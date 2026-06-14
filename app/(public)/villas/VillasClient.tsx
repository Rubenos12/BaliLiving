"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Villa } from "@/lib/villas-data";
import VillaAdvisor from "@/components/VillaAdvisor";

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

export default function VillasClient({ villas }: { villas: Villa[] }) {
  const [activeRegion, setActiveRegion] = useState("Alle Villa's");
  const [activeExperience, setActiveExperience] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const filtered = villas.filter((v) => {
    const regionMatch = activeRegion === "Alle Villa's" || v.region === activeRegion;
    const expFilter = EXPERIENCE_FILTERS.find((f) => f.label === activeExperience);
    const expMatch = !activeExperience || (expFilter ? expFilter.match(v) : true);
    return regionMatch && expMatch;
  });

  const activeCount = (activeRegion !== "Alle Villa's" ? 1 : 0) + (activeExperience ? 1 : 0);
  const hasActiveFilters = activeRegion !== "Alle Villa's" || activeExperience !== "";
  const clearFilters = () => { setActiveRegion("Alle Villa's"); setActiveExperience(""); };

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
        {/* Region filters */}
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-2">
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
          <p className="text-[#F5F0E8]/40 text-sm">
            <span className="text-[#F5F0E8]">{filtered.length}</span>{" "}
            villa{filtered.length !== 1 ? "'s" : ""} gevonden
          </p>
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
