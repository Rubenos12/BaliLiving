"use client";

import { useState, useEffect } from "react";
import { updateBookingStatus } from "@/lib/actions/bookings";
import { createClient } from "@/lib/supabase/client";

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
  admin_notes?: string;
  created_at: string;
};

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString("nl-NL", { day: "numeric", month: "short", year: "numeric" });
}

export default function BookingsClient({ bookings: initial }: { bookings: Booking[] }) {
  const [bookings, setBookings] = useState(initial);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState<string | null>(null);
  const [pulse, setPulse] = useState(false);
  const [rejectModal, setRejectModal] = useState<{ id: string; notes: string } | null>(null);

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("bookings-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            setBookings((prev) => [payload.new as Booking, ...prev]);
            setPulse(true);
            setTimeout(() => setPulse(false), 3000);
          } else if (payload.eventType === "UPDATE") {
            setBookings((prev) =>
              prev.map((b) => b.id === (payload.new as Booking).id ? payload.new as Booking : b)
            );
          } else if (payload.eventType === "DELETE") {
            setBookings((prev) => prev.filter((b) => b.id !== (payload.old as Booking).id));
          }
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const filtered = filter === "all" ? bookings : bookings.filter((b) => b.status === filter);
  const pending = bookings.filter((b) => b.status === "pending").length;

  const handleAccept = async (id: string) => {
    setLoading(id + "accepted");
    const result = await updateBookingStatus(id, "accepted");
    if (!result.error) {
      setBookings((bs) => bs.map((b) => b.id === id ? { ...b, status: "accepted" } : b));
    }
    setLoading(null);
  };

  const openRejectModal = (id: string) => {
    setRejectModal({ id, notes: "" });
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    setLoading(rejectModal.id + "rejected");
    const result = await updateBookingStatus(rejectModal.id, "rejected", rejectModal.notes);
    if (!result.error) {
      setBookings((bs) =>
        bs.map((b) =>
          b.id === rejectModal.id
            ? { ...b, status: "rejected", admin_notes: rejectModal.notes }
            : b
        )
      );
    }
    setLoading(null);
    setRejectModal(null);
  };

  return (
    <div className="p-4 md:p-8">
      {/* Reject modal */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
          <div className="bg-[#1C2B1E] border border-[#C9A84C]/20 p-6 max-w-md w-full">
            <h3 className="text-xl font-light text-[#F5F0E8] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>
              Boeking afwijzen
            </h3>
            <p className="text-[#F5F0E8]/50 text-sm mb-4">
              Voeg optioneel een reden toe voor de gast. Dit wordt opgenomen in de e-mail.
            </p>
            <textarea
              value={rejectModal.notes}
              onChange={(e) => setRejectModal({ ...rejectModal, notes: e.target.value })}
              placeholder="Bijv. Villa niet beschikbaar op deze datums."
              rows={3}
              className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/40 resize-none mb-4 placeholder-[#F5F0E8]/20"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setRejectModal(null)}
                className="flex-1 py-3 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-wider uppercase hover:bg-[#C9A84C]/10 transition-colors"
              >
                Annuleren
              </button>
              <button
                onClick={handleReject}
                disabled={loading !== null}
                className="flex-1 py-3 bg-red-500/20 text-red-400 border border-red-400/30 text-xs tracking-wider uppercase hover:bg-red-500/30 transition-colors disabled:opacity-50"
              >
                {loading ? "Bezig..." : "Afwijzen bevestigen"}
              </button>
            </div>
          </div>
        </div>
      )}

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
        {/* Live indicator — always visible, pulses brighter on new booking */}
        <div className={`flex items-center gap-2 text-xs transition-all duration-500 ${pulse ? "text-green-400" : "text-[#C9A84C]/50"}`}>
          <span className={`w-2 h-2 rounded-full transition-all duration-500 ${pulse ? "bg-green-400 animate-pulse" : "bg-[#C9A84C]/40"}`} />
          Live
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1 -mx-4 px-4 md:mx-0 md:px-0">
        {[
          { key: "all", label: "Alle" },
          { key: "pending", label: "In behandeling" },
          { key: "accepted", label: "Bevestigd" },
          { key: "rejected", label: "Afgewezen" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-xs tracking-wider transition-all duration-200 whitespace-nowrap ${
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
                <div className="min-w-[180px]">
                  <p className="text-[#F5F0E8] font-medium text-sm">{b.guest_name}</p>
                  <p className="text-[#F5F0E8]/40 text-xs mt-0.5">{b.guest_email}</p>
                  {b.guest_phone && <p className="text-[#F5F0E8]/40 text-xs">{b.guest_phone}</p>}
                </div>

                <div className="flex-1 min-w-[200px]">
                  <p className="text-[#C9A84C] text-sm font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {b.villa_name}
                  </p>
                  <p className="text-[#F5F0E8]/50 text-xs mt-1">
                    {fmtDate(b.check_in)} → {fmtDate(b.check_out)} · {b.total_nights} nachten · {b.guest_count} gasten
                  </p>
                  {b.notes && (
                    <p className="text-[#F5F0E8]/30 text-xs mt-1 italic">&ldquo;{b.notes}&rdquo;</p>
                  )}
                  {b.status === "rejected" && b.admin_notes && (
                    <p className="text-red-400/60 text-xs mt-1 italic">Reden: {b.admin_notes}</p>
                  )}
                </div>

                <div className="text-right">
                  <p className="text-[#C9A84C] text-lg font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                    €{b.total_price.toLocaleString("nl-NL")}
                  </p>
                  <span className={`inline-block mt-1 px-2.5 py-1 text-[0.6rem] tracking-wider uppercase border ${statusColors[b.status]}`}>
                    {statusLabels[b.status]}
                  </span>
                </div>
              </div>

              {b.status === "pending" && (
                <div className="border-t border-[#C9A84C]/10 px-5 py-3 flex items-center gap-3">
                  <button
                    onClick={() => handleAccept(b.id)}
                    disabled={loading === b.id + "accepted"}
                    className="px-4 py-2.5 bg-green-500/15 text-green-400 border border-green-400/30 text-[0.6rem] tracking-wider uppercase hover:bg-green-500/25 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    {loading === b.id + "accepted" ? "Bezig..." : "✓ Accepteren"}
                  </button>
                  <button
                    onClick={() => openRejectModal(b.id)}
                    disabled={loading !== null}
                    className="px-4 py-2.5 bg-red-500/15 text-red-400 border border-red-400/30 text-[0.6rem] tracking-wider uppercase hover:bg-red-500/25 transition-colors disabled:opacity-50 whitespace-nowrap"
                  >
                    ✕ Afwijzen
                  </button>
                  <span className="text-[#F5F0E8]/25 text-xs ml-auto">
                    {fmtDate(b.created_at)}
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
