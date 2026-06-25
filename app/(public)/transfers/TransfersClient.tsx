"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createTransferRequest } from "@/lib/actions/transfers";
import { BALI_REGIONS } from "@/lib/constants/bali-locations";

// ─── Constants ────────────────────────────────────────────────────────────────

// Airport is pinned at the top; all other Bali areas follow from the central list.
// The autocomplete shows suggestions only — any custom location can be typed freely.
const BALI_LOCATIONS = [
  "Ngurah Rai Luchthaven (DPS)",
  "Denpasar Centrum",
  ...BALI_REGIONS,
];

const TIERS = [
  {
    id: "normaal" as const,
    label: "Normaal",
    sublabel: "Comfortabel & Betrouwbaar",
    emoji: "🚗",
    priceFrom: "45",
    features: [
      "Moderne sedan of MPV",
      "Airconditioning",
      "Ervaren lokale chauffeur",
      "Vluchttracking bij airport",
      "30 min. gratis wachttijd",
    ],
    capacity: "1 – 4 reizigers",
    badge: "Voordeligst",
    ideal: "Dagelijks vervoer & korte ritten",
  },
  {
    id: "luxe" as const,
    label: "Luxe",
    sublabel: "Premium Ervaring",
    emoji: "🚙",
    priceFrom: "85",
    features: [
      "Premium SUV of Executive MPV",
      "Lederen bekleding",
      "Koelwater & welkomstsnack",
      "USB & draadloze telefoonlader",
      "60 min. gratis wachttijd",
      "Kinderstoel op aanvraag",
    ],
    capacity: "1 – 6 reizigers",
    badge: "Meest Gekozen",
    ideal: "Stijlvol reizen & zakelijk vervoer",
    popular: true,
  },
  {
    id: "vip" as const,
    label: "VIP",
    sublabel: "Ongeëvenaarde Luxe",
    emoji: "✨",
    priceFrom: "150",
    features: [
      "Executive voertuig",
      "Welkomstchampagne bij aankomst",
      "Persoonlijke meet & greet service",
      "Privé conciërge begeleiding",
      "Onbeperkte wachttijd",
      "Premium koelbox met dranken",
      "Wi-Fi aan boord",
    ],
    capacity: "1 – 8 reizigers",
    badge: "Ultieme Luxe",
    ideal: "VIP-behandeling & onvergetelijke momenten",
  },
] as const;

type Tier = "normaal" | "luxe" | "vip";

interface AIResult {
  tier: Tier;
  reistijd: string;
  redenKeuze: string;
  reistip: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function LocationInput({
  label,
  value,
  onChange,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  icon: string;
}) {
  const [open, setOpen] = useState(false);
  const [flipUp, setFlipUp] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = BALI_LOCATIONS.filter(
    (loc) => value.length > 0 && loc.toLowerCase().includes(value.toLowerCase())
  );

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  const checkFlip = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    const dropdownHeight = Math.min(filtered.length * 56, 192);
    setFlipUp(rect.bottom + dropdownHeight > window.innerHeight - 16);
  };

  return (
    <div ref={ref} className="relative">
      <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base pointer-events-none">
          {icon}
        </span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
            checkFlip();
          }}
          onFocus={() => { setOpen(true); checkFlip(); }}
          placeholder={placeholder}
          className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] pl-10 pr-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/25"
          autoComplete="off"
        />
      </div>
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: flipUp ? 4 : -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: flipUp ? 4 : -4 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 right-0 z-50 bg-[#1A2B1C] border border-[#C9A84C]/25 max-h-48 overflow-y-auto shadow-2xl ${
              flipUp
                ? "bottom-full border-b-0 mb-1"
                : "top-full border-t-0"
            }`}
          >
            {filtered.map((loc) => (
              <button
                key={loc}
                type="button"
                onMouseDown={() => {
                  onChange(loc);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-4 text-sm text-[#F5F0E8]/70 hover:bg-[#243628] hover:text-[#F5F0E8] transition-colors border-b border-[#C9A84C]/10 last:border-0"
              >
                {loc}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PassengerCounter({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
        Reizigers
      </label>
      <div className="flex items-center bg-[#243628] border border-[#C9A84C]/20 h-[50px]">
        <button
          type="button"
          onClick={() => onChange(Math.max(1, value - 1))}
          className="w-14 h-full flex items-center justify-center text-[#F5F0E8]/50 hover:text-[#C9A84C] hover:bg-[#1C2B1E] transition-colors text-xl font-light border-r border-[#C9A84C]/15"
        >
          −
        </button>
        <span className="flex-1 text-center text-[#F5F0E8] text-sm font-light">
          {value} {value === 1 ? "persoon" : "personen"}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(8, value + 1))}
          className="w-14 h-full flex items-center justify-center text-[#F5F0E8]/50 hover:text-[#C9A84C] hover:bg-[#1C2B1E] transition-colors text-xl font-light border-l border-[#C9A84C]/15"
        >
          +
        </button>
      </div>
    </div>
  );
}

function TypingText({ text, onDone }: { text: string; onDone?: () => void }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) {
        clearInterval(interval);
        onDone?.();
      }
    }, 18);
    return () => clearInterval(interval);
  }, [text, onDone]);

  return (
    <span>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-0.5 h-3.5 bg-[#C9A84C] ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } },
};

export default function TransfersClient() {
  // Journey form
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [passengers, setPassengers] = useState(2);
  const [luggage, setLuggage] = useState("geen");
  const [occasion, setOccasion] = useState("");

  // Return trip
  const [returnTrip, setReturnTrip] = useState(false);
  const [returnDate, setReturnDate] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [returnBookingRef, setReturnBookingRef] = useState("");

  // AI state
  const [analyzing, setAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIResult | null>(null);
  const [aiTextDone, setAiTextDone] = useState(false);

  // Tier & details
  const [selectedTier, setSelectedTier] = useState<Tier | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [bookingRef, setBookingRef] = useState("");
  const [error, setError] = useState("");

  const tierSectionRef = useRef<HTMLDivElement>(null);
  const detailsRef = useRef<HTMLDivElement>(null);

  const canAnalyze = from.trim() && to.trim() && date;

  const handleAnalyze = useCallback(async () => {
    if (!canAnalyze) return;
    setAnalyzing(true);
    setAiResult(null);
    setAiTextDone(false);
    setSelectedTier(null);
    setShowDetails(false);

    try {
      const res = await fetch("/api/transfer-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ from, to, passengers, date, time, luggage, occasion }),
      });
      const data: AIResult = await res.json();
      setAiResult(data);
      setSelectedTier(data.tier);
    } catch {
      setAiResult({
        tier: passengers >= 7 ? "vip" : passengers >= 5 ? "luxe" : "normaal",
        reistijd: "45-75 minuten",
        redenKeuze:
          "Op basis van uw reisgegevens hebben wij de beste optie voor u geselecteerd.",
        reistip:
          "Houd rekening met extra reistijd tijdens het spitsuur op Bali (8–10u en 17–19u).",
      });
      setSelectedTier(passengers >= 7 ? "vip" : passengers >= 5 ? "luxe" : "normaal");
    }

    setAnalyzing(false);
    setTimeout(
      () => tierSectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      300
    );
  }, [canAnalyze, from, to, passengers, date, time]);

  const handleTierSelect = (tier: Tier) => {
    setSelectedTier(tier);
    setShowDetails(true);
    setTimeout(
      () => detailsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }),
      200
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTier) return;

    if (returnTrip && !returnDate) {
      setError("Vul een datum in voor de terugreis.");
      return;
    }

    setSubmitting(true);
    setError("");

    const basePayload = {
      from_location: from,
      to_location: to,
      transfer_date: date,
      transfer_time: time,
      passengers,
      tier: selectedTier,
      guest_name: name,
      guest_email: email,
      guest_phone: phone,
      notes,
      ai_recommendation: aiResult?.redenKeuze,
      estimated_travel_time: aiResult?.reistijd,
      luggage,
      occasion,
    };

    const result = await createTransferRequest(basePayload);

    if (result.error) {
      setError(result.error);
      setSubmitting(false);
      return;
    }

    setBookingRef(
      result.data?.id?.slice(0, 8).toUpperCase() ??
        Math.random().toString(36).slice(2, 10).toUpperCase()
    );

    if (returnTrip && returnDate) {
      const returnResult = await createTransferRequest({
        ...basePayload,
        from_location: to,
        to_location: from,
        transfer_date: returnDate,
        transfer_time: returnTime,
        notes: notes ? `[Terugreis] ${notes}` : "[Terugreis]",
      });
      if (returnResult.data) {
        setReturnBookingRef(
          returnResult.data.id?.slice(0, 8).toUpperCase() ?? ""
        );
      }
    }

    setSubmitting(false);
    setSuccess(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const tierLabel: Record<Tier, string> = {
    normaal: "Normaal Vervoer",
    luxe: "Luxe Vervoer",
    vip: "VIP Vervoer",
  };

  // ─── Success screen ─────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="min-h-screen bg-[#131E14] flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full text-center"
        >
          <div className="text-5xl mb-6">✓</div>
          <h1
            className="text-4xl font-light text-[#F5F0E8] mb-3"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Aanvraag Ontvangen
          </h1>
          <p className="text-[#F5F0E8]/50 text-sm mb-8 leading-relaxed">
            Uw transfer is aangevraagd. Wij nemen binnen 2 uur contact met u op
            ter bevestiging.
          </p>
          {/* Outward booking */}
          <div className="bg-[#1C2B1E] border border-[#C9A84C]/20 p-6 mb-4 text-left space-y-3">
            {returnBookingRef && (
              <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-1">Heenreis</p>
            )}
            <div className="flex justify-between text-sm gap-4">
              <span className="text-[#F5F0E8]/40 uppercase tracking-wider text-[0.65rem] shrink-0">
                Referentie
              </span>
              <span className="text-[#C9A84C] font-mono tracking-wider">
                #{bookingRef}
              </span>
            </div>
            <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-0.5 sm:gap-4">
              <span className="text-[#F5F0E8]/40 uppercase tracking-wider text-[0.65rem] shrink-0">
                Route
              </span>
              <span className="text-[#F5F0E8]/80 sm:text-right break-words text-xs">
                {from} → {to}
              </span>
            </div>
            <div className="flex justify-between text-sm gap-4">
              <span className="text-[#F5F0E8]/40 uppercase tracking-wider text-[0.65rem] shrink-0">
                Service
              </span>
              <span className="text-[#F5F0E8]/80 text-right text-xs">
                {tierLabel[selectedTier!]}
              </span>
            </div>
            <div className="flex justify-between text-sm gap-4">
              <span className="text-[#F5F0E8]/40 uppercase tracking-wider text-[0.65rem] shrink-0">
                Datum & Tijd
              </span>
              <span className="text-[#F5F0E8]/80 text-right text-xs">
                {date} {time && `om ${time}`}
              </span>
            </div>
          </div>

          {/* Return booking */}
          {returnBookingRef ? (
            <div className="bg-[#1C2B1E] border border-[#C9A84C]/20 p-6 mb-4 text-left space-y-3">
              <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-1">Terugreis</p>
              <div className="flex justify-between text-sm gap-4">
                <span className="text-[#F5F0E8]/40 uppercase tracking-wider text-[0.65rem] shrink-0">
                  Referentie
                </span>
                <span className="text-[#C9A84C] font-mono tracking-wider">
                  #{returnBookingRef}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between text-sm gap-0.5 sm:gap-4">
                <span className="text-[#F5F0E8]/40 uppercase tracking-wider text-[0.65rem] shrink-0">
                  Route
                </span>
                <span className="text-[#F5F0E8]/80 sm:text-right break-words text-xs">
                  {to} → {from}
                </span>
              </div>
              <div className="flex justify-between text-sm gap-4">
                <span className="text-[#F5F0E8]/40 uppercase tracking-wider text-[0.65rem] shrink-0">
                  Datum & Tijd
                </span>
                <span className="text-[#F5F0E8]/80 text-right text-xs">
                  {returnDate} {returnTime && `om ${returnTime}`}
                </span>
              </div>
            </div>
          ) : returnTrip ? (
            <div className="bg-[#1C2B1E] border border-[#C9A84C]/10 p-4 mb-4 text-left">
              <p className="text-[#F5F0E8]/40 text-xs">
                Terugreis kon niet worden aangemaakt — neem contact op met Edwin &amp; Citty.
              </p>
            </div>
          ) : null}

          <div className="mb-8" />
          <a
            href="/"
            className="inline-block px-8 py-3.5 border border-[#C9A84C]/30 text-[#C9A84C] text-xs tracking-[0.25em] uppercase hover:bg-[#C9A84C]/10 transition-colors"
          >
            Terug naar Home
          </a>
        </motion.div>
      </div>
    );
  }

  // ─── Main page ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#131E14]">
      {/* ── Hero ── */}
      <section className="relative pt-28 sm:pt-40 pb-20 sm:pb-32 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-48 md:w-80 lg:w-[500px] h-48 md:h-80 lg:h-[500px] rounded-full bg-[#C9A84C]/4 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-32 md:w-64 lg:w-96 h-32 md:h-64 lg:h-96 rounded-full bg-[#243628]/60 blur-2xl" />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 80px, #C9A84C 80px, #C9A84C 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, #C9A84C 80px, #C9A84C 81px)`,
            }}
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            className="text-center mb-10 sm:mb-16"
          >
            <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.5em] uppercase mb-6">
              Privé Vervoer op Bali
            </p>
            <h1
              className="text-4xl sm:text-5xl md:text-7xl font-light text-[#F5F0E8] mb-6 leading-tight"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Uw Vervoer,{" "}
              <span className="text-[#C9A84C] italic">Uw Stijl</span>
            </h1>
            <p className="text-[#F5F0E8]/45 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
              Kies uit Normaal, Luxe of VIP vervoer — onze AI analyseert uw
              reis en adviseert de ideale optie op maat.
            </p>
          </motion.div>

          {/* ── Booking Form Card ── */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.15 }}
            className="bg-[#1C2B1E] border border-[#C9A84C]/20 p-6 sm:p-8 max-w-3xl mx-auto"
          >
            <h2 className="text-[#C9A84C] text-[0.65rem] tracking-[0.35em] uppercase mb-6">
              Plan uw reis
            </h2>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <LocationInput
                  label="Vertrek"
                  value={from}
                  onChange={setFrom}
                  placeholder="Bijv. Ngurah Rai Luchthaven"
                  icon="📍"
                />
                <LocationInput
                  label="Bestemming"
                  value={to}
                  onChange={setTo}
                  placeholder="Bijv. Ubud"
                  icon="🏁"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="grid grid-cols-2 sm:contents gap-4">
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                      Datum
                    </label>
                    <input
                      type="date"
                      value={date}
                      min={new Date().toISOString().split("T")[0]}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-3 sm:px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                      Tijdstip
                    </label>
                    <input
                      type="time"
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-3 sm:px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                      style={{ colorScheme: "dark" }}
                    />
                  </div>
                </div>
                <PassengerCounter value={passengers} onChange={setPassengers} />
              </div>

              {/* Luggage */}
              <div>
                <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                  Bagage
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["geen", "1-2", "3-4", "5+"] as const).map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setLuggage(opt)}
                      className={`min-h-[48px] py-3 text-xs tracking-[0.1em] uppercase border transition-all duration-200 ${
                        luggage === opt
                          ? "bg-[#C9A84C] text-[#1C2B1E] border-[#C9A84C]"
                          : "bg-[#243628] border-[#C9A84C]/20 text-[#F5F0E8]/50 hover:text-[#F5F0E8]/80"
                      }`}
                    >
                      {opt === "geen" ? "Geen" : `${opt} koffers`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Occasion */}
              <div>
                <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                  Aanleiding{" "}
                  <span className="text-[#F5F0E8]/25 normal-case tracking-normal lowercase ml-1">
                    optioneel
                  </span>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { value: "luchthaventransfer",    label: "Luchthaventransfer" },
                    { value: "dagtocht",               label: "Dagtocht" },
                    { value: "speciale-gelegenheid",   label: "Speciale gelegenheid" },
                    { value: "overig",                 label: "Overig" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setOccasion((prev) => prev === opt.value ? "" : opt.value)}
                      className={`min-h-[48px] px-3 py-3 text-xs tracking-[0.1em] uppercase border transition-all duration-200 ${
                        occasion === opt.value
                          ? "bg-[#C9A84C]/15 text-[#C9A84C] border-[#C9A84C]/50"
                          : "border-[#C9A84C]/15 text-[#F5F0E8]/45 hover:border-[#C9A84C]/35 hover:text-[#F5F0E8]/70"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Return trip toggle */}
              <button
                type="button"
                onClick={() => setReturnTrip((prev) => !prev)}
                aria-pressed={returnTrip}
                className="w-full flex items-center justify-between py-4 px-4 border border-[#C9A84C]/15 text-left"
              >
                <div>
                  <p className="text-[#F5F0E8]/70 text-sm">Heen &amp; terug?</p>
                  <p className="text-[#F5F0E8]/30 text-[0.65rem]">Boek retour in één aanvraag</p>
                </div>
                <span
                  className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-300 ${
                    returnTrip ? "bg-[#C9A84C]" : "bg-[#243628] border border-[#C9A84C]/25"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-[#F5F0E8] shadow transition-transform duration-300 ${
                      returnTrip ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </span>
              </button>

              {/* Return date/time */}
              <AnimatePresence>
                {returnTrip && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="grid grid-cols-2 gap-4 pt-1">
                      <div>
                        <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                          Terugreis datum
                        </label>
                        <input
                          type="date"
                          value={returnDate}
                          min={date || new Date().toISOString().split("T")[0]}
                          onChange={(e) => setReturnDate(e.target.value)}
                          className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-3 sm:px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                      <div>
                        <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.25em] uppercase mb-2">
                          Terugreis tijdstip
                        </label>
                        <input
                          type="time"
                          value={returnTime}
                          onChange={(e) => setReturnTime(e.target.value)}
                          className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-3 sm:px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors"
                          style={{ colorScheme: "dark" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <button
                type="button"
                onClick={handleAnalyze}
                disabled={!canAnalyze || analyzing}
                className="w-full py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {analyzing ? (
                  <>
                    <span className="flex gap-1">
                      {[0, 1, 2].map((i) => (
                        <span
                          key={i}
                          className="w-1.5 h-1.5 bg-[#1C2B1E] rounded-full animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }}
                        />
                      ))}
                    </span>
                    AI analyseert uw reis…
                  </>
                ) : (
                  <>
                    <span>✦</span>
                    Analyseer mijn reis met AI
                  </>
                )}
              </button>

              {!canAnalyze && (
                <p className="text-[#F5F0E8]/25 text-xs text-center">
                  Vul vertrek, bestemming en datum in om te beginnen.
                </p>
              )}
            </div>

            {/* ── AI Result ── */}
            <AnimatePresence>
              {aiResult && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6 overflow-hidden"
                >
                  <div className="border-t border-[#C9A84C]/15 pt-6">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-[#C9A84C]/15 border border-[#C9A84C]/30 flex items-center justify-center text-sm shrink-0 mt-0.5">
                        ✦
                      </div>
                      <div className="flex-1">
                        <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-2">
                          AI-aanbeveling
                        </p>
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`text-xs tracking-wider uppercase px-3 py-1 border ${
                              aiResult.tier === "vip"
                                ? "text-[#C9A84C] border-[#C9A84C]/40 bg-[#C9A84C]/10"
                                : aiResult.tier === "luxe"
                                  ? "text-[#C9A84C] border-[#C9A84C]/30 bg-[#C9A84C]/8"
                                  : "text-[#F5F0E8]/70 border-[#F5F0E8]/20 bg-[#F5F0E8]/5"
                            }`}
                          >
                            {tierLabel[aiResult.tier]}
                          </span>
                          <span className="text-[#F5F0E8]/35 text-xs">
                            ⏱ {aiResult.reistijd}
                          </span>
                        </div>
                        <p className="text-[#F5F0E8]/75 text-sm leading-relaxed mb-3">
                          <TypingText
                            text={aiResult.redenKeuze}
                            onDone={() => setAiTextDone(true)}
                          />
                        </p>
                        <AnimatePresence>
                          {aiTextDone && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-[#243628] border border-[#C9A84C]/15 p-3 text-xs text-[#F5F0E8]/50 leading-relaxed"
                            >
                              <span className="text-[#C9A84C] mr-2">💡</span>
                              {aiResult.reistip}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* ── Tier Selection ── */}
      <section
        ref={tierSectionRef}
        className="py-16 sm:py-24 px-6 bg-[#131E14]"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.5em] uppercase mb-4">
              Kies uw service
            </p>
            <h2
              className="text-3xl sm:text-4xl font-light text-[#F5F0E8]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Drie Niveaus van Comfort
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TIERS.map((tier, i) => {
                const isRecommended = aiResult?.tier === tier.id;
                const isSelected = selectedTier === tier.id;

                return (
                  <motion.div
                    key={tier.id}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    onClick={() => handleTierSelect(tier.id)}
                    className={`relative cursor-pointer group transition-all duration-300 pt-4 ${
                      isSelected
                        ? "ring-2 ring-[#C9A84C]"
                        : "hover:ring-1 hover:ring-[#C9A84C]/40"
                    }`}
                  >
                    {/* Badges */}
                    <div className="absolute top-1 left-4 flex gap-2">
                      {"popular" in tier && tier.popular && !isRecommended && (
                        <span className="bg-[#243628] border border-[#C9A84C]/30 text-[#C9A84C] text-[0.55rem] tracking-[0.2em] uppercase px-2 py-0.5">
                          {tier.badge}
                        </span>
                      )}
                      {isRecommended && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          className="bg-[#C9A84C] text-[#1C2B1E] text-[0.55rem] tracking-[0.2em] uppercase px-2 py-0.5 font-medium"
                        >
                          ✦ AI Aanbevolen
                        </motion.span>
                      )}
                    </div>

                    <div
                      className={`h-full bg-[#1C2B1E] border p-5 sm:p-6 transition-all duration-300 ${
                        isSelected
                          ? "border-[#C9A84C]/60 bg-[#1C2B1E]"
                          : isRecommended
                            ? "border-[#C9A84C]/35"
                            : "border-[#C9A84C]/12 group-hover:border-[#C9A84C]/30"
                      }`}
                    >
                      {/* Header */}
                      <div className="mb-5">
                        <div className="text-3xl mb-3">{tier.emoji}</div>
                        <h3
                          className="text-2xl font-light text-[#F5F0E8] mb-1"
                          style={{ fontFamily: "var(--font-cormorant)" }}
                        >
                          {tier.label}
                        </h3>
                        <p className="text-[#F5F0E8]/35 text-[0.65rem] tracking-wider uppercase">
                          {tier.sublabel}
                        </p>
                      </div>

                      {/* Price from */}
                      <div className="mb-4 pb-4 border-b border-[#C9A84C]/12">
                        <span className="text-[#F5F0E8]/30 text-xs">vanaf </span>
                        <span className="text-[#C9A84C] text-xl font-light">
                          €{tier.priceFrom}
                        </span>
                      </div>

                      {/* Features */}
                      <ul className="space-y-2.5 mb-5">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm">
                            <span className="text-[#C9A84C] text-xs mt-0.5 shrink-0">
                              ✓
                            </span>
                            <span className="text-[#F5F0E8]/60 text-xs leading-relaxed">
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Capacity */}
                      <div className="flex items-center justify-between text-xs mb-4">
                        <span className="text-[#F5F0E8]/30">👥 {tier.capacity}</span>
                      </div>

                      {/* CTA */}
                      <div
                        className={`text-center py-4 text-[0.65rem] tracking-[0.25em] uppercase border transition-all ${
                          isSelected
                            ? "bg-[#C9A84C] text-[#1C2B1E] border-[#C9A84C]"
                            : "text-[#C9A84C] border-[#C9A84C]/30 group-hover:bg-[#C9A84C]/10"
                        }`}
                      >
                        {isSelected ? "✓ Geselecteerd" : "Selecteren"}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </section>

      {/* ── Contact Details ── */}
      <AnimatePresence>
        {showDetails && selectedTier && (
          <motion.section
            ref={detailsRef}
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 32 }}
            transition={{ duration: 0.5 }}
            className="py-16 sm:py-20 px-6 bg-[#1C2B1E]/50"
          >
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.5em] uppercase mb-3">
                  Bijna klaar
                </p>
                <h2
                  className="text-3xl sm:text-4xl font-light text-[#F5F0E8]"
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  Uw Gegevens
                </h2>
              </div>

              {/* Booking Summary */}
              <div className="bg-[#1C2B1E] border border-[#C9A84C]/20 p-5 mb-8">
                <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-4">
                  Overzicht
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-0.5 sm:gap-4">
                    <span className="text-[#F5F0E8]/35 text-[0.65rem] uppercase tracking-wider shrink-0">
                      Route
                    </span>
                    <span className="text-[#F5F0E8]/80 text-xs sm:text-right break-words">
                      {from} → {to}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#F5F0E8]/35 text-[0.65rem] uppercase tracking-wider shrink-0">
                      Datum & Tijd
                    </span>
                    <span className="text-[#F5F0E8]/80 text-right text-xs">
                      {date} {time && `— ${time}`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#F5F0E8]/35 text-[0.65rem] uppercase tracking-wider shrink-0">
                      Reizigers
                    </span>
                    <span className="text-[#F5F0E8]/80 text-right text-xs">
                      {passengers} {passengers === 1 ? "persoon" : "personen"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-[#F5F0E8]/35 text-[0.65rem] uppercase tracking-wider shrink-0">
                      Service
                    </span>
                    <span className="text-[#C9A84C] text-right text-xs tracking-wider">
                      {tierLabel[selectedTier]}
                    </span>
                  </div>
                  {aiResult?.reistijd && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#F5F0E8]/35 text-[0.65rem] uppercase tracking-wider shrink-0">
                        Reistijd
                      </span>
                      <span className="text-[#F5F0E8]/80 text-right text-xs">
                        {aiResult.reistijd}
                      </span>
                    </div>
                  )}
                  {luggage && luggage !== "geen" && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#F5F0E8]/35 text-[0.65rem] uppercase tracking-wider shrink-0">
                        Bagage
                      </span>
                      <span className="text-[#F5F0E8]/80 text-right text-xs">
                        {luggage === "5+" ? "5+ koffers" : `${luggage} koffers`}
                      </span>
                    </div>
                  )}
                  {occasion && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#F5F0E8]/35 text-[0.65rem] uppercase tracking-wider shrink-0">
                        Aanleiding
                      </span>
                      <span className="text-[#F5F0E8]/80 text-right text-xs capitalize">
                        {occasion.replace(/-/g, " ")}
                      </span>
                    </div>
                  )}
                  {returnTrip && returnDate && (
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[#F5F0E8]/35 text-[0.65rem] uppercase tracking-wider shrink-0">
                        Terugreis
                      </span>
                      <span className="text-[#F5F0E8]/80 text-right text-xs">
                        {returnDate} {returnTime && `om ${returnTime}`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                      Naam *
                    </label>
                    <input
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Uw volledige naam"
                      className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
                    />
                  </div>
                  <div>
                    <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                      Telefoon *
                    </label>
                    <input
                      required
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+31 6 ..."
                      className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                    E-mail *
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="uw@email.com"
                    className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20"
                  />
                </div>

                <div>
                  <label className="block text-[#C9A84C] text-[0.6rem] tracking-[0.25em] uppercase mb-2">
                    Opmerkingen
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Vluchtummer, speciale verzoeken, kinderstoel nodig..."
                    className="w-full bg-[#243628] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-4 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors placeholder-[#F5F0E8]/20 resize-none"
                  />
                </div>

                {error && (
                  <p className="text-red-400 text-xs">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300 disabled:opacity-60"
                >
                  {submitting ? "Aanvraag versturen..." : "Transfer Aanvragen →"}
                </button>

                <p className="text-[#F5F0E8]/25 text-xs text-center leading-relaxed">
                  Na uw aanvraag ontvangt u binnen 2 uur een bevestiging per
                  e-mail. De exacte prijs wordt op maat berekend op basis van
                  uw route.
                </p>
              </form>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── Why choose us ── */}
      {!showDetails && (
        <section className="py-16 sm:py-24 px-6 border-t border-[#C9A84C]/10">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
              {[
                {
                  icon: "🛡️",
                  title: "Gecertificeerde Chauffeurs",
                  desc: "Alle chauffeurs zijn gecertificeerd, Engelssprekend en kennen Bali van binnen en buiten.",
                },
                {
                  icon: "⏰",
                  title: "24/7 Beschikbaar",
                  desc: "Of u nu vroeg vliegt of laat aankomt — wij zijn er altijd, ook midden in de nacht.",
                },
                {
                  icon: "✈️",
                  title: "Vluchttracking",
                  desc: "Uw chauffeur volgt uw vlucht live en past de ophaaltijd automatisch aan bij vertraging.",
                },
              ].map((item) => (
                <div key={item.title} className="space-y-3">
                  <div className="text-3xl">{item.icon}</div>
                  <h3
                    className="text-[#F5F0E8] text-lg font-light"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {item.title}
                  </h3>
                  <p className="text-[#F5F0E8]/35 text-xs leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
