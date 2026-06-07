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
    title: "Lokale Wortels",
    desc: "Wij werken uitsluitend samen met lokale Balinese partners die eerlijk worden beloond voor hun expertise en kennis van het eiland.",
  },
  {
    icon: "✦",
    title: "Eerlijkheid",
    desc: "Wij vertellen je wat wij zelf gebruiken en aanbevelen. Geen gesponsorde aanbevelingen, geen hoge commissies — jouw vertrouwen is ons fundament.",
  },
  {
    icon: "✦",
    title: "Persoonlijk Contact",
    desc: "Je spreekt altijd rechtstreeks met Edwin of Citty. Geen callcenters, geen scripts — gewoon twee mensen die Bali kennen als hun broekzak.",
  },
  {
    icon: "✦",
    title: "Totaalpakket",
    desc: "Van villa tot vlucht, van restaurantreservering tot privétour. Wij ontzorgen jou volledig zodat jij alleen maar hoeft te genieten.",
  },
];

const team = [
  {
    naam: "Edwin",
    rol: "Oprichter & Bali Fanaat",
    bio: "Al jarenlang valt Edwin in herhaling op Bali. Als mede-eigenaar van STOER Bracelets bouwde hij een diep netwerk op met lokale makers, villa-eigenaren en gidsen op het eiland.",
    initials: "E",
  },
  {
    naam: "Citty",
    rol: "Oprichtster & Local Expert",
    bio: "Citty kent Bali zoals weinig anderen. Met haar oog voor detail, gevoel voor luxe en passie voor het eiland zorgt zij ervoor dat elke reis tot in de puntjes klopt.",
    initials: "C",
  },
];

export default function OverOnsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 sm:pt-40 md:pt-44 pb-16 sm:pb-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1A10] via-[#1C2B1E] to-[#243628]" />
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] rounded-full border border-[#C9A84C]/8" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl">
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">
              Ons Verhaal
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-8xl font-light text-[#F5F0E8] leading-none mb-8"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Gemaakt door
              <br />
              <span className="italic text-[#C9A84C]">echte fanaten</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/65 text-xl leading-relaxed">
              BaliLiving is opgericht door Edwin en Citty — twee Bali-verslaafden die al jarenlang
              het eiland bezoeken en inmiddels diep geworteld zijn in de lokale gemeenschap.
              Wat begon als een persoonlijke liefde voor Bali, groeide uit tot een missie.
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
          className="grid md:grid-cols-2 gap-12 md:gap-24 items-center"
        >
          <motion.div variants={fadeUp} className="relative">
            <div className="aspect-square relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1573790387438-4da905039392?w=900&q=85&auto=format&fit=crop"
                alt="Bali temple"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A10]/30 to-transparent pointer-events-none" />
            </div>
            <div className="absolute -top-4 -left-4 w-24 h-24 border-t border-l border-[#C9A84C]/40" />
            <div className="absolute -bottom-4 -right-4 w-24 h-24 border-b border-r border-[#C9A84C]/40" />
          </motion.div>

          <motion.div variants={fadeUp}>
            <div className="space-y-6 text-[#F5F0E8]/65 leading-relaxed text-lg">
              <p>
                Edwin en Citty zijn al jaren vaste bezoekers van Bali. Als mede-eigenaren van
                <span className="text-[#C9A84C]"> STOER Bracelets</span> kwamen ze in contact
                met de mooiste lokale makers en ambachtslieden op het eiland — en ze raakten
                volledig verliefd op de Bali lifestyle.
              </p>
              <p>
                Wat hen stoorde? Dat mooie reizen naar Bali voor veel Nederlanders onnodig
                ingewikkeld of anoniem waren. Geen persoonlijk contact, geen eerlijke aanbevelingen,
                geen echte lokale connectie. Dat wilden ze anders doen.
              </p>
              <p>
                BaliLiving biedt een totaalpakket: villa&apos;s, tours, restaurants en alles
                daartussenin. Volledig persoonlijk, volledig lokaal, en altijd met de warmte
                van mensen die het eiland echt kennen en liefhebben.
              </p>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <div className="text-center">
                <div className="text-4xl font-light text-[#C9A84C]" style={{ fontFamily: "var(--font-cormorant)" }}>100%</div>
                <div className="text-[#F5F0E8]/40 text-xs tracking-wider">Lokale partners</div>
              </div>
              <div className="w-px h-12 bg-[#C9A84C]/20" />
              <div className="text-center">
                <div className="text-4xl font-light text-[#C9A84C]" style={{ fontFamily: "var(--font-cormorant)" }}>Jaren</div>
                <div className="text-[#F5F0E8]/40 text-xs tracking-wider">Bali ervaring</div>
              </div>
              <div className="w-px h-12 bg-[#C9A84C]/20" />
              <div className="text-center">
                <div className="text-4xl font-light text-[#C9A84C]" style={{ fontFamily: "var(--font-cormorant)" }}>Totaal</div>
                <div className="text-[#F5F0E8]/40 text-xs tracking-wider">Ontzorgd</div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* STOER Bracelets verbinding */}
      <section className="py-20 bg-[#131E14]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 gap-10 md:gap-16 items-center"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">De Connectie</p>
              <h2
                className="text-5xl font-light text-[#F5F0E8] mb-6"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Geworteld in
                <br />
                <span className="italic text-[#C9A84C]">de lokale cultuur</span>
              </h2>
              <p className="text-[#F5F0E8]/60 leading-relaxed mb-6">
                Via STOER Bracelets bouwden Edwin en Citty jarenlange relaties op met lokale
                Balinese families, villa-eigenaren, restauranthouders en gidsen. Geen
                tussenpersonen, geen anonieme boekingssites — maar mensen die ze persoonlijk
                kennen en vertrouwen.
              </p>
              <p className="text-[#F5F0E8]/60 leading-relaxed">
                Die lokale wortels zijn de basis van alles wat BaliLiving doet. Jij profiteert
                van connecties die je zelf nooit zou kunnen opbouwen.
              </p>
            </motion.div>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
              {[
                { nr: "1", text: "Persoonlijk netwerk van lokale villa-eigenaren" },
                { nr: "2", text: "Eerlijke aanbevelingen, geen commissie-gedreven keuzes" },
                { nr: "3", text: "Directe communicatie, 7 dagen per week bereikbaar" },
                { nr: "4", text: "Ter plekke support tijdens jouw verblijf op Bali" },
              ].map((item) => (
                <div key={item.nr} className="border border-[#C9A84C]/15 p-6 hover:border-[#C9A84C]/40 transition-all duration-300">
                  <div className="text-[#C9A84C]/40 text-xs tracking-[0.3em] mb-3">0{item.nr}</div>
                  <p className="text-[#F5F0E8]/65 text-sm leading-relaxed">{item.text}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Waarden */}
      <section className="py-24 bg-[#1C2B1E]">
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

          <motion.div variants={stagger} className="grid md:grid-cols-2 gap-12 max-w-3xl mx-auto">
            {team.map((lid) => (
              <motion.div key={lid.naam} variants={fadeUp} className="text-center group">
                <div className="w-32 h-32 rounded-full bg-[#1C2B1E] border border-[#C9A84C]/20 group-hover:border-[#C9A84C]/60 transition-all duration-300 flex items-center justify-center mx-auto mb-6">
                  <span
                    className="text-[#C9A84C] text-4xl font-light"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {lid.initials}
                  </span>
                </div>
                <h3
                  className="text-3xl font-light text-[#F5F0E8] mb-1"
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
            Plan een gratis, vrijblijvend gesprek met Edwin of Citty.
            Wij horen graag over jouw Bali droom.
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
