import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + 60_000 });
    return true;
  }
  if (entry.count >= 15) return false;
  entry.count++;
  return true;
}

const requestSchema = z.object({
  check_in: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  check_out: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "Te veel verzoeken." }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = requestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Ongeldige datums." }, { status: 400 });
  }

  const { check_in, check_out } = parsed.data;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ items: [] });
  }

  const checkInDate = new Date(check_in);
  const checkOutDate = new Date(check_out);
  const nights = Math.round((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24));

  const monthNames = ["januari", "februari", "maart", "april", "mei", "juni", "juli", "augustus", "september", "oktober", "november", "december"];
  const checkInMonth = monthNames[checkInDate.getMonth()];
  const checkOutMonth = monthNames[checkOutDate.getMonth()];
  const checkInYear = checkInDate.getFullYear();

  const prompt = `Je bent een Bali-expert voor BaliVoorNederlanders. Een gast wil reizen van ${check_in} tot ${check_out} (${nights} nachten, aankomst in ${checkInMonth} ${checkInYear}).

Geef maximaal 4 korte contextuele inzichten over deze reisperiode op Bali. Denk aan:
- Seizoen (droog apr-okt, nat nov-mrt) en wat dat betekent praktisch
- Bali-feestdagen en ceremonies (Nyepi 2025 = 29 mrt, 2026 = 19 mrt; Galungan loopt 210 dagen Saka-kalender cyclus; Hari Raya Idul Fitri)
- Piekseizoen (jul-aug, dec-jan) vs. rustige periode
- Activiteitstips specifiek voor deze periode (surf, rijstvelden groen, etc.)
- Temperatuur/neerslag verwachting

Geef ALLEEN de meest relevante 2-4 items. Als er een Nyepi of grote ceremonie is, verplicht noemen. Als er niets bijzonders is, geef dan seizoen + 1 activiteitstip.

Geef exact dit JSON-formaat terug (geen andere tekst):
{
  "items": [
    { "icon": "🌤", "text": "korte beschrijving in het Nederlands (max 12 woorden)", "type": "info" | "warning" | "tip" }
  ]
}

Type "warning" alleen voor Nyepi (alles sluit), extreme moesson, of extreme drukte. Type "tip" voor activiteitsaanbevelingen. Type "info" voor seizoen/ceremonie info.`;

  try {
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

    if (!response.ok) return NextResponse.json({ items: [] });

    const result = await response.json();
    const text = result.content?.[0]?.type === "text" ? result.content[0].text : "";
    const clean = text.replace(/```json|```/g, "").trim();
    const data = JSON.parse(clean);

    const itemSchema = z.object({
      items: z.array(z.object({
        icon: z.string().max(10),
        text: z.string().max(150),
        type: z.enum(["info", "warning", "tip"]),
      })).max(4),
    });

    const validated = itemSchema.safeParse(data);
    if (!validated.success) return NextResponse.json({ items: [] });

    // Ensure text doesn't contain anything suspicious (prompt injection guard)
    const safeItems = validated.data.items.map((item) => ({
      ...item,
      text: item.text.replace(/<[^>]*>/g, "").slice(0, 150),
    }));

    return NextResponse.json({ items: safeItems });
  } catch {
    return NextResponse.json({ items: [] });
  }
}
