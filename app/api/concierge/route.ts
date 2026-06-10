import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchVillas } from "@/lib/actions/villas-fetch";
import { z } from "zod";

// Rate limiter: 20 requests per IP per minute
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 20) return false;
  entry.count++;
  return true;
}

const profileSchema = z.object({
  guests: z.string().optional(),
  budget: z.string().optional(),
  tripType: z.string().optional(),
  region: z.string().optional(),
  dates: z.string().optional(),
}).optional();

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(2000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(30),
  profile: profileSchema,
});

export type ConciergeResponse = {
  message: string;
  quickReplies: string[];
};

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Te veel verzoeken. Probeer het over een minuut opnieuw." }, { status: 429 });
  }

  const rawBody = await req.json().catch(() => null);
  if (!rawBody) return NextResponse.json({ error: "Ongeldige invoer." }, { status: 400 });

  const parsed = requestSchema.safeParse(rawBody);
  if (!parsed.success) return NextResponse.json({ error: "Ongeldige invoer." }, { status: 400 });

  const { messages, profile } = parsed.data;

  // Load villa data server-side
  const villas = await fetchVillas();
  const villaSummary = villas.map((v) => ({
    naam: v.name,
    slug: v.slug,
    regio: v.region,
    prijs: `€${v.price_per_night}/nacht`,
    slaapkamers: v.bedrooms,
    max_gasten: v.guests_max,
    tag: v.tag,
    beschrijving: v.short_description,
    voorzieningen: v.amenities.slice(0, 5).join(", "),
  }));

  // Build known profile context
  const profileLines: string[] = [];
  if (profile?.guests) profileLines.push(`Aantal gasten: ${profile.guests}`);
  if (profile?.budget) profileLines.push(`Budget: ${profile.budget}`);
  if (profile?.tripType) profileLines.push(`Reistype: ${profile.tripType}`);
  if (profile?.region) profileLines.push(`Gewenste regio: ${profile.region}`);
  if (profile?.dates) profileLines.push(`Reisdatums: ${profile.dates}`);
  const profileContext = profileLines.length > 0
    ? `\nWAT WE AL WETEN OVER DEZE GAST:\n${profileLines.join("\n")}\n`
    : "";

  const systemPrompt = `Je bent de persoonlijke AI concierge van BaliLiving — het exclusieve villa- en reisbedrijf op Bali van Edwin & Citty. Je spreekt altijd Nederlands en bent warm, bondig en deskundig.
${profileContext}
BESCHIKBARE VILLA'S:
${JSON.stringify(villaSummary, null, 2)}

BELANGRIJK — ANTWOORDFORMAAT:
Je antwoordt ALTIJD met geldig JSON en niets anders:
{
  "message": "...",
  "quickReplies": ["...", "..."]
}

REGELS:
- "message": maximaal 1-2 zinnen. GEEN markdown, GEEN asterisken (*), GEEN opsommingstekens (-, •), GEEN koppen. Gewone lopende tekst.
- "quickReplies": een array van 2-4 korte opties (max 5 woorden elk) die logisch aansluiten op jouw vraag. Gebruik [] als je een concrete aanbeveling geeft en geen keuze nodig is.
- Als je villa's aanbeveelt: noem de naam in de tekst, geef als quickReplies bijv. ["Meer over [villanaam]", "Andere opties", "Boekingsvraag"]
- Verwijs naar villa's als: [Villa Naam](/villas/slug)

GESPREKSSTRATEGIE:
1. Stel één vraag tegelijk
2. Gebruik quickReplies als keuzemenu voor die ene vraag
3. Zodra je weet: reistype, gasten, budget → doe een gerichte aanbeveling
4. Houd de flow soepel en persoonlijk`;

  const client = new Anthropic();

  try {
    const response = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: systemPrompt,
      messages: messages as Anthropic.MessageParam[],
    });

    const raw = response.content[0].type === "text" ? response.content[0].text.trim() : "";

    // Parse JSON, with fallback
    let result: ConciergeResponse;
    try {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      const parsed = JSON.parse(jsonMatch?.[0] ?? raw);
      result = {
        message: typeof parsed.message === "string" ? parsed.message : "Er ging iets mis. Probeer het opnieuw.",
        quickReplies: Array.isArray(parsed.quickReplies)
          ? parsed.quickReplies.filter((r: unknown) => typeof r === "string").slice(0, 4)
          : [],
      };
    } catch {
      result = { message: raw || "Er ging iets mis. Probeer het opnieuw.", quickReplies: [] };
    }

    return NextResponse.json(result);
  } catch {
    return NextResponse.json(
      { message: "Er ging iets mis. Probeer het opnieuw.", quickReplies: [] },
      { status: 500 }
    );
  }
}
