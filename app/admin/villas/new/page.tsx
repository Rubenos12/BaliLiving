"use client";

import { useState } from "react";
import Link from "next/link";
import MediaUploader from "@/components/admin/MediaUploader";
import { saveVilla } from "@/lib/actions/villas";

export default function NewVillaPage() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    region: "",
    bedrooms: "",
    bathrooms: "",
    guests_min: "",
    guests_max: "",
    price_per_night: "",
    tag: "",
    short_description: "",
    long_description: "",
  });
  const [amenities, setAmenities] = useState<string[]>([""]);
  const [highlights, setHighlights] = useState<string[]>([""]);
  const [saved, setSaved] = useState(false);
  const [savedId, setSavedId] = useState<string | undefined>();
  const [saveError, setSaveError] = useState("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError("");

    const slug = form.name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, "-");

    const result = await saveVilla({
      slug,
      name: form.name,
      location: form.location,
      region: form.region,
      tag: form.tag,
      short_description: form.short_description,
      long_description: form.long_description,
      guests_min: parseInt(form.guests_min) || 1,
      guests_max: parseInt(form.guests_max) || 2,
      bedrooms: parseInt(form.bedrooms) || 1,
      bathrooms: parseInt(form.bathrooms) || 1,
      price_per_night: parseInt(form.price_per_night) || 0,
      amenities: amenities.filter(Boolean),
      highlights: highlights.filter(Boolean),
      cover_icon: "🏡",
      published: true,
    });

    if (result.error) {
      setSaveError(result.error);
      return;
    }

    setSavedId(result.data?.id);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const updateList = (
    list: string[],
    setter: (v: string[]) => void,
    index: number,
    value: string
  ) => {
    const updated = [...list];
    updated[index] = value;
    setter(updated);
  };

  const addToList = (list: string[], setter: (v: string[]) => void) => {
    setter([...list, ""]);
  };

  const removeFromList = (list: string[], setter: (v: string[]) => void, index: number) => {
    setter(list.filter((_, i) => i !== index));
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center gap-4 mb-8">
        <Link
          href="/admin/villas"
          className="text-[#F5F0E8]/35 text-xs tracking-wider hover:text-[#C9A84C] transition-colors"
        >
          ← Terug
        </Link>
        <div>
          <h1
            className="text-3xl font-light text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Nieuwe villa toevoegen
          </h1>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Basic info */}
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-6 space-y-4">
          <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">Basisinformatie</h2>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                Villa naam *
              </label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Villa Tirta"
                className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
              />
            </div>
            <div>
              <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                Label / tag *
              </label>
              <input
                required
                value={form.tag}
                onChange={(e) => setForm({ ...form, tag: e.target.value })}
                placeholder="Meest geboekt"
                className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                Locatie *
              </label>
              <input
                required
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Ubud, Bali"
                className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
              />
            </div>
            <div>
              <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                Regio (voor filter)
              </label>
              <select
                value={form.region}
                onChange={(e) => setForm({ ...form, region: e.target.value })}
                className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8]/80 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              >
                <option value="">Selecteer regio</option>
                {["Ubud", "Seminyak", "Canggu", "Uluwatu", "Nusa Dua", "Jimbaran", "Kuta"].map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                Slaapkamers
              </label>
              <input
                type="number"
                min="1"
                value={form.bedrooms}
                onChange={(e) => setForm({ ...form, bedrooms: e.target.value })}
                className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                Badkamers
              </label>
              <input
                type="number"
                min="1"
                value={form.bathrooms}
                onChange={(e) => setForm({ ...form, bathrooms: e.target.value })}
                className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                Min. gasten
              </label>
              <input
                type="number"
                min="1"
                value={form.guests_min}
                onChange={(e) => setForm({ ...form, guests_min: e.target.value })}
                className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              />
            </div>
            <div>
              <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                Max. gasten
              </label>
              <input
                type="number"
                min="1"
                value={form.guests_max}
                onChange={(e) => setForm({ ...form, guests_max: e.target.value })}
                className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
              Prijs per nacht (€) *
            </label>
            <input
              required
              type="number"
              min="1"
              value={form.price_per_night}
              onChange={(e) => setForm({ ...form, price_per_night: e.target.value })}
              placeholder="350"
              className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
            />
          </div>
        </div>

        {/* Descriptions */}
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-6 space-y-4">
          <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">Omschrijvingen</h2>

          <div>
            <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
              Korte omschrijving (kaartje op overzichtspagina)
            </label>
            <input
              value={form.short_description}
              onChange={(e) => setForm({ ...form, short_description: e.target.value })}
              placeholder="Privé villa met infinity pool..."
              className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
            />
          </div>

          <div>
            <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
              Volledige omschrijving (detailpagina)
            </label>
            <textarea
              rows={6}
              value={form.long_description}
              onChange={(e) => setForm({ ...form, long_description: e.target.value })}
              placeholder="Uitgebreide beschrijving van de villa, sfeer, omgeving..."
              className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20 resize-none"
            />
          </div>
        </div>

        {/* Highlights */}
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-6">
          <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">
            Highlights (waarom deze villa)
          </h2>
          <div className="space-y-2">
            {highlights.map((h, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={h}
                  onChange={(e) => updateList(highlights, setHighlights, i, e.target.value)}
                  placeholder={`Highlight ${i + 1}`}
                  className="flex-1 bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
                />
                <button
                  type="button"
                  onClick={() => removeFromList(highlights, setHighlights, i)}
                  className="px-3 py-2.5 border border-red-400/20 text-red-400/60 hover:bg-red-400/10 transition-colors text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addToList(highlights, setHighlights)}
            className="mt-3 text-[#C9A84C] text-xs tracking-wider hover:underline"
          >
            + Highlight toevoegen
          </button>
        </div>

        {/* Amenities */}
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-6">
          <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">
            Voorzieningen (amenities)
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {amenities.map((a, i) => (
              <div key={i} className="flex gap-2">
                <input
                  value={a}
                  onChange={(e) => updateList(amenities, setAmenities, i, e.target.value)}
                  placeholder={`Voorziening ${i + 1}`}
                  className="flex-1 bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
                />
                <button
                  type="button"
                  onClick={() => removeFromList(amenities, setAmenities, i)}
                  className="px-3 py-2.5 border border-red-400/20 text-red-400/60 hover:bg-red-400/10 transition-colors text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => addToList(amenities, setAmenities)}
            className="mt-3 text-[#C9A84C] text-xs tracking-wider hover:underline"
          >
            + Voorziening toevoegen
          </button>
        </div>

        {/* Media upload */}
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-6">
          <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">
            Foto&apos;s & Video&apos;s
          </h2>
          {!savedId && (
            <p className="text-[#F5F0E8]/35 text-xs mb-4">
              Sla de villa eerst op, daarna kun je media uploaden.
            </p>
          )}
          <MediaUploader villaId={savedId} />
        </div>

        {/* Save */}
        {saveError && <p className="text-red-400 text-xs">{saveError}</p>}
        <div className="flex gap-3">
          <Link
            href="/admin/villas"
            className="px-6 py-4 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-[0.25em] uppercase hover:bg-[#C9A84C]/10 transition-all duration-200"
          >
            Annuleren
          </Link>
          <button
            type="submit"
            className="flex-1 py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300"
          >
            {saved ? "✓ Opgeslagen! Nu media uploaden ↑" : "Villa opslaan"}
          </button>
        </div>
      </form>
    </div>
  );
}
