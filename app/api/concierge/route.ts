import { NextRequest } from "next/server";
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

const messageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(2000),
});

const requestSchema = z.object({
  messages: z.array(messageSchema).min(1).max(20),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return new Response("Te veel verzoeken. Probeer het over een minuut opnieuw.", { status: 429 });
  }

  const rawBody = await req.json().catch(() => null);
  if (!rawBody) return new Response("Ongeldige invoer.", { status: 400 });

  const parsed = requestSchema.safeParse(rawBody);
  if (!parsed.success) return new Response("Ongeldige invoer.", { status: 400 });

  const { messages } = parsed.data;

  // Load villa data server-side (not trusted from client)
  const villas = await fetchVillas();
  const villaSummary = villas.map((v) => ({
    naam: v.name,
    slug: v.slug,
    regio: v.region,
    locatie: v.location,
    prijs_per_nacht: `€${v.price_per_night}`,
    slaapkamers: v.bedrooms,
    max_gasten: v.guests_max,
    tag: v.tag,
    beschrijving: v.short_description,
    voorzieningen: v.amenities.slice(0, 6).join(", "),
  }));

  const systemPrompt = `Je bent de persoonlijke AI concierge van BaliLiving — het exclusieve villa- en reisbedrijf op Bali, gerund door Edwin & Citty vanuit hun jarenlange liefde voor het eiland.

Jouw karakter: warm, deskundig, enthousiast over Bali. Je helpt reizigers hun perfecte Balivakantie te vinden en te plannen.

Je spreekt ALTIJD Nederlands. Je gebruikt 'je/jouw' (niet 'u').

BESCHIKBARE VILLA'S:
${JSON.stringify(villaSummary, null, 2)}

HOE TE VERWIJZEN: Verwijs altijd naar villa's met hun volledige naam én link: [Villa Naam](/villas/[slug])

WAAR JE BIJ HELPT:
- Villa selectie op basis van wensen (budget, type reis, locatie, groepsgrootte)
- Reistips over Bali: beste reistijd, lokale gebruiken, activiteiten per regio
- Restauranttips (fine dining, lokale warungs, beachclubs)
- Tours & excursies: tempels, rijstterrassen, Mount Batur, eilandhopping
- Praktische info: transfers, simlokale, wisselkoers, ziektenpreventie
- Bij boekingsvragen: verwijs naar /contact of /booking/[villa-slug]

STIJL:
- Beknopt maar warm: max 2-3 paragrafen per antwoord
- Gebruik opsommingen bij meerdere opties
- Eindig soms met een gerichte vervolgvraag om beter te kunnen helpen
- Gebruik geen emojis tenzij de gebruiker ze ook gebruikt`;

  const client = new Anthropic();

  const stream = client.messages.stream({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 1024,
    system: systemPrompt,
    messages: messages as Anthropic.MessageParam[],
  });

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(chunk.delta.text));
          }
        }
        controller.close();
      } catch {
        controller.close();
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
