import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { from, to, passengers, date, time } = await req.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      // Intelligent client-side fallback when no API key is configured
      return NextResponse.json(buildFallback(from, to, passengers, time));
    }

    const prompt = `Je bent een premium vervoersadviseur voor BaliLiving, een exclusief reisbedrijf op Bali, Indonesië.

Analyseer deze transfer aanvraag en geef een persoonlijk advies:
- Van: ${from}
- Naar: ${to}
- Datum: ${date || "niet opgegeven"}
- Tijdstip: ${time || "niet opgegeven"}
- Aantal reizigers: ${passengers}

Beschikbare tiers:
- normaal: Sedan/MPV, AC, betrouwbaar, tot 4 reizigers
- luxe: Premium SUV, leer, koelwater, USB-lader, tot 6 reizigers
- vip: Executive voertuig, champagne, conciërge, Wi-Fi, onbeperkt wachten, tot 8 reizigers

Regels voor aanbeveling:
- Airport route → minimaal luxe (meet & greet belangrijk)
- 5+ reizigers → minimaal luxe
- 7+ reizigers → vip
- Avond/nacht (19:00-23:59) → upgrade één niveau (veiliger en comfortabeler)
- Huwelijksreis of bijzondere gelegenheid (hint in locaties) → vip
- Korte rit binnen dezelfde wijk → normaal volstaat

Geef exact dit JSON-formaat terug (geen andere tekst):
{
  "tier": "normaal" | "luxe" | "vip",
  "reistijd": "bijv. 45-60 minuten",
  "redenKeuze": "Persoonlijke aanbeveling in 1-2 zinnen, spreek de klant aan met 'u'",
  "reistip": "Één praktische tip specifiek voor deze route of dit tijdstip"
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
        max_tokens: 350,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json(buildFallback(from, to, passengers, time));
    }

    const result = await response.json();
    const text =
      result.content?.[0]?.type === "text" ? result.content[0].text : "";

    // Parse the JSON from Claude's response (strip any markdown fences)
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
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
  time: string
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

  let tier: "normaal" | "luxe" | "vip" = "normaal";
  let redenKeuze =
    "Op basis van uw reisgegevens is Normaal vervoer een uitstekende keuze voor een comfortabele en betrouwbare rit.";
  let reistip =
    "Houd rekening met drukte op de weg — Bali's wegen zijn het rustigst vroeg in de ochtend.";

  if (passengers >= 7) {
    tier = "vip";
    redenKeuze = `Met ${passengers} reizigers biedt onze VIP-service de ruimste en meest comfortabele oplossing, met een executive voertuig en persoonlijke service.`;
    reistip =
      "Wij adviseren vooraf te melden of er bagage meegaat, zodat uw chauffeur het juiste voertuig inzet.";
  } else if (passengers >= 5) {
    tier = "luxe";
    redenKeuze = `Voor ${passengers} reizigers is Luxe vervoer ideaal — voldoende ruimte, premium comfort en een attente chauffeur.`;
    reistip =
      "Combineer de rit met een welkomstdrankje en geniet van een stijlvolle aankomst op uw bestemming.";
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
