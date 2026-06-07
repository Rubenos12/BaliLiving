"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Transfer = {
  id: string; name: string; from_location: string; to_location: string;
  price: number; vehicle_type: string; max_passengers: number; published: boolean;
};

const VEHICLE_LABELS: Record<string, string> = { car: "Auto", van: "Busje", minibus: "Minibus" };

export default function AdminTransfersPage() {
  const [items, setItems] = useState<Transfer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("transfers").select("*").order("name");
    if (data) setItems(data as Transfer[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const togglePublish = async (id: string, published: boolean) => {
    const supabase = createClient();
    await supabase.from("transfers").update({ published: !published }).eq("id", id);
    setItems((t) => t.map((i) => i.id === id ? { ...i, published: !published } : i));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Transfer verwijderen?")) return;
    const supabase = createClient();
    await supabase.from("transfers").delete().eq("id", id);
    setItems((t) => t.filter((i) => i.id !== id));
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
            Transfers
          </h1>
          <p className="text-[#F5F0E8]/40 text-sm mt-1">{items.length} transfers in het aanbod</p>
        </div>
        <Link href="/admin/transfers/new" className="px-5 py-2.5 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.25em] uppercase hover:bg-[#E8C96A] transition-all duration-200">
          + Nieuwe transfer
        </Link>
      </div>
      {loading ? (
        <div className="text-[#F5F0E8]/30 text-sm py-20 text-center">Laden...</div>
      ) : items.length === 0 ? (
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 py-20 text-center">
          <p className="text-[#F5F0E8]/30 text-sm mb-4">Nog geen transfers toegevoegd</p>
          <Link href="/admin/transfers/new" className="text-[#C9A84C] text-xs tracking-wider hover:underline">
            Voeg je eerste transfer toe →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <div key={item.id} className="bg-[#1C2B1E] border border-[#C9A84C]/15 hover:border-[#C9A84C]/30 transition-all duration-200 flex items-center gap-6 p-5">
              <div className="w-12 h-12 bg-[#243628] flex items-center justify-center text-2xl shrink-0">🚐</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="text-[#F5F0E8] font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {item.name}
                  </h3>
                  <span className={`text-[0.6rem] tracking-wider uppercase px-2 py-0.5 border ${
                    item.published
                      ? "text-green-400 bg-green-400/10 border-green-400/25"
                      : "text-[#F5F0E8]/30 bg-[#F5F0E8]/5 border-[#F5F0E8]/15"
                  }`}>
                    {item.published ? "Gepubliceerd" : "Verborgen"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-4 text-[#F5F0E8]/40 text-xs">
                  <span>{item.from_location} → {item.to_location}</span>
                  <span>{VEHICLE_LABELS[item.vehicle_type] ?? item.vehicle_type}</span>
                  <span>Max. {item.max_passengers} passagiers</span>
                  <span className="text-[#C9A84C]">€{item.price}</span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 shrink-0">
                <button onClick={() => togglePublish(item.id, item.published)}
                  className="px-3 py-2 border border-[#C9A84C]/20 text-[#F5F0E8]/50 text-[0.6rem] tracking-wider uppercase hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors">
                  {item.published ? "Verberg" : "Publiceer"}
                </button>
                <Link href={`/admin/transfers/${item.id}`}
                  className="px-3 py-2 border border-[#C9A84C]/20 text-[#F5F0E8]/50 text-[0.6rem] tracking-wider uppercase hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors">
                  Bewerken
                </Link>
                <button onClick={() => handleDelete(item.id)}
                  className="px-3 py-2 border border-red-400/20 text-red-400/50 text-[0.6rem] tracking-wider uppercase hover:border-red-400/50 hover:text-red-400 transition-colors">
                  Verwijder
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
