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

const services = [
  {
    title: "Villa's",
    subtitle: "Privé verblijven",
    description: "Handpicked luxe villa's met eigen zwembad, persoonlijke butler en adembenemend uitzicht. Van intiem voor twee tot ruim voor het hele gezin.",
    href: "/villas",
    icon: "🏡",
    number: "01",
  },
  {
    title: "Tours",
    subtitle: "Onvergetelijke ervaringen",
    description: "Privé rondleidingen langs tempels, rijstterrassen en verborgen watervallen. Op maat gemaakt, met een lokale gids die de weg kent.",
    href: "/tours",
    icon: "🛺",
    number: "02",
  },
  {
    title: "Restaurants",
    subtitle: "Culinaire hoogtepunten",
    description: "Van romantische kliffendining boven de oceaan tot verborgen lokale warungs. Wij reserveren de beste tafels voor jou.",
    href: "/restaurants",
    icon: "🍽️",
    number: "03",
  },
];

const highlights = [
  { number: "200+", label: "Gecureerde Villa's" },
  { number: "50+", label: "Exclusieve Tours" },
  { number: "150+", label: "Toprestaurants" },
  { number: "5000+", label: "Tevreden Reizigers" },
];

export default function HomePage() {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0F1A10] via-[#1C2B1E] to-[#243628]" />
        <div className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full border border-[#C9A84C]/10 pointer-events-none" />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 rounded-full border border-[#C9A84C]/5 pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full border border-[#C9A84C]/8 pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <motion.div
            variants={stagger}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center"
          >
            <motion.p
              variants={fadeUp}
              className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-12"
            >
              Welkom bij BaliLiving
            </motion.p>

            <motion.h1
              variants={fadeUp}
              className="text-6xl md:text-8xl lg:text-9xl font-light text-[#F5F0E8] leading-none mb-10"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Bali op
              <br />
              <span className="italic text-[#C9A84C]">zijn best</span>
            </motion.h1>

            <motion.div variants={fadeUp} className="flex items-center gap-4 my-12">
              <span className="gold-line" />
              <p className="text-[#F5F0E8]/60 text-sm tracking-[0.2em] uppercase">
                Volledig ontzorgd reizen naar Bali
              </p>
              <span className="gold-line" />
            </motion.div>

            <motion.p
              variants={fadeUp}
              className="text-[#F5F0E8]/70 text-lg max-w-2xl leading-relaxed mb-16"
            >
              Van luxe villa&apos;s en privé tours tot de beste restaurantreserveringen —
              wij regelen elk detail van jouw perfecte Bali reis.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 items-center">
              <Link
                href="/villas"
                className="px-10 py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300"
              >
                Ontdek Villa&apos;s
              </Link>
              <Link
                href="/over-ons"
                className="px-10 py-4 border border-[#F5F0E8]/30 text-[#F5F0E8] text-xs tracking-[0.3em] uppercase hover:border-[#C9A84C] hover:text-[#C9A84C] transition-all duration-300"
              >
                Onze Aanpak
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[#C9A84C]/60 text-[0.6rem] tracking-[0.3em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-[#C9A84C]/60 to-transparent"
          />
        </motion.div>
      </section>

      {/* STATS */}
      <section className="bg-[#C9A84C] py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
          >
            {highlights.map((h) => (
              <motion.div key={h.label} variants={fadeUp}>
                <div
                  className="text-4xl md:text-5xl font-light text-[#1C2B1E] mb-1"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {h.number}
                </div>
                <div className="text-[#1C2B1E]/70 text-xs tracking-[0.2em] uppercase">
                  {h.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* INTRO */}
      <section className="py-36 max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="grid md:grid-cols-2 gap-16 items-center"
        >
          <motion.div variants={fadeUp}>
            <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-6">
              Waarom BaliLiving
            </p>
            <h2
              className="text-5xl md:text-6xl font-light text-[#F5F0E8] leading-tight mb-8"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Meer dan een
              <br />
              <span className="italic text-[#C9A84C]">reisbureau</span>
            </h2>
            <div className="space-y-5 text-[#F5F0E8]/65 leading-relaxed">
              <p>
                BaliLiving is opgericht door Edwin en Citty — pure Bali-fanaten en mede-eigenaren
                van STOER Bracelets. Jarenlang kwamen zij op het eiland en bouwden een diep
                persoonlijk netwerk op met lokale villa-eigenaren, gidsen en restauranthouders.
              </p>
              <p>
                Dat netwerk zetten zij nu voor jou in. Geen standaard pakketreizen, geen
                anonieme boekingssites. Gewoon directe, eerlijke service van mensen die Bali
                net zo lief hebben als jij.
              </p>
            </div>
            <Link
              href="/over-ons"
              className="inline-flex items-center gap-3 mt-10 text-[#C9A84C] text-xs tracking-[0.3em] uppercase group"
            >
              Lees ons verhaal
              <span className="w-8 h-px bg-[#C9A84C] group-hover:w-14 transition-all duration-300" />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="relative">
            <div className="aspect-[3/4] relative overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf4?w=900&q=85&auto=format&fit=crop"
                alt="Bali rijstterrassen"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A10]/30 to-transparent pointer-events-none" />
            </div>
            <div className="absolute -top-4 -right-4 w-24 h-24 border-t border-r border-[#C9A84C]/40" />
            <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b border-l border-[#C9A84C]/40" />
          </motion.div>
        </motion.div>
      </section>

      {/* SERVICES */}
      <section className="py-32 bg-[#131E14]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="text-center mb-20"
          >
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">
              Onze Diensten
            </motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-5xl md:text-6xl font-light text-[#F5F0E8]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Alles wat je nodig hebt
              <br />
              <span className="italic text-[#C9A84C]">op één plek</span>
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-100px" }}
            variants={stagger}
            className="grid md:grid-cols-3 gap-px bg-[#C9A84C]/10"
          >
            {services.map((service) => (
              <motion.div key={service.title} variants={fadeUp}>
                <Link href={service.href} className="group block bg-[#131E14] p-10 hover:bg-[#1C2B1E] transition-all duration-500 h-full">
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[#C9A84C]/30 text-sm tracking-[0.3em] font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {service.number}
                    </span>
                    <span className="text-3xl opacity-60">{service.icon}</span>
                  </div>
                  <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">
                    {service.subtitle}
                  </p>
                  <h3
                    className="text-4xl font-light text-[#F5F0E8] mb-5 group-hover:text-[#C9A84C] transition-colors duration-300"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {service.title}
                  </h3>
                  <p className="text-[#F5F0E8]/50 text-sm leading-relaxed mb-8">
                    {service.description}
                  </p>
                  <div className="flex items-center gap-3 text-[#C9A84C] text-xs tracking-[0.2em] uppercase">
                    <span>Bekijk meer</span>
                    <span className="w-6 h-px bg-[#C9A84C] group-hover:w-12 transition-all duration-300" />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* USPs */}
      <section className="py-36 max-w-7xl mx-auto px-6">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="text-center"
        >
          <motion.p variants={fadeUp} className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">
            De BaliLiving Belofte
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="text-5xl md:text-6xl font-light text-[#F5F0E8] mb-16"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Jouw reis, volledig
            <br />
            <span className="italic text-[#C9A84C]">ontzorgd</span>
          </motion.h2>

          <motion.div variants={stagger} className="grid md:grid-cols-3 gap-16">
            {[
              {
                icon: "✦",
                title: "Persoonlijk Advies",
                desc: "Geen algoritmes of chatbots. Een echte Bali-expert luistert naar jouw wensen en denkt met je mee.",
              },
              {
                icon: "✦",
                title: "Lokale Expertise",
                desc: "Onze partners wonen op Bali. Ze kennen de plekken die je niet in een reisgids vindt.",
              },
              {
                icon: "✦",
                title: "24/7 Ondersteuning",
                desc: "Tijdens je verblijf staan wij dag en nacht klaar. Wat er ook is, wij lossen het op.",
              },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="flex flex-col items-center text-center">
                <div className="text-[#C9A84C] text-2xl mb-6">{item.icon}</div>
                <h3
                  className="text-2xl font-light text-[#F5F0E8] mb-4"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {item.title}
                </h3>
                <p className="text-[#F5F0E8]/55 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA */}
      <section className="py-32 bg-[#C9A84C] relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full border-2 border-[#1C2B1E]" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full border-2 border-[#1C2B1E]" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.h2
              variants={fadeUp}
              className="text-5xl md:text-7xl font-light text-[#1C2B1E] mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Klaar om Bali te
              <br />
              <span className="italic">ontdekken?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#1C2B1E]/70 mb-10 text-lg">
              Plan een gratis kennismakingsgesprek met een van onze Bali-experts.
            </motion.p>
            <motion.div variants={fadeUp}>
              <Link
                href="/contact"
                className="inline-block px-12 py-5 bg-[#1C2B1E] text-[#C9A84C] text-xs tracking-[0.3em] uppercase hover:bg-[#243628] transition-all duration-300"
              >
                Start jouw reis
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
