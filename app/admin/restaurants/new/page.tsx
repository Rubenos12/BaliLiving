"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const PRICE_RANGES = ["€", "€€", "€€€", "€€€€"];

export default function NewRestaurantPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", location: "", cuisine: "", price_range: "€€",
    short_description: "", long_description: "",
    opening_hours: "", phone: "", website: "", published: true,
  });

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase.from("restaurants").insert([{
      name: form.name,
      location: form.location,
      cuisine: form.cuisine,
      price_range: form.price_range,
      short_description: form.short_description,
      long_description: form.long_description,
      opening_hours: form.opening_hours,
      phone: form.phone,
      website: form.website,
      published: form.published,
    }]);
    setSaving(false);
    if (!error) router.push("/admin/restaurants");
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/restaurants" className="text-[#F5F0E8]/35 text-xs tracking-wider hover:text-[#C9A84C] transition-colors">
          ← Restaurants
        </Link>
        <h1 className="text-3xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
          Nieuw restaurant
        </h1>
      </div>
      <form onSubmit={handleSave} className="space-y-5">
        <Field label="NAAM *" value={form.name} onChange={set("name")} required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="LOCATIE" value={form.location} onChange={set("location")} />
          <Field label="KEUKEN" value={form.cuisine} onChange={set("cuisine")} placeholder="Bijv. Indonesisch, Italiaans" />
        </div>
        <div>
          <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">PRIJSKLASSE</label>
          <div className="flex gap-2">
            {PRICE_RANGES.map((p) => (
              <button key={p} type="button" onClick={() => setForm((f) => ({ ...f, price_range: p }))}
                className={`px-4 py-2 text-sm border transition-colors ${
                  form.price_range === p
                    ? "border-[#C9A84C] bg-[#C9A84C]/15 text-[#C9A84C]"
                    : "border-[#C9A84C]/20 text-[#F5F0E8]/40 hover:border-[#C9A84C]/40"
                }`}>
                {p}
              </button>
            ))}
          </div>
        </div>
        <Field label="KORTE BESCHRIJVING" value={form.short_description} onChange={set("short_description")} multiline />
        <Field label="UITGEBREIDE BESCHRIJVING" value={form.long_description} onChange={set("long_description")} multiline />
        <div className="grid grid-cols-2 gap-4">
          <Field label="OPENINGSTIJDEN" value={form.opening_hours} onChange={set("opening_hours")} placeholder="Bijv. Ma-Zo 10:00–22:00" />
          <Field label="TELEFOON" value={form.phone} onChange={set("phone")} />
        </div>
        <Field label="WEBSITE" value={form.website} onChange={set("website")} />
        <div className="flex items-center gap-3">
          <input type="checkbox" id="pub" checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="accent-[#C9A84C]" />
          <label htmlFor="pub" className="text-[#F5F0E8]/60 text-sm">Direct publiceren</label>
        </div>
        <div className="flex gap-3 pt-2">
          <Link href="/admin/restaurants" className="px-6 py-3 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-wider uppercase hover:bg-[#C9A84C]/10 transition-colors">
            Annuleren
          </Link>
          <button type="submit" disabled={saving}
            className="flex-1 py-3 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.25em] uppercase hover:bg-[#E8C96A] transition-all disabled:opacity-60">
            {saving ? "Opslaan..." : "Restaurant opslaan"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, multiline, type, placeholder }: {
  label: string; value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean; multiline?: boolean; type?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">{label}</label>
      {multiline ? (
        <textarea value={value} onChange={onChange} rows={3} placeholder={placeholder}
          className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors resize-none placeholder:text-[#F5F0E8]/20" />
      ) : (
        <input type={type ?? "text"} value={value} onChange={onChange} required={required} placeholder={placeholder}
          className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder:text-[#F5F0E8]/20" />
      )}
    </div>
  );
}
