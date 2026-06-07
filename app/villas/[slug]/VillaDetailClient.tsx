"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import type { Villa } from "@/lib/villas-data";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

// Placeholder gallery items — will be replaced with real media from Supabase
function GalleryPlaceholder({ icon, count }: { icon: string; count: number }) {
  const [active, setActive] = useState(0);
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className="relative">
      {/* Main image */}
      <div className="aspect-[16/9] md:aspect-[2/1] bg-[#243628] relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-[120px] opacity-10">{icon}</div>
        </div>
        <div className="absolute bottom-4 right-4 bg-[#1C2B1E]/80 px-3 py-1.5 text-[#C9A84C] text-xs tracking-wider">
          {active + 1} / {count}
        </div>
        {/* Navigation arrows */}
        <button
          onClick={() => setActive((a) => (a - 1 + count) % count)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1C2B1E]/70 hover:bg-[#1C2B1E] flex items-center justify-center text-[#C9A84C] transition-all duration-200"
          aria-label="Vorige foto"
        >
          ‹
        </button>
        <button
          onClick={() => setActive((a) => (a + 1) % count)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#1C2B1E]/70 hover:bg-[#1C2B1E] flex items-center justify-center text-[#C9A84C] transition-all duration-200"
          aria-label="Volgende foto"
        >
          ›
        </button>
      </div>
      {/* Thumbnails */}
      <div className="flex gap-2 mt-2">
        {items.map((i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`flex-1 aspect-video bg-[#243628] transition-all duration-200 ${
              active === i ? "ring-2 ring-[#C9A84C]" : "opacity-50 hover:opacity-75"
            }`}
          >
            <div className="h-full flex items-center justify-center text-2xl opacity-20">{icon}</div>
          </button>
        ))}
      </div>
    </div>
  );
}

function BookingWidget({ villa }: { villa: Villa }) {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const nights =
    checkIn && checkOut
      ? Math.max(
          0,
          Math.ceil(
            (new Date(checkOut).getTime() - new Date(checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;
  const total = nights * villa.price_per_night;

  return (
    <div className="bg-[#1C2B1E] border border-[#C9A84C]/30 p-6 sticky top-28">
      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2">
          <span
            className="text-4xl font-light text-[#C9A84C]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            €{villa.price_per_night}
          </span>
          <span className="text-[#F5F0E8]/50 text-sm">/ nacht</span>
        </div>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[#C9A84C] text-xs">✦</span>
          <span className="text-[#F5F0E8]/50 text-xs tracking-wider">{villa.tag}</span>
        </div>
      </div>

      {/* Date inputs */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-1.5">
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
          />
        </div>
        <div>
          <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-1.5">
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || new Date().toISOString().split("T")[0]}
            className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-3 py-2.5 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
          />
        </div>
      </div>

      {/* Guests */}
      <div className="mb-5">
        <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-1.5">
          Gasten
        </label>
        <div className="flex items-center border border-[#C9A84C]/20 bg-[#243628]">
          <button
            onClick={() => setGuests((g) => Math.max(1, g - 1))}
            className="px-4 py-2.5 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors text-lg leading-none"
          >
            −
          </button>
          <span className="flex-1 text-center text-[#F5F0E8] text-sm py-2.5">
            {guests} {guests === 1 ? "gast" : "gasten"}
          </span>
          <button
            onClick={() => setGuests((g) => Math.min(villa.guests_max, g + 1))}
            className="px-4 py-2.5 text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors text-lg leading-none"
          >
            +
          </button>
        </div>
        <p className="text-[#F5F0E8]/30 text-[0.65rem] mt-1.5">
          Max. {villa.guests_max} gasten
        </p>
      </div>

      {/* Price breakdown */}
      {nights > 0 && (
        <div className="border-t border-[#C9A84C]/15 pt-4 mb-5 space-y-2">
          <div className="flex justify-between text-sm text-[#F5F0E8]/60">
            <span>€{villa.price_per_night} × {nights} nachten</span>
            <span>€{total.toLocaleString("nl-NL")}</span>
          </div>
          <div className="flex justify-between text-sm font-medium text-[#F5F0E8] border-t border-[#C9A84C]/15 pt-2 mt-2">
            <span>Totaal</span>
            <span className="text-[#C9A84C]">€{total.toLocaleString("nl-NL")}</span>
          </div>
        </div>
      )}

      {/* Book button */}
      <Link
        href={`/booking/${villa.slug}${checkIn && checkOut ? `?checkIn=${checkIn}&checkOut=${checkOut}&guests=${guests}` : ""}`}
        className="block w-full py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase text-center font-medium hover:bg-[#E8C96A] transition-all duration-300"
      >
        {nights > 0 ? "Boek Nu" : "Beschikbaarheid Checken"}
      </Link>

      <p className="text-center text-[#F5F0E8]/30 text-xs mt-3">
        Je wordt nog niets in rekening gebracht
      </p>

      {/* Contact alternative */}
      <div className="mt-5 pt-5 border-t border-[#C9A84C]/15 text-center">
        <p className="text-[#F5F0E8]/40 text-xs mb-2">Liever direct contact?</p>
        <Link
          href="/contact"
          className="text-[#C9A84C] text-xs tracking-wider hover:underline"
        >
          Stuur Edwin & Citty een bericht →
        </Link>
      </div>
    </div>
  );
}

export default function VillaDetailClient({ villa }: { villa: Villa }) {
  return (
    <>
      {/* Breadcrumb */}
      <div className="pt-28 pb-0 max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex items-center gap-2 text-xs text-[#F5F0E8]/35 tracking-wider"
        >
          <Link href="/" className="hover:text-[#C9A84C] transition-colors">Home</Link>
          <span>›</span>
          <Link href="/villas" className="hover:text-[#C9A84C] transition-colors">Villa&apos;s</Link>
          <span>›</span>
          <span className="text-[#F5F0E8]/60">{villa.name}</span>
        </motion.div>
      </div>

      {/* Gallery */}
      <section className="pt-6 max-w-7xl mx-auto px-6">
        <GalleryPlaceholder icon={villa.cover_icon} count={5} />
      </section>

      {/* Content + Booking widget */}
      <section className="py-12 max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <motion.div
              initial="hidden"
              animate="show"
              variants={stagger}
            >
              {/* Header */}
              <motion.div variants={fadeUp} className="mb-8">
                <div className="flex items-start justify-between flex-wrap gap-4 mb-3">
                  <div>
                    <span className="inline-block bg-[#C9A84C] text-[#1C2B1E] text-[0.6rem] tracking-[0.25em] uppercase px-3 py-1 mb-3">
                      {villa.tag}
                    </span>
                    <h1
                      className="text-5xl md:text-6xl font-light text-[#F5F0E8] leading-none"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      {villa.name}
                    </h1>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-[#F5F0E8]/50">
                  <span className="flex items-center gap-1.5">
                    <span className="text-[#C9A84C]">📍</span> {villa.location}
                  </span>
                  <span className="text-[#C9A84C]/30">·</span>
                  <span>{villa.bedrooms} slaapkamers</span>
                  <span className="text-[#C9A84C]/30">·</span>
                  <span>{villa.bathrooms} badkamers</span>
                  <span className="text-[#C9A84C]/30">·</span>
                  <span>
                    {villa.guests_min === villa.guests_max
                      ? `${villa.guests_max} gasten`
                      : `${villa.guests_min}–${villa.guests_max} gasten`}
                  </span>
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div variants={fadeUp} className="h-px bg-[#C9A84C]/15 mb-8" />

              {/* Highlights */}
              <motion.div variants={fadeUp} className="mb-8">
                <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-5">
                  Waarom deze villa
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {villa.highlights.map((h) => (
                    <div key={h} className="flex items-start gap-3">
                      <span className="text-[#C9A84C] text-xs mt-0.5 shrink-0">✦</span>
                      <span className="text-[#F5F0E8]/70 text-sm leading-relaxed">{h}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div variants={fadeUp} className="h-px bg-[#C9A84C]/15 mb-8" />

              {/* Description */}
              <motion.div variants={fadeUp} className="mb-8">
                <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-5">
                  Over de villa
                </p>
                <div className="space-y-4 text-[#F5F0E8]/65 leading-relaxed">
                  {villa.long_description.split("\n\n").map((para, i) => (
                    <p key={i}>{para}</p>
                  ))}
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div variants={fadeUp} className="h-px bg-[#C9A84C]/15 mb-8" />

              {/* Amenities */}
              <motion.div variants={fadeUp} className="mb-8">
                <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-5">
                  Voorzieningen
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {villa.amenities.map((a) => (
                    <div key={a} className="flex items-center gap-2.5 text-[#F5F0E8]/65 text-sm">
                      <span className="text-[#C9A84C] text-xs">✦</span>
                      {a}
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Divider */}
              <motion.div variants={fadeUp} className="h-px bg-[#C9A84C]/15 mb-8" />

              {/* Edwin & Citty note */}
              <motion.div
                variants={fadeUp}
                className="bg-[#1C2B1E] border border-[#C9A84C]/20 p-6 md:p-8"
              >
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#243628] border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
                    <span
                      className="text-[#C9A84C] text-lg font-light"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      E&C
                    </span>
                  </div>
                  <div>
                    <p className="text-[#C9A84C] text-xs tracking-[0.25em] uppercase mb-2">
                      Edwin & Citty over deze villa
                    </p>
                    <p className="text-[#F5F0E8]/65 text-sm leading-relaxed">
                      &ldquo;Wij kennen deze villa persoonlijk en staan volledig achter de kwaliteit.
                      Heb je vragen of wil je weten of deze villa bij jou past?
                      Stuur ons gewoon een berichtje — wij zijn 7 dagen per week bereikbaar.&rdquo;
                    </p>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 mt-4 text-[#C9A84C] text-xs tracking-wider hover:gap-4 transition-all duration-300"
                    >
                      Direct contact <span className="w-6 h-px bg-[#C9A84C]" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Booking widget — desktop sticky */}
          <div className="hidden lg:block">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}>
              <BookingWidget villa={villa} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mobile booking bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[#1C2B1E] border-t border-[#C9A84C]/30 px-4 py-4 flex items-center justify-between">
        <div>
          <span
            className="text-2xl font-light text-[#C9A84C]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            €{villa.price_per_night}
          </span>
          <span className="text-[#F5F0E8]/50 text-xs ml-1">/ nacht</span>
        </div>
        <Link
          href={`/booking/${villa.slug}`}
          className="px-8 py-3 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.25em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300"
        >
          Boek Nu
        </Link>
      </div>

      {/* Mobile bottom padding for fixed bar */}
      <div className="lg:hidden h-24" />

      {/* More villas */}
      <section className="py-20 bg-[#131E14]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
          >
            <motion.div variants={fadeUp} className="flex items-center justify-between mb-10">
              <div>
                <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-2">Meer Opties</p>
                <h2
                  className="text-4xl font-light text-[#F5F0E8]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Andere villa&apos;s
                </h2>
              </div>
              <Link
                href="/villas"
                className="hidden md:flex items-center gap-2 text-[#C9A84C] text-xs tracking-wider hover:gap-4 transition-all duration-300"
              >
                Alle villa&apos;s <span className="w-6 h-px bg-[#C9A84C]" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
