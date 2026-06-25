"use client";

import { motion, type Variants } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useFavorites } from "@/hooks/useFavorites";
import { villas } from "@/lib/villas-data";
import FavoriteButton from "@/components/FavoriteButton";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

export default function FavorietenPage() {
  const { favorites, hydrated } = useFavorites();
  const savedVillas = villas.filter((v) => favorites.has(v.slug));

  if (!hydrated) return null;

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 max-w-7xl mx-auto">
      <motion.div initial="hidden" animate="show" variants={stagger}>
        <motion.p variants={fadeUp} className="text-[#C9A84C] text-[0.65rem] tracking-[0.4em] uppercase mb-3">
          Jouw selectie
        </motion.p>
        <motion.h1
          variants={fadeUp}
          className="text-5xl md:text-7xl font-light text-[#F5F0E8] mb-4 leading-none"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Opgeslagen
          <span className="block italic text-[#C9A84C]">Villa&apos;s</span>
        </motion.h1>

        {savedVillas.length === 0 ? (
          <motion.div variants={fadeUp} className="mt-20 text-center">
            <div className="text-6xl mb-6 opacity-30">♡</div>
            <p className="text-[#F5F0E8]/50 text-lg mb-2">Je hebt nog geen villa&apos;s opgeslagen.</p>
            <p className="text-[#F5F0E8]/30 text-sm mb-8">
              Tik het hartje op een villa om hem hier op te slaan.
            </p>
            <Link
              href="/villas"
              className="inline-block px-8 py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase hover:bg-[#E8C96A] transition-all duration-300"
            >
              Bekijk alle villa&apos;s
            </Link>
          </motion.div>
        ) : (
          <>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/40 text-sm mb-12">
              {savedVillas.length} villa{savedVillas.length !== 1 ? "'s" : ""} opgeslagen
            </motion.p>
            <motion.div
              variants={stagger}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {savedVillas.map((villa) => (
                <motion.div key={villa.slug} variants={fadeUp} className="group relative">
                  <Link href={`/villas/${villa.slug}`} className="block overflow-hidden bg-[#1C2B1E] border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 transition-all duration-300">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={villa.images[0]}
                        alt={villa.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A10]/70 via-transparent to-transparent" />
                      {villa.tag && (
                        <div className="absolute top-4 left-4">
                          <span className="bg-[#C9A84C] text-[#1C2B1E] text-[0.6rem] tracking-[0.2em] uppercase px-3 py-1.5">
                            {villa.tag}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="p-6">
                      <h3
                        className="text-2xl font-light text-[#F5F0E8] group-hover:text-[#C9A84C] transition-colors duration-300 mb-1"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {villa.name}
                      </h3>
                      <p className="text-[#F5F0E8]/40 text-xs tracking-wider mb-3">
                        {villa.location} · {villa.bedrooms} slaapkamers
                      </p>
                      <div className="flex items-center justify-between">
                        <div>
                          <span
                            className="text-xl text-[#C9A84C]"
                            style={{ fontFamily: "var(--font-cormorant)" }}
                          >
                            €{villa.price_per_night.toLocaleString("nl-NL")}
                          </span>
                          <span className="text-[#F5F0E8]/30 text-xs ml-1">/ nacht</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                  <div className="absolute top-4 right-4">
                    <FavoriteButton
                      slug={villa.slug}
                      size="sm"
                      className="bg-[#1C2B1E]/80 backdrop-blur-sm border border-[#C9A84C]/30"
                    />
                  </div>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} className="mt-12 text-center">
              <Link
                href="/villas"
                className="inline-block px-8 py-4 border border-[#C9A84C]/40 text-[#C9A84C] text-xs tracking-[0.3em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-300"
              >
                Bekijk alle villa&apos;s
              </Link>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}
