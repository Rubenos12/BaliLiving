import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServiceClient } from "@/lib/supabase/server";
import { sanitizePromptInput } from "@/lib/utils/sanitize-prompt-input";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 10) return false;
  entry.count++;
  return true;
}

const requestSchema = z.object({
  villa_name: z.string().max(200),
  region: z.string().max(100),
  check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  nights: z.number().int().min(1).max(90),
  guests: z.number().int().min(1).max(50),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Te veel verzoeken." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ongeldige invoer." }, { status: 400 });
  }

  const { villa_name, region, check_in, nights, guests } = parsed.data;
  const safeVillaName = sanitizePromptInput(villa_name, 100);
  const safeRegion = sanitizePromptInput(region, 60);
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return NextResponse.json({ error: "Service tijdelijk niet beschikbaar." }, { status: 503 });

  try {
    const db = createServiceClient();
    const [toursRes, restaurantsRes] = await Promise.all([
      db.from("tours").select("id, name, short_description, price_per_person, duration_hours, location").eq("published", true).limit(20),
      db.from("restaurants").select("id, name, short_description, cuisine, price_range, location, sfeer").eq("published", true).limit(20),
    ]);

    type TourRow = { name: string; short_description: string | null; price_per_person: number | null; duration_hours: number | null; location: string | null };
    type RestaurantRow = { name: string; short_description: string | null; cuisine: string | null; price_range: string | null; location: string | null; sfeer: string | null };
    const tours = (toursRes.data ?? []) as TourRow[];
    const restaurants = (restaurantsRes.data ?? []) as RestaurantRow[];

    if (tours.length === 0 && restaurants.length === 0) {
      return NextResponse.json({ suggestions: [] });
    }

    const checkInDate = new Date(check_in);
    const monthName = checkInDate.toLocaleDateString("nl-NL", { month: "long" });

    const prompt = `Een gast heeft zojuist ${safeVillaName} geboekt in ${safeRegion}, Bali. ${nights} nachten, ${guests} personen, aankomst ${monthName}.

Beschikbare tours:
${JSON.stringify(tours.slice(0, 10).map((t) => ({ name: t.name, description: t.short_description, price_per_person: t.price_per_person, duration_hours: t.duration_hours, location: t.location })), null, 2)}

Beschikbare restaurants:
${JSON.stringify(restaurants.slice(0, 10).map((r) => ({ name: r.name, description: r.short_description, cuisine: r.cuisine, price_range: r.price_range, location: r.location, sfeer: r.sfeer })), null, 2)}

Transfers: Luxe €85 / VIP €150 van vliegveld Ngurah Rai naar de villa.

Selecteer exact 3 suggesties: 1 transfer (airport), 1 tour, 1 restaurant. Kies wat het beste past bij de villa locatie (${safeRegion}), het seizoen (${monthName}), en de groepsgrootte (${guests} personen).

Geef exact dit JSON-formaat terug (geen andere tekst):
{
  "suggestions": [
    {
      "type": "transfer" | "tour" | "restaurant",
      "title": "Korte titel (max 8 woorden)",
      "reason": "Waarom dit perfect past (1 zin, max 20 woorden)",
      "link": "/transfers" | "/tours" | "/restaurants",
      "cta": "Boek direct" | "Meer info" | "Vraag reservering aan"
    }
  ]
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) return NextResponse.json({ suggestions: [] });

    const result = await response.json();
    const text = result.content?.[0]?.type === "text" ? result.content[0].text : "";
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    const suggestionSchema = z.object({
      suggestions: z.array(z.object({
        type: z.enum(["transfer", "tour", "restaurant"]),
        title: z.string().max(100),
        reason: z.string().max(200),
        link: z.string().startsWith("/"),
        cta: z.string().max(30),
      })).max(3),
    });

    const validated = suggestionSchema.safeParse(data);
    if (!validated.success) return NextResponse.json({ suggestions: [] });

    return NextResponse.json(validated.data);
  } catch (err) {
    console.error("Activity suggestions error:", err);
    return NextResponse.json({ suggestions: [] });
  }
}
