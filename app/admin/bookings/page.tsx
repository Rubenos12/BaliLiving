// Placeholder bookings page — will be connected to Supabase

const statusColors: Record<string, string> = {
  pending: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
  accepted: "bg-green-400/15 text-green-400 border-green-400/30",
  rejected: "bg-red-400/15 text-red-400 border-red-400/30",
  cancelled: "bg-[#F5F0E8]/10 text-[#F5F0E8]/40 border-[#F5F0E8]/20",
};

const statusLabels: Record<string, string> = {
  pending: "In behandeling",
  accepted: "Bevestigd",
  rejected: "Afgewezen",
  cancelled: "Geannuleerd",
};

// Sample data — replace with Supabase fetch
const sampleBookings = [
  {
    id: "1",
    guest_name: "Jan de Vries",
    guest_email: "jan@example.nl",
    villa: "Villa Tirta",
    check_in: "2025-07-10",
    check_out: "2025-07-17",
    nights: 7,
    guests: 2,
    total: 2450,
    status: "pending",
    created_at: "2025-06-01",
  },
];

export default function AdminBookingsPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-light text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Boekingen
          </h1>
          <p className="text-[#F5F0E8]/40 text-sm mt-1">
            Beheer alle boekingsaanvragen
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {["Alle", "In behandeling", "Bevestigd", "Afgewezen"].map((tab, i) => (
          <button
            key={tab}
            className={`px-4 py-2 text-xs tracking-wider transition-all duration-200 ${
              i === 0
                ? "bg-[#C9A84C] text-[#1C2B1E]"
                : "bg-[#1C2B1E] text-[#F5F0E8]/50 border border-[#C9A84C]/15 hover:border-[#C9A84C]/40"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#C9A84C]/15">
              {["Gast", "Villa", "Check-in", "Check-out", "Gasten", "Totaal", "Status", "Acties"].map(
                (h) => (
                  <th
                    key={h}
                    className="text-left text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase px-5 py-4"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {sampleBookings.map((b) => (
              <tr key={b.id} className="border-b border-[#C9A84C]/10 hover:bg-[#243628]/50 transition-colors">
                <td className="px-5 py-4">
                  <div className="text-[#F5F0E8]">{b.guest_name}</div>
                  <div className="text-[#F5F0E8]/35 text-xs">{b.guest_email}</div>
                </td>
                <td className="px-5 py-4 text-[#F5F0E8]/70">{b.villa}</td>
                <td className="px-5 py-4 text-[#F5F0E8]/70">{b.check_in}</td>
                <td className="px-5 py-4 text-[#F5F0E8]/70">{b.check_out}</td>
                <td className="px-5 py-4 text-[#F5F0E8]/70">{b.guests}</td>
                <td className="px-5 py-4 text-[#C9A84C]">€{b.total.toLocaleString("nl-NL")}</td>
                <td className="px-5 py-4">
                  <span
                    className={`inline-block px-2.5 py-1 text-[0.6rem] tracking-wider uppercase border rounded-none ${
                      statusColors[b.status]
                    }`}
                  >
                    {statusLabels[b.status]}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1.5 bg-green-500/15 text-green-400 border border-green-400/30 text-[0.6rem] tracking-wider uppercase hover:bg-green-500/25 transition-colors">
                      Accepteren
                    </button>
                    <button className="px-3 py-1.5 bg-red-500/15 text-red-400 border border-red-400/30 text-[0.6rem] tracking-wider uppercase hover:bg-red-500/25 transition-colors">
                      Afwijzen
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {sampleBookings.length === 0 && (
          <div className="py-16 text-center text-[#F5F0E8]/30 text-sm">
            Nog geen boekingen. Koppel Supabase om live data te tonen.
          </div>
        )}
      </div>
    </div>
  );
}
