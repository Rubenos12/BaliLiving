"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const villas = [
  {
    name: "Villa Tirta",
    location: "Ubud, Bali",
    guests: "2–4 gasten",
    bedrooms: "2 slaapkamers",
    tag: "Meest geboekt",
    features: ["Privé infinity pool", "Butler service", "Rijstterrassen uitzicht", "Dagelijks ontbijt"],
    prijs: "Vanaf €350 / nacht",
  },
  {
    name: "Villa Samudra",
    location: "Seminyak, Bali",
    guests: "2 gasten",
    bedrooms: "1 slaapkamer",
    tag: "Romantisch",
    features: ["Oceaan uitzicht", "Privé terras", "Spa behandelingen", "Champagne bij aankomst"],
    prijs: "Vanaf €280 / nacht",
  },
  {
    name: "Villa Puri Agung",
    location: "Canggu, Bali",
    guests: "8–12 gasten",
    bedrooms: "5 slaapkamers",
    tag: "Grote groep",
    features: ["Groot zwembad", "Volledig personeel", "Entertainment ruimte", "Eigen chef"],
    prijs: "Vanaf €1.200 / nacht",
  },
  {
    name: "Villa Hijau",
    location: "Ubud, Bali",
    guests: "4–6 gasten",
    bedrooms: "3 slaapkamers",
    tag: "Eco Luxury",
    features: ["Duurzaam gebouwd", "Jungle omgeving", "Yoga paviljoen", "Organisch ontbijt"],
    prijs: "Vanaf €420 / nacht",
  },
  {
    name: "Villa Karang",
    location: "Uluwatu, Bali",
    guests: "4 gasten",
    bedrooms: "2 slaapkamers",
    tag: "Klif uitzicht",
    features: ["Spectaculair klif uitzicht", "Infinity pool", "Sunset lounge", "Privé toegang strand"],
    prijs: "Vanaf €550 / nacht",
  },
  {
    name: "Villa Lotus",
    location: "Nusa Dua, Bali",
    guests: "6–8 gasten",
    bedrooms: "4 slaapkamers",
    tag: "Gezin",
    features: ["Beachfront locatie", "Kindvriendelijk", "Spacieuze tuin", "24/7 beveiliging"],
    prijs: "Vanaf €750 / nacht",
  },
];

export default function VillasPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-24 bg-[#131E14] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1A10] to-[#131E14]" />
        <div className="absolute top-20 right-0 w-80 h-80 rounded-full border border-[#C9A84C]/10" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">
              Onze Collectie
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-8xl font-light text-[#F5F0E8] leading-none mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Luxe
              <br />
              <span className="italic text-[#C9A84C]">Villa&apos;s</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/60 text-lg max-w-xl leading-relaxed">
              Elke villa is persoonlijk geselecteerd op comfort, locatie en sfeer.
              Jouw privé thuis op het mooiste eiland ter wereld.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Filter bar */}
      <section className="bg-[#1C2B1E] border-y border-[#C9A84C]/15 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4">
          {["Alle Villa's", "Ubud", "Seminyak", "Canggu", "Uluwatu", "Nusa Dua"].map((f, i) => (
            <button
              key={f}
              className={`text-xs tracking-[0.2em] uppercase px-5 py-2 transition-all duration-300 ${
                i === 0
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
      <section className="py-20 max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {villas.map((villa) => (
            <motion.div
              key={villa.name}
              variants={fadeUp}
              className="group bg-[#1C2B1E] border border-[#C9A84C]/10 hover:border-[#C9A84C]/40 transition-all duration-500"
            >
              {/* Image placeholder */}
              <div className="aspect-[4/3] bg-[#243628] flex items-center justify-center relative overflow-hidden">
                <div className="text-[80px] opacity-10">🏡</div>
                <div className="absolute top-4 left-4">
                  <span className="bg-[#C9A84C] text-[#1C2B1E] text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5">
                    {villa.tag}
                  </span>
                </div>
              </div>

              <div className="p-7">
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
                    <p className="text-[#F5F0E8]/40 text-xs">{villa.guests}</p>
                    <p className="text-[#F5F0E8]/40 text-xs">{villa.bedrooms}</p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {villa.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-[#F5F0E8]/55 text-sm">
                      <span className="text-[#C9A84C] text-xs">✦</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-5 border-t border-[#C9A84C]/10">
                  <p className="text-[#C9A84C] text-sm font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                    {villa.prijs}
                  </p>
                  <Link
                    href="/contact"
                    className="text-xs tracking-[0.2em] uppercase text-[#F5F0E8]/50 hover:text-[#C9A84C] transition-colors duration-300 flex items-center gap-2"
                  >
                    Aanvragen
                    <span className="w-4 h-px bg-current" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#131E14] text-center">
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
            Wij hebben toegang tot honderden villa&apos;s op Bali. Vertel ons wat jij zoekt en wij vinden de perfecte match.
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
