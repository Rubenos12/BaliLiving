"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { updateRestaurant } from "@/lib/actions/restaurants";

const PRICE_RANGES = ["€", "€€", "€€€", "€€€€"];

export default function EditRestaurantPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    name: "", location: "", cuisine: "", price_range: "€€",
    short_description: "", long_description: "",
    opening_hours: "", phone: "", website: "",
    image_url: "", tag: "", sfeer: "", published: true,
  });

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("restaurants").select("*").eq("id", id).single();
      if (data) {
        setForm({
          name: data.name ?? "",
          location: data.location ?? "",
          cuisine: data.cuisine ?? "",
          price_range: data.price_range ?? "€€",
          short_description: data.short_description ?? "",
          long_description: data.long_description ?? "",
          opening_hours: data.opening_hours ?? "",
          phone: data.phone ?? "",
          website: data.website ?? "",
          image_url: data.image_url ?? "",
          tag: data.tag ?? "",
          sfeer: data.sfeer ?? "",
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
    await updateRestaurant(id, {
      name: form.name,
      location: form.location,
      cuisine: form.cuisine,
      price_range: form.price_range,
      short_description: form.short_description,
      long_description: form.long_description,
      opening_hours: form.opening_hours,
      phone: form.phone,
      website: form.website,
      image_url: form.image_url,
      tag: form.tag,
      sfeer: form.sfeer,
      published: form.published,
    });
    setSaving(false);
    router.push("/admin/restaurants");
  };

  if (loading) return <div className="p-8 text-[#F5F0E8]/30 text-sm">Laden...</div>;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/restaurants" className="text-[#F5F0E8]/35 text-xs tracking-wider hover:text-[#C9A84C] transition-colors">
          ← Restaurants
        </Link>
        <h1 className="text-3xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
          Restaurant bewerken
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
        <Field label="FOTO URL" value={form.image_url} onChange={set("image_url")} placeholder="https://..." />
        <div className="grid grid-cols-2 gap-4">
          <Field label="TAG / LABEL" value={form.tag} onChange={set("tag")} placeholder="Bijv. Award Winning" />
          <Field label="SFEER" value={form.sfeer} onChange={set("sfeer")} placeholder="Bijv. Romantisch, Fine Dining" />
        </div>
        <div className="flex items-center gap-3">
          <input type="checkbox" id="pub" checked={form.published}
            onChange={(e) => setForm((f) => ({ ...f, published: e.target.checked }))}
            className="accent-[#C9A84C]" />
          <label htmlFor="pub" className="text-[#F5F0E8]/60 text-sm">Gepubliceerd</label>
        </div>
        <div className="flex gap-3 pt-2">
          <Link href="/admin/restaurants" className="px-6 py-3 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-wider uppercase hover:bg-[#C9A84C]/10 transition-colors">
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
