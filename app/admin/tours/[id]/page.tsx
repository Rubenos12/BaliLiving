"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function EditTourPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", location: "", short_description: "", long_description: "",
    price_per_person: "", duration_hours: "", max_guests: "10", published: true,
  });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("tours").select("*").eq("id", id).single();
      if (data) {
        setForm({
          name: data.name ?? "",
          location: data.location ?? "",
          short_description: data.short_description ?? "",
          long_description: data.long_description ?? "",
          price_per_person: String(data.price_per_person ?? ""),
          duration_hours: String(data.duration_hours ?? ""),
          max_guests: String(data.max_guests ?? "10"),
          published: data.published ?? true,
        });
      }
      setLoading(false);
    };
    load();
  }, [id]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("tours").update({
      name: form.name,
      location: form.location,
      short_description: form.short_description,
      long_description: form.long_description,
      price_per_person: parseInt(form.price_per_person) || 0,
      duration_hours: parseFloat(form.duration_hours) || 0,
      max_guests: parseInt(form.max_guests) || 10,
      published: form.published,
    }).eq("id", id);
    setSaving(false);
    router.push("/admin/tours");
  };

  if (loading) return <div className="p-8 text-[#F5F0E8]/30 text-sm">Laden...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/tours" className="text-[#F5F0E8]/35 text-xs tracking-wider hover:text-[#C9A84C] transition-colors">
          ← Tours
        </Link>
        <h1 className="text-3xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
          Tour bewerken
        </h1>
      </div>
      <form onSubmit={handleSave} className="space-y-5">
        <Field label="NAAM *" value={form.name} onChange={set("name")} required />
        <Field label="LOCATIE" value={form.location} onChange={set("location")} />
        <Field label="KORTE BESCHRIJVING" value={form.short_description} onChange={set("short_description")} multiline />
        <Field label="UITGEBREIDE BESCHRIJVING" value={form.long_description} onChange={set("long_description")} multiline />
        <div className="grid grid-cols-3 gap-4">
          <Field label="PRIJS P.P. (€)" value={form.price_per_person} onChange={set("price_per_person")} type="number" />
          <Field label="DUUR (UUR)" value={form.duration_hours} onChange={set("duration_hours")} type="number" />
          <Field label="MAX. GASTEN" value={form.max_guests} onChange={set("max_guests")} type="number" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="pub" checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="accent-[#C9A84C]" />
          <label htmlFor="pub" className="text-[#F5F0E8]/60 text-sm">Gepubliceerd</label>
        </div>
        <div className="flex gap-3 pt-2">
          <Link href="/admin/tours" className="px-6 py-3 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-wider uppercase hover:bg-[#C9A84C]/10 transition-colors">
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
