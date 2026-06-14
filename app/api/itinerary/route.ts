import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchVillas } from "@/lib/actions/villas-fetch";
import { createServiceClient } from "@/lib/supabase/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 5) return false;
  entry.count++;
  return true;
}

const requestSchema = z.object({
  arrival: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  departure: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  group_type: z.enum(["koppel", "familie", "vrienden", "solo"]),
  guests: z.number().int().min(1).max(20),
  style: z.array(z.string().max(50)).min(1).max(4),
  budget: z.enum(["budget", "midden", "luxe", "ultra"]),
  priorities: z.array(z.string().max(50)).max(7),
});

const budgetRanges: Record<string, { min: number; max: number; label: string }> = {
  budget: { min: 0, max: 500, label: "tot €500/nacht" },
  midden: { min: 500, max: 1200, label: "€500–€1200/nacht" },
  luxe: { min: 1200, max: 2500, label: "€1200–€2500/nacht" },
  ultra: { min: 2500, max: Infinity, label: "€2500+/nacht" },
};

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Te veel verzoeken. Probeer het over een minuut opnieuw." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Controleer je invoer en probeer het opnieuw." }, { status: 400 });
  }

  const { arrival, departure, group_type, guests, style, budget, priorities } = parsed.data;

  const arrivalDate = new Date(arrival);
  const departureDate = new Date(departure);
  const nights = Math.round((departureDate.getTime() - arrivalDate.getTime()) / (1000 * 60 * 60 * 24));

  if (nights < 1 || nights > 60) {
    return NextResponse.json({ error: "Kies een geldige reisperiode (1–60 nachten)." }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service niet beschikbaar." }, { status: 500 });
  }

  try {
    const db = createServiceClient();
    const range = budgetRanges[budget];

    const [allVillas, toursRes, restaurantsRes] = await Promise.all([
      fetchVillas(),
      db.from("tours").select("name, location, short_description, price_per_person, duration_hours, tag").eq("published", true).limit(15),
      db.from("restaurants").select("name, location, cuisine, price_range, short_description, sfeer, tag").eq("published", true).limit(15),
    ]);

    const budgetFiltered = allVillas.filter(
      (v) => v.price_per_night >= range.min && v.price_per_night <= range.max && v.guests_max >= guests
    );
    const villaPool = (budgetFiltered.length > 0 ? budgetFiltered : allVillas.filter((v) => v.guests_max >= guests))
      .slice(0, 6);
    const filteredVillas = villaPool.map((v) => ({
        slug: v.slug,
        naam: v.name,
        regio: v.region,
        prijs_per_nacht: v.price_per_night,
        slaapkamers: v.bedrooms,
        max_gasten: v.guests_max,
        kenmerken: v.amenities.slice(0, 5).join(", "),
        tag: v.tag,
      }));

    type TourRow = { name: string; location: string | null; short_description: string | null; price_per_person: number | null; duration_hours: number | null; tag: string | null };
    type RestaurantRow = { name: string; location: string | null; cuisine: string | null; price_range: string | null; short_description: string | null; sfeer: string | null; tag: string | null };
    const tours = (toursRes.data ?? []) as TourRow[];
    const restaurants = (restaurantsRes.data ?? []) as RestaurantRow[];

    const arrivalMonth = arrivalDate.toLocaleDateString("nl-NL", { month: "long" });
    const displayDays = Math.min(nights, 6);

    const prompt = `Je bent een persoonlijke reisplanner voor BaliLiving, gerund door Edwin & Citty. Stel een droomreis samen voor onderstaande gast.

REIZIGERSPROFIEL:
- Aankomst: ${arrival} (${arrivalMonth}), vertrek: ${departure}
- Totaal: ${nights} nachten
- Reisgezelschap: ${group_type} (${guests} personen)
- Stijl voorkeur: ${style.join(", ")}
- Budget villa: ${range.label}
- Prioriteiten: ${priorities.length > 0 ? priorities.join(", ") : "geen specifiek"}

BESCHIKBARE VILLA'S (${filteredVillas.length}):
${JSON.stringify(filteredVillas, null, 2)}

BESCHIKBARE TOURS (kies de beste):
${JSON.stringify(tours.slice(0, 10).map((t) => ({ naam: t.name, locatie: t.location, beschrijving: t.short_description, prijs_pp: t.price_per_person, uren: t.duration_hours })), null, 2)}

BESCHIKBARE RESTAURANTS (kies de beste):
${JSON.stringify(restaurants.slice(0, 10).map((r) => ({ naam: r.name, locatie: r.location, keuken: r.cuisine, prijsklasse: r.price_range, sfeer: r.sfeer })), null, 2)}

TRANSFER OPTIES:
- Standaard transfer airport → villa: €55
- Luxe transfer: €85
- VIP transfer: €150

Stel een gepersonaliseerd reisplan samen. Geef maximaal ${displayDays} dagen terug (dag 1 t/m ${displayDays}). Dag 1 = aankomstdag met transfer. Overige dagen bevatten 2–3 activiteiten. Kies activiteiten die passen bij het profiel.

Geef exact dit JSON-formaat terug (geen andere tekst):
{
  "headline": "Beknopte, inspirerende reistittel (max 8 woorden)",
  "tagline": "1 zin die de sfeer van de reis vat",
  "villa": {
    "slug": "villa-slug",
    "name": "Villa naam",
    "region": "Regio",
    "price_per_night": 1200,
    "reason": "1-2 zinnen waarom deze villa perfect past bij het profiel"
  },
  "days": [
    {
      "day": 1,
      "title": "Aankomst & eerste indruk",
      "items": [
        { "type": "transfer", "time": "15:00", "title": "Luxe transfer Ngurah Rai", "description": "Verwelkomd worden met koele handdoek en welkomstdrankje in je privéwagen.", "price": 85, "link": "/transfers" },
        { "type": "villa", "time": "17:00", "title": "Inchecken [Villa naam]", "description": "...", "link": "/villas/[slug]" },
        { "type": "restaurant", "time": "19:30", "title": "Eerste diner bij [naam]", "description": "...", "link": "/restaurants" }
      ]
    }
  ],
  "total_estimate": 4200,
  "cta_message": "Klaar om deze droomreis te boeken? We regelen alles voor jullie."
}

Typen voor items: "transfer" | "villa" | "tour" | "restaurant" | "activity". Links: "/transfers", "/tours", "/restaurants", "/villas/[slug]". Prijs in EUR per persoon of totaal (geef context in description).`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 4000,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI service tijdelijk niet beschikbaar." }, { status: 502 });
    }

    const result = await response.json();
    const text: string = result.content?.[0]?.type === "text" ? result.content[0].text : "";
    if (!text) {
      console.error("Itinerary: empty Claude response", JSON.stringify(result).slice(0, 300));
      return NextResponse.json({ error: "AI service heeft geen resultaat teruggegeven." }, { status: 502 });
    }
    // Extract the JSON object — Claude sometimes adds a preamble or trailing text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Itinerary: no JSON found in response", text.slice(0, 300));
      return NextResponse.json({ error: "Kon geen reisplan genereren. Probeer het opnieuw." }, { status: 500 });
    }
    let data: unknown;
    try {
      data = JSON.parse(jsonMatch[0]);
    } catch (parseErr) {
      console.error("Itinerary: JSON parse failed", parseErr, jsonMatch[0].slice(0, 300));
      return NextResponse.json({ error: "Kon geen reisplan genereren. Probeer het opnieuw." }, { status: 500 });
    }

    const sanitizeLink = (link: unknown): string | undefined => {
      if (typeof link !== "string") return undefined;
      const cleaned = link.startsWith("/") ? link : `/${link}`;
      return cleaned.length <= 200 ? cleaned : undefined;
    };

    const itemSchema = z.object({
      type: z.enum(["transfer", "villa", "tour", "restaurant", "activity"]),
      time: z.string().max(10),
      title: z.string().max(100),
      description: z.string().max(400),
      price: z.number().optional(),
      link: z.string().max(300).optional().transform(sanitizeLink),
    });

    const responseSchema = z.object({
      headline: z.string().max(100),
      tagline: z.string().max(200),
      villa: z.object({
        slug: z.string().max(100),
        name: z.string().max(100),
        region: z.string().max(100),
        price_per_night: z.number(),
        reason: z.string().max(400),
      }),
      days: z.array(z.object({
        day: z.number().int().min(1).max(10),
        title: z.string().max(100),
        items: z.array(itemSchema).max(5),
      })).max(8),
      total_estimate: z.number(),
      cta_message: z.string().max(200),
    });

    const validated = responseSchema.safeParse(data);
    if (!validated.success) {
      console.error("Itinerary Zod validation failed:", JSON.stringify(validated.error.issues).slice(0, 500));
      return NextResponse.json({ error: "Kon geen reisplan genereren. Probeer het opnieuw." }, { status: 500 });
    }

    return NextResponse.json({ ...validated.data, nights });
  } catch (err) {
    console.error("Itinerary error:", err);
    return NextResponse.json({ error: "Er is een fout opgetreden. Probeer het opnieuw." }, { status: 500 });
  }
}
