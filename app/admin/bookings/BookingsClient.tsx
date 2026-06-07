"use client";

import { useState } from "react";
import { updateBookingStatus } from "@/lib/actions/bookings";

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

type Booking = {
  id: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  villa_name: string;
  check_in: string;
  check_out: string;
  total_nights: number;
  guest_count: number;
  total_price: number;
  status: string;
  notes: string;
  created_at: string;
};

export default function BookingsClient({ bookings: initial }: { bookings: Booking[] }) {
  const [bookings, setBookings] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);

  const handle = async (id: string, status: "accepted" | "rejected") => {
    setLoading(id + status);
    const result = await updateBookingStatus(id, status);
    if (!result.error) {
      setBookings((bs) => bs.map((b) => b.id === id ? { ...b, status } : b));
    }
    setLoading(null);
  };

  const pending = bookings.filter((b) => b.status === "pending").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
            Boekingen
          </h1>
          <p className="text-[#F5F0E8]/40 text-sm mt-1">
            {bookings.length} totaal
            {pending > 0 && (
              <span className="ml-2 text-yellow-400">· {pending} wachten op bevestiging</span>
            )}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6">
        {[
          { key: "all", label: "Alle" },
          { key: "pending", label: "In behandeling" },
          { key: "accepted", label: "Bevestigd" },
          { key: "rejected", label: "Afgewezen" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-xs tracking-wider transition-all duration-200 ${
              filter === tab.key
                ? "bg-[#C9A84C] text-[#1C2B1E]"
                : "bg-[#1C2B1E] text-[#F5F0E8]/50 border border-[#C9A84C]/15 hover:border-[#C9A84C]/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 py-20 text-center text-[#F5F0E8]/30 text-sm">
          Geen boekingen gevonden
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => (
            <div key={b.id} className="bg-[#1C2B1E] border border-[#C9A84C]/15 hover:border-[#C9A84C]/25 transition-colors">
              <div className="p-5 flex flex-wrap gap-6 items-start">
                {/* Guest info */}
                <div className="min-w-[180px]">
                  <p className="text-[#F5F0E8] font-medium text-sm">{b.guest_name}</p>
                  <p className="text-[#F5F0E8]/40 text-xs mt-0.5">{b.guest_email}</p>
                  {b.guest_phone && <p className="text-[#F5F0E8]/40 text-xs">{b.guest_phone}</p>}
                </div>

                {/* Booking details */}
                <div className="flex-1 min-w-[200px]">
                  <p className="text-[#C9A84C] text-sm font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {b.villa_name}
                  </p>
                  <p className="text-[#F5F0E8]/50 text-xs mt-1">
                    {b.check_in} → {b.check_out} · {b.total_nights} nachten · {b.guest_count} gasten
                  </p>
                  {b.notes && (
                    <p className="text-[#F5F0E8]/30 text-xs mt-1 italic">&ldquo;{b.notes}&rdquo;</p>
                  )}
                </div>

                {/* Price + status */}
                <div className="text-right">
                  <p className="text-[#C9A84C] text-lg font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                    €{b.total_price.toLocaleString("nl-NL")}
                  </p>
                  <span className={`inline-block mt-1 px-2.5 py-1 text-[0.6rem] tracking-wider uppercase border ${statusColors[b.status]}`}>
                    {statusLabels[b.status]}
                  </span>
                </div>
              </div>

              {/* Actions — only for pending */}
              {b.status === "pending" && (
                <div className="border-t border-[#C9A84C]/10 px-5 py-3 flex items-center gap-3">
                  <button
                    onClick={() => handle(b.id, "accepted")}
                    disabled={loading === b.id + "accepted"}
                    className="px-5 py-2 bg-green-500/15 text-green-400 border border-green-400/30 text-[0.6rem] tracking-wider uppercase hover:bg-green-500/25 transition-colors disabled:opacity-50"
                  >
                    {loading === b.id + "accepted" ? "Bezig..." : "✓ Accepteren"}
                  </button>
                  <button
                    onClick={() => handle(b.id, "rejected")}
                    disabled={loading === b.id + "rejected"}
                    className="px-5 py-2 bg-red-500/15 text-red-400 border border-red-400/30 text-[0.6rem] tracking-wider uppercase hover:bg-red-500/25 transition-colors disabled:opacity-50"
                  >
                    {loading === b.id + "rejected" ? "Bezig..." : "✕ Afwijzen"}
                  </button>
                  <span className="text-[#F5F0E8]/25 text-xs ml-auto">
                    Aangevraagd: {new Date(b.created_at).toLocaleDateString("nl-NL")}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
