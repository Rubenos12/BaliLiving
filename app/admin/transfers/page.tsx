"use client";

import { useState, useEffect, useCallback } from "react";
import { updateTransferRequestStatus } from "@/lib/actions/transfer-requests";
import { createClient } from "@/lib/supabase/client";

type TransferRequest = {
  id: string;
  from_location: string;
  to_location: string;
  transfer_date: string;
  transfer_time: string;
  passengers: number;
  tier: "normaal" | "luxe" | "vip";
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  notes: string;
  ai_recommendation: string;
  estimated_travel_time: string;
  status: "pending" | "confirmed" | "rejected";
  price_quoted: number | null;
  price_type: "per_person" | "total" | null;
  created_at: string;
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
  confirmed: "bg-green-400/15 text-green-400 border-green-400/30",
  rejected: "bg-red-400/15 text-red-400 border-red-400/30",
};

const statusLabels: Record<string, string> = {
  pending: "In behandeling",
  confirmed: "Bevestigd",
  rejected: "Afgewezen",
};

const tierLabels: Record<string, string> = {
  normaal: "Normaal",
  luxe: "Luxe",
  vip: "VIP",
};

const tierColors: Record<string, string> = {
  normaal: "text-[#F5F0E8]/50 border-[#F5F0E8]/20",
  luxe: "text-[#C9A84C] border-[#C9A84C]/30",
  vip: "text-purple-400 border-purple-400/30",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("nl-NL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AdminTransferRequestsPage() {
  const [requests, setRequests] = useState<TransferRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [prices, setPrices] = useState<Record<string, { amount: string; type: "per_person" | "total" }>>({});

  const fetchRequests = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("transfer_requests")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setRequests(data as TransferRequest[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Real-time subscription
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("transfer-requests-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "transfer_requests" },
        async (payload) => {
          if (payload.eventType === "INSERT") {
            setRequests((prev) => [payload.new as TransferRequest, ...prev]);
          } else if (payload.eventType === "UPDATE") {
            setRequests((prev) =>
              prev.map((r) =>
                r.id === (payload.new as TransferRequest).id
                  ? (payload.new as TransferRequest)
                  : r
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const getPriceForRequest = (id: string) =>
    prices[id] ?? { amount: "", type: "total" as const };

  const setPriceField = (id: string, field: "amount" | "type", value: string) => {
    setPrices((prev) => ({
      ...prev,
      [id]: { ...getPriceForRequest(id), [field]: value },
    }));
  };

  const handleStatus = async (id: string, status: "confirmed" | "rejected") => {
    setLoadingId(id + status);
    const priceData = prices[id];
    const priceQuoted = priceData?.amount ? parseInt(priceData.amount, 10) : undefined;
    const priceType = priceData?.type;
    const result = await updateTransferRequestStatus(
      id,
      status,
      status === "confirmed" && priceQuoted ? priceQuoted : undefined,
      status === "confirmed" && priceType ? priceType : undefined
    );
    if (!result.error) {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status,
                price_quoted: status === "confirmed" && priceQuoted ? priceQuoted : r.price_quoted,
                price_type: status === "confirmed" && priceType ? priceType : r.price_type,
              }
            : r
        )
      );
    }
    setLoadingId(null);
  };

  const filtered =
    filter === "all" ? requests : requests.filter((r) => r.status === filter);
  const pending = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1
            className="text-3xl font-light text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Transfer Aanvragen
          </h1>
          <p className="text-[#F5F0E8]/40 text-sm mt-1">
            {requests.length} aanvra{requests.length === 1 ? "ag" : "gen"} in
            totaal
            {pending > 0 && (
              <span className="ml-2 text-yellow-400">
                · {pending} openstaand
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {[
          { key: "all", label: "Alle" },
          { key: "pending", label: "Openstaand" },
          { key: "confirmed", label: "Bevestigd" },
          { key: "rejected", label: "Afgewezen" },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-1.5 text-xs tracking-wider uppercase border transition-colors duration-200 ${
              filter === tab.key
                ? "bg-[#C9A84C] text-[#1C2B1E] border-[#C9A84C]"
                : "border-[#C9A84C]/20 text-[#F5F0E8]/40 hover:border-[#C9A84C]/50 hover:text-[#F5F0E8]/70"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-[#F5F0E8]/30 text-sm py-20 text-center">
          Laden...
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 py-20 text-center">
          <p className="text-[#F5F0E8]/30 text-sm">
            {filter === "all"
              ? "Nog geen transfer aanvragen ontvangen"
              : "Geen aanvragen met deze status"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((req) => (
            <div
              key={req.id}
              className="bg-[#1C2B1E] border border-[#C9A84C]/15 hover:border-[#C9A84C]/25 transition-all duration-200 p-5"
            >
              {/* Header row */}
              <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-2xl">🚐</span>
                  <div>
                    <p
                      className="text-[#F5F0E8] font-light text-lg"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {req.from_location}{" "}
                      <span className="text-[#C9A84C]">→</span>{" "}
                      {req.to_location}
                    </p>
                    <p className="text-[#F5F0E8]/35 text-xs mt-0.5">
                      {formatDate(req.transfer_date)}
                      {req.transfer_time && ` · ${req.transfer_time}`}
                      {" · "}
                      {req.passengers} passagier
                      {req.passengers !== 1 ? "s" : ""}
                      {req.estimated_travel_time &&
                        ` · ca. ${req.estimated_travel_time}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span
                    className={`text-[0.6rem] tracking-wider uppercase px-2 py-0.5 border ${tierColors[req.tier] ?? ""}`}
                  >
                    {tierLabels[req.tier] ?? req.tier}
                  </span>
                  <span
                    className={`text-[0.6rem] tracking-wider uppercase px-2 py-0.5 border ${statusColors[req.status] ?? ""}`}
                  >
                    {statusLabels[req.status] ?? req.status}
                  </span>
                </div>
              </div>

              {/* Guest info */}
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs text-[#F5F0E8]/50 mb-4">
                <span>
                  <span className="text-[#F5F0E8]/25 mr-1.5">Gast</span>
                  {req.guest_name}
                </span>
                <a
                  href={`mailto:${req.guest_email}`}
                  className="hover:text-[#C9A84C] transition-colors"
                >
                  {req.guest_email}
                </a>
                {req.guest_phone && (
                  <a
                    href={`tel:${req.guest_phone}`}
                    className="hover:text-[#C9A84C] transition-colors"
                  >
                    {req.guest_phone}
                  </a>
                )}
              </div>

              {/* AI recommendation */}
              {req.ai_recommendation && (
                <div className="bg-[#243628] border border-[#C9A84C]/10 px-4 py-3 mb-4 text-xs text-[#F5F0E8]/55 leading-relaxed">
                  <span className="text-[#C9A84C] text-[0.6rem] tracking-wider uppercase mr-2">
                    AI advies
                  </span>
                  {req.ai_recommendation}
                </div>
              )}

              {/* Notes */}
              {req.notes && (
                <p className="text-xs text-[#F5F0E8]/40 italic mb-4">
                  "{req.notes}"
                </p>
              )}

              {/* Actions */}
              {req.status === "pending" && (
                <div className="space-y-3">
                  {/* Price input */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[#F5F0E8]/30 text-[0.6rem] tracking-wider uppercase shrink-0">Prijs</span>
                    <div className="flex items-center gap-1 bg-[#243628] border border-[#C9A84C]/15 px-3 py-1.5">
                      <span className="text-[#C9A84C] text-xs">€</span>
                      <input
                        type="number"
                        min="0"
                        value={getPriceForRequest(req.id).amount}
                        onChange={(e) => setPriceField(req.id, "amount", e.target.value)}
                        placeholder="0"
                        className="w-20 bg-transparent text-[#F5F0E8] text-xs focus:outline-none"
                      />
                    </div>
                    {/* Type toggle */}
                    <div className="flex">
                      {(["per_person", "total"] as const).map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setPriceField(req.id, "type", t)}
                          className={`px-3 py-1.5 text-[0.6rem] tracking-wider uppercase border transition-colors ${
                            getPriceForRequest(req.id).type === t
                              ? "bg-[#C9A84C]/20 border-[#C9A84C]/50 text-[#C9A84C]"
                              : "border-[#C9A84C]/15 text-[#F5F0E8]/35 hover:text-[#F5F0E8]/60"
                          }`}
                        >
                          {t === "per_person" ? "p.p." : "totaal"}
                        </button>
                      ))}
                    </div>
                    {/* Calculated total */}
                    {getPriceForRequest(req.id).amount && getPriceForRequest(req.id).type === "per_person" && (
                      <span className="text-[#C9A84C] text-xs">
                        = €{(parseInt(getPriceForRequest(req.id).amount || "0", 10) * req.passengers).toLocaleString("nl-NL")} totaal
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => handleStatus(req.id, "confirmed")}
                      disabled={loadingId === req.id + "confirmed"}
                      className="px-4 py-2 bg-green-400/10 border border-green-400/30 text-green-400 text-[0.6rem] tracking-wider uppercase hover:bg-green-400/20 transition-colors disabled:opacity-50"
                    >
                      {loadingId === req.id + "confirmed" ? "..." : "Bevestigen"}
                    </button>
                    <button
                      onClick={() => handleStatus(req.id, "rejected")}
                      disabled={loadingId === req.id + "rejected"}
                      className="px-4 py-2 bg-red-400/10 border border-red-400/30 text-red-400 text-[0.6rem] tracking-wider uppercase hover:bg-red-400/20 transition-colors disabled:opacity-50"
                    >
                      {loadingId === req.id + "rejected" ? "..." : "Afwijzen"}
                    </button>
                  </div>
                </div>
              )}
              {/* Show quoted price for confirmed requests */}
              {req.status === "confirmed" && req.price_quoted && (
                <div className="text-xs text-[#F5F0E8]/40 mt-1">
                  Gecalculeerde prijs: <span className="text-[#C9A84C]">€{req.price_quoted.toLocaleString("nl-NL")}</span>
                  {req.price_type === "per_person" && (
                    <span className="ml-1">p.p. (= €{(req.price_quoted * req.passengers).toLocaleString("nl-NL")} totaal)</span>
                  )}
                  {req.price_type === "total" && <span className="ml-1">totaal</span>}
                </div>
              )}

              <p className="text-[#F5F0E8]/20 text-[0.6rem] mt-3">
                Ontvangen:{" "}
                {new Date(req.created_at).toLocaleDateString("nl-NL", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
