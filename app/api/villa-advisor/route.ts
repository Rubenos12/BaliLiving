import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchVillas } from "@/lib/actions/villas-fetch";

export type AdvisorPreferences = {
  budget: string;         // e.g. "onder-300", "300-500", "500-800", "800+"
  guests: number;
  location: string;       // e.g. "Ubud", "Seminyak", or "geen-voorkeur"
  preferences: string[];  // e.g. ["pool", "strand", "romantisch"]
};

export type AdvisorResult = {
  slug: string;
  reason: string;
};

const BUDGET_MAP: Record<string, { min: number; max: number }> = {
  "onder-300": { min: 0, max: 299 },
  "300-500": { min: 300, max: 500 },
  "500-800": { min: 500, max: 800 },
  "800+": { min: 800, max: 999999 },
};

export async function POST(req: NextRequest) {
  try {
    const body: AdvisorPreferences = await req.json();
    const { budget, guests, location, preferences } = body;

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

    const message = await client.messages.create({
      model: "claude-opus-4-6",
      max_tokens: 512,
      messages: [
        {
          role: "user",
          content: `Je bent de persoonlijke villa-adviseur van BaliLiving — een luxe reisadviseur op Bali gerund door Edwin & Citty.

Een klant heeft de volgende wensen opgegeven:
- Budget per nacht: ${budget.replace("onder-", "onder €").replace("+", "+").replace("-", "–€")}
- Aantal gasten: ${guests}
- Locatievoorkeur: ${location === "geen-voorkeur" ? "Geen voorkeur" : location}
- Sfeer & voorkeuren: ${preferences.length > 0 ? preferences.join(", ") : "geen specifieke voorkeur"}

Hier zijn de beschikbare villa's die al gefilterd zijn op budget en capaciteit:
${JSON.stringify(villasSummary, null, 2)}

Kies de BESTE villa uit de lijst hierboven voor deze klant. Geef je antwoord als geldig JSON met exact deze structuur:
{
  "slug": "<slug van de aanbevolen villa>",
  "reason": "<persoonlijke toelichting in 2-3 zinnen in het Nederlands waarom deze villa perfect past bij de wensen van de klant. Spreek de klant direct aan met 'je/jouw'.>"
}

Geef ALLEEN het JSON object terug, geen extra tekst.`,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    let result: AdvisorResult;
    try {
      result = JSON.parse(responseText.trim());
    } catch {
      // Try extracting JSON from response if there's surrounding text
      const match = responseText.match(/\{[\s\S]*\}/);
      if (!match) {
        return NextResponse.json(
          { error: "Kon geen aanbeveling genereren. Probeer het opnieuw." },
          { status: 500 }
        );
      }
      result = JSON.parse(match[0]);
    }

    // Validate slug is in our eligible list
    const recommendedVilla = eligible.find((v) => v.slug === result.slug);
    if (!recommendedVilla) {
      // Fall back to first eligible villa
      result.slug = eligible[0].slug;
    }

    return NextResponse.json(result);
  } catch (err) {
    console.error("Villa advisor error:", err);
    return NextResponse.json(
      { error: "Er ging iets mis. Probeer het opnieuw." },
      { status: 500 }
    );
  }
}
