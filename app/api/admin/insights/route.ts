import { NextRequest, NextResponse } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  // Verify admin auth via session cookie
  try {
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error || !user || user.app_metadata?.role !== "admin") {
      return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
    }
  } catch {
    return NextResponse.json({ error: "Niet geautoriseerd." }, { status: 401 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "API key niet geconfigureerd." }, { status: 500 });
  }

  try {
    const db = createServiceClient();
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();

    const [bookingsRes, transfersRes, contactsRes] = await Promise.all([
      db.from("bookings").select("villa_name, status, total_price, total_nights, guest_count, created_at, check_in").gte("created_at", thirtyDaysAgo),
      db.from("transfer_requests").select("tier, status, from_location, to_location, occasion, created_at").gte("created_at", thirtyDaysAgo),
      db.from("contact_inquiries").select("interesse, status, created_at").gte("created_at", thirtyDaysAgo),
    ]);

    type BookingRow = { villa_name: string | null; status: string | null; total_price: number | null; total_nights: number | null; guest_count: number | null; created_at: string; check_in: string };
    type TransferRow = { tier: string | null; status: string | null; from_location: string | null; to_location: string | null; occasion: string | null; created_at: string };
    type ContactRow = { interesse: string | null; status: string | null; created_at: string };
    const bookings = (bookingsRes.data ?? []) as BookingRow[];
    const transfers = (transfersRes.data ?? []) as TransferRow[];
    const contacts = (contactsRes.data ?? []) as ContactRow[];

    // Aggregate booking stats
    const acceptedBookings = bookings.filter((b) => b.status === "accepted");
    const pendingBookings = bookings.filter((b) => b.status === "pending");
    const totalRevenue = acceptedBookings.reduce((s, b) => s + (b.total_price ?? 0), 0);
    const avgNights = acceptedBookings.length > 0
      ? (acceptedBookings.reduce((s, b) => s + (b.total_nights ?? 0), 0) / acceptedBookings.length).toFixed(1)
      : 0;

    const villaCounts: Record<string, number> = {};
    for (const b of acceptedBookings) {
      if (b.villa_name) villaCounts[b.villa_name] = (villaCounts[b.villa_name] ?? 0) + 1;
    }
    const topVilla = Object.entries(villaCounts).sort((a, b) => b[1] - a[1])[0];

    const allVillas = [...new Set(bookings.map((b) => b.villa_name).filter(Boolean))];
    const villaWithNoAccepted = allVillas.filter((v) => !acceptedBookings.some((b) => b.villa_name === v));

    // Transfer stats
    const tierCounts: Record<string, number> = {};
    for (const t of transfers) {
      if (t.tier) tierCounts[t.tier] = (tierCounts[t.tier] ?? 0) + 1;
    }

    // Contact stats
    const interestCounts: Record<string, number> = {};
    for (const c of contacts) {
      const key = c.interesse ?? "onbekend";
      interestCounts[key] = (interestCounts[key] ?? 0) + 1;
    }

    const period = `${new Date(thirtyDaysAgo).toLocaleDateString("nl-NL", { day: "numeric", month: "long" })} – ${now.toLocaleDateString("nl-NL", { day: "numeric", month: "long", year: "numeric" })}`;

    const dataContext = `
Periode: ${period}

BOEKINGEN (${bookings.length} totaal):
- Bevestigd: ${acceptedBookings.length} | Openstaand: ${pendingBookings.length} | Geannuleerd/afgewezen: ${bookings.length - acceptedBookings.length - pendingBookings.length}
- Omzet bevestigde boekingen: €${totalRevenue.toLocaleString("nl-NL")}
- Gemiddeld verblijf: ${avgNights} nachten
- Meest geboekte villa: ${topVilla ? `${topVilla[0]} (${topVilla[1]}×)` : "geen"}
- Villa's met aanvragen maar 0 bevestigingen: ${villaWithNoAccepted.length > 0 ? villaWithNoAccepted.join(", ") : "geen"}
- Villa verdeling (bevestigd): ${Object.entries(villaCounts).map(([v, c]) => `${v}: ${c}×`).join(", ") || "geen"}

TRANSFER AANVRAGEN (${transfers.length} totaal):
- Per tier: ${Object.entries(tierCounts).map(([t, c]) => `${t}: ${c}×`).join(", ") || "geen"}

CONTACT AANVRAGEN (${contacts.length} totaal):
- Per interesse: ${Object.entries(interestCounts).map(([i, c]) => `${i}: ${c}×`).join(", ") || "geen"}
`;

    const prompt = `Je bent een zakelijk adviseur voor BaliLiving, een exclusief Bali-reisbedrijf gerund door Edwin & Citty. Analyseer onderstaande data van de afgelopen 30 dagen en geef een beknopt rapport in het Nederlands.

${dataContext}

Geef exact dit JSON-formaat terug (geen andere tekst, geen markdown):
{
  "summary": "2-3 zinnen die de periode samenvatten — highlight het belangrijkste resultaat",
  "bullets": [
    { "type": "success", "text": "Positief resultaat of sterke prestatie (1 zin)" },
    { "type": "opportunity", "text": "Kans of actie die omzet kan verhogen (1 zin)" },
    { "type": "warning", "text": "Aandachtspunt dat actie vereist (1 zin)" }
  ]
}

Wees specifiek met namen en cijfers. Als data ontbreekt of nul is, zeg dat eerlijk.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 600,
        messages: [{ role: "user", content: prompt }],
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: "AI service tijdelijk niet beschikbaar." }, { status: 502 });
    }

    const result = await response.json();
    const text = result.content?.[0]?.type === "text" ? result.content[0].text : "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json(parsed);
  } catch (err) {
    console.error("Admin insights error:", err);
    return NextResponse.json({ error: "Er is een fout opgetreden bij het genereren van inzichten." }, { status: 500 });
  }
}
