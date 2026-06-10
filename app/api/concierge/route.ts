import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { fetchVillas } from "@/lib/actions/villas-fetch";
import { createBooking } from "@/lib/actions/bookings";
import { createServiceClient } from "@/lib/supabase/server";
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

async function checkVillaAvailability(
  villaId: string,
  checkIn: string,
  checkOut: string
): Promise<{ available: boolean; blockedDates?: string[] }> {
  const supabase = createServiceClient();
  const start = new Date(checkIn);
  const end = new Date(checkOut);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
    return { available: false };
  }

  const dates: string[] = [];
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]);
  }

  const { data } = await supabase
    .from("blocked_dates")
    .select("blocked_date")
    .eq("villa_id", villaId)
    .in("blocked_date", dates);

  if (data && data.length > 0) {
    return { available: false, blockedDates: data.map((d: { blocked_date: string }) => d.blocked_date) };
  }
  return { available: true };
}

const profileSchema = z.object({
  guests: z.string().optional(),
  budget: z.string().optional(),
  tripType: z.string().optional(),
  region: z.string().optional(),
  dates: z.string().optional(),
  guestName: z.string().optional(),
  guestEmail: z.string().optional(),
  guestPhone: z.string().optional(),
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
  bookingCreated?: boolean;
};

const tools: Anthropic.Tool[] = [
  {
    name: "check_availability",
    description: "Check if a villa is available for a specific date range. Call this as soon as the guest has specified a villa and dates.",
    input_schema: {
      type: "object" as const,
      properties: {
        villa_id: { type: "string", description: "The UUID of the villa to check" },
        check_in: { type: "string", description: "Check-in date in YYYY-MM-DD format" },
        check_out: { type: "string", description: "Check-out date in YYYY-MM-DD format" },
      },
      required: ["villa_id", "check_in", "check_out"],
    },
  },
  {
    name: "create_booking",
    description: "Create a booking request for a villa. Only call this after: (1) confirming availability via check_availability, (2) collecting guest_name and guest_email.",
    input_schema: {
      type: "object" as const,
      properties: {
        villa_id: { type: "string", description: "The UUID of the villa" },
        villa_name: { type: "string", description: "The name of the villa" },
        guest_name: { type: "string", description: "Full name of the guest" },
        guest_email: { type: "string", description: "Email address of the guest" },
        guest_phone: { type: "string", description: "Phone number of the guest (empty string if not provided)" },
        guest_count: { type: "number", description: "Number of guests" },
        check_in: { type: "string", description: "Check-in date in YYYY-MM-DD format" },
        check_out: { type: "string", description: "Check-out date in YYYY-MM-DD format" },
        notes: { type: "string", description: "Special requests or notes from the guest" },
      },
      required: ["villa_id", "villa_name", "guest_name", "guest_email", "guest_phone", "guest_count", "check_in", "check_out"],
    },
  },
];

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

  // Load villa data server-side (villas + their IDs for tool use)
  const supabase = createServiceClient();
  const [villas, { data: villaIds }] = await Promise.all([
    fetchVillas(),
    supabase.from("villas").select("id, slug").eq("published", true),
  ]);

  const slugToId: Record<string, string> = {};
  for (const v of villaIds ?? []) {
    slugToId[v.slug] = v.id;
  }

  const villaSummary = villas.map((v) => ({
    id: slugToId[v.slug] ?? "",
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
  if (profile?.guestName) profileLines.push(`Naam gast: ${profile.guestName}`);
  if (profile?.guestEmail) profileLines.push(`E-mail gast: ${profile.guestEmail}`);
  if (profile?.guestPhone) profileLines.push(`Telefoon gast: ${profile.guestPhone}`);
  const profileContext = profileLines.length > 0
    ? `\nWAT WE AL WETEN OVER DEZE GAST:\n${profileLines.join("\n")}\n`
    : "";

  const systemPrompt = `Je bent de persoonlijke AI concierge van BaliLiving — het exclusieve villa- en reisbedrijf op Bali van Edwin & Citty. Je spreekt altijd Nederlands en bent warm, bondig en deskundig.
${profileContext}
BESCHIKBARE VILLA'S (id is nodig voor de tools):
${JSON.stringify(villaSummary, null, 2)}

TOOLS DIE JE KUNT GEBRUIKEN:
- check_availability: controleer of een villa beschikbaar is voor bepaalde datums
- create_booking: maak een boekingsaanvraag aan (status wordt 'pending', admin bevestigt binnen 24 uur)

BOEKINGSFLOW — volg deze volgorde strikt:
1. Doe een aanbeveling op basis van reistype, gasten en budget
2. Als de gast wil boeken: vraag check-in en check-out datum (formaat YYYY-MM-DD)
3. Roep check_availability aan
4. Als beschikbaar: vraag naam en e-mailadres (telefoonnummer optioneel)
5. Roep create_booking aan met alle gegevens
6. Bevestig dat de aanvraag is ingediend — de admin neemt binnen 24 uur contact op

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
- Na een succesvolle boeking: geef quickReplies: []

GESPREKSSTRATEGIE:
1. Stel één vraag tegelijk
2. Gebruik quickReplies als keuzemenu voor die ene vraag
3. Zodra je weet: reistype, gasten, budget → doe een gerichte aanbeveling
4. Houd de flow soepel en persoonlijk`;

  const client = new Anthropic();
  const toolMessages: Anthropic.MessageParam[] = messages as Anthropic.MessageParam[];

  let finalResult: ConciergeResponse | null = null;
  let bookingCreated = false;

  try {
    // Tool loop — handle up to 4 rounds (max 3 tool calls + final response)
    for (let i = 0; i < 4; i++) {
      const response = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 512,
        system: systemPrompt,
        tools,
        messages: toolMessages,
      });

      const toolUseBlocks = response.content.filter(
        (b): b is Anthropic.ToolUseBlock => b.type === "tool_use"
      );
      const textBlock = response.content.find(
        (b): b is Anthropic.TextBlock => b.type === "text"
      );

      if (toolUseBlocks.length === 0) {
        // Final text response — parse JSON
        const raw = textBlock?.text.trim() ?? "";
        try {
          const jsonMatch = raw.match(/\{[\s\S]*\}/);
          const parsedJson = JSON.parse(jsonMatch?.[0] ?? raw);
          finalResult = {
            message: typeof parsedJson.message === "string" ? parsedJson.message : "Er ging iets mis.",
            quickReplies: Array.isArray(parsedJson.quickReplies)
              ? parsedJson.quickReplies.filter((r: unknown) => typeof r === "string").slice(0, 4)
              : [],
            bookingCreated,
          };
        } catch {
          finalResult = { message: raw || "Er ging iets mis.", quickReplies: [], bookingCreated };
        }
        break;
      }

      // Execute tool calls and collect results
      const toolResultContent: Anthropic.ToolResultBlockParam[] = [];

      for (const block of toolUseBlocks) {
        let result: string;

        if (block.name === "check_availability") {
          const input = block.input as { villa_id: string; check_in: string; check_out: string };
          const availability = await checkVillaAvailability(input.villa_id, input.check_in, input.check_out);
          result = JSON.stringify(availability);
        } else if (block.name === "create_booking") {
          const input = block.input as {
            villa_id: string;
            villa_name: string;
            guest_name: string;
            guest_email: string;
            guest_phone: string;
            guest_count: number;
            check_in: string;
            check_out: string;
            notes?: string;
          };
          const bookingResult = await createBooking({
            villa_id: input.villa_id,
            villa_name: input.villa_name,
            guest_name: input.guest_name,
            guest_email: input.guest_email,
            guest_phone: input.guest_phone ?? "",
            guest_count: input.guest_count,
            check_in: input.check_in,
            check_out: input.check_out,
            total_nights: 0, // recalculated server-side
            total_price: 0,  // recalculated server-side
            notes: input.notes ?? "",
          });
          if (!bookingResult.error) bookingCreated = true;
          result = JSON.stringify(bookingResult);
        } else {
          result = JSON.stringify({ error: "Onbekende tool." });
        }

        toolResultContent.push({
          type: "tool_result",
          tool_use_id: block.id,
          content: result,
        });
      }

      // Append assistant response + tool results for next iteration
      toolMessages.push({ role: "assistant", content: response.content });
      toolMessages.push({ role: "user", content: toolResultContent });
    }

    if (!finalResult) {
      finalResult = { message: "Er ging iets mis. Probeer het opnieuw.", quickReplies: [] };
    }

    return NextResponse.json(finalResult);
  } catch {
    return NextResponse.json(
      { message: "Er ging iets mis. Probeer het opnieuw.", quickReplies: [] },
      { status: 500 }
    );
  }
}
