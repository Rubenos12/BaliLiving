"use client";

import { motion, Variants } from "framer-motion";
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

  const filtered = villas.filter((v) => {
    const regionMatch = activeRegion === "Alle Villa's" || v.region === activeRegion;
    const expFilter = EXPERIENCE_FILTERS.find((f) => f.label === activeExperience);
    const expMatch = !activeExperience || (expFilter ? expFilter.match(v) : true);
    return regionMatch && expMatch;
  });

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

      {/* Filter bar */}
      <section className="bg-[#1C2B1E] border-y border-[#C9A84C]/15 py-5 space-y-3">
        {/* Region filters */}
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-2">
          {REGION_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveRegion(f)}
              className={`text-xs tracking-[0.2em] uppercase px-5 py-2 transition-all duration-300 ${
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
              className={`text-xs tracking-[0.15em] uppercase px-4 py-1.5 transition-all duration-300 border ${
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
              className="text-xs text-[#C9A84C] tracking-wider hover:underline"
            >
              Probeer andere filters
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
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={villa.images[0]}
                    alt={villa.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
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
                  <div className="flex items-center gap-2 mb-6">
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
                      className="px-5 py-2.5 border border-[#C9A84C]/40 text-[#C9A84C] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-300"
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
