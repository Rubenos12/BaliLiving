import Link from "next/link";
import { createServiceClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

async function getStats() {
  try {
    const supabase = createServiceClient();
    const [bookings, villas, tours, transfers, restaurants] = await Promise.all([
      supabase.from("bookings").select("status, total_price, created_at"),
      supabase.from("villas").select("id", { count: "exact", head: true }),
      supabase.from("tours").select("id", { count: "exact", head: true }),
      supabase.from("transfers").select("id", { count: "exact", head: true }),
      supabase.from("restaurants").select("id", { count: "exact", head: true }),
    ]);

    const allBookings = bookings.data ?? [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const pending = allBookings.filter((b) => b.status === "pending").length;
    const accepted = allBookings.filter((b) => b.status === "accepted").length;
    const monthRevenue = allBookings
      .filter((b) => b.status === "accepted" && b.created_at >= monthStart)
      .reduce((s, b) => s + (b.total_price ?? 0), 0);
    const totalRevenue = allBookings
      .filter((b) => b.status === "accepted")
      .reduce((s, b) => s + (b.total_price ?? 0), 0);

    return {
      pending, accepted, monthRevenue, totalRevenue,
      villas: villas.count ?? 0,
      tours: tours.count ?? 0,
      transfers: transfers.count ?? 0,
      restaurants: restaurants.count ?? 0,
    };
  } catch {
    return { pending: 0, accepted: 0, monthRevenue: 0, totalRevenue: 0, villas: 0, tours: 0, transfers: 0, restaurants: 0 };
  }
}

export default async function AdminDashboard() {
  const stats = await getStats();

  const topStats = [
    { label: "Openstaande aanvragen", value: String(stats.pending), color: "text-yellow-400" },
    { label: "Bevestigde boekingen", value: String(stats.accepted), color: "text-green-400" },
    { label: "Omzet deze maand", value: `€${stats.monthRevenue.toLocaleString("nl-NL")}`, color: "text-[#C9A84C]" },
    { label: "Totale omzet", value: `€${stats.totalRevenue.toLocaleString("nl-NL")}`, color: "text-[#C9A84C]" },
  ];

  const inventory = [
    { label: "Villa's", value: stats.villas, href: "/admin/villas", icon: "🏡" },
    { label: "Tours", value: stats.tours, href: "/admin/tours", icon: "🌴" },
    { label: "Transfers", value: stats.transfers, href: "/admin/transfers", icon: "🚐" },
    { label: "Restaurants", value: stats.restaurants, href: "/admin/restaurants", icon: "🍜" },
  ];

  const quickActions = [
    { href: "/admin/bookings", label: "Bekijk alle boekingen", icon: "◉" },
    { href: "/admin/analytics", label: "Analytics bekijken", icon: "▦" },
    { href: "/admin/villas/new", label: "Nieuwe villa toevoegen", icon: "+" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
            Dashboard
          </h1>
          <p className="text-[#F5F0E8]/40 text-sm mt-1">Welkom, Edwin & Citty.</p>
        </div>
        {stats.pending > 0 && (
          <Link href="/admin/bookings" className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 px-4 py-2 text-yellow-400 text-xs tracking-wider hover:bg-yellow-400/20 transition-colors">
            ● {stats.pending} nieuwe aanvra{stats.pending === 1 ? "ag" : "gen"}
          </Link>
        )}
      </div>

      {/* Booking stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {topStats.map((s) => (
          <div key={s.label} className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-5">
            <div className={`text-3xl font-light mb-1 ${s.color}`} style={{ fontFamily: "var(--font-cormorant)" }}>
              {s.value}
            </div>
            <div className="text-[#F5F0E8]/40 text-xs tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Inventory */}
      <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">Aanbod</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {inventory.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-[#1C2B1E] border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 p-5 transition-all duration-200 group"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{item.icon}</span>
              <span className="text-3xl font-light text-[#C9A84C] group-hover:text-[#E8C96A] transition-colors" style={{ fontFamily: "var(--font-cormorant)" }}>
                {item.value}
              </span>
            </div>
            <div className="text-[#F5F0E8]/50 text-sm">{item.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">Snelle acties</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {quickActions.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="flex items-center gap-3 bg-[#1C2B1E] border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 p-4 transition-all duration-200"
          >
            <span className="text-[#C9A84C] text-lg w-6 text-center">{a.icon}</span>
            <span className="text-[#F5F0E8]/70 text-sm">{a.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
