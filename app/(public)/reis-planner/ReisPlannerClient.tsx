"use client";

import { useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Link from "next/link";

type GroupType = "koppel" | "familie" | "vrienden" | "solo";
type BudgetTier = "budget" | "midden" | "luxe" | "ultra";
type StyleOption = "Luxe" | "Avontuur" | "Cultuur" | "Strand";
type PriorityOption = "Privé zwembad" | "Eigen chef" | "Dichtbij strand" | "Natuur" | "Nachtleven" | "Wellness" | "Kinderactiviteiten";

type DayItem = {
  type: "transfer" | "villa" | "tour" | "restaurant" | "activity";
  time: string;
  title: string;
  description: string;
  price?: number;
  link?: string;
};

type ItineraryResult = {
  headline: string;
  tagline: string;
  nights: number;
  villa: { slug: string; name: string; region: string; price_per_night: number; reason: string };
  days: Array<{ day: number; title: string; items: DayItem[] }>;
  total_estimate: number;
  cta_message: string;
};

const STYLES: { id: StyleOption; icon: string; label: string; sub: string }[] = [
  { id: "Luxe", icon: "🥂", label: "Luxe", sub: "Private pool villa, fine dining, VIP transfers" },
  { id: "Avontuur", icon: "🏄", label: "Avontuur", sub: "Surfen, trekking, waterval tours" },
  { id: "Cultuur", icon: "🏛", label: "Cultuur", sub: "Tempels, rijstvelden, lokale ceremonies" },
  { id: "Strand", icon: "🌊", label: "Strand", sub: "Beach clubs, zonsondergang, watersport" },
];

const PRIORITIES: PriorityOption[] = [
  "Privé zwembad", "Eigen chef", "Dichtbij strand", "Natuur", "Nachtleven", "Wellness", "Kinderactiviteiten",
];

const BUDGET_OPTIONS: { id: BudgetTier; label: string; sub: string }[] = [
  { id: "budget", label: "Budget", sub: "tot €500/nacht" },
  { id: "midden", label: "Comfort", sub: "€500–€1200/nacht" },
  { id: "luxe", label: "Luxe", sub: "€1200–€2500/nacht" },
  { id: "ultra", label: "Ultra Luxe", sub: "€2500+/nacht" },
];

const GROUP_OPTIONS: { id: GroupType; icon: string; label: string }[] = [
  { id: "koppel", icon: "💑", label: "Koppel" },
  { id: "familie", icon: "👨‍👩‍👧‍👦", label: "Familie" },
  { id: "vrienden", icon: "🧑‍🤝‍🧑", label: "Vrienden" },
  { id: "solo", icon: "🧘", label: "Solo" },
];

const itemIcon: Record<DayItem["type"], string> = {
  transfer: "🚗",
  villa: "🏡",
  tour: "🗺",
  restaurant: "🍽",
  activity: "✦",
};

const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } } };
const stagger: Variants = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };

export default function ReisPlannerClient() {
  const [step, setStep] = useState(1);
  const [arrival, setArrival] = useState("");
  const [departure, setDeparture] = useState("");
  const [groupType, setGroupType] = useState<GroupType | "">("");
  const [guests, setGuests] = useState(2);
  const [selectedStyles, setSelectedStyles] = useState<StyleOption[]>([]);
  const [budget, setBudget] = useState<BudgetTier | "">("");
  const [selectedPriorities, setSelectedPriorities] = useState<PriorityOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ItineraryResult | null>(null);
  const [error, setError] = useState("");

  const nights = arrival && departure
    ? Math.round((new Date(departure).getTime() - new Date(arrival).getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const toggleStyle = (s: StyleOption) => setSelectedStyles((p) => p.includes(s) ? p.filter((x) => x !== s) : [...p, s]);
  const togglePriority = (p: PriorityOption) => setSelectedPriorities((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p]);

  const canProceed = () => {
    if (step === 1) return arrival && departure && nights > 0 && nights <= 60;
    if (step === 2) return groupType !== "" && guests >= 1;
    if (step === 3) return selectedStyles.length > 0 && budget !== "";
    return true;
  };

  const handleGenerate = async () => {
    if (!groupType || !budget || selectedStyles.length === 0) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          arrival,
          departure,
          group_type: groupType,
          guests,
          style: selectedStyles,
          budget,
          priorities: selectedPriorities,
        }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Er is iets misgegaan. Probeer het opnieuw.");
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  // Result view
  if (result) {
    return (
      <motion.div variants={stagger} initial="hidden" animate="show" className="max-w-3xl mx-auto px-6 py-16">
        {/* Header */}
        <motion.div variants={fadeUp} className="mb-12 text-center">
          <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.4em] uppercase mb-4">✦ Jouw persoonlijk reisplan</p>
          <h2
            className="text-4xl md:text-6xl font-light text-[#F5F0E8] mb-4 leading-tight"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            {result.headline}
          </h2>
          <p className="text-[#F5F0E8]/55 text-lg italic">{result.tagline}</p>
        </motion.div>

        {/* Villa recommendation */}
        <motion.div variants={fadeUp} className="bg-[#1C2B1E] border border-[#C9A84C]/25 p-6 mb-10">
          <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.35em] uppercase mb-3">Aanbevolen verblijf</p>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="flex-1 min-w-0">
              <h3
                className="text-2xl font-light text-[#F5F0E8] mb-1"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {result.villa.name}
              </h3>
              <p className="text-[#C9A84C]/70 text-xs tracking-wider mb-3">{result.villa.region}</p>
              <p className="text-[#F5F0E8]/55 text-sm leading-relaxed">{result.villa.reason}</p>
            </div>
            <div className="text-right shrink-0">
              <p
                className="text-[#C9A84C] text-2xl font-light"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                €{result.villa.price_per_night.toLocaleString("nl-NL")}
              </p>
              <p className="text-[#F5F0E8]/35 text-xs mt-0.5">per nacht</p>
              <Link
                href={`/villas/${result.villa.slug}`}
                className="inline-block mt-3 px-4 py-2 border border-[#C9A84C]/40 text-[#C9A84C] text-[0.6rem] tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-300"
              >
                Bekijk villa
              </Link>
            </div>
          </div>
        </motion.div>

        {/* Day-by-day timeline */}
        <motion.div variants={fadeUp} className="mb-10">
          <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.35em] uppercase mb-6">
            Dag voor dag — {result.nights} nachten
          </p>
          <div className="space-y-8">
            {result.days.map((day) => (
              <div key={day.day}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-7 h-7 bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center shrink-0">
                    <span className="text-[#C9A84C] text-xs font-medium">{day.day}</span>
                  </div>
                  <h4
                    className="text-lg font-light text-[#F5F0E8]"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {day.title}
                  </h4>
                </div>
                <div className="ml-10 space-y-3 border-l border-[#C9A84C]/10 pl-5">
                  {day.items.map((item, i) => (
                    <div key={i} className="relative">
                      <div className="absolute -left-[1.4375rem] top-2 w-2 h-2 bg-[#C9A84C]/30 rounded-full" />
                      <div className="flex items-start gap-3">
                        <span className="text-sm shrink-0 mt-0.5">{itemIcon[item.type]}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[#F5F0E8]/30 text-xs w-10 shrink-0">{item.time}</span>
                            <span className="text-[#F5F0E8] text-sm font-light">{item.title}</span>
                            {item.price && (
                              <span className="text-[#C9A84C] text-xs">€{item.price}</span>
                            )}
                          </div>
                          <p className="text-[#F5F0E8]/45 text-xs mt-1 leading-relaxed ml-12">
                            {item.description}
                          </p>
                          {item.link && (
                            <Link
                              href={item.link}
                              className="inline-block mt-1 ml-12 text-[#C9A84C]/60 text-[0.6rem] tracking-[0.15em] uppercase hover:text-[#C9A84C] transition-colors"
                            >
                              Meer info →
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Estimate + CTA */}
        <motion.div variants={fadeUp} className="border-t border-[#C9A84C]/15 pt-8 text-center">
          <p className="text-[#F5F0E8]/35 text-xs tracking-[0.2em] uppercase mb-2">Geschatte totaalprijs</p>
          <p
            className="text-[#C9A84C] text-4xl font-light mb-2"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            €{result.total_estimate.toLocaleString("nl-NL")}
          </p>
          <p className="text-[#F5F0E8]/30 text-xs mb-8">Indicatief — inclusief villa, tours & transfers</p>

          <p className="text-[#F5F0E8]/60 text-sm italic mb-8">{result.cta_message}</p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/contact?plan=${encodeURIComponent(result.headline)}&villa=${encodeURIComponent(result.villa.name)}`}
              className="px-8 py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300"
            >
              Stuur mij dit reisplan ✦
            </Link>
            <button
              onClick={() => { setResult(null); setStep(1); setSelectedStyles([]); setSelectedPriorities([]); setGroupType(""); setBudget(""); setArrival(""); setDeparture(""); }}
              className="px-8 py-4 border border-[#F5F0E8]/15 text-[#F5F0E8]/40 text-xs tracking-[0.2em] uppercase hover:text-[#F5F0E8] hover:border-[#F5F0E8]/30 transition-all duration-300"
            >
              Nieuw plan maken
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  // Loading view
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-6 py-20">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-2 border-[#C9A84C]/20 border-t-[#C9A84C] rounded-full mb-8"
        />
        <p
          className="text-3xl font-light text-[#F5F0E8] mb-3 text-center"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Edwin & Citty stellen jouw reis samen…
        </p>
        <p className="text-[#F5F0E8]/35 text-sm text-center">
          We doorzoeken onze collectie villa&apos;s, tours en restaurants
        </p>
      </div>
    );
  }

  // Step form
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      {/* Progress */}
      <div className="flex items-center gap-2 mb-10">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-0.5 flex-1 transition-all duration-500 ${s <= step ? "bg-[#C9A84C]" : "bg-[#C9A84C]/15"}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1 — Wanneer? */}
        {step === 1 && (
          <motion.div key="step1" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -16 }}>
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-[0.6rem] tracking-[0.4em] uppercase mb-3">Stap 1 van 4</motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-light text-[#F5F0E8] mb-8"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Wanneer ga je naar Bali?
            </motion.h2>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-2">Aankomst</label>
                <input
                  type="date"
                  value={arrival}
                  min={today}
                  onChange={(e) => setArrival(e.target.value)}
                  className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/50 [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-2">Vertrek</label>
                <input
                  type="date"
                  value={departure}
                  min={arrival || today}
                  onChange={(e) => setDeparture(e.target.value)}
                  className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/50 [color-scheme:dark]"
                />
              </div>
            </motion.div>
            {nights > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-[#C9A84C] text-sm mb-6"
              >
                {nights} nacht{nights !== 1 ? "en" : ""} op Bali
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Step 2 — Met wie? */}
        {step === 2 && (
          <motion.div key="step2" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -16 }}>
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-[0.6rem] tracking-[0.4em] uppercase mb-3">Stap 2 van 4</motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-light text-[#F5F0E8] mb-8"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Met wie ga je?
            </motion.h2>
            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mb-8">
              {GROUP_OPTIONS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGroupType(g.id)}
                  className={`p-5 border text-left transition-all duration-200 ${
                    groupType === g.id
                      ? "bg-[#C9A84C]/15 border-[#C9A84C]/50"
                      : "bg-[#1C2B1E] border-[#C9A84C]/10 hover:border-[#C9A84C]/30"
                  }`}
                >
                  <span className="text-2xl block mb-2">{g.icon}</span>
                  <span
                    className={`text-lg font-light block ${groupType === g.id ? "text-[#C9A84C]" : "text-[#F5F0E8]"}`}
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {g.label}
                  </span>
                </button>
              ))}
            </motion.div>
            <motion.div variants={fadeUp}>
              <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-4">Aantal personen</label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setGuests((p) => Math.max(1, p - 1))}
                  className="w-10 h-10 flex items-center justify-center border border-[#C9A84C]/20 text-[#F5F0E8]/60 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all"
                >
                  –
                </button>
                <span className="text-[#F5F0E8] text-2xl font-light w-8 text-center" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {guests}
                </span>
                <button
                  onClick={() => setGuests((p) => Math.min(20, p + 1))}
                  className="w-10 h-10 flex items-center justify-center border border-[#C9A84C]/20 text-[#F5F0E8]/60 hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-all"
                >
                  +
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Step 3 — Stijl & budget */}
        {step === 3 && (
          <motion.div key="step3" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -16 }}>
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-[0.6rem] tracking-[0.4em] uppercase mb-3">Stap 3 van 4</motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-light text-[#F5F0E8] mb-2"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Stijl & budget
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/40 text-sm mb-8">Kies meerdere reisstemmen die bij jullie passen.</motion.p>

            <motion.div variants={fadeUp} className="grid grid-cols-2 gap-3 mb-8">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => toggleStyle(s.id)}
                  className={`p-4 border text-left transition-all duration-200 ${
                    selectedStyles.includes(s.id)
                      ? "bg-[#C9A84C]/15 border-[#C9A84C]/50"
                      : "bg-[#1C2B1E] border-[#C9A84C]/10 hover:border-[#C9A84C]/30"
                  }`}
                >
                  <span className="text-xl block mb-2">{s.icon}</span>
                  <span
                    className={`text-base font-light block mb-1 ${selectedStyles.includes(s.id) ? "text-[#C9A84C]" : "text-[#F5F0E8]"}`}
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {s.label}
                  </span>
                  <span className="text-[#F5F0E8]/35 text-[0.65rem] leading-tight block">{s.sub}</span>
                </button>
              ))}
            </motion.div>

            <motion.div variants={fadeUp}>
              <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-3">Villa budget</p>
              <div className="grid grid-cols-2 gap-2">
                {BUDGET_OPTIONS.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBudget(b.id)}
                    className={`p-3 border text-left transition-all duration-200 ${
                      budget === b.id
                        ? "bg-[#C9A84C]/15 border-[#C9A84C]/50"
                        : "bg-[#1C2B1E] border-[#C9A84C]/10 hover:border-[#C9A84C]/30"
                    }`}
                  >
                    <span className={`text-sm font-light block ${budget === b.id ? "text-[#C9A84C]" : "text-[#F5F0E8]"}`}>
                      {b.label}
                    </span>
                    <span className="text-[#F5F0E8]/35 text-xs">{b.sub}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Step 4 — Prioriteiten */}
        {step === 4 && (
          <motion.div key="step4" variants={stagger} initial="hidden" animate="show" exit={{ opacity: 0, y: -16 }}>
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-[0.6rem] tracking-[0.4em] uppercase mb-3">Stap 4 van 4</motion.p>
            <motion.h2
              variants={fadeUp}
              className="text-4xl md:text-5xl font-light text-[#F5F0E8] mb-2"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Wat is voor jullie het belangrijkste?
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/40 text-sm mb-8">Optioneel — sla over als dit niet van toepassing is.</motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-10">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => togglePriority(p)}
                  className={`text-xs tracking-[0.15em] uppercase px-4 py-2.5 border transition-all duration-200 ${
                    selectedPriorities.includes(p)
                      ? "bg-[#C9A84C]/15 border-[#C9A84C]/50 text-[#C9A84C]"
                      : "border-[#C9A84C]/15 text-[#F5F0E8]/45 hover:border-[#C9A84C]/40 hover:text-[#C9A84C]/80"
                  }`}
                >
                  {p}
                </button>
              ))}
            </motion.div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400/80 text-sm mb-4"
              >
                {error}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#C9A84C]/10">
        {step > 1 ? (
          <button
            onClick={() => setStep((s) => s - 1)}
            className="text-[#F5F0E8]/40 text-xs tracking-[0.2em] uppercase hover:text-[#F5F0E8] transition-colors"
          >
            ← Terug
          </button>
        ) : <div />}

        {step < 4 ? (
          <button
            onClick={() => { if (canProceed()) setStep((s) => s + 1); }}
            disabled={!canProceed()}
            className="px-8 py-3 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Volgende →
          </button>
        ) : (
          <button
            onClick={handleGenerate}
            className="px-8 py-3 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300"
          >
            Genereer mijn reisplan ✦
          </button>
        )}
      </div>
    </div>
  );
}
