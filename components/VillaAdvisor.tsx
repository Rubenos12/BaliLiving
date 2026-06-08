"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";
import type { Villa } from "@/lib/villas-data";
import type { AdvisorPreferences, AdvisorResult } from "@/app/api/villa-advisor/route";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const TRIP_TYPE_OPTIONS = [
  { value: "huwelijksreis", label: "Huwelijksreis", icon: "💍" },
  { value: "gezinsreis",    label: "Gezinsreis",    icon: "👨‍👩‍👧" },
  { value: "vrienden",      label: "Vrienden / Groep", icon: "🥂" },
  { value: "avontuur",      label: "Avontuur",      icon: "🌿" },
  { value: "zakelijk",      label: "Zakelijk",      icon: "💼" },
];

const BUDGET_OPTIONS = [
  { value: "onder-300", label: "Onder €300" },
  { value: "300-500", label: "€300 – €500" },
  { value: "500-800", label: "€500 – €800" },
  { value: "800+", label: "€800+" },
];

const GUEST_OPTIONS = [
  { value: 1, label: "1–2 personen" },
  { value: 3, label: "3–4 personen" },
  { value: 5, label: "5–8 personen" },
  { value: 9, label: "9+ personen" },
];

const LOCATION_OPTIONS = [
  { value: "geen-voorkeur", label: "Geen voorkeur" },
  { value: "Ubud", label: "Ubud" },
  { value: "Seminyak", label: "Seminyak" },
  { value: "Canggu", label: "Canggu" },
  { value: "Uluwatu", label: "Uluwatu" },
  { value: "Nusa Dua", label: "Nusa Dua" },
];

const PREFERENCE_OPTIONS = [
  { value: "privé zwembad", label: "Privé zwembad" },
  { value: "strand en oceaan", label: "Strand & oceaan" },
  { value: "natuur en jungle", label: "Natuur & jungle" },
  { value: "romantisch voor twee", label: "Romantisch" },
  { value: "gezinsvriendelijk", label: "Gezin" },
  { value: "surfen", label: "Surfen" },
  { value: "eco en duurzaam", label: "Eco & duurzaam" },
  { value: "eigen chef", label: "Eigen chef" },
  { value: "grote groep of feest", label: "Grote groep" },
  { value: "yoga en wellness", label: "Yoga & wellness" },
];

type Step = 1 | 2 | 3 | 4 | 5;

// Full-width tap-friendly option button
function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`min-h-[48px] px-4 py-3 text-sm tracking-[0.15em] uppercase border transition-all duration-200 text-left ${
        selected
          ? "bg-[#C9A84C] text-[#1C2B1E] border-[#C9A84C]"
          : "border-[#C9A84C]/25 text-[#F5F0E8]/70 hover:border-[#C9A84C]/60 hover:text-[#F5F0E8]/90"
      }`}
    >
      {children}
    </button>
  );
}

function StepIndicator({ step, total }: { step: Step; total: number }) {
  return (
    <div className="flex items-center gap-2 mb-7">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`h-0.5 flex-1 transition-all duration-300 ${
            i < step ? "bg-[#C9A84C]" : "bg-[#C9A84C]/20"
          }`}
        />
      ))}
      <span className="text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase shrink-0">
        {step} / {total}
      </span>
    </div>
  );
}

export default function VillaAdvisor({ villas }: { villas: Villa[] }) {
  const [step, setStep] = useState<Step>(1);
  const [tripType, setTripType] = useState("");
  const [budget, setBudget] = useState("");
  const [guests, setGuests] = useState<number | null>(null);
  const [location, setLocation] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AdvisorResult | null>(null);
  const [error, setError] = useState("");

  const togglePreference = (pref: string) => {
    setPreferences((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const payload: AdvisorPreferences = {
      trip_type: tripType,
      budget,
      guests: guests!,
      location,
      preferences,
    };
    try {
      const res = await fetch("/api/villa-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error ?? "Er ging iets mis. Probeer het opnieuw.");
        setLoading(false);
        return;
      }
      setResult(data as AdvisorResult);
    } catch {
      setError("Er ging iets mis. Probeer het opnieuw.");
    }
    setLoading(false);
  };

  const reset = () => {
    setStep(1);
    setTripType("");
    setBudget("");
    setGuests(null);
    setLocation("");
    setPreferences([]);
    setResult(null);
    setError("");
  };

  const recommendedVilla = result ? villas.find((v) => v.slug === result.primary.slug) : null;

  return (
    <section className="py-16 md:py-20 bg-[#131E14] border-y border-[#C9A84C]/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header — compact on mobile */}
        <div className="mb-6 md:mb-8">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-2">
            Persoonlijk Advies
          </p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
            <h2
              className="text-3xl md:text-5xl font-light text-[#F5F0E8] leading-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Welke villa past{" "}
              <span className="italic text-[#C9A84C]">bij jou?</span>
            </h2>
            <p className="text-[#F5F0E8]/45 text-sm max-w-xs leading-relaxed sm:text-right hidden sm:block">
              Beantwoord 5 korte vragen en onze AI-adviseur vindt de perfecte villa voor jouw reis.
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-5 sm:p-8 md:p-10 max-w-2xl">
          <AnimatePresence mode="wait">
            {/* Result */}
            {result && recommendedVilla ? (
              <motion.div key="result" variants={fadeUp} initial="hidden" animate="show">
                <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-5">
                  Jouw perfecte villa
                </p>

                <div className="group border border-[#C9A84C]/20 hover:border-[#C9A84C]/50 transition-all duration-300 mb-5">
                  <div className="aspect-[16/9] bg-[#243628] overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={recommendedVilla.images[0]}
                      alt={recommendedVilla.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3
                        className="text-xl sm:text-2xl font-light text-[#F5F0E8]"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        {recommendedVilla.name}
                      </h3>
                      <span
                        className="text-[#C9A84C] text-sm font-light shrink-0"
                        style={{ fontFamily: "var(--font-cormorant)" }}
                      >
                        €{recommendedVilla.price_per_night.toLocaleString("nl-NL")}/nacht
                      </span>
                    </div>
                    <p className="text-[#C9A84C]/70 text-xs tracking-wider mb-4">
                      {recommendedVilla.location} · {recommendedVilla.bedrooms} slaapkamers · max {recommendedVilla.guests_max} gasten
                    </p>

                    <div className="bg-[#243628] border border-[#C9A84C]/10 px-4 py-3 mb-5 text-sm text-[#F5F0E8]/60 leading-relaxed italic">
                      <span className="text-[#C9A84C] not-italic text-[0.6rem] tracking-wider uppercase block mb-1">
                        AI advies
                      </span>
                      {result.primary.reason}
                    </div>

                    {/* Stacked buttons on mobile */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={`/villas/${recommendedVilla.slug}`}
                        className="w-full sm:w-auto text-center px-6 py-3 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.2em] uppercase hover:bg-[#E8C96A] transition-colors duration-300"
                      >
                        Bekijk villa
                      </Link>
                      <button
                        onClick={reset}
                        className="w-full sm:w-auto px-6 py-3 border border-[#C9A84C]/30 text-[#F5F0E8]/55 text-xs tracking-[0.2em] uppercase hover:border-[#C9A84C]/60 hover:text-[#F5F0E8]/80 transition-colors duration-300"
                      >
                        Opnieuw zoeken
                      </button>
                    </div>
                  </div>
                </div>

                {/* Alternatives */}
                {result.alternatives.length > 0 && (
                  <>
                    <p className="text-[#F5F0E8]/35 text-[0.65rem] tracking-[0.25em] uppercase mb-3">
                      Andere suggesties
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      {result.alternatives.map((alt) => {
                        const altVilla = villas.find((v) => v.slug === alt.slug);
                        if (!altVilla) return null;
                        return (
                          <div
                            key={alt.slug}
                            className="border border-[#C9A84C]/12 hover:border-[#C9A84C]/35 transition-all duration-200"
                          >
                            <div className="aspect-[4/3] bg-[#243628] overflow-hidden">
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img
                                src={altVilla.images[0]}
                                alt={altVilla.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-3">
                              <p
                                className="text-[#F5F0E8] text-sm font-light leading-tight mb-0.5"
                                style={{ fontFamily: "var(--font-cormorant)" }}
                              >
                                {altVilla.name}
                              </p>
                              <p className="text-[#C9A84C]/60 text-[0.6rem] tracking-wider mb-2">
                                {altVilla.location} · €{altVilla.price_per_night.toLocaleString("nl-NL")}/nacht
                              </p>
                              <p className="text-[#F5F0E8]/40 text-[0.65rem] leading-relaxed mb-3 line-clamp-2">
                                {alt.reason}
                              </p>
                              <Link
                                href={`/villas/${altVilla.slug}`}
                                className="block text-center py-2 border border-[#C9A84C]/25 text-[#C9A84C] text-[0.6rem] tracking-[0.2em] uppercase hover:border-[#C9A84C]/60 hover:bg-[#C9A84C]/8 transition-colors"
                              >
                                Bekijk
                              </Link>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </motion.div>
            ) : loading ? (
              <motion.div key="loading" variants={fadeUp} initial="hidden" animate="show" className="py-14 text-center">
                <div className="text-[#C9A84C] text-4xl mb-4 animate-pulse">✦</div>
                <p className="text-[#F5F0E8]/50 text-sm">Jouw perfecte villa wordt gezocht...</p>
              </motion.div>
            ) : (
              <motion.div key={`step-${step}`} variants={fadeUp} initial="hidden" animate="show">
                <StepIndicator step={step} total={5} />

                {/* Step 1: Trip type */}
                {step === 1 && (
                  <>
                    <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-1">Stap 1</p>
                    <h3
                      className="text-xl sm:text-2xl font-light text-[#F5F0E8] mb-5"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      Wat voor reis is dit?
                    </h3>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                      {TRIP_TYPE_OPTIONS.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={tripType === opt.value}
                          onClick={() => setTripType(opt.value)}
                        >
                          <span className="mr-2">{opt.icon}</span>{opt.label}
                        </OptionButton>
                      ))}
                    </div>
                    <div className="mt-6">
                      <button
                        onClick={() => setStep(2)}
                        disabled={!tripType}
                        className="w-full sm:w-auto px-8 py-3.5 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.2em] uppercase disabled:opacity-30 hover:bg-[#E8C96A] transition-colors duration-300"
                      >
                        Volgende →
                      </button>
                    </div>
                  </>
                )}

                {/* Step 2: Budget */}
                {step === 2 && (
                  <>
                    <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-1">Stap 2</p>
                    <h3
                      className="text-xl sm:text-2xl font-light text-[#F5F0E8] mb-5"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      Wat is jouw budget per nacht?
                    </h3>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                      {BUDGET_OPTIONS.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={budget === opt.value}
                          onClick={() => setBudget(opt.value)}
                        >
                          {opt.label}
                        </OptionButton>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setStep(1)}
                        className="flex-1 sm:flex-none px-5 py-3.5 border border-[#C9A84C]/25 text-[#F5F0E8]/55 text-xs tracking-[0.2em] uppercase hover:border-[#C9A84C]/50 transition-colors duration-300"
                      >
                        ← Terug
                      </button>
                      <button
                        onClick={() => setStep(3)}
                        disabled={!budget}
                        className="flex-1 sm:flex-none px-8 py-3.5 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.2em] uppercase disabled:opacity-30 hover:bg-[#E8C96A] transition-colors duration-300"
                      >
                        Volgende →
                      </button>
                    </div>
                  </>
                )}

                {/* Step 3: Guests */}
                {step === 3 && (
                  <>
                    <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-1">Stap 3</p>
                    <h3
                      className="text-xl sm:text-2xl font-light text-[#F5F0E8] mb-5"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      Hoeveel gasten zijn jullie?
                    </h3>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                      {GUEST_OPTIONS.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={guests === opt.value}
                          onClick={() => setGuests(opt.value)}
                        >
                          {opt.label}
                        </OptionButton>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setStep(2)}
                        className="flex-1 sm:flex-none px-5 py-3.5 border border-[#C9A84C]/25 text-[#F5F0E8]/55 text-xs tracking-[0.2em] uppercase hover:border-[#C9A84C]/50 transition-colors duration-300"
                      >
                        ← Terug
                      </button>
                      <button
                        onClick={() => setStep(4)}
                        disabled={guests === null}
                        className="flex-1 sm:flex-none px-8 py-3.5 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.2em] uppercase disabled:opacity-30 hover:bg-[#E8C96A] transition-colors duration-300"
                      >
                        Volgende →
                      </button>
                    </div>
                  </>
                )}

                {/* Step 4: Location */}
                {step === 4 && (
                  <>
                    <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-1">Stap 4</p>
                    <h3
                      className="text-xl sm:text-2xl font-light text-[#F5F0E8] mb-5"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      Heb je een locatievoorkeur?
                    </h3>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                      {LOCATION_OPTIONS.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={location === opt.value}
                          onClick={() => setLocation(opt.value)}
                        >
                          {opt.label}
                        </OptionButton>
                      ))}
                    </div>
                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setStep(3)}
                        className="flex-1 sm:flex-none px-5 py-3.5 border border-[#C9A84C]/25 text-[#F5F0E8]/55 text-xs tracking-[0.2em] uppercase hover:border-[#C9A84C]/50 transition-colors duration-300"
                      >
                        ← Terug
                      </button>
                      <button
                        onClick={() => setStep(5)}
                        disabled={!location}
                        className="flex-1 sm:flex-none px-8 py-3.5 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.2em] uppercase disabled:opacity-30 hover:bg-[#E8C96A] transition-colors duration-300"
                      >
                        Volgende →
                      </button>
                    </div>
                  </>
                )}

                {/* Step 5: Preferences */}
                {step === 5 && (
                  <>
                    <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-1">Stap 5</p>
                    <h3
                      className="text-xl sm:text-2xl font-light text-[#F5F0E8] mb-1"
                      style={{ fontFamily: "var(--font-cormorant)" }}
                    >
                      Wat zijn jouw wensen?
                    </h3>
                    <p className="text-[#F5F0E8]/35 text-xs mb-5">Selecteer alles wat van toepassing is (optioneel)</p>
                    <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2 sm:gap-3">
                      {PREFERENCE_OPTIONS.map((opt) => (
                        <OptionButton
                          key={opt.value}
                          selected={preferences.includes(opt.value)}
                          onClick={() => togglePreference(opt.value)}
                        >
                          {opt.label}
                        </OptionButton>
                      ))}
                    </div>

                    {error && (
                      <p className="mt-4 text-red-400 text-xs">{error}</p>
                    )}

                    <div className="mt-6 flex gap-3">
                      <button
                        onClick={() => setStep(4)}
                        className="flex-1 sm:flex-none px-5 py-3.5 border border-[#C9A84C]/25 text-[#F5F0E8]/55 text-xs tracking-[0.2em] uppercase hover:border-[#C9A84C]/50 transition-colors duration-300"
                      >
                        ← Terug
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="flex-1 sm:flex-none px-8 py-3.5 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.2em] uppercase hover:bg-[#E8C96A] transition-colors duration-300"
                      >
                        Zoek villa ✦
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
