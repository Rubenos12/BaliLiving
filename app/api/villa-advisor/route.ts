import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchVillas } from "@/lib/actions/villas-fetch";
import { z } from "zod";

// Simple in-memory rate limiter: max 10 requests per IP per minute
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

const VALID_PREFERENCES = [
  "pool", "strand", "romantisch", "natuur", "wellness",
  "wifi", "chef", "kinderen", "afgelegen", "modern",
] as const;

const requestSchema = z.object({
  trip_type: z.enum(["huwelijksreis", "gezinsreis", "vrienden", "avontuur", "zakelijk"]),
  budget: z.enum(["onder-300", "300-500", "500-800", "800+"]),
  guests: z.number().int().min(1).max(30),
  location: z.string().max(50),
  preferences: z.array(z.enum(VALID_PREFERENCES)),
});

export type AdvisorPreferences = {
  trip_type: string;    // e.g. "huwelijksreis", "gezinsreis", "vrienden", "avontuur", "zakelijk"
  budget: string;       // e.g. "onder-300", "300-500", "500-800", "800+"
  guests: number;
  location: string;     // e.g. "Ubud", "Seminyak", or "geen-voorkeur"
  preferences: string[]; // e.g. ["pool", "strand", "romantisch"]
};

export type VillaRecommendation = {
  slug: string;
  reason: string;
};

export type AdvisorResult = {
  primary: VillaRecommendation;
  alternatives: VillaRecommendation[];
};

const BUDGET_MAP: Record<string, { min: number; max: number }> = {
  "onder-300": { min: 0, max: 299 },
  "300-500": { min: 300, max: 500 },
  "500-800": { min: 500, max: 800 },
  "800+": { min: 800, max: 999999 },
};

const TRIP_TYPE_LABELS: Record<string, string> = {
  huwelijksreis: "Huwelijksreis / Romantische Reis",
  gezinsreis: "Gezinsreis",
  vrienden: "Vrienden / Groepsreis",
  avontuur: "Avontuurlijke Reis",
  zakelijk: "Zakelijke Reis",
};

const TRIP_TYPE_INSTRUCTIONS: Record<string, string> = {
  huwelijksreis:
    "PRIORITEIT: Romantiek, privacy en bijzondere sfeer staan voorop. Kies villa's met privé pool, afgelegen ligging, romantisch interieur en eventueel spa. Budget is secundair — de beleving telt. Vermijd villa's die primair gericht zijn op grote groepen.",
  gezinsreis:
    "PRIORITEIT: Veiligheid, ruimte en kindvriendelijkheid zijn doorslaggevend. Kies villa's met meerdere slaapkamers, tuinruimte en beveiligde omgeving. Gezinsactiviteiten in de buurt zijn een pluspunt.",
  vrienden:
    "PRIORITEIT: Ruimte voor de groep en sociale voorzieningen tellen zwaar. Kies villa's met grote zwembaden, gemeenschappelijke terrassen, entertainment-ruimte en een eigen chef. Prijs per persoon moet aantrekkelijk zijn.",
  avontuur:
    "PRIORITEIT: Ligging en nabijheid van activiteiten zijn bepalend. Surf spots, jungle treks, rijstterras-wandelingen of duiklocaties in de buurt verhogen de score. Comfort is aanwezig maar hoeft niet maximaal te zijn.",
  zakelijk:
    "PRIORITEIT: Rust, professionaliteit en goede WiFi zijn essentieel. Kies villa's met een werkplek, betrouwbare verbinding en discrete service. Nabijheid van Denpasar of andere zakelijke centra is een pluspunt.",
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Te veel verzoeken. Probeer het over een minuut opnieuw." }, { status: 429 });
    }

    const rawBody = await req.json();
    const parsed = requestSchema.safeParse(rawBody);
    if (!parsed.success) {
      return NextResponse.json({ error: "Ongeldige invoer." }, { status: 400 });
    }
    const { trip_type, budget, guests, location, preferences } = parsed.data;

    const villas = await fetchVillas();

    // Pre-filter on hard constraints (budget + guests) so Claude sees only eligible villas
    const budgetRange = BUDGET_MAP[budget] ?? { min: 0, max: 999999 };
    const eligible = villas.filter((v) => {
      const withinBudget =
        v.price_per_night >= budgetRange.min &&
        v.price_per_night <= budgetRange.max;
      const fitsGuests = v.guests_max >= guests;
      return withinBudget && fitsGuests;
    });

    if (eligible.length === 0) {
      return NextResponse.json(
        { error: "Geen villa's gevonden die aan jouw eisen voldoen. Probeer een ruimere selectie." },
        { status: 422 }
      );
    }

    const villasSummary = eligible.map((v) => ({
      slug: v.slug,
      name: v.name,
      region: v.region,
      location: v.location,
      price_per_night: v.price_per_night,
      guests_max: v.guests_max,
      bedrooms: v.bedrooms,
      tag: v.tag,
      short_description: v.short_description,
      amenities: v.amenities,
    }));

    const client = new Anthropic();

    const tripTypeLabel = TRIP_TYPE_LABELS[trip_type] ?? trip_type ?? "Niet opgegeven";
    const tripTypeInstruction = TRIP_TYPE_INSTRUCTIONS[trip_type] ?? "";
    const formattedBudget = budget
      .replace("onder-", "onder €")
      .replace("800+", "€800+")
      .replace(/^(\d+)-(\d+)$/, "€$1–€$2");

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 768,
      messages: [
        {
          role: "user",
          content: `Je bent de persoonlijke villa-adviseur van BaliLiving — een exclusief reisbedrijf op Bali van Edwin & Citty. Jouw taak is om de drie beste villa's te selecteren uit de beschikbare lijst.

REISTYPE: ${tripTypeLabel}
${tripTypeInstruction}

Klantenwensen:
- Budget per nacht: ${formattedBudget}
- Aantal gasten: ${guests}
- Locatievoorkeur: ${location === "geen-voorkeur" ? "Geen voorkeur" : location}
- Sfeer & voorkeuren: ${preferences.length > 0 ? preferences.join(", ") : "geen specifieke voorkeur"}

Beschikbare villa's (al gefilterd op budget en capaciteit):
${JSON.stringify(villasSummary, null, 2)}

Selecteer de DRIE beste villa's in volgorde van prioriteit. Eerste keuze is de absolute beste match.

Geef je antwoord als geldig JSON met exact deze structuur:
{
  "primary": {
    "slug": "<slug van de beste villa>",
    "reason": "<persoonlijke toelichting in 2-3 zinnen in het Nederlands. Spreek de klant aan met 'je/jouw'. Begin met waarom dit de perfecte keuze is voor hun specifieke reistype.>"
  },
  "alternatives": [
    {
      "slug": "<slug van tweede keuze>",
      "reason": "<korte toelichting in 1-2 zinnen waarom dit een goed alternatief is>"
    },
    {
      "slug": "<slug van derde keuze>",
      "reason": "<korte toelichting in 1-2 zinnen waarom dit een goed alternatief is>"
    }
  ]
}

Als er minder dan 3 villa's beschikbaar zijn, geef je alleen de beschikbare villa's terug (primary altijd aanwezig, alternatives kan leeg zijn).
Geef ALLEEN het JSON object terug, geen extra tekst.`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    const claudeResponseSchema = z.object({
      primary: z.object({ slug: z.string(), reason: z.string().max(600) }),
      alternatives: z.array(z.object({ slug: z.string(), reason: z.string().max(400) })),
    });

    let result: AdvisorResult;
    try {
      const parsed = JSON.parse(responseText.trim());
      const validated = claudeResponseSchema.safeParse(parsed);
      result = validated.success
        ? validated.data
        : { primary: { slug: eligible[0].slug, reason: eligible[0].short_description }, alternatives: [] };
    } catch {
      const match = responseText.match(/\{[\s\S]*\}/);
      if (!match) {
        return NextResponse.json(
          { error: "Kon geen aanbeveling genereren. Probeer het opnieuw." },
          { status: 500 }
        );
      }
      try {
        const fallbackParsed = JSON.parse(match[0]);
        const validated = claudeResponseSchema.safeParse(fallbackParsed);
        result = validated.success
          ? validated.data
          : { primary: { slug: eligible[0].slug, reason: eligible[0].short_description }, alternatives: [] };
      } catch {
        result = { primary: { slug: eligible[0].slug, reason: eligible[0].short_description }, alternatives: [] };
      }
    }

    // Ensure result has the expected shape
    if (!result.primary) {
      result = { primary: { slug: eligible[0].slug, reason: eligible[0].short_description }, alternatives: [] };
    }
    if (!Array.isArray(result.alternatives)) {
      result.alternatives = [];
    }

    // Validate and patch slugs
    const eligibleSlugs = new Set(eligible.map((v) => v.slug));

    if (!eligibleSlugs.has(result.primary.slug)) {
      result.primary.slug = eligible[0].slug;
    }

    const usedSlugs = new Set([result.primary.slug]);
    const validAlts = result.alternatives
      .filter((a) => eligibleSlugs.has(a.slug) && !usedSlugs.has(a.slug))
      .slice(0, 2);

    validAlts.forEach((a) => usedSlugs.add(a.slug));

    // Pad alternatives with remaining eligible villas if Claude returned fewer than 2
    const remaining = eligible.filter(
      (v) => !usedSlugs.has(v.slug)
    );
    while (validAlts.length < 2 && remaining.length > 0) {
      const filler = remaining.shift()!;
      validAlts.push({ slug: filler.slug, reason: filler.short_description });
    }

    result.alternatives = validAlts;

    return NextResponse.json(result);
  } catch (err) {
    console.error("Villa advisor error:", err);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
