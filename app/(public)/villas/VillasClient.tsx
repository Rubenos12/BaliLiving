"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import type { Villa } from "@/lib/villas-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const FILTERS = ["Alle Villa's", "Ubud", "Seminyak", "Canggu", "Uluwatu", "Nusa Dua"];

export default function VillasClient({ villas }: { villas: Villa[] }) {
  const [activeFilter, setActiveFilter] = useState("Alle Villa's");

  const filtered = activeFilter === "Alle Villa's"
    ? villas
    : villas.filter((v) => v.region === activeFilter);

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

      {/* Filter bar */}
      <section className="bg-[#1C2B1E] border-y border-[#C9A84C]/15 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-3">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs tracking-[0.2em] uppercase px-5 py-2.5 md:py-2 transition-all duration-300 ${
                activeFilter === f
                  ? "bg-[#C9A84C] text-[#1C2B1E]"
                  : "text-[#F5F0E8]/50 border border-[#F5F0E8]/10 hover:border-[#C9A84C]/50 hover:text-[#C9A84C]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Villas grid */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        {filtered.length === 0 ? (
          <div className="text-center py-20 text-[#F5F0E8]/30 text-sm">
            Geen villa&apos;s gevonden voor {activeFilter}
          </div>
        ) : (
          <motion.div
            key={activeFilter}
            initial="hidden"
            animate="show"
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {filtered.map((villa) => (
              <motion.div
                key={villa.slug}
                variants={fadeUp}
                className="group bg-[#1C2B1E] border border-[#C9A84C]/10 hover:border-[#C9A84C]/40 transition-all duration-500"
              >
                <div className="aspect-[4/3] bg-[#243628] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={villa.images[0]}
                    alt={villa.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A10]/40 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#C9A84C] text-[#1C2B1E] text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5">
                      {villa.tag}
                    </span>
                  </div>
                </div>

                <div className="p-9">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3
                        className="text-2xl font-light text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors duration-300"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {villa.name}
                      </h3>
                      <p className="text-[#C9A84C]/70 text-xs tracking-wider mt-1">{villa.location}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[#F5F0E8]/40 text-xs">
                        {villa.guests_min === villa.guests_max
                          ? `${villa.guests_max} gasten`
                          : `${villa.guests_min}–${villa.guests_max} gasten`}
                      </p>
                      <p className="text-[#F5F0E8]/40 text-xs">{villa.bedrooms} slaapkamers</p>
                    </div>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {villa.amenities.slice(0, 4).map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[#F5F0E8]/55 text-sm">
                        <span className="text-[#C9A84C] text-xs">✦</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  <div className="flex items-center justify-between pt-5 border-t border-[#C9A84C]/10">
                    <p className="text-[#C9A84C] text-sm font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                      Vanaf €{villa.price_per_night.toLocaleString("nl-NL")} / nacht
                    </p>
                    <Link
                      href={`/villas/${villa.slug}`}
                      className="text-xs tracking-[0.2em] uppercase text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors duration-300 flex items-center gap-2"
                    >
                      Bekijk villa
                      <span className="w-4 h-px bg-current" />
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
