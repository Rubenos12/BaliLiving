"use client";

import { motion, Variants, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import type { Villa } from "@/lib/villas-data";
import { createBooking } from "@/lib/actions/bookings";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const stepSlide: Variants = {
  hidden: (dir: number) => ({ opacity: 0, x: dir * 24 }),
  show: { opacity: 1, x: 0, transition: { duration: 0.3, ease: "easeOut" } },
  exit: (dir: number) => ({ opacity: 0, x: dir * -24, transition: { duration: 0.2, ease: "easeIn" } }),
};

type Step = 1 | 2 | 3;

type FormData = {
  naam: string;
  email: string;
  telefoon: string;
  bericht: string;
};

function StepIndicator({ current }: { current: Step }) {
  const steps = [
    { n: 1, label: "Datums" },
    { n: 2, label: "Gegevens" },
    { n: 3, label: "Bevestiging" },
  ];
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, i) => (
        <div key={s.n} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-11 h-11 flex items-center justify-center text-sm transition-all duration-300 ${
                current > s.n
                  ? "bg-[#C9A84C] text-[#1C2B1E]"
                  : current === s.n
                  ? "bg-[#C9A84C] text-[#1C2B1E]"
                  : "bg-[#1C2B1E] border border-[#C9A84C]/30 text-[#F5F0E8]/40"
              }`}
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {current > s.n ? "✓" : s.n}
            </div>
            <span
              className={`text-[0.65rem] tracking-wider mt-1.5 uppercase ${
                current >= s.n ? "text-[#C9A84C]" : "text-[#F5F0E8]/25"
              }`}
            >
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={`w-16 md:w-24 h-px mx-3 mb-4 transition-all duration-300 ${
                current > s.n ? "bg-[#C9A84C]" : "bg-[#C9A84C]/20"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default function BookingClient({
  villa,
  villaId,
  initialCheckIn,
  initialCheckOut,
  initialGuests,
}: {
  villa: Villa;
  villaId: string;
  initialCheckIn: string;
  initialCheckOut: string;
  initialGuests: number;
}) {
  const [step, setStep] = useState<Step>(1);
  const [stepDir, setStepDir] = useState(1); // 1 = forward, -1 = backward
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [guests, setGuests] = useState(initialGuests);
  const [form, setForm] = useState<FormData>({
    naam: "",
    email: "",
    telefoon: "",
    bericht: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [bookingRef, setBookingRef] = useState("");

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

  const formatDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString("nl-NL", {
          weekday: "short",
          day: "numeric",
          month: "long",
        })
      : "—";

  const goToStep = (next: Step) => {
    setStepDir(next > step ? 1 : -1);
    setStep(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const result = await createBooking({
      villa_id: villaId,
      villa_name: villa.name,
      guest_name: form.naam,
      guest_email: form.email,
      guest_phone: form.telefoon,
      guest_count: guests,
      check_in: checkIn,
      check_out: checkOut,
      total_nights: nights,
      total_price: total,
      notes: form.bericht,
    });

    setIsSubmitting(false);

    if (result.error) {
      setSubmitError(result.error);
      return;
    }

    if (result.data?.id) {
      setBookingRef(result.data.id.slice(0, 8).toUpperCase());
    }
    setSubmitted(true);
    setStep(3);
  };

  if (submitted && step === 3) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-28 pb-16">
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="max-w-lg w-full text-center"
        >
          <motion.div variants={fadeUp} className="text-[#C9A84C] text-6xl mb-6">✦</motion.div>
          <motion.h1
            variants={fadeUp}
            className="text-5xl font-light text-[#F5F0E8] mb-4"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Aanvraag ontvangen
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[#F5F0E8]/60 leading-relaxed mb-8">
            Bedankt, {form.naam}! Edwin of Citty neemt binnen 24 uur persoonlijk contact met je op
            via <span className="text-[#C9A84C]">{form.email}</span> om de boeking van{" "}
            <strong className="text-[#F5F0E8]">{villa.name}</strong> te bevestigen.
          </motion.p>
          <motion.div variants={fadeUp} className="bg-[#1C2B1E] border border-[#C9A84C]/20 p-6 mb-8 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#F5F0E8]/50">Villa</span>
              <span className="text-[#F5F0E8]">{villa.name}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#F5F0E8]/50">Check-in</span>
              <span className="text-[#F5F0E8]">{formatDate(checkIn)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#F5F0E8]/50">Check-out</span>
              <span className="text-[#F5F0E8]">{formatDate(checkOut)}</span>
            </div>
            <div className="flex justify-between text-sm border-t border-[#C9A84C]/15 pt-3">
              <span className="text-[#F5F0E8]/50">Totaal ({nights} nachten)</span>
              <span className="text-[#C9A84C] font-medium">€{total.toLocaleString("nl-NL")}</span>
            </div>
            {bookingRef && (
              <div className="flex justify-between text-sm border-t border-[#C9A84C]/10 pt-3">
                <span className="text-[#F5F0E8]/35">Referentie</span>
                <span className="text-[#F5F0E8]/50 font-mono tracking-wider">{bookingRef}</span>
              </div>
            )}
          </motion.div>
          <motion.div variants={fadeUp}>
            <Link
              href="/"
              className="inline-block px-10 py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase hover:bg-[#E8C96A] transition-all duration-300"
            >
              Terug naar home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={stagger}
          className="mb-10"
        >
          <motion.div variants={fadeUp}>
            <Link
              href={`/villas/${villa.slug}`}
              className="flex items-center gap-2 text-[#F5F0E8]/35 text-xs tracking-wider hover:text-[#C9A84C] transition-colors mb-6"
            >
              ‹ Terug naar {villa.name}
            </Link>
          </motion.div>
          <motion.p variants={fadeUp} className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-2">
            Boeking
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="text-4xl md:text-5xl font-light text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {villa.name}
          </motion.h1>
          <motion.p variants={fadeUp} className="text-[#F5F0E8]/40 text-sm mt-1">
            {villa.location}
          </motion.p>
        </motion.div>

        <StepIndicator current={step} />

        <AnimatePresence mode="wait" custom={stepDir}>
          {/* Step 1 — Dates */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={stepDir}
              variants={stepSlide}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <motion.div variants={stagger} initial="hidden" animate="show">
                <motion.div variants={fadeUp} className="bg-[#1C2B1E] border border-[#C9A84C]/20 p-6 md:p-8 mb-6">
                  <h2
                    className="text-2xl font-light text-[#F5F0E8] mb-6"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Kies je datums
                  </h2>
                  <div className="grid grid-cols-2 gap-4 mb-5">
                    <div>
                      <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        min={checkIn || new Date().toISOString().split("T")[0]}
                        className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                      Aantal gasten
                    </label>
                    <div className="flex items-center border border-[#C9A84C]/20 bg-[#243628] w-44">
                      <button
                        onClick={() => setGuests((g) => Math.max(1, g - 1))}
                        className="w-12 h-12 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors text-lg leading-none"
                      >
                        −
                      </button>
                      <span className="flex-1 text-center text-[#F5F0E8] text-sm">
                        {guests}
                      </span>
                      <button
                        onClick={() => setGuests((g) => Math.min(villa.guests_max, g + 1))}
                        className="w-12 h-12 flex items-center justify-center text-[#C9A84C] hover:bg-[#C9A84C]/10 transition-colors text-lg leading-none"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-[#F5F0E8]/30 text-[0.65rem] mt-1.5">Max. {villa.guests_max} gasten</p>
                  </div>
                </motion.div>

                {/* Price breakdown */}
                {nights > 0 && (
                  <motion.div variants={fadeUp} className="bg-[#1C2B1E] border border-[#C9A84C]/20 p-6 mb-6">
                    <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-4">
                      Prijsoverzicht
                    </p>
                    <div className="space-y-2.5 mb-4">
                      <div className="flex justify-between text-sm text-[#F5F0E8]/65">
                        <span>
                          €{villa.price_per_night.toLocaleString("nl-NL")} × {nights} {nights === 1 ? "nacht" : "nachten"}
                        </span>
                        <span>€{total.toLocaleString("nl-NL")}</span>
                      </div>
                      <div className="flex justify-between text-sm text-[#F5F0E8]/65">
                        <span>Servicekosten</span>
                        <span className="text-[#F5F0E8]/35 italic text-xs self-center">Na bevestiging</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm font-medium text-[#F5F0E8] border-t border-[#C9A84C]/15 pt-3">
                      <span>Totaal accommodatie</span>
                      <span
                        className="text-[#C9A84C] text-xl font-light"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        €{total.toLocaleString("nl-NL")}
                      </span>
                    </div>
                    <p className="text-[#F5F0E8]/30 text-[0.65rem] mt-3 leading-relaxed">
                      Geen betaling nu — Edwin & Citty bevestigen jouw aanvraag binnen 24 uur.
                    </p>
                  </motion.div>
                )}

                <motion.div variants={fadeUp}>
                  <button
                    onClick={() => goToStep(2)}
                    disabled={!checkIn || !checkOut || nights < 1}
                    className="w-full py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Doorgaan naar gegevens →
                  </button>
                </motion.div>
              </motion.div>
            </motion.div>
          )}

          {/* Step 2 — Guest details */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={stepDir}
              variants={stepSlide}
              initial="hidden"
              animate="show"
              exit="exit"
            >
              <motion.div variants={stagger} initial="hidden" animate="show">
                <motion.div variants={fadeUp} className="bg-[#1C2B1E] border border-[#C9A84C]/20 p-6 md:p-8 mb-4">
                  <h2
                    className="text-2xl font-light text-[#F5F0E8] mb-1"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Jouw gegevens
                  </h2>
                  <p className="text-[#F5F0E8]/40 text-sm mb-6">
                    {formatDate(checkIn)} → {formatDate(checkOut)} · {nights} nachten · {guests} gasten
                  </p>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                          Naam *
                        </label>
                        <input
                          type="text"
                          required
                          value={form.naam}
                          onChange={(e) => setForm({ ...form, naam: e.target.value })}
                          placeholder="Jouw naam"
                          className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
                        />
                      </div>
                      <div>
                        <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                          E-mailadres *
                        </label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="jouw@email.nl"
                          className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                        Telefoonnummer
                      </label>
                      <input
                        type="tel"
                        value={form.telefoon}
                        onChange={(e) => setForm({ ...form, telefoon: e.target.value })}
                        placeholder="+31 6 ..."
                        className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
                      />
                    </div>
                    <div>
                      <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                        Bijzonderheden / verzoeken
                      </label>
                      <textarea
                        value={form.bericht}
                        onChange={(e) => setForm({ ...form, bericht: e.target.value })}
                        rows={3}
                        placeholder="Speciale verzoeken, vragen, allergiën..."
                        className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20 resize-none"
                      />
                    </div>

                    {submitError && (
                      <p className="text-red-400 text-xs text-center py-2">{submitError}</p>
                    )}
                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                        className="px-6 py-4 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-[0.25em] uppercase hover:bg-[#C9A84C]/10 transition-all duration-300"
                      >
                        ← Terug
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex-1 py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round"/>
                            </svg>
                            Bezig...
                          </>
                        ) : (
                          "Aanvraag bevestigen ✦"
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>

                <motion.div variants={fadeUp} className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-[#C9A84C] text-sm mt-0.5">🔒</span>
                    <p className="text-[#F5F0E8]/40 text-xs leading-relaxed">
                      Je gegevens worden nooit gedeeld met derden. Edwin of Citty neemt binnen
                      24 uur contact op voor definitieve bevestiging. Betaling verloopt na bevestiging.
                    </p>
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
