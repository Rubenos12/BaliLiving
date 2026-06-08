"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { updateStaticTransfer } from "@/lib/actions/static-transfers";

const VEHICLE_OPTIONS = [
  { value: "car", label: "Auto" },
  { value: "van", label: "Busje" },
  { value: "minibus", label: "Minibus" },
];

export default function EditTransferPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", from_location: "", to_location: "",
    price: "", vehicle_type: "car", max_passengers: "4",
    description: "", published: true,
  });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("transfers").select("*").eq("id", id).single();
      if (data) {
        setForm({
          name: data.name ?? "",
          from_location: data.from_location ?? "",
          to_location: data.to_location ?? "",
          price: String(data.price ?? ""),
          vehicle_type: data.vehicle_type ?? "car",
          max_passengers: String(data.max_passengers ?? "4"),
          description: data.description ?? "",
          published: data.published ?? true,
        });
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await updateStaticTransfer(id, {
      name: form.name,
      from_location: form.from_location,
      to_location: form.to_location,
      price: parseInt(form.price) || 0,
      vehicle_type: form.vehicle_type,
      max_passengers: parseInt(form.max_passengers) || 4,
      description: form.description,
      published: form.published,
    });
    setSaving(false);
    router.push("/admin/transfers");
  };

  if (loading) return <div className="p-8 text-[#F5F0E8]/30 text-sm">Laden...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/transfers" className="text-[#F5F0E8]/35 text-xs tracking-wider hover:text-[#C9A84C] transition-colors">
          ← Transfers
        </Link>
        <h1 className="text-3xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
          Transfer bewerken
        </h1>
      </div>
      <form onSubmit={handleSave} className="space-y-5">
        <Field label="NAAM *" value={form.name} onChange={set("name")} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="VAN *" value={form.from_location} onChange={set("from_location")} required />
          <Field label="NAAR *" value={form.to_location} onChange={set("to_location")} required />
        </div>
        <Field label="OMSCHRIJVING" value={form.description} onChange={set("description")} multiline />
        <div className="grid grid-cols-3 gap-4">
          <Field label="PRIJS (€)" value={form.price} onChange={set("price")} type="number" />
          <div>
            <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">VOERTUIG</label>
            <select value={form.vehicle_type} onChange={set("vehicle_type")}
              className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors">
              {VEHICLE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
          <Field label="MAX. PASSAGIERS" value={form.max_passengers} onChange={set("max_passengers")} type="number" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="pub" checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="accent-[#C9A84C]" />
          <label htmlFor="pub" className="text-[#F5F0E8]/60 text-sm">Gepubliceerd</label>
        </div>
        <div className="flex gap-3 pt-2">
          <Link href="/admin/transfers" className="px-6 py-3 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-wider uppercase hover:bg-[#C9A84C]/10 transition-colors">
            Annuleren
          </Link>
          <button type="submit" disabled={saving}
            className="flex-1 py-3 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.25em] uppercase hover:bg-[#E8C96A] transition-all disabled:opacity-60">
            {saving ? "Opslaan..." : "Wijzigingen opslaan"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, multiline, type }: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean; multiline?: boolean; type?: string;
}) {
  return (
    <div>
      <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={onChange} rows={3}
          className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors resize-none" />
      ) : (
        <input type={type ?? "text"} value={value} onChange={onChange} required={required}
          className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors" />
      )}
    </div>
  );
}
