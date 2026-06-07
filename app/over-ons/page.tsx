"use client";

import { motion, Variants } from "framer-motion";
import Link from "next/link";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15 } },
};

const waarden = [
  {
    icon: "✦",
    title: "Eerlijkheid",
    desc: "Wij vertellen je wat wij echt aanbevelen, niet wat de hoogste commissie oplevert. Jouw vertrouwen is ons fundament.",
  },
  {
    icon: "✦",
    title: "Kwaliteit",
    desc: "Elk verblijf, elke tour en elk restaurant wordt persoonlijk getest en beoordeeld door ons team op Bali.",
  },
  {
    icon: "✦",
    title: "Persoonlijkheid",
    desc: "Geen scripts, geen call centers. Je spreekt altijd met dezelfde persoon die jouw trip kent van A tot Z.",
  },
  {
    icon: "✦",
    title: "Lokale wortels",
    desc: "Wij werken uitsluitend met lokale Balinese partners die eerlijk worden beloond voor hun expertise.",
  },
];

const team = [
  {
    naam: "Sander de Vries",
    rol: "Oprichter & Bali Expert",
    bio: "Woont 8 jaar op Bali. Oud-reisjournalist met een onstilbare liefde voor het eiland en zijn cultuur.",
    initials: "SdV",
  },
  {
    naam: "Maya Putri",
    rol: "Lokale Partner Coördinator",
    bio: "Geboren en opgegroeid in Ubud. Maya kent elk verborgen hoekje van Bali en spreekt vloeiend Nederlands.",
    initials: "MP",
  },
  {
    naam: "Lisa Brouwer",
    rol: "Klantenservice & Planning",
    bio: "Vanuit Nederland de schakel tussen onze klanten en het team op Bali. Bereikbaar 7 dagen per week.",
    initials: "LB",
  },
];

export default function OverOnsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-40 pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1A10] via-[#1C2B1E] to-[#243628]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full border border-[#C9A84C]/8" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">
              Ons Verhaal
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-8xl font-light text-[#F5F0E8] leading-none mb-8"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Gemaakt door
              <br />
              <span className="italic text-[#C9A84C]">Bali-liefhebbers</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/65 text-xl leading-relaxed">
              BaliLiving ontstond uit frustratie. Goede reisbureaus voor Bali bestonden niet —
              je werd doorverwezen naar standaard pakketjes of een website vol anonieme villa&apos;s.
              Wij besloten het anders te doen.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Verhaal */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-20 items-center"
        >
          <motion.div variants={fadeUp} className="relative">
            <div className="aspect-square bg-[#1C2B1E] border border-[#C9A84C]/20 flex items-center justify-center">
              <div className="text-center p-12">
                <div className="text-[100px] opacity-20">🌿</div>
                <p className="text-[#F5F0E8]/30 text-sm tracking-widest uppercase mt-4">Team foto plaatshouder</p>
              </div>
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-[#C9A84C]/40" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-[#C9A84C]/40" />
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="space-y-6 text-[#F5F0E8]/65 leading-relaxed text-lg">
              <p>
                In 2018 verhuisde onze oprichter Sander naar Ubud. Wat begon als een sabbatical
                groeide uit tot een missie: het beste van Bali toegankelijk maken voor Nederlanders
                die echt willen genieten — zonder de stress van zelf alles uitzoeken.
              </p>
              <p>
                We bouwden een netwerk op van de beste lokale partners: villa-eigenaren, gidsen,
                restaurateurs. Mensen die we persoonlijk kennen en vertrouwen. Geen middelmannen,
                geen onpersoonlijke boekingssites.
              </p>
              <p>
                Vandaag helpen we honderden Nederlanders per jaar aan hun droomreis naar Bali.
                Elk op hun eigen manier. Elk volledig ontzorgd.
              </p>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <div className="text-center">
                <div className="text-4xl font-light text-[#C9A84C]" style={{ fontFamily: "var(--font-cormorant)" }}>8+</div>
                <div className="text-[#F5F0E8]/40 text-xs tracking-wider">Jaar op Bali</div>
              </div>
              <div className="w-px h-12 bg-[#C9A84C]/20" />
              <div className="text-center">
                <div className="text-4xl font-light text-[#C9A84C]" style={{ fontFamily: "var(--font-cormorant)" }}>5000+</div>
                <div className="text-[#F5F0E8]/40 text-xs tracking-wider">Blije reizigers</div>
              </div>
              <div className="w-px h-12 bg-[#C9A84C]/20" />
              <div className="text-center">
                <div className="text-4xl font-light text-[#C9A84C]" style={{ fontFamily: "var(--font-cormorant)" }}>100%</div>
                <div className="text-[#F5F0E8]/40 text-xs tracking-wider">Persoonlijk</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Waarden */}
      <section className="py-24 bg-[#131E14]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="text-center mb-16">
              <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">Onze Waarden</p>
              <h2
                className="text-5xl font-light text-[#F5F0E8]"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Waar wij voor staan
              </h2>
            </motion.div>

            <motion.div variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {waarden.map((w) => (
                <motion.div key={w.title} variants={fadeUp} className="border border-[#C9A84C]/10 p-8 hover:border-[#C9A84C]/30 transition-all duration-300">
                  <div className="text-[#C9A84C] text-2xl mb-6">{w.icon}</div>
                  <h3
                    className="text-2xl font-light text-[#F5F0E8] mb-4"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {w.title}
                  </h3>
                  <p className="text-[#F5F0E8]/50 text-sm leading-relaxed">{w.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
        >
          <motion.div variants={fadeUp} className="text-center mb-16">
            <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">Het Team</p>
            <h2
              className="text-5xl font-light text-[#F5F0E8]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              De mensen achter
              <br />
              <span className="italic text-[#C9A84C]">BaliLiving</span>
            </h2>
          </motion.div>

          <motion.div variants={stagger} className="grid md:grid-cols-3 gap-8">
            {team.map((lid) => (
              <motion.div key={lid.naam} variants={fadeUp} className="text-center group">
                <div className="w-28 h-28 rounded-full bg-[#1C2B1E] border border-[#C9A84C]/20 group-hover:border-[#C9A84C]/60 transition-all duration-300 flex items-center justify-center mx-auto mb-6">
                  <span
                    className="text-[#C9A84C] text-2xl font-light"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {lid.initials}
                  </span>
                </div>
                <h3
                  className="text-2xl font-light text-[#F5F0E8] mb-1"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {lid.naam}
                </h3>
                <p className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase mb-4">{lid.rol}</p>
                <p className="text-[#F5F0E8]/50 text-sm leading-relaxed">{lid.bio}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#C9A84C] text-center">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-2xl mx-auto px-6"
        >
          <motion.h2
            variants={fadeUp}
            className="text-5xl font-light text-[#1C2B1E] mb-6"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Leer ons
            <br />
            <span className="italic">kennen</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#1C2B1E]/70 mb-10">
            Plan een gratis, vrijblijvend gesprek. Wij horen graag over jouw Bali droom.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href="/contact"
              className="inline-block px-12 py-5 bg-[#1C2B1E] text-[#C9A84C] text-xs tracking-[0.3em] uppercase hover:bg-[#243628] transition-all duration-300"
            >
              Maak kennis
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
