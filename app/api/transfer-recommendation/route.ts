import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sanitizePromptInput } from "@/lib/utils/sanitize-prompt-input";

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

const requestSchema = z.object({
  from: z.string().min(1).max(100),
  to: z.string().min(1).max(100),
  passengers: z.number().int().min(1).max(20),
  date: z.string().max(20).optional(),
  time: z.string().regex(/^\d{2}:\d{2}$/).optional().or(z.literal("")).optional(),
  luggage: z.enum(["geen", "1-2", "3-4", "5+"]).optional().default("geen"),
  occasion: z.enum(["luchthaventransfer", "dagtocht", "speciale-gelegenheid", "overig", ""]).optional().default(""),
});

const OCCASION_TONE: Record<string, string> = {
  "luchthaventransfer":
    "Professionele, betrouwbare toon. Benadruk punctualiteit en vluchttracking.",
  "dagtocht":
    "Ontspannen, vriendelijke toon. Benadruk het gemak en de vrijheid van de dag.",
  "speciale-gelegenheid":
    "Warme, feestelijke en elegante toon. Maak de klant enthousiast over de beleving. VIP is hier de logische keuze.",
  "overig":
    "Neutrale, behulpzame toon.",
};

const LUGGAGE_LABELS: Record<string, string> = {
  "geen": "geen bagage",
  "1-2": "1-2 koffers",
  "3-4": "3-4 koffers",
  "5+": "5 of meer koffers",
};

const OCCASION_LABELS: Record<string, string> = {
  "luchthaventransfer": "Luchthaventransfer",
  "dagtocht": "Dagtocht",
  "speciale-gelegenheid": "Speciale gelegenheid",
  "overig": "Overig",
};

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Te veel verzoeken. Probeer het over een minuut opnieuw." }, { status: 429 });
    }

    const body = await req.json();
    const inputValidation = requestSchema.safeParse(body);
    if (!inputValidation.success) {
      return NextResponse.json({ error: "Ongeldige invoer." }, { status: 400 });
    }
    const { from, to, passengers, date, time, luggage, occasion } = inputValidation.data;
    const safeFrom = sanitizePromptInput(from, 100);
    const safeTo = sanitizePromptInput(to, 100);
    const safeTime = time ?? "";

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(buildFallback(from, to, passengers, safeTime, luggage, occasion));
    }

    const luggageLabel = LUGGAGE_LABELS[luggage] ?? "niet opgegeven";
    const occasionLabel = OCCASION_LABELS[occasion] ?? "niet opgegeven";
    const toneTip = OCCASION_TONE[occasion] ?? "Neutrale, professionele toon.";

    const prompt = `Je bent een premium vervoersadviseur voor BaliVoorNederlanders, een exclusief reisbedrijf op Bali, Indonesië.

Analyseer deze transfer aanvraag en geef een persoonlijk advies:
- Van: ${safeFrom}
- Naar: ${safeTo}
- Datum: ${date || "niet opgegeven"}
- Tijdstip: ${safeTime || "niet opgegeven"}
- Aantal reizigers: ${passengers}
- Bagage: ${luggageLabel}
- Aanleiding: ${occasionLabel}

Beschikbare tiers:
- normaal: Sedan/MPV, AC, betrouwbaar, max 4 reizigers, tot 2 middelgrote koffers
- luxe: Premium SUV, leer, koelwater, USB-lader, max 6 reizigers, tot 4 koffers
- vip: Executive voertuig, champagne, conciërge, Wi-Fi, onbeperkt wachten, max 8 reizigers, altijd voldoende bagageruimte

Regels voor aanbeveling:
- Airport route → minimaal luxe (meet & greet belangrijk)
- 5+ reizigers → minimaal luxe
- 7+ reizigers → vip
- 3-4 koffers → minimaal luxe (ruimte in bagageruimte)
- 5+ koffers → vip (executive voertuig biedt maximale bagageruimte)
- Avond/nacht (19:00–23:59) → upgrade één niveau
- Speciale gelegenheid → vip
- Dagtocht → normaal volstaat tenzij groep groot of bagage aanwezig
- Korte rit binnen dezelfde wijk → normaal

Tone instructie: ${toneTip}

Geef exact dit JSON-formaat terug (geen andere tekst):
{
  "tier": "normaal" | "luxe" | "vip",
  "reistijd": "bijv. 45-60 minuten",
  "redenKeuze": "Persoonlijke aanbeveling in 1-2 zinnen, spreek de klant aan met 'u'. Verwijs specifiek naar bagage en aanleiding als die zijn opgegeven.",
  "reistip": "Één praktische tip specifiek voor deze route, dit tijdstip of deze aanleiding"
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
        max_tokens: 400,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(buildFallback(from, to, passengers, safeTime, luggage, occasion));
    }

    const claudeResult = await response.json();
    const text =
      claudeResult.content?.[0]?.type === "text" ? claudeResult.content[0].text : "";

    const clean = text.replace(/```json|```/g, "").trim();
    const claudeJson = JSON.parse(clean);

    const responseSchema = z.object({
      tier: z.enum(["normaal", "luxe", "vip"]),
      reistijd: z.string().max(100),
      redenKeuze: z.string().max(500),
      reistip: z.string().max(300),
    });
    const validated = responseSchema.safeParse(claudeJson);
    if (!validated.success) {
      return NextResponse.json(buildFallback(from, to, passengers, safeTime, luggage, occasion));
    }

    return NextResponse.json(validated.data);
  } catch {
    return NextResponse.json({
      tier: "luxe",
      reistijd: "45-75 minuten",
      redenKeuze:
        "Op basis van uw reisgegevens adviseren wij Luxe vervoer voor een optimale balans tussen comfort en stijl.",
      reistip:
        "Plan uw transfer met een ruime marge — Bali kent drukke verkeersmomenten, zeker rond het middaguur en in de avondspits.",
    });
  }
}

function buildFallback(
  from: string,
  to: string,
  passengers: number,
  time: string,
  luggage?: string,
  occasion?: string
): object {
  const fromLower = (from || "").toLowerCase();
  const toLower = (to || "").toLowerCase();
  const hour = time ? parseInt(time.split(":")[0]) : 12;

  const isAirport =
    fromLower.includes("luchthaven") ||
    toLower.includes("luchthaven") ||
    fromLower.includes("airport") ||
    toLower.includes("airport") ||
    fromLower.includes("dps") ||
    toLower.includes("dps");

  const isEvening = hour >= 19 && hour <= 23;
  const isSpecial = occasion === "speciale-gelegenheid";

  let tier: "normaal" | "luxe" | "vip" = "normaal";
  let redenKeuze =
    "Op basis van uw reisgegevens is Normaal vervoer een uitstekende keuze voor een comfortabele en betrouwbare rit.";
  let reistip =
    "Houd rekening met drukte op de weg — Bali's wegen zijn het rustigst vroeg in de ochtend.";

  if (passengers >= 7 || isSpecial || luggage === "5+") {
    tier = "vip";
    if (isSpecial) {
      redenKeuze =
        "Voor uw speciale gelegenheid is VIP-vervoer de perfecte keuze — verwelkom uzelf in stijl met champagne en een persoonlijke conciërge.";
      reistip =
        "Laat ons weten om welke bijzondere gelegenheid het gaat — we zorgen voor een onvergetelijke aankomst.";
    } else if (luggage === "5+") {
      redenKeuze = `Met ${passengers} reizigers en veel bagage biedt VIP-vervoer de ruimste oplossing — een executive voertuig met maximale bagageruimte.`;
      reistip =
        "Wij adviseren vooraf te melden hoeveel stuks bagage u meeneemt, zodat uw chauffeur het juiste voertuig inzet.";
    } else {
      redenKeuze = `Met ${passengers} reizigers biedt onze VIP-service de ruimste en meest comfortabele oplossing, met een executive voertuig en persoonlijke service.`;
      reistip =
        "Wij adviseren vooraf te melden of er bagage meegaat, zodat uw chauffeur het juiste voertuig inzet.";
    }
  } else if (passengers >= 5 || luggage === "3-4") {
    tier = "luxe";
    if (luggage === "3-4") {
      redenKeuze =
        "Met 3-4 koffers is Luxe vervoer ideaal — de premium SUV biedt voldoende bagageruimte naast comfortabele zitplaatsen.";
      reistip =
        "Zorg dat uw koffers bij aankomst direct in de auto passen — bij twijfel over ruimte upgraden wij graag naar VIP.";
    } else {
      redenKeuze = `Voor ${passengers} reizigers is Luxe vervoer ideaal — voldoende ruimte, premium comfort en een attente chauffeur.`;
      reistip =
        "Combineer de rit met een welkomstdrankje en geniet van een stijlvolle aankomst op uw bestemming.";
    }
  } else if (isAirport) {
    tier = "luxe";
    redenKeuze =
      "Voor een luchthavenstransfer adviseren wij Luxe vervoer — u wordt professioneel ontvangen en rijdt comfortabel na een lange vlucht.";
    reistip =
      "Uw chauffeur volgt uw vlucht live en past de ophaaltijd automatisch aan bij vertraging.";
  } else if (isEvening) {
    tier = "luxe";
    redenKeuze =
      "Een avondtransfer vraagt om extra comfort en veiligheid — Luxe vervoer biedt u precies dat, met een ervaren chauffeur die de wegen op Bali van binnen kent.";
    reistip =
      "Bali's wegen zijn 's avonds rustiger, maar let op: in toeristische gebieden kan het rond 20:00 nog druk zijn.";
  } else if (passengers <= 2) {
    tier = "normaal";
    redenKeuze =
      "Voor twee reizigers is Normaal vervoer een slimme keuze — comfortabel, betrouwbaar en uitstekende prijs-kwaliteitverhouding.";
    reistip =
      "Boek minimaal een dag van tevoren om de beste beschikbaarheid te garanderen.";
  }

  // Estimate travel time based on common Bali routes
  let reistijd = "30-60 minuten";
  if (isAirport) reistijd = "45-90 minuten";
  if (
    fromLower.includes("ubud") ||
    toLower.includes("ubud") ||
    fromLower.includes("amed") ||
    toLower.includes("amed")
  ) {
    reistijd = "60-120 minuten";
  }

  return { tier, reistijd, redenKeuze, reistip };
}
