"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const REGIONS = ["Ubud", "Seminyak", "Canggu", "Uluwatu", "Nusa Dua", "Jimbaran", "Kuta"];

export default function EditVillaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [villaId, setVillaId] = useState<string>("");
  const [form, setForm] = useState({
    name: "", location: "", region: "", tag: "",
    short_description: "", long_description: "",
    bedrooms: "", bathrooms: "", guests_min: "", guests_max: "",
    price_per_night: "", published: true,
  });
  const [amenities, setAmenities] = useState<string[]>([""]);
  const [highlights, setHighlights] = useState<string[]>([""]);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("villas")
        .select("*")
        .eq("slug", slug)
        .single();
      if (data) {
        setVillaId(data.id);
        setForm({
          name: data.name ?? "",
          location: data.location ?? "",
          region: data.region ?? "",
          tag: data.tag ?? "",
          short_description: data.short_description ?? "",
          long_description: data.long_description ?? "",
          bedrooms: String(data.bedrooms ?? 1),
          bathrooms: String(data.bathrooms ?? 1),
          guests_min: String(data.guests_min ?? 1),
          guests_max: String(data.guests_max ?? 2),
          price_per_night: String(data.price_per_night ?? 0),
          published: data.published ?? true,
        });
        setAmenities(data.amenities?.length > 0 ? data.amenities : [""]);
        setHighlights(data.highlights?.length > 0 ? data.highlights : [""]);
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();
    await supabase.from("villas").update({
      name: form.name,
      location: form.location,
      region: form.region,
      tag: form.tag,
      short_description: form.short_description,
      long_description: form.long_description,
      bedrooms: parseInt(form.bedrooms) || 1,
      bathrooms: parseInt(form.bathrooms) || 1,
      guests_min: parseInt(form.guests_min) || 1,
      guests_max: parseInt(form.guests_max) || 2,
      price_per_night: parseInt(form.price_per_night) || 0,
      amenities: amenities.filter(Boolean),
      highlights: highlights.filter(Boolean),
      published: form.published,
      updated_at: new Date().toISOString(),
    }).eq("id", villaId);
    setSaving(false);
    router.push("/admin/villas");
  };

  const updateList = (list: string[], setter: (v: string[]) => void, i: number, val: string) => {
    const updated = [...list]; updated[i] = val; setter(updated);
  };

  if (loading) return <div className="p-8 text-[#F5F0E8]/30 text-sm">Laden...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/villas" className="text-[#F5F0E8]/35 text-xs tracking-wider hover:text-[#C9A84C] transition-colors">
          ← Villa&apos;s
        </Link>
        <div>
          <h1 className="text-3xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
            {form.name || "Villa bewerken"}
          </h1>
          <p className="text-[#F5F0E8]/40 text-xs mt-1 tracking-wider">{form.location}</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Basic info */}
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-6 space-y-4">
          <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase">Basisinformatie</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="NAAM *" value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} required />
            <Field label="TAG / LABEL" value={form.tag} onChange={(v) => setForm(f => ({ ...f, tag: v }))} placeholder="Meest geboekt" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="LOCATIE" value={form.location} onChange={(v) => setForm(f => ({ ...f, location: v }))} placeholder="Ubud, Bali" />
            <div>
              <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">REGIO</label>
              <select value={form.region} onChange={(e) => setForm(f => ({ ...f, region: e.target.value }))}
                className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8]/80 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors">
                <option value="">Selecteer regio</option>
                {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <Field label="SLPK" value={form.bedrooms} onChange={(v) => setForm(f => ({ ...f, bedrooms: v }))} type="number" />
            <Field label="BADK" value={form.bathrooms} onChange={(v) => setForm(f => ({ ...f, bathrooms: v }))} type="number" />
            <Field label="MIN GASTEN" value={form.guests_min} onChange={(v) => setForm(f => ({ ...f, guests_min: v }))} type="number" />
            <Field label="MAX GASTEN" value={form.guests_max} onChange={(v) => setForm(f => ({ ...f, guests_max: v }))} type="number" />
          </div>
          <Field label="PRIJS PER NACHT (€)" value={form.price_per_night} onChange={(v) => setForm(f => ({ ...f, price_per_night: v }))} type="number" />
        </div>

        {/* Descriptions */}
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-6 space-y-4">
          <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase">Omschrijvingen</h2>
          <Field label="KORTE OMSCHRIJVING" value={form.short_description} onChange={(v) => setForm(f => ({ ...f, short_description: v }))} />
          <Field label="VOLLEDIGE OMSCHRIJVING" value={form.long_description} onChange={(v) => setForm(f => ({ ...f, long_description: v }))} multiline rows={6} />
        </div>

        {/* Highlights */}
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-6">
          <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">Highlights</h2>
          <div className="space-y-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input value={h} onChange={(e) => updateList(highlights, setHighlights, i, e.target.value)}
                  placeholder={`Highlight ${i + 1}`}
                  className="flex-1 bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20" />
                <button type="button" onClick={() => setHighlights(highlights.filter((_, j) => j !== i))}
                  className="px-3 border border-red-400/20 text-red-400/60 hover:bg-red-400/10 transition-colors text-xs">✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setHighlights([...highlights, ""])}
            className="mt-3 text-[#C9A84C] text-xs tracking-wider hover:underline">+ Highlight toevoegen</button>
        </div>

        {/* Amenities */}
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-6">
          <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">Voorzieningen</h2>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((a, i) => (
              <div key={i} className="flex gap-2">
                <input value={a} onChange={(e) => updateList(amenities, setAmenities, i, e.target.value)}
                  placeholder={`Voorziening ${i + 1}`}
                  className="flex-1 bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20" />
                <button type="button" onClick={() => setAmenities(amenities.filter((_, j) => j !== i))}
                  className="px-3 border border-red-400/20 text-red-400/60 hover:bg-red-400/10 transition-colors text-xs">✕</button>
              </div>
            ))}
          </div>
          <button type="button" onClick={() => setAmenities([...amenities, ""])}
            className="mt-3 text-[#C9A84C] text-xs tracking-wider hover:underline">+ Voorziening toevoegen</button>
        </div>

        {/* Publish */}
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-5 flex items-center gap-3">
          <input type="checkbox" id="pub" checked={form.published}
            onChange={(e) => setForm(f => ({ ...f, published: e.target.checked }))}
            className="accent-[#C9A84C] w-4 h-4" />
          <label htmlFor="pub" className="text-[#F5F0E8]/70 text-sm">Gepubliceerd (zichtbaar op website)</label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <Link href="/admin/villas" className="px-6 py-3.5 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-wider uppercase hover:bg-[#C9A84C]/10 transition-colors">
            Annuleren
          </Link>
          <button type="submit" disabled={saving}
            className="flex-1 py-3.5 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.25em] uppercase hover:bg-[#E8C96A] transition-all disabled:opacity-60">
            {saving ? "Opslaan..." : "Wijzigingen opslaan"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, required, multiline, type, placeholder, rows }: {
  label: string; value: string; onChange: (v: string) => void;
  required?: boolean; multiline?: boolean; type?: string; placeholder?: string; rows?: number;
}) {
  const cls = "w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20";
  return (
    <div>
      <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">{label}</label>
      {multiline
        ? <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={rows ?? 3} placeholder={placeholder} className={`${cls} resize-none`} />
        : <input type={type ?? "text"} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder} className={cls} />
      }
    </div>
  );
}
