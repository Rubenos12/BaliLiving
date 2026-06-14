import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { fetchVillas } from "@/lib/actions/villas-fetch";

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
  slugs: z.array(z.string().max(100)).min(2).max(3),
  priority: z.string().min(1).max(500),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Te veel verzoeken. Probeer het over een minuut opnieuw." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Selecteer 2 of 3 villa's om te vergelijken." }, { status: 400 });
  }

  const { slugs, priority } = parsed.data;
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "AI service niet beschikbaar." }, { status: 500 });
  }

  try {
    const allVillas = await fetchVillas();
    const selectedVillas = slugs.map((s) => allVillas.find((v) => v.slug === s)).filter(Boolean);

    if (selectedVillas.length < 2) {
      return NextResponse.json({ error: "Een of meer villa's niet gevonden." }, { status: 404 });
    }

    const villaDescriptions = selectedVillas.map((v) => ({
      slug: v!.slug,
      naam: v!.name,
      locatie: `${v!.location}, ${v!.region}`,
      prijs_per_nacht: `€${v!.price_per_night}`,
      slaapkamers: v!.bedrooms,
      max_gasten: v!.guests_max,
      amenities: v!.amenities,
      tag: v!.tag,
      highlights: v!.highlights ?? [],
    }));

    const prompt = `Je bent een persoonlijke villa-adviseur voor BaliLiving. Een gast wil kiezen tussen ${selectedVillas.length} villa's.

Wat de gast het belangrijkste vindt:
"${priority}"

De villa's om te vergelijken:
${JSON.stringify(villaDescriptions, null, 2)}

Maak een eerlijke, specifieke vergelijking op basis van wat de gast het belangrijkste vindt. Noem échte voor- en nadelen — geen vage algemeenheden. Wijs een winnaar aan.

Geef exact dit JSON-formaat terug (geen andere tekst):
{
  "winner": "villa-slug",
  "winner_reason": "2-3 zinnen waarom dit de beste keuze is voor wat de gast zoekt",
  "villa_summaries": [
    {
      "slug": "villa-slug",
      "pros": ["2-3 specifieke voordelen voor deze gast"],
      "cons": ["1-2 nadelen of minpunten voor wat de gast zoekt"]
    }
  ],
  "final_verdict": "1 beslissende aanbeveling in directe toon, max 20 woorden"
}`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 800,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI service tijdelijk niet beschikbaar." }, { status: 502 });
    }

    const result = await response.json();
    const text = result.content?.[0]?.type === "text" ? result.content[0].text : "";
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    const responseSchema = z.object({
      winner: z.string().max(100),
      winner_reason: z.string().max(600),
      villa_summaries: z.array(z.object({
        slug: z.string().max(100),
        pros: z.array(z.string().max(200)).max(3),
        cons: z.array(z.string().max(200)).max(2),
      })).max(3),
      final_verdict: z.string().max(200),
    });

    const validated = responseSchema.safeParse(data);
    if (!validated.success) {
      return NextResponse.json({ error: "Kon geen vergelijking genereren." }, { status: 500 });
    }

    // Include villa names for rendering
    const withNames = {
      ...validated.data,
      villa_summaries: validated.data.villa_summaries.map((s) => ({
        ...s,
        name: selectedVillas.find((v) => v!.slug === s.slug)?.name ?? s.slug,
      })),
      winner_name: selectedVillas.find((v) => v!.slug === validated.data.winner)?.name ?? validated.data.winner,
    };

    return NextResponse.json(withNames);
  } catch (err) {
    console.error("Villa compare error:", err);
    return NextResponse.json({ error: "Vergelijking mislukt. Probeer het opnieuw." }, { status: 500 });
  }
}
