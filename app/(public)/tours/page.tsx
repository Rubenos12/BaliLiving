"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const tours = [
  {
    name: "Heilige Tempels van Ubud",
    duration: "Hele dag",
    type: "Cultureel",
    icon: "🛕",
    highlights: ["Tirta Empul tempel", "Goa Gajah grot", "Lokale priester ontmoeting", "Traditioneel klederdracht"],
    prijs: "Vanaf €95 p.p.",
    tag: "Bestseller",
  },
  {
    name: "Rijstterrassen & Waterval",
    duration: "Hele dag",
    type: "Natuur",
    icon: "🌾",
    highlights: ["Tegalalang rijstterrassen", "Sekumpul waterval", "Koffie plantage bezoek", "Lokale lunch"],
    prijs: "Vanaf €85 p.p.",
    tag: "Natuur",
  },
  {
    name: "Zonsopgang op Mount Batur",
    duration: "Vroeg ochtend",
    type: "Avontuur",
    icon: "🌋",
    highlights: ["Vulkaan beklimming", "Zonsopgang op de krater", "Lokale gids", "Ontbijt op de top"],
    prijs: "Vanaf €75 p.p.",
    tag: "Avontuur",
  },
  {
    name: "Privé Koken & Markt Tour",
    duration: "Halve dag",
    type: "Culinair",
    icon: "👨‍🍳",
    highlights: ["Lokale markt bezoek", "Bali kookles", "5 traditionele gerechten", "Recept boek mee"],
    prijs: "Vanaf €110 p.p.",
    tag: "Culinair",
  },
  {
    name: "Uluwatu Kliff & Kecak Dans",
    duration: "Middag & avond",
    type: "Cultureel",
    icon: "🎭",
    highlights: ["Uluwatu tempel", "Sunset kliff wandeling", "Traditionele Kecak dans", "Diner aan zee"],
    prijs: "Vanaf €90 p.p.",
    tag: "Zonsondergang",
  },
  {
    name: "Privé Eiland Hopping",
    duration: "Hele dag",
    type: "Zee",
    icon: "⛵",
    highlights: ["Privé boot", "Nusa Penida & Lembongan", "Snorkelen met manta's", "Strand picknick"],
    prijs: "Vanaf €195 p.p.",
    tag: "Premium",
  },
];

export default function ToursPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-56 pb-32 bg-[#131E14] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1A10] to-[#131E14]" />
        <div className="absolute top-20 left-0 w-80 h-80 rounded-full border border-[#C9A84C]/10" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">
              Beleef Bali
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-8xl font-light text-[#F5F0E8] leading-none mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Tours &
              <br />
              <span className="italic text-[#C9A84C]">Excursies</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/60 text-lg max-w-xl leading-relaxed">
              Alle tours zijn privé en volledig op maat. Geen groepsreizen, geen vaste tijden.
              Jouw Bali, op jouw tempo.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Tours grid */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-10"
        >
          {tours.map((tour) => (
            <motion.div
              key={tour.name}
              variants={fadeUp}
              className="group bg-[#1C2B1E] border border-[#C9A84C]/10 hover:border-[#C9A84C]/40 transition-all duration-500 p-8"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="text-4xl opacity-60">{tour.icon}</div>
                  <div>
                    <span className="text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase border border-[#C9A84C]/30 px-2 py-1">
                      {tour.tag}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#F5F0E8]/40 text-xs tracking-wider">{tour.type}</p>
                  <p className="text-[#F5F0E8]/40 text-xs">{tour.duration}</p>
                </div>
              </div>

              <h3
                className="text-3xl font-light text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors duration-300 mb-5"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {tour.name}
              </h3>

              <ul className="grid grid-cols-2 gap-2 mb-8">
                {tour.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2 text-[#F5F0E8]/55 text-sm">
                    <span className="text-[#C9A84C] text-xs mt-0.5">✦</span>
                    {h}
                  </li>
                ))}
              </ul>

              <div className="flex items-center justify-between pt-5 border-t border-[#C9A84C]/10">
                <p className="text-[#C9A84C] text-lg font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {tour.prijs}
                </p>
                <Link
                  href="/contact"
                  className="px-6 py-2.5 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-300"
                >
                  Boek Tour
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Custom tour */}
      <section className="py-24 bg-[#C9A84C]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-5xl md:text-6xl font-light text-[#1C2B1E] mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Jouw eigen
              <br />
              <span className="italic">avontuur</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#1C2B1E]/70 mb-10 text-lg max-w-xl mx-auto">
              Geen van onze tours past precies? Wij ontwerpen graag een volledig op maat gemaakte dag voor jou.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                href="/contact"
                className="inline-block px-12 py-5 bg-[#1C2B1E] text-[#C9A84C] text-xs tracking-[0.3em] uppercase hover:bg-[#243628] transition-all duration-300"
              >
                Maak op maat
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
