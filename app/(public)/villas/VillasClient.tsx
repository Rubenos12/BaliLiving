"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Villa } from "@/lib/villas-data";
import VillaAdvisor from "@/components/VillaAdvisor";
import FavoriteButton from "@/components/FavoriteButton";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const REGION_FILTERS = ["Alle Villa's", "Ubud", "Seminyak", "Canggu", "Uluwatu", "Nusa Dua"];

// Mood-based filters mapped to amenity keywords or tags
const EXPERIENCE_FILTERS: { label: string; match: (v: Villa) => boolean }[] = [
  {
    label: "Privé zwembad",
    match: (v) => v.amenities.some((a) => /zwembad|pool/i.test(a)),
  },
  {
    label: "Beachfront",
    match: (v) => v.amenities.some((a) => /strand|beach|oceaan/i.test(a)) || /strand|beach/i.test(v.tag),
  },
  {
    label: "Romantisch",
    match: (v) =>
      /romantisch|koppel|romantic/i.test(v.tag) ||
      v.amenities.some((a) => /champagne|spa|bad|romantisch/i.test(a)),
  },
  {
    label: "Gezin",
    match: (v) =>
      /gezin|family/i.test(v.tag) ||
      v.amenities.some((a) => /kind|baby|gezin|child/i.test(a)),
  },
  {
    label: "Eco & natuur",
    match: (v) =>
      /eco|natuur|jungle|duurzaam/i.test(v.tag) ||
      v.amenities.some((a) => /jungle|yoga|eco|organic|organisch|bamboe/i.test(a)),
  },
  {
    label: "Grote groep",
    match: (v) => v.guests_max >= 8,
  },
];

type CompareResult = {
  winner: string;
  winner_name: string;
  winner_reason: string;
  villa_summaries: Array<{ slug: string; name: string; pros: string[]; cons: string[] }>;
  final_verdict: string;
};

export default function VillasClient({ villas }: { villas: Villa[] }) {
  const [activeRegion, setActiveRegion] = useState("Alle Villa's");
  const [activeExperience, setActiveExperience] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [comparePriority, setComparePriority] = useState("");
  const [compareLoading, setCompareLoading] = useState(false);
  const [compareResult, setCompareResult] = useState<CompareResult | null>(null);
  const [compareError, setCompareError] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("aanbevolen");

  const filtered = villas
    .filter((v) => {
      const regionMatch = activeRegion === "Alle Villa's" || v.region === activeRegion;
      const expFilter = EXPERIENCE_FILTERS.find((f) => f.label === activeExperience);
      const expMatch = !activeExperience || (expFilter ? expFilter.match(v) : true);
      const q = searchQuery.toLowerCase();
      const searchMatch = !q || v.name.toLowerCase().includes(q) || v.region.toLowerCase().includes(q) || v.location.toLowerCase().includes(q);
      return regionMatch && expMatch && searchMatch;
    })
    .sort((a, b) => {
      if (sortBy === "prijs-laag") return a.price_per_night - b.price_per_night;
      if (sortBy === "prijs-hoog") return b.price_per_night - a.price_per_night;
      if (sortBy === "slaapkamers") return b.bedrooms - a.bedrooms;
      return 0;
    });

  const activeCount = (activeRegion !== "Alle Villa's" ? 1 : 0) + (activeExperience ? 1 : 0);
  const hasActiveFilters = activeRegion !== "Alle Villa's" || activeExperience !== "" || searchQuery !== "";
  const clearFilters = () => { setActiveRegion("Alle Villa's"); setActiveExperience(""); setSearchQuery(""); setSortBy("aanbevolen"); };

  const toggleCompare = (slug: string) => {
    setCompareSelection((prev) => {
      if (prev.includes(slug)) return prev.filter((s) => s !== slug);
      if (prev.length >= 3) return prev;
      return [...prev, slug];
    });
  };

  const handleCompare = async () => {
    if (compareSelection.length < 2 || !comparePriority.trim()) return;
    setCompareLoading(true);
    setCompareResult(null);
    setCompareError(false);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30_000);
    try {
      const res = await fetch("/api/villa-compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slugs: compareSelection, priority: comparePriority }),
        signal: controller.signal,
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCompareResult(data);
    } catch {
      setCompareError(true);
    } finally {
      clearTimeout(timeout);
      setCompareLoading(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 sm:pt-40 md:pt-44 pb-16 sm:pb-24 bg-[#131E14] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1A10] to-[#131E14]" />
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full border border-[#C9A84C]/10" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">
              Onze Collectie
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-8xl font-light text-[#F5F0E8] leading-none mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Luxe
              <br />
              <span className="italic text-[#C9A84C]">Villa&apos;s</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/60 text-lg max-w-xl leading-relaxed">
              Elke villa is persoonlijk geselecteerd door Edwin & Citty op comfort, locatie en sfeer.
              Jouw privé thuis op het mooiste eiland ter wereld.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* AI Advisor */}
      <VillaAdvisor villas={villas} />

      {/* Divider */}
      <div className="bg-[#131E14] py-8">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-[#C9A84C]/15" />
            <span className="text-[#F5F0E8]/25 text-[0.6rem] tracking-[0.35em] uppercase shrink-0">╱ Of blader zelf</span>
            <div className="flex-1 h-px bg-[#C9A84C]/15" />
          </div>
        </div>
      </div>

      {/* Mobile: compact filter button + active chips */}
      <div className="md:hidden sticky top-[72px] z-40 bg-[#1C2B1E] border-b border-[#C9A84C]/15 px-4 py-3 flex items-center gap-2 overflow-x-auto">
        <button
          onClick={() => setFilterOpen(true)}
          aria-label="Open filters"
          className={`flex items-center gap-1.5 shrink-0 text-xs tracking-[0.15em] uppercase px-4 py-2.5 border transition-all duration-200 whitespace-nowrap ${
            activeCount > 0
              ? "bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#C9A84C]"
              : "border-[#F5F0E8]/15 text-[#F5F0E8]/50"
          }`}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
          </svg>
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>
        {activeRegion !== "Alle Villa's" && (
          <span className="flex items-center gap-1 shrink-0 text-xs px-3 py-2 bg-[#C9A84C] text-[#1C2B1E] whitespace-nowrap">
            {activeRegion}
            <button
              onClick={() => setActiveRegion("Alle Villa's")}
              className="ml-1 leading-none text-[#1C2B1E]/60 hover:text-[#1C2B1E] transition-colors"
              aria-label={`Verwijder ${activeRegion} filter`}
            >×</button>
          </span>
        )}
        {activeExperience && (
          <span className="flex items-center gap-1 shrink-0 text-xs px-3 py-2 bg-[#C9A84C]/20 border border-[#C9A84C]/60 text-[#C9A84C] whitespace-nowrap">
            {activeExperience}
            <button
              onClick={() => setActiveExperience("")}
              className="ml-1 leading-none text-[#C9A84C]/60 hover:text-[#C9A84C] transition-colors"
              aria-label={`Verwijder ${activeExperience} filter`}
            >×</button>
          </span>
        )}
      </div>

      {/* Desktop: sticky filter bar */}
      <section className="hidden md:block sticky top-[72px] z-40 bg-[#1C2B1E] border-y border-[#C9A84C]/15 py-5 space-y-3">
        {/* Search + sort row */}
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-4">
          <div className="relative flex-1 max-w-xs">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]/50 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Zoek villa, regio…"
              className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] pl-10 pr-8 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/25"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5F0E8]/30 hover:text-[#C9A84C] transition-colors"
                aria-label="Wis zoekopdracht"
              >
                ×
              </button>
            )}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8]/70 text-xs tracking-wider px-4 py-2.5 focus:outline-none focus:border-[#C9A84C]/60 transition-colors cursor-pointer"
          >
            <option value="aanbevolen">Aanbevolen</option>
            <option value="prijs-laag">Prijs: laag → hoog</option>
            <option value="prijs-hoog">Prijs: hoog → laag</option>
            <option value="slaapkamers">Meeste slaapkamers</option>
          </select>
        </div>
        {/* Region filters */}
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-2 border-t border-[#C9A84C]/10 pt-3">
          {REGION_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveRegion(f)}
              className={`text-xs tracking-[0.2em] uppercase px-5 py-2.5 min-h-[44px] transition-all duration-300 ${
                activeRegion === f
                  ? "bg-[#C9A84C] text-[#1C2B1E]"
                  : "text-[#F5F0E8]/50 border border-[#F5F0E8]/10 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        {/* Experience / mood filters */}
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-2 border-t border-[#C9A84C]/10 pt-3">
          <span className="text-[#F5F0E8]/25 text-[0.6rem] tracking-[0.25em] uppercase self-center mr-1 shrink-0">
            Sfeer
          </span>
          {EXPERIENCE_FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setActiveExperience((prev) => (prev === f.label ? "" : f.label))}
              className={`text-xs tracking-[0.15em] uppercase px-4 py-2.5 min-h-[44px] transition-all duration-300 border ${
                activeExperience === f.label
                  ? "bg-[#C9A84C]/20 border-[#C9A84C]/60 text-[#C9A84C]"
                  : "border-[#C9A84C]/15 text-[#F5F0E8]/40 hover:border-[#C9A84C]/40 hover:text-[#C9A84C]/80"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </section>

      {/* Villas grid */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        {/* Result count + clear */}
        <div className="flex items-center justify-between mb-10">
          <div>
            {searchQuery && (
              <p className="text-[#C9A84C] text-xs tracking-wider mb-1">
                Zoekresultaten voor &ldquo;{searchQuery}&rdquo;
              </p>
            )}
            <p className="text-[#F5F0E8]/40 text-sm">
              <span className="text-[#F5F0E8]">{filtered.length}</span>{" "}
              villa{filtered.length !== 1 ? "'s" : ""} gevonden
            </p>
          </div>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="text-xs text-[#C9A84C]/50 hover:text-[#C9A84C] tracking-wider transition-colors duration-200"
            >
              Wis filters ×
            </button>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#F5F0E8]/30 text-sm mb-4">
              Geen villa&apos;s gevonden voor deze combinatie.
            </p>
            <button
              onClick={clearFilters}
              className="text-xs text-[#C9A84C] tracking-wider hover:underline mb-8 block mx-auto"
            >
              Probeer andere filters
            </button>
            <p className="text-[#F5F0E8]/25 text-xs mb-4">Of laat onze AI de perfecte match vinden:</p>
            <button
              onClick={() => { window.scrollTo({ top: 0, behavior: "smooth" }); }}
              className="inline-block px-8 py-3 border border-[#C9A84C]/40 text-[#C9A84C] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-300"
            >
              Gebruik Villa Advisor ✦
            </button>
          </div>
        ) : (
          <motion.div
            key={`${activeRegion}-${activeExperience}`}
            initial="hidden"
            animate="show"
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filtered.map((villa) => (
              <motion.div
                key={villa.slug}
                variants={fadeUp}
                className="group bg-[#1C2B1E] border border-[#C9A84C]/10 hover:border-[#C9A84C]/35 transition-all duration-500"
              >
                {/* Image */}
                <div className="aspect-[4/3] bg-[#243628] relative overflow-hidden">
                  <Image
                    src={villa.images[0]}
                    alt={villa.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.classList.add("img-fallback"); }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A10]/40 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#C9A84C] text-[#1C2B1E] text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5">
                      {villa.tag}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <FavoriteButton
                      slug={villa.slug}
                      size="sm"
                      className="bg-[#0F1A10]/70 border border-[#F5F0E8]/20 hover:border-[#C9A84C]/60 text-[#F5F0E8]/60"
                    />
                    <button
                      onClick={() => toggleCompare(villa.slug)}
                      disabled={!compareSelection.includes(villa.slug) && compareSelection.length >= 3}
                      className={`w-11 h-11 flex items-center justify-center border text-xs font-medium transition-all duration-200 active:scale-95 ${
                        compareSelection.includes(villa.slug)
                          ? "bg-[#C9A84C] border-[#C9A84C] text-[#1C2B1E]"
                          : compareSelection.length >= 3
                          ? "bg-[#0F1A10]/60 border-[#F5F0E8]/10 text-[#F5F0E8]/20 cursor-not-allowed"
                          : "bg-[#0F1A10]/60 border-[#F5F0E8]/20 text-[#F5F0E8]/50 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
                      }`}
                      aria-label={compareSelection.includes(villa.slug) ? `${villa.name} verwijderen uit vergelijking` : `${villa.name} vergelijken`}
                      aria-pressed={compareSelection.includes(villa.slug)}
                    >
                      {compareSelection.includes(villa.slug) ? "✓" : "+"}
                    </button>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-6">
                  {/* Name + location */}
                  <h3
                    className="text-2xl font-light text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors duration-300 leading-tight"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {villa.name}
                  </h3>
                  <p className="text-[#C9A84C]/70 text-xs tracking-wider mt-1 mb-4">{villa.location}</p>

                  {/* Stat chips */}
                  <div className="flex items-center gap-2 mb-6 flex-wrap">
                    <span className="inline-flex items-center gap-1.5 border border-[#C9A84C]/20 text-[#F5F0E8]/55 text-xs px-3 py-1.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M2 9V6a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v3"/><path d="M2 11v9"/><path d="M22 11v9"/><path d="M2 15h20"/><rect x="6" y="15" width="4" height="5"/><rect x="14" y="15" width="4" height="5"/>
                      </svg>
                      {villa.bedrooms} slpk
                    </span>
                    <span className="inline-flex items-center gap-1.5 border border-[#C9A84C]/20 text-[#F5F0E8]/55 text-xs px-3 py-1.5">
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                      {villa.guests_min === villa.guests_max
                        ? villa.guests_max
                        : `${villa.guests_min}–${villa.guests_max}`}{" "}
                      gst
                    </span>
                    {villa.avg_rating && villa.avg_rating > 0 ? (
                      <span className="inline-flex items-center gap-1 border border-[#C9A84C]/20 text-[#C9A84C] text-xs px-3 py-1.5">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                        </svg>
                        {villa.avg_rating}
                        <span className="text-[#F5F0E8]/35 ml-0.5">({villa.review_count})</span>
                      </span>
                    ) : null}
                  </div>

                  {/* Price + CTA */}
                  <div className="flex items-center justify-between pt-4 border-t border-[#C9A84C]/10">
                    <div>
                      <p
                        className="text-[#C9A84C] text-xl font-light leading-none"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        €{villa.price_per_night.toLocaleString("nl-NL")}
                      </p>
                      <p className="text-[#F5F0E8]/35 text-[0.65rem] mt-0.5">per nacht</p>
                    </div>
                    <Link
                      href={`/villas/${villa.slug}`}
                      className="px-5 py-3 border border-[#C9A84C]/40 text-[#C9A84C] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-300"
                    >
                      Bekijk
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* Mobile: filter bottom sheet */}
      <AnimatePresence>
        {filterOpen && (
          <motion.div
            key="filter-sheet-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[45] md:hidden flex flex-col justify-end"
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setFilterOpen(false)} aria-hidden="true" />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              className="relative bg-[#1C2B1E] rounded-t-2xl px-5 pt-5 pb-safe max-h-[85dvh] overflow-y-auto overscroll-contain"
              role="dialog"
              aria-modal="true"
              aria-label="Villa filters"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
                  Filters
                </h3>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="w-10 h-10 flex items-center justify-center text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors"
                  aria-label="Sluit filters"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>

              {/* Search */}
              <div className="relative mb-6">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#C9A84C]/50 pointer-events-none" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Zoek villa, regio…"
                  className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] pl-10 pr-8 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/25"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#F5F0E8]/40 hover:text-[#C9A84C]" aria-label="Wis zoekopdracht">×</button>
                )}
              </div>

              {/* Sort */}
              <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-3">Sorteren</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {[
                  { value: "aanbevolen", label: "Aanbevolen" },
                  { value: "prijs-laag", label: "Prijs ↑" },
                  { value: "prijs-hoog", label: "Prijs ↓" },
                  { value: "slaapkamers", label: "Slaapkamers" },
                ].map((s) => (
                  <button
                    key={s.value}
                    onClick={() => setSortBy(s.value)}
                    className={`text-xs tracking-[0.15em] uppercase px-4 py-2.5 min-h-[44px] transition-all duration-200 border ${
                      sortBy === s.value
                        ? "bg-[#C9A84C] border-[#C9A84C] text-[#1C2B1E]"
                        : "border-[#F5F0E8]/10 text-[#F5F0E8]/50 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-3">Regio</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {REGION_FILTERS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveRegion(f)}
                    className={`text-xs tracking-[0.15em] uppercase px-4 py-2.5 min-h-[44px] transition-all duration-200 ${
                      activeRegion === f
                        ? "bg-[#C9A84C] text-[#1C2B1E]"
                        : "text-[#F5F0E8]/50 border border-[#F5F0E8]/10 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-3">Sfeer</p>
              <div className="flex flex-wrap gap-2 mb-6">
                {EXPERIENCE_FILTERS.map((f) => (
                  <button
                    key={f.label}
                    onClick={() => setActiveExperience((prev) => (prev === f.label ? "" : f.label))}
                    className={`text-xs tracking-[0.15em] uppercase px-4 py-2.5 min-h-[44px] transition-all duration-200 border ${
                      activeExperience === f.label
                        ? "bg-[#C9A84C]/20 border-[#C9A84C]/60 text-[#C9A84C]"
                        : "border-[#C9A84C]/15 text-[#F5F0E8]/40 hover:border-[#C9A84C]/40 hover:text-[#C9A84C]/80"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setFilterOpen(false)}
                className="w-full py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300 mb-2"
              >
                Toon {filtered.length} villa&apos;s
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare bar — slides up when 2–3 villas selected */}
      <AnimatePresence>
        {compareSelection.length >= 2 && (
          <motion.div
            key="compare-bar"
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-[44] bg-[#131E14] border-t border-[#C9A84C]/25 px-4 py-4 flex items-center justify-between"
            style={{ paddingBottom: "calc(1rem + env(safe-area-inset-bottom, 0px))" }}
          >
            <div>
              <p className="text-[#F5F0E8] text-sm font-light">{compareSelection.length} villa&apos;s geselecteerd</p>
              <p className="text-[#F5F0E8]/35 text-xs mt-0.5">
                {compareSelection.length < 3 ? "Voeg er nog één toe of vergelijk nu" : "Maximum bereikt"}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCompareSelection([])}
                className="text-[#F5F0E8]/35 text-xs tracking-[0.15em] uppercase hover:text-[#F5F0E8] transition-colors"
              >
                Wissen
              </button>
              <button
                onClick={() => { setCompareOpen(true); setCompareResult(null); setComparePriority(""); }}
                className="px-5 py-2.5 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.2em] uppercase hover:bg-[#E8C96A] transition-colors"
              >
                Vergelijk met AI →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Compare modal */}
      <AnimatePresence>
        {compareOpen && (
          <motion.div
            key="compare-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[46] flex flex-col justify-end md:items-center md:justify-center"
          >
            <div
              className="absolute inset-0 bg-black/75"
              onClick={() => { if (!compareLoading) setCompareOpen(false); }}
              aria-hidden="true"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative bg-[#1C2B1E] rounded-t-2xl md:rounded-2xl w-full md:max-w-2xl max-h-[90dvh] overflow-y-auto overscroll-contain"
              role="dialog"
              aria-modal="true"
              aria-label="Villa vergelijking"
            >
              <div className="px-5 pt-5 pb-safe">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.35em] uppercase mb-1">AI Vergelijking</p>
                    <h3 className="text-2xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
                      Welke villa past bij jullie?
                    </h3>
                  </div>
                  {!compareLoading && (
                    <button
                      onClick={() => setCompareOpen(false)}
                      className="w-10 h-10 flex items-center justify-center text-[#F5F0E8]/40 hover:text-[#F5F0E8] transition-colors shrink-0"
                      aria-label="Sluit vergelijking"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  )}
                </div>

                {!compareResult ? (
                  <>
                    {/* Selected villa names */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      {compareSelection.map((slug) => {
                        const v = villas.find((x) => x.slug === slug);
                        return v ? (
                          <span key={slug} className="text-xs px-3 py-1.5 bg-[#C9A84C]/10 border border-[#C9A84C]/30 text-[#C9A84C]">
                            {v.name}
                          </span>
                        ) : null;
                      })}
                    </div>

                    {/* Priority input */}
                    <label className="block mb-2">
                      <span className="text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase">
                        Wat vinden jullie het belangrijkste?
                      </span>
                    </label>
                    <textarea
                      value={comparePriority}
                      onChange={(e) => setComparePriority(e.target.value)}
                      placeholder="Bijv. 'We zijn met 2 kinderen en willen dicht bij Ubud, met veel privacy en een grote tuin'"
                      rows={4}
                      className="w-full bg-[#131E14] border border-[#C9A84C]/20 text-[#F5F0E8] text-sm placeholder-[#F5F0E8]/25 px-4 py-3 resize-none focus:outline-none focus:border-[#C9A84C]/50 mb-4"
                      disabled={compareLoading}
                    />

                    {compareError && (
                      <div className="mb-4 p-4 border border-red-500/30 bg-red-900/20 text-sm text-red-300">
                        Er ging iets mis. Controleer je verbinding en probeer het opnieuw.
                      </div>
                    )}

                    {compareLoading ? (
                      <div className="py-8 text-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                          className="w-8 h-8 border-2 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full mx-auto mb-4"
                        />
                        <p className="text-[#F5F0E8]/40 text-sm">Claude analyseert de villa&apos;s…</p>
                      </div>
                    ) : (
                      <button
                        onClick={handleCompare}
                        disabled={!comparePriority.trim()}
                        className="w-full py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed mb-2"
                      >
                        {compareError ? "Probeer opnieuw ✦" : "Vergelijk nu met AI ✦"}
                      </button>
                    )}
                  </>
                ) : (
                  /* Results */
                  <div className="pb-4">
                    {/* Winner banner */}
                    <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 p-5 mb-6">
                      <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.35em] uppercase mb-2">✦ Onze aanbeveling</p>
                      <h4
                        className="text-2xl font-light text-[#F5F0E8] mb-3"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {compareResult.winner_name}
                      </h4>
                      <p className="text-[#F5F0E8]/65 text-sm leading-relaxed mb-4">
                        {compareResult.winner_reason}
                      </p>
                      <p className="text-[#C9A84C] text-sm italic leading-relaxed border-l-2 border-[#C9A84C]/40 pl-3">
                        &ldquo;{compareResult.final_verdict}&rdquo;
                      </p>
                    </div>

                    {/* Per-villa breakdown */}
                    <div className="space-y-4 mb-6">
                      {compareResult.villa_summaries.map((s) => (
                        <div
                          key={s.slug}
                          className={`p-4 border ${s.slug === compareResult.winner ? "border-[#C9A84C]/30 bg-[#C9A84C]/5" : "border-[#F5F0E8]/8"}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h5
                              className="text-[#F5F0E8] font-light text-base"
                              style={{ fontFamily: "var(--font-cormorant)" }}
                            >
                              {s.name}
                            </h5>
                            {s.slug === compareResult.winner && (
                              <span className="text-[#C9A84C] text-[0.55rem] tracking-[0.2em] uppercase">Winnaar</span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <p className="text-[0.55rem] tracking-[0.2em] uppercase text-green-400/70 mb-2">Voordelen</p>
                              <ul className="space-y-1">
                                {s.pros.map((p, i) => (
                                  <li key={i} className="text-[#F5F0E8]/55 text-xs flex gap-1.5">
                                    <span className="text-green-400/60 shrink-0">✓</span>{p}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <p className="text-[0.55rem] tracking-[0.2em] uppercase text-[#F5F0E8]/30 mb-2">Aandachtspunten</p>
                              <ul className="space-y-1">
                                {s.cons.map((c, i) => (
                                  <li key={i} className="text-[#F5F0E8]/40 text-xs flex gap-1.5">
                                    <span className="text-[#F5F0E8]/25 shrink-0">–</span>{c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/villas/${compareResult.winner}`}
                        onClick={() => { setCompareOpen(false); setCompareSelection([]); }}
                        className="w-full py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium text-center hover:bg-[#E8C96A] transition-all duration-300 block"
                      >
                        Bekijk {compareResult.winner_name} →
                      </Link>
                      <button
                        onClick={() => setCompareResult(null)}
                        className="w-full py-3 border border-[#F5F0E8]/15 text-[#F5F0E8]/40 text-xs tracking-[0.2em] uppercase hover:text-[#F5F0E8] hover:border-[#F5F0E8]/30 transition-all duration-300"
                      >
                        Opnieuw vergelijken
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <section className="py-28 bg-[#131E14] text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-2xl mx-auto px-6"
        >
          <motion.h2
            variants={fadeUp}
            className="text-4xl md:text-5xl font-light text-[#F5F0E8] mb-6"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Niet gevonden wat je zoekt?
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#F5F0E8]/55 mb-10">
            Edwin & Citty hebben toegang tot honderden villa&apos;s op Bali. Vertel ons wat jij zoekt en wij vinden de perfecte match.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href="/contact"
              className="inline-block px-10 py-4 border border-[#C9A84C] text-[#C9A84C] text-xs tracking-[0.3em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-300"
            >
              Stel jouw wensen voor
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
