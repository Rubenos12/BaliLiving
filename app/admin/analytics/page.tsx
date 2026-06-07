import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

const MONTHS = ["Jan", "Feb", "Mrt", "Apr", "Mei", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dec"];

async function getAnalytics() {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("bookings")
      .select("status, total_price, villa_name, created_at, total_nights");

    const bookings = data ?? [];
    const accepted = bookings.filter((b) => b.status === "accepted");
    const now = new Date();

    const totalRevenue = accepted.reduce((s, b) => s + (b.total_price ?? 0), 0);
    const yearRevenue = accepted
      .filter((b) => new Date(b.created_at).getFullYear() === now.getFullYear())
      .reduce((s, b) => s + (b.total_price ?? 0), 0);
    const monthRevenue = accepted
      .filter((b) => {
        const d = new Date(b.created_at);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      })
      .reduce((s, b) => s + (b.total_price ?? 0), 0);

    // Monthly revenue last 12 months
    const monthly: { month: string; revenue: number; count: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const m = d.getMonth();
      const y = d.getFullYear();
      const filtered = accepted.filter((b) => {
        const bd = new Date(b.created_at);
        return bd.getMonth() === m && bd.getFullYear() === y;
      });
      monthly.push({
        month: MONTHS[m],
        revenue: filtered.reduce((s, b) => s + (b.total_price ?? 0), 0),
        count: filtered.length,
      });
    }

    // Revenue per villa
    const villaMap: Record<string, number> = {};
    accepted.forEach((b) => {
      villaMap[b.villa_name] = (villaMap[b.villa_name] ?? 0) + (b.total_price ?? 0);
    });
    const villaRevenue = Object.entries(villaMap)
      .map(([name, revenue]) => ({ name, revenue }))
      .sort((a, b) => b.revenue - a.revenue);

    const avgNights = accepted.length > 0
      ? (accepted.reduce((s, b) => s + (b.total_nights ?? 0), 0) / accepted.length).toFixed(1)
      : "0";

    return {
      totalRevenue, yearRevenue, monthRevenue,
      totalBookings: bookings.length,
      acceptedBookings: accepted.length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      rejectedBookings: bookings.filter((b) => b.status === "rejected").length,
      avgNights,
      monthly, villaRevenue,
    };
  } catch {
    return {
      totalRevenue: 0, yearRevenue: 0, monthRevenue: 0,
      totalBookings: 0, acceptedBookings: 0, pendingBookings: 0, rejectedBookings: 0,
      avgNights: "0", monthly: [], villaRevenue: [],
    };
  }
}

export default async function AnalyticsPage() {
  const data = await getAnalytics();
  const maxMonthly = Math.max(...data.monthly.map((m) => m.revenue), 1);
  const maxVilla = Math.max(...data.villaRevenue.map((v) => v.revenue), 1);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
          Analytics
        </h1>
        <p className="text-[#F5F0E8]/40 text-sm mt-1">Financieel overzicht & statistieken</p>
      </div>

      {/* Revenue cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Deze maand", value: `€${data.monthRevenue.toLocaleString("nl-NL")}`, color: "text-[#C9A84C]" },
          { label: "Dit jaar", value: `€${data.yearRevenue.toLocaleString("nl-NL")}`, color: "text-[#C9A84C]" },
          { label: "All-time omzet", value: `€${data.totalRevenue.toLocaleString("nl-NL")}`, color: "text-[#C9A84C]" },
          { label: "Gem. verblijfsduur", value: `${data.avgNights} nachten`, color: "text-[#F5F0E8]" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-5">
            <div className={`text-2xl font-light mb-1 ${s.color}`} style={{ fontFamily: "var(--font-cormorant)" }}>
              {s.value}
            </div>
            <div className="text-[#F5F0E8]/40 text-xs tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Booking status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Totaal", value: data.totalBookings, color: "text-[#F5F0E8]" },
          { label: "Nieuw", value: data.pendingBookings, color: "text-yellow-400" },
          { label: "Bevestigd", value: data.acceptedBookings, color: "text-green-400" },
          { label: "Afgewezen", value: data.rejectedBookings, color: "text-red-400" },
        ].map((s) => (
          <div key={s.label} className="bg-[#1C2B1E] border border-[#C9A84C]/10 p-5">
            <div className={`text-3xl font-light mb-1 ${s.color}`} style={{ fontFamily: "var(--font-cormorant)" }}>
              {s.value}
            </div>
            <div className="text-[#F5F0E8]/40 text-xs tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Monthly revenue chart */}
      <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-6 mb-6">
        <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6">Omzet per maand (12 mnd)</h2>
        <div className="flex items-end gap-3 h-40">
          {data.monthly.map((m) => {
            const pct = (m.revenue / maxMonthly) * 100;
            return (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                {m.revenue > 0 && (
                  <span className="text-[#C9A84C] text-[0.6rem]">
                    €{m.revenue >= 1000 ? `${(m.revenue / 1000).toFixed(1)}k` : m.revenue}
                  </span>
                )}
                <div className="w-full bg-[#243628] relative" style={{ height: "100px" }}>
                  <div
                    className="absolute bottom-0 left-0 right-0 bg-[#C9A84C] transition-all duration-500"
                    style={{ height: `${Math.max(pct, m.revenue > 0 ? 3 : 0)}%`, opacity: 0.85 }}
                  />
                </div>
                <span className="text-[#F5F0E8]/30 text-[0.6rem]">{m.month}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top villas */}
      {data.villaRevenue.length > 0 && (
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-6">
          <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6">Omzet per villa</h2>
          <div className="space-y-4">
            {data.villaRevenue.map((v, i) => (
              <div key={v.name} className="flex items-center gap-4">
                <span className="text-[#C9A84C]/50 text-xs w-5 text-right">#{i + 1}</span>
                <span className="text-[#F5F0E8]/70 text-sm w-40 truncate">{v.name}</span>
                <div className="flex-1 bg-[#243628] h-2">
                  <div
                    className="h-2 bg-[#C9A84C]"
                    style={{ width: `${(v.revenue / maxVilla) * 100}%`, opacity: 0.8 }}
                  />
                </div>
                <span className="text-[#C9A84C] text-sm font-light w-24 text-right" style={{ fontFamily: "var(--font-cormorant)" }}>
                  €{v.revenue.toLocaleString("nl-NL")}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {data.totalRevenue === 0 && (
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/10 py-16 text-center text-[#F5F0E8]/30 text-sm">
          Nog geen bevestigde boekingen om te analyseren
        </div>
      )}
    </div>
  );
}
