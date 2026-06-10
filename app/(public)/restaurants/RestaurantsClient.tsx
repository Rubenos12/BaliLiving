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

type DbRestaurant = {
  id: string;
  name: string;
  location: string;
  cuisine: string;
  price_range: string;
  short_description: string;
  image_url: string;
  tag: string;
  sfeer: string;
};

type StaticRestaurant = {
  name: string;
  location: string;
  cuisine: string;
  sfeer: string;
  image: string;
  beschrijving: string;
  prijs: string;
  tag: string;
};

const staticRestaurants: StaticRestaurant[] = [
  {
    name: "Karang Kliff Dining",
    location: "Uluwatu",
    cuisine: "Internationaal",
    sfeer: "Romantisch",
    image: "https://images.unsplash.com/photo-1514190051997-0f6f39ca5cde?w=800&q=80&auto=format&fit=crop",
    beschrijving: "Spectaculair restaurant gebouwd op de klif met onbegrensd uitzicht over de Indische Oceaan. Perfecte sunset dining.",
    prijs: "€€€€",
    tag: "Meest romantisch",
  },
  {
    name: "Locavore",
    location: "Ubud",
    cuisine: "Modern Aziatisch",
    sfeer: "Fine Dining",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&auto=format&fit=crop",
    beschrijving: "Bekroond restaurant dat lokale Balinese ingrediënten verheft tot culinaire kunst. Reserveren ver van tevoren vereist.",
    prijs: "€€€€",
    tag: "Award Winning",
  },
  {
    name: "Merah Putih",
    location: "Seminyak",
    cuisine: "Indonesisch",
    sfeer: "Luxe Casual",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&q=80&auto=format&fit=crop",
    beschrijving: "In een prachtig bamboebouwwerk geniet je van verfijnde Indonesische keuken. Een van Bali's mooiste interieurs.",
    prijs: "€€€",
    tag: "Architectuur",
  },
  {
    name: "Warung Babi Guling Ibu Oka",
    location: "Ubud",
    cuisine: "Balinees",
    sfeer: "Authentiek",
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&q=80&auto=format&fit=crop",
    beschrijving: "Legendarische warung beroemd om de beste babi guling (suckling pig) van Bali. Een must-do voor de echte foodie.",
    prijs: "€",
    tag: "Lokale Legende",
  },
  {
    name: "Sundara",
    location: "Jimbaran",
    cuisine: "International",
    sfeer: "Beach Club",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80&auto=format&fit=crop",
    beschrijving: "Elegante beach club met voeten in het zand. Verse zeevruchten, cocktails bij de oceaan en perfecte sunsets.",
    prijs: "€€€",
    tag: "Beach Dining",
  },
  {
    name: "Mozaic",
    location: "Ubud",
    cuisine: "Frans-Aziatisch",
    sfeer: "Fine Dining",
    image: "https://images.unsplash.com/photo-1544148103-0773bf10d330?w=800&q=80&auto=format&fit=crop",
    beschrijving: "Chef Chris Salans combineert klassieke Franse technieken met Balinese smaken in een tropische tuinomgeving.",
    prijs: "€€€€",
    tag: "Culinair Hoogtepunt",
  },
];

const prijsLegend = [
  { symbol: "€", label: "Onder €15 p.p." },
  { symbol: "€€", label: "€15–30 p.p." },
  { symbol: "€€€", label: "€30–60 p.p." },
  { symbol: "€€€€", label: "Boven €60 p.p." },
];

export default function RestaurantsClient({ dbRestaurants }: { dbRestaurants: DbRestaurant[] }) {
  const useDb = dbRestaurants.length > 0;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 sm:pt-40 md:pt-44 pb-16 sm:pb-24 bg-[#131E14] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1A10] to-[#131E14]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full border border-[#C9A84C]/10" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">
              Culinair Bali
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-8xl font-light text-[#F5F0E8] leading-none mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              De beste
              <br />
              <span className="italic text-[#C9A84C]">Restaurants</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/60 text-lg max-w-xl leading-relaxed">
              Van fine dining op de klif tot verborgen lokale warungs. Wij kennen de beste tafels en reserveren ze voor jou.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Prijs legenda */}
      <section className="bg-[#1C2B1E] border-y border-[#C9A84C]/15 py-5">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-6">
          {prijsLegend.map((p) => (
            <div key={p.symbol} className="flex items-center gap-2">
              <span className="text-[#C9A84C] text-sm font-medium" style={{ fontFamily: "var(--font-cormorant)" }}>
                {p.symbol}
              </span>
              <span className="text-[#F5F0E8]/40 text-xs tracking-wider">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Restaurants grid */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        {useDb ? (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {dbRestaurants.map((r) => (
              <motion.div
                key={r.id}
                variants={fadeUp}
                className="group bg-[#1C2B1E] border border-[#C9A84C]/10 hover:border-[#C9A84C]/40 transition-all duration-500"
              >
                <div className="aspect-[3/2] bg-[#243628] relative overflow-hidden">
                  {r.image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={r.image_url}
                      alt={r.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.classList.add("img-fallback"); }}
                    />
                  ) : (
                    <div className="w-full h-full bg-[#243628]" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A10]/50 to-transparent pointer-events-none" />
                  {r.tag && (
                    <div className="absolute top-4 left-4">
                      <span className="bg-[#C9A84C] text-[#1C2B1E] text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5">
                        {r.tag}
                      </span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="text-[#C9A84C] text-sm font-medium bg-[#1C2B1E]/80 px-2 py-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {r.price_range}
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[#C9A84C]/70 text-xs tracking-wider mb-1">
                        {r.cuisine}{r.sfeer ? ` · ${r.sfeer}` : ""}
                      </p>
                      <h3
                        className="text-2xl font-light text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors duration-300"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {r.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[#F5F0E8]/40 text-xs tracking-wider mb-4">📍 {r.location}</p>
                  {r.short_description && (
                    <p className="text-[#F5F0E8]/55 text-sm leading-relaxed mb-6">{r.short_description}</p>
                  )}
                  <div className="pt-5 border-t border-[#C9A84C]/10">
                    <Link
                      href="/contact"
                      className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-[#C9A84C] hover:gap-4 transition-all duration-300 group/btn"
                    >
                      <span>Reservering aanvragen</span>
                      <span className="w-6 h-px bg-[#C9A84C] group-hover/btn:w-10 transition-all duration-300" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
          >
            {staticRestaurants.map((r) => (
              <motion.div
                key={r.name}
                variants={fadeUp}
                className="group bg-[#1C2B1E] border border-[#C9A84C]/10 hover:border-[#C9A84C]/40 transition-all duration-500"
              >
                <div className="aspect-[3/2] bg-[#243628] relative overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.image}
                    alt={r.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.classList.add("img-fallback"); }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A10]/50 to-transparent pointer-events-none" />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#C9A84C] text-[#1C2B1E] text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5">
                      {r.tag}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="text-[#C9A84C] text-sm font-medium bg-[#1C2B1E]/80 px-2 py-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {r.prijs}
                    </span>
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[#C9A84C]/70 text-xs tracking-wider mb-1">{r.cuisine} · {r.sfeer}</p>
                      <h3
                        className="text-2xl font-light text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors duration-300"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {r.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-[#F5F0E8]/40 text-xs tracking-wider mb-4">📍 {r.location}</p>
                  <p className="text-[#F5F0E8]/55 text-sm leading-relaxed mb-6">{r.beschrijving}</p>

                  <div className="pt-5 border-t border-[#C9A84C]/10">
                    <Link
                      href="/contact"
                      className="flex items-center justify-between text-xs tracking-[0.2em] uppercase text-[#C9A84C] hover:gap-4 transition-all duration-300 group/btn"
                    >
                      <span>Reservering aanvragen</span>
                      <span className="w-6 h-px bg-[#C9A84C] group-hover/btn:w-10 transition-all duration-300" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#131E14] text-center">
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
            Speciaal diner
            <br />
            <span className="italic text-[#C9A84C]">op locatie?</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-[#F5F0E8]/55 mb-10">
            Wij organiseren ook privé diners bij jouw villa, sunset picknicks of romantische stranddiners. Vertel ons je droom.
          </motion.p>
          <motion.div variants={fadeUp}>
            <Link
              href="/contact"
              className="inline-block px-10 py-4 border border-[#C9A84C] text-[#C9A84C] text-xs tracking-[0.3em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-300"
            >
              Neem contact op
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </>
  );
}
