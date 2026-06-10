"use client";

import { useEffect, useRef, useState } from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";

/* ─── Inline SVG icons (replaces lucide-react) ───────────────── */
type IconProps = { className?: string; strokeWidth?: number };

const IconHome = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const IconMap = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
  </svg>
);
const IconUtensils = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z"/><path d="M21 15v7"/>
  </svg>
);
const IconCar = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 17H3a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h13l4 4v4a2 2 0 0 1-2 2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
);
const IconFileText = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconCompass = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>
  </svg>
);
const IconArrowUpRight = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/>
  </svg>
);
const IconArrowRight = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
  </svg>
);
const IconStar = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth={0} strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const IconMapPin = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconUsers = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconShield = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);
const IconClock = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);
const IconCheck = ({ className, strokeWidth = 2 }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
  </svg>
);

/* ─── Shared fade-up variant (Framer Motion) ───────────────────── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.85, ease: [0.25, 0.46, 0.45, 0.94] } },
};
const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.14 } },
};

/* ─── Data ──────────────────────────────────────────────────────── */
const STATS = [
  { target: 200, suffix: "+", label: "Gecureerde Villa's" },
  { target: 50,  suffix: "+", label: "Exclusieve Tours" },
  { target: 150, suffix: "+", label: "Toprestaurants" },
  { target: 5000, suffix: "+", label: "Tevreden Reizigers" },
];

const SERVICES = [
  { icon: IconHome,     title: "Villa's",     subtitle: "Privé verblijven",          text: "Handpicked luxe villa's met eigen zwembad, persoonlijke butler en adembenemend uitzicht.",                                               href: "/villas",    num: "01" },
  { icon: IconMap,      title: "Tours",       subtitle: "Onvergetelijke ervaringen", text: "Privé rondleidingen langs tempels, rijstterrassen en verborgen watervallen op maat gemaakt.",                                            href: "/tours",     num: "02" },
  { icon: IconUtensils, title: "Restaurants", subtitle: "Culinaire hoogtepunten",    text: "Van romantische kliffendining tot verborgen lokale warungs. Wij reserveren de beste tafels.",                                           href: "/restaurants", num: "03" },
  { icon: IconCar,      title: "Transfers",   subtitle: "Stijlvol vervoer",          text: "Privé transferservice in normaal, luxe of VIP-klasse met lokale chauffeurs die het eiland kennen.",                                     href: "/transfers", num: "04" },
  { icon: IconFileText, title: "Visum",       subtitle: "Zorgeloze reisdocumenten",  text: "Wij regelen jouw Indonesisch visum snel en correct — geen papierwerk, geen stress.",                                                    href: "/visum",     num: "05" },
  { icon: IconCompass,  title: "Op Maat",     subtitle: "Volledig ontzorgd",         text: "Van eerste kennismaking tot de dag dat je thuiskomt — wij plannen elk detail van jouw Bali reis.",                                      href: "/contact",   num: "06" },
];

const HOE_HET_WERKT = [
  {
    num: "01", title: "Vertel ons", tagline: "Jouw droom, onze missie.",
    text: "Vertel ons wanneer je gaat, met wie, en wat jouw ideale Bali-reis is. We luisteren — geen formulieren, gewoon een gesprek met echte Bali-kenners.",
    image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf4?w=1200&q=85&auto=format&fit=crop",
    alt: "Bali rijstterrassen bij zonsopgang", meta: "Stap 1 / Vertel",
    checks: ["Gratis kennismakingsgesprek", "Persoonlijk advies op maat", "Geen verborgen kosten"],
  },
  {
    num: "02", title: "Wij plannen", tagline: "Elk detail, perfect geregeld.",
    text: "Wij zetten jouw wensen om in een volledig uitgewerkte reisplanning — villa's, tours, restaurants, transfers en meer. Alles op één plek.",
    image: "https://images.unsplash.com/photo-1573790387438-4da905039392?w=1200&q=85&auto=format&fit=crop",
    alt: "Balinese tempel bij schemering", meta: "Stap 2 / Plan",
    checks: ["Curated villa selectie", "Private tours & restaurantreserveringen", "24/7 bereikbaar tijdens planning"],
  },
  {
    num: "03", title: "Jij geniet", tagline: "Bali op zijn allerbest.",
    text: "Terwijl jij geniet, staan wij op de achtergrond klaar. Onze lokale partners zorgen dat alles perfect verloopt — van aankomst tot vertrek.",
    image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=1200&q=85&auto=format&fit=crop",
    alt: "Luxe villa zwembad op Bali", meta: "Stap 3 / Geniet",
    checks: ["Lokale support on-island", "Last-minute aanpassingen mogelijk", "Onvergetelijke herinneringen"],
  },
];

const VILLA_PREVIEWS = [
  { name: "Jungle Retreat Ubud",   region: "Ubud",     price: "€285", beds: 4, image: "https://images.unsplash.com/photo-1540541338537-1220205ac293?w=800&q=85&auto=format&fit=crop", tag: "Meest geboekt" },
  { name: "Cliffside Uluwatu",     region: "Uluwatu",  price: "€420", beds: 6, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=85&auto=format&fit=crop", tag: "Nieuw" },
  { name: "Seminyak Sanctuary",    region: "Seminyak", price: "€190", beds: 3, image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=800&q=85&auto=format&fit=crop", tag: "Populair" },
];

const TESTIMONIALS = [
  { quote: "BaliLiving heeft onze huwelijksreis letterlijk perfect gemaakt. Elke villa, elk restaurant, elke tour was precies wat we gehoopt hadden. Beter dan een reisbureau, het voelde als een vriend die op Bali woont.", name: "Sophie & Thomas", location: "Rotterdam", stars: 5 },
  { quote: "Onze gezinsvakantie met vier kinderen was een droom. Edwin en Citty dachten aan alles — van kindvriendelijke activiteiten tot een villa met beveiligd zwembad. Wij komen zeker terug.", name: "Maria van den Berg", location: "Amsterdam", stars: 5 },
  { quote: "Professioneel, persoonlijk en altijd beschikbaar. Midden in de nacht een vraag? Ze reageerden binnen het uur. BaliLiving is de enige manier om Bali te ontdekken.", name: "Robert Dekker", location: "Utrecht", stars: 5 },
];

/* ─── CountUp component ─────────────────────────────────────────── */
function CountUp({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const t = Math.min(1, (now - startTime) / duration);
            const eased = 1 - Math.pow(1 - t, 3);
            setCount(Math.floor(target * eased));
            if (t < 1) requestAnimationFrame(tick);
            else setCount(target);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.35 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [target, duration]);

  return <span ref={ref} className="tabular-nums">{count}</span>;
}

/* ─── Credentials Stats Card ────────────────────────────────────── */
function CredentialsCard() {
  const stats = [
    { value: 200, suffix: "+", label: "villa's op Bali" },
    { value: 5,   suffix: " jaar", label: "Bali-expertise" },
  ];
  return (
    <div className="rounded-3xl border border-[#C9A84C]/20 bg-[#131E14] overflow-hidden">
      <div className="flex items-center justify-between px-8 pt-6 pb-4">
        <span className="text-[#C9A84C]/50 text-[0.6rem] tracking-[0.3em] uppercase">Onze cijfers</span>
        <span className="h-2 w-2 rounded-full bg-[#C9A84C] ring-pulse-gold flex-shrink-0" />
      </div>
      {stats.map(({ value, suffix, label }) => (
        <div key={label} className="px-8 py-5 border-t border-[#C9A84C]/10">
          <div className="flex items-baseline gap-3">
            <span className="text-5xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
              <CountUp target={value} />{suffix}
            </span>
            <span className="text-[#C9A84C]/50 text-xs tracking-[0.15em]">╱</span>
            <span className="text-[#F5F0E8]/50 text-sm">{label}</span>
          </div>
        </div>
      ))}
      <div className="px-8 py-5 border-t border-[#C9A84C]/10">
        <div className="flex items-baseline gap-3">
          <span className="text-5xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>24/7</span>
          <span className="text-[#C9A84C]/50 text-xs tracking-[0.15em]">╱</span>
          <span className="text-[#F5F0E8]/50 text-sm">persoonlijke service</span>
        </div>
      </div>
      <div className="px-8 py-4 bg-[#0F1A10] border-t border-[#C9A84C]/10">
        <p className="text-[#F5F0E8]/25 text-xs tracking-wider">Opgericht door Edwin &amp; Citty · Bali since 2019</p>
      </div>
    </div>
  );
}

/* ─── Sticky-stack Protocol section (CSS-only, no GSAP) ─────────── */
function HoeHetWerkt() {
  return (
    <section className="relative px-4 sm:px-6 py-20 sm:py-28">
      <div className="max-w-7xl mx-auto mb-16 px-2 sm:px-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#C9A84C]/70">╱ Hoe het werkt</span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#F5F0E8] mt-4 leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
          Drie stappen.
          <span className="block italic text-[#C9A84C]">Geen zorgen.</span>
        </h2>
      </div>

      <div className="space-y-8">
        {HOE_HET_WERKT.map((step, idx) => (
          <article
            key={idx}
            className="sticky top-24 sm:top-28 mx-auto max-w-6xl bg-[#131E14] border border-[#C9A84C]/15 rounded-3xl overflow-hidden shadow-2xl shadow-black/50"
          >
            <div className="grid lg:grid-cols-5 gap-0 min-h-[65vh]">
              <div className="lg:col-span-3 p-8 sm:p-12 lg:p-16 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-[#F5F0E8]/40">{step.meta}</span>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#C9A84C] bg-[#C9A84C]/10 px-3 py-1 rounded-full border border-[#C9A84C]/20">BaliLiving</span>
                </div>
                <div className="my-10 lg:my-0 lg:py-10">
                  <span className="font-light text-[6rem] sm:text-[9rem] leading-none text-[#C9A84C]/10 -mb-4 block" style={{ fontFamily: "var(--font-cormorant)" }}>{step.num}</span>
                  <h3 className="text-3xl sm:text-4xl md:text-5xl font-light text-[#F5F0E8] leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>{step.title}</h3>
                  <p className="text-2xl sm:text-3xl italic text-[#C9A84C] mt-3" style={{ fontFamily: "var(--font-cormorant)" }}>{step.tagline}</p>
                </div>
                <div>
                  <p className="text-[#F5F0E8]/60 text-base sm:text-lg leading-relaxed mb-8">{step.text}</p>
                  <ul className="space-y-3">
                    {step.checks.map((c) => (
                      <li key={c} className="flex items-center gap-3 text-[#F5F0E8]/70 text-sm">
                        <IconCheck className="h-4 w-4 text-[#C9A84C] flex-shrink-0" strokeWidth={2} />
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="lg:col-span-2 relative overflow-hidden min-h-[280px] lg:min-h-full bg-[#0F1A10]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={step.image} alt={step.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" style={{ animation: "ken-burns 12s ease-in-out infinite alternate" }} onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.classList.add("img-fallback"); }} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A10]/70 via-transparent to-[#0F1A10]/20" />
                <div className="absolute top-5 left-5 flex items-center gap-2 glass-dark rounded-full pl-3 pr-4 py-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#C9A84C] ring-pulse-gold" />
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#F5F0E8]/80">Stap {step.num}</span>
                </div>
                <div className="absolute bottom-4 right-4 font-mono text-[10px] uppercase tracking-widest text-[#F5F0E8]/50">{step.num} / BaliLiving</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ─── HomePage ──────────────────────────────────────────────────── */
export default function HomePage() {
  return (
    <>
      {/* Noise overlay */}
      <div className="noise-overlay" aria-hidden />

      {/* ─── HERO ──────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen overflow-hidden flex flex-col">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=90&auto=format&fit=crop"
          alt="Luxe villa op Bali"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ animation: "ken-burns 18s ease-in-out infinite alternate" }}
          onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.classList.add("img-fallback"); }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0A1209]/75 via-[#131E14]/60 to-[#1C2B1E]/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A10]/80 via-transparent to-transparent" />

        {/* Floating lotus petal particles */}
        <div className="absolute top-20 right-12 md:right-24 flex flex-col gap-3 opacity-60 pointer-events-none" aria-hidden>
          {[
            { delay: "0s", size: "h-3 w-3" },
            { delay: "1.2s", size: "h-2 w-2" },
            { delay: "2.5s", size: "h-4 w-4" },
            { delay: "0.7s", size: "h-2.5 w-2.5" },
            { delay: "1.9s", size: "h-3.5 w-3.5" },
          ].map((p, i) => (
            <svg key={i} className={p.size} style={{ animation: `float-particle 6s ease-in-out ${p.delay} infinite` }} viewBox="0 0 20 28">
              <path d="M10 1 C 7 5, 2 10, 2 16 Q 2 24 10 27 Q 18 24 18 16 C 18 10, 13 5, 10 1 Z" fill="#C9A84C" fillOpacity="0.75" />
            </svg>
          ))}
        </div>

        {/* Hero content */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 text-center pt-28 sm:pt-36 pb-20">
          <div className="max-w-5xl mx-auto w-full flex flex-col items-center">
            <p
              className="text-[#C9A84C] text-[0.65rem] tracking-[0.45em] uppercase mb-10"
              style={{ animation: "hero-rise 0.9s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s both" }}
            >
              Welkom bij BaliLiving
            </p>

            <h1
              className="text-5xl sm:text-7xl lg:text-9xl font-light text-[#F5F0E8] leading-none mb-8"
              style={{ fontFamily: "var(--font-cormorant)", animation: "hero-rise 1.1s cubic-bezier(0.25,0.46,0.45,0.94) 0.5s both" }}
            >
              Bali op
              <br />
              <span className="italic text-[#C9A84C]">zijn best</span>
            </h1>

            <div className="flex items-center gap-4 my-8" style={{ animation: "hero-rise 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.85s both" }}>
              <span className="gold-line" />
              <p className="text-[#F5F0E8]/60 text-xs tracking-[0.25em] uppercase">Volledig ontzorgd reizen naar Bali</p>
              <span className="gold-line" />
            </div>

            <p
              className="text-[#F5F0E8]/70 text-lg max-w-xl leading-relaxed mb-14"
              style={{ animation: "hero-rise 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 1.0s both" }}
            >
              Van luxe villa&apos;s en privé tours tot de beste restaurantreserveringen —
              wij regelen elk detail van jouw perfecte Bali reis.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 items-center" style={{ animation: "hero-rise 0.7s cubic-bezier(0.25,0.46,0.45,0.94) 1.15s both" }}>
              <Link href="/villas" className="magnetic-btn inline-flex items-center gap-2 px-10 py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-semibold hover:bg-[#E8C96A]">
                Ontdek Villa&apos;s
                <IconArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <Link href="/over-ons" className="magnetic-btn inline-flex items-center gap-2 px-10 py-4 border border-[#F5F0E8]/30 text-[#F5F0E8] text-xs tracking-[0.3em] uppercase hover:border-[#C9A84C] hover:text-[#C9A84C]">
                Onze Aanpak
                <IconArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none" style={{ animation: "hero-fade 0.8s ease-out 1.5s both" }}>
          <span className="text-[#C9A84C]/50 text-[0.55rem] tracking-[0.35em] uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
            className="w-px h-10 bg-gradient-to-b from-[#C9A84C]/50 to-transparent"
          />
        </div>
      </section>

      {/* ─── STATS (CountUp) ──────────────────────────────────────── */}
      <section className="bg-[#C9A84C] py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10 text-center">
            {STATS.map((s, i) => (
              <div key={s.label}>
                <div className="text-4xl md:text-6xl font-light text-[#1C2B1E] mb-1" style={{ fontFamily: "var(--font-cormorant)" }}>
                  <CountUp target={s.target} duration={1800 + i * 200} />
                  {s.suffix}
                </div>
                <div className="text-[#1C2B1E]/65 text-[0.65rem] tracking-[0.25em] uppercase">{s.label}</div>
                <div className="mt-3 h-px bg-[#1C2B1E]/15 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-transparent via-[#1C2B1E]/40 to-transparent" style={{ animation: `pillar-sweep 4s ease-in-out ${i * 0.4}s infinite` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOE HET WERKT (sticky-stack) ─────────────────────────── */}
      <HoeHetWerkt />

      {/* ─── INTRO ────────────────────────────────────────────────── */}
      <section className="py-32 sm:py-40 max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp}>
            <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.4em] uppercase mb-6">Waarom BaliLiving</p>
            <h2 className="text-5xl md:text-6xl font-light text-[#F5F0E8] leading-tight mb-8" style={{ fontFamily: "var(--font-cormorant)" }}>
              Meer dan een<br /><span className="italic text-[#C9A84C]">reisbureau</span>
            </h2>
            <div className="space-y-5 text-[#F5F0E8]/60 leading-relaxed">
              <p>BaliLiving is opgericht door Edwin en Citty — pure Bali-fanaten en mede-eigenaren van STOER Bracelets. Jarenlang kwamen zij op het eiland en bouwden een diep persoonlijk netwerk op met lokale villa-eigenaren, gidsen en restauranthouders.</p>
              <p>Dat netwerk zetten zij nu voor jou in. Geen standaard pakketreizen, geen anonieme boekingssites. Gewoon directe, eerlijke service van mensen die Bali net zo lief hebben als jij.</p>
            </div>
            <Link href="/over-ons" className="lift-on-hover inline-flex items-center gap-3 mt-10 text-[#C9A84C] text-[0.7rem] tracking-[0.3em] uppercase group">
              Lees ons verhaal
              <span className="w-8 h-px bg-[#C9A84C] group-hover:w-14 transition-all duration-300" />
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="relative">
            <div className="aspect-[3/4] relative overflow-hidden rounded-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="https://images.unsplash.com/photo-1537953773345-d172ccf13cf4?w=900&q=85&auto=format&fit=crop" alt="Bali rijstterrassen" className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.classList.add("img-fallback"); }} />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A10]/30 to-transparent pointer-events-none" />
            </div>
            <div className="absolute -top-4 -right-4 w-20 h-20 border-t border-r border-[#C9A84C]/40" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 border-b border-l border-[#C9A84C]/40" />
            <div className="absolute bottom-8 -left-6 glass-dark border border-[#C9A84C]/20 px-5 py-3 rounded-sm shadow-xl">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-[#C9A84C] ring-pulse-gold flex-shrink-0" />
                <div>
                  <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.2em] uppercase">Live beschikbaar</p>
                  <p className="text-[#F5F0E8]/60 text-xs mt-0.5">200+ villa&apos;s op Bali</p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── LOTUS RAIN FEATURE STRIP ─────────────────────────────── */}
      <section className="py-20 sm:py-28 bg-[#0F1A10]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-center">
            <motion.div variants={fadeUp} className="lg:col-span-2">
              <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.4em] uppercase mb-5">╱ Real-time beschikbaarheid</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#F5F0E8] leading-tight mb-6" style={{ fontFamily: "var(--font-cormorant)" }}>
                Altijd een villa<span className="block italic text-[#C9A84C]">voor jou beschikbaar.</span>
              </h2>
              <p className="text-[#F5F0E8]/55 text-base leading-relaxed max-w-lg">
                Ons live netwerk van villa-eigenaren en lokale partners zorgt dat wij altijd de perfecte match voor jou kunnen vinden — op elk moment van het jaar.
              </p>
              <div className="flex flex-wrap gap-6 mt-8">
                {[
                  { icon: IconShield, text: "Gecureerde selectie" },
                  { icon: IconClock,  text: "24/7 support" },
                  { icon: IconUsers,  text: "Lokaal netwerk" },
                  { icon: IconMapPin, text: "Heel Bali" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-[#F5F0E8]/60 text-sm">
                    <Icon className="h-4 w-4 text-[#C9A84C]" strokeWidth={2} />
                    {text}
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={fadeUp}>
              <CredentialsCard />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ─── SERVICES GRID ────────────────────────────────────────── */}
      <section className="py-28 sm:py-36 bg-[#131E14]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="text-center mb-20">
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-[0.65rem] tracking-[0.45em] uppercase mb-4">Onze Diensten</motion.p>
            <motion.h2 variants={fadeUp} className="text-5xl md:text-6xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
              Alles wat je nodig hebt<br /><span className="italic text-[#C9A84C]">op één plek</span>
            </motion.h2>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="grid md:grid-cols-3 gap-px bg-[#C9A84C]/10">
            {SERVICES.map((s) => (
              <motion.div key={s.title} variants={fadeUp}>
                <Link href={s.href} className="group block bg-[#131E14] p-10 hover:bg-[#1C2B1E] transition-all duration-500 h-full">
                  <div className="flex justify-between items-start mb-8">
                    <span className="text-[#C9A84C]/25 text-sm tracking-[0.3em] font-light" style={{ fontFamily: "var(--font-cormorant)" }}>{s.num}</span>
                    <div className="h-10 w-10 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center group-hover:bg-[#C9A84C]/20 transition-colors duration-300">
                      <s.icon className="h-5 w-5 text-[#C9A84C]" strokeWidth={2} />
                    </div>
                  </div>
                  <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.3em] uppercase mb-3">{s.subtitle}</p>
                  <h3 className="text-4xl font-light text-[#F5F0E8] mb-5 group-hover:text-[#C9A84C] transition-colors duration-300" style={{ fontFamily: "var(--font-cormorant)" }}>{s.title}</h3>
                  <p className="text-[#F5F0E8]/45 text-sm leading-relaxed mb-8">{s.text}</p>
                  <div className="flex items-center gap-3 text-[#C9A84C] text-[0.65rem] tracking-[0.2em] uppercase">
                    <span>Bekijk meer</span>
                    <span className="w-6 h-px bg-[#C9A84C] group-hover:w-12 transition-all duration-300" />
                    <IconArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 -ml-2 transition-all duration-300" strokeWidth={2} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ─── VILLA PREVIEW ────────────────────────────────────────── */}
      <section className="py-28 sm:py-36 max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-16">
            <div>
              <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.4em] uppercase mb-4">Uitgelichte Villa&apos;s</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#F5F0E8] leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>
                Onze topkeuzes<span className="block italic text-[#C9A84C]">op dit moment</span>
              </h2>
            </div>
            <Link href="/villas" className="lift-on-hover hidden md:flex items-center gap-3 text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase group">
              Alle villa&apos;s
              <span className="w-6 h-px bg-[#C9A84C] group-hover:w-12 transition-all duration-300" />
            </Link>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {VILLA_PREVIEWS.map((v, i) => (
              <motion.div key={v.name} variants={fadeUp} style={{ transitionDelay: `${i * 80}ms` }}>
                <Link href="/villas" className="group block overflow-hidden rounded-sm">
                  <div className="relative overflow-hidden aspect-[4/5]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={v.image} alt={v.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.parentElement?.classList.add("img-fallback"); }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0F1A10]/80 via-transparent to-transparent" />
                    <div className="absolute top-4 left-4 glass-dark border border-[#C9A84C]/20 px-3 py-1 rounded-full">
                      <span className="font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]">{v.tag}</span>
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="font-mono text-[10px] uppercase tracking-widest text-[#C9A84C]/70 mb-1">{v.region}</p>
                          <h3 className="text-2xl font-light text-[#F5F0E8] leading-tight" style={{ fontFamily: "var(--font-cormorant)" }}>{v.name}</h3>
                          <p className="text-[#F5F0E8]/50 text-xs mt-1">{v.beds} slaapkamers</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[#C9A84C] text-xl font-light" style={{ fontFamily: "var(--font-cormorant)" }}>{v.price}</p>
                          <p className="text-[#F5F0E8]/40 text-[0.65rem] tracking-widest uppercase">/nacht</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          <motion.div variants={fadeUp} className="mt-10 text-center md:hidden">
            <Link href="/villas" className="magnetic-btn inline-flex items-center gap-2 border border-[#C9A84C]/40 text-[#C9A84C] text-xs tracking-[0.3em] uppercase px-8 py-3">
              Alle Villa&apos;s <IconArrowRight className="h-4 w-4" strokeWidth={2} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── TESTIMONIALS ─────────────────────────────────────────── */}
      <section className="py-28 sm:py-36 bg-[#0F1A10]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-20">
              <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.45em] uppercase mb-4">Ervaringen</p>
              <h2 className="text-4xl sm:text-5xl md:text-6xl font-light text-[#F5F0E8]" style={{ fontFamily: "var(--font-cormorant)" }}>
                Wat onze reizigers<span className="block italic text-[#C9A84C]">zeggen</span>
              </h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-8">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={t.name} variants={fadeUp} style={{ transitionDelay: `${i * 100}ms` }} className="group bg-[#131E14] border border-[#C9A84C]/10 p-8 hover:border-[#C9A84C]/25 transition-colors duration-500">
                  <div className="flex gap-1 mb-6">
                    {Array.from({ length: t.stars }).map((_, j) => (
                      <IconStar key={j} className="h-3.5 w-3.5 fill-[#C9A84C] text-[#C9A84C]" />
                    ))}
                  </div>
                  <blockquote className="text-[#F5F0E8]/70 text-base leading-relaxed mb-8 italic" style={{ fontFamily: "var(--font-cormorant)" }}>
                    &ldquo;{t.quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-3 pt-6 border-t border-[#C9A84C]/10">
                    <div className="h-8 w-8 rounded-full bg-[#C9A84C]/20 flex items-center justify-center">
                      <span className="text-[#C9A84C] text-xs font-medium">{t.name.charAt(0)}</span>
                    </div>
                    <div>
                      <p className="text-[#F5F0E8] text-sm font-medium">{t.name}</p>
                      <p className="text-[#F5F0E8]/40 text-xs">{t.location}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── TRUST PILLARS ────────────────────────────────────────── */}
      <section className="py-28 sm:py-36 max-w-7xl mx-auto px-6">
        <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={stagger} className="text-center">
          <motion.p variants={fadeUp} className="text-[#C9A84C] text-[0.65rem] tracking-[0.45em] uppercase mb-4">De BaliLiving Belofte</motion.p>
          <motion.h2 variants={fadeUp} className="text-4xl sm:text-5xl md:text-6xl font-light text-[#F5F0E8] mb-20" style={{ fontFamily: "var(--font-cormorant)" }}>
            Jouw reis, volledig<br /><span className="italic text-[#C9A84C]">ontzorgd</span>
          </motion.h2>
          <motion.div variants={stagger} className="grid md:grid-cols-3 gap-16">
            {[
              { icon: IconUsers,  title: "Persoonlijk Advies", desc: "Geen algoritmes of chatbots. Een echte Bali-expert luistert naar jouw wensen en denkt met je mee." },
              { icon: IconMapPin, title: "Lokale Expertise",   desc: "Onze partners wonen op Bali. Ze kennen de plekken die je niet in een reisgids vindt." },
              { icon: IconClock,  title: "24/7 Ondersteuning", desc: "Tijdens je verblijf staan wij dag en nacht klaar. Wat er ook is, wij lossen het op." },
            ].map((item) => (
              <motion.div key={item.title} variants={fadeUp} className="flex flex-col items-center text-center group">
                <div className="h-14 w-14 rounded-3xl bg-[#C9A84C]/10 border border-[#C9A84C]/20 flex items-center justify-center mb-6 group-hover:bg-[#C9A84C]/20 transition-colors duration-300">
                  <item.icon className="h-6 w-6 text-[#C9A84C]" strokeWidth={1.8} />
                </div>
                <h3 className="text-2xl sm:text-3xl font-light text-[#F5F0E8] mb-4" style={{ fontFamily: "var(--font-cormorant)" }}>{item.title}</h3>
                <p className="text-[#F5F0E8]/50 text-sm leading-relaxed max-w-xs">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ─── CTA ──────────────────────────────────────────────────── */}
      <section className="py-32 bg-[#C9A84C] relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full border-2 border-[#1C2B1E]/10" />
          <div className="absolute bottom-0 right-1/4 w-56 h-56 rounded-full border-2 border-[#1C2B1E]/8" />
          <div className="absolute top-1/2 right-10 w-32 h-32 rounded-full bg-[#E8C96A]/40 blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="font-mono text-[0.6rem] uppercase tracking-[0.4em] text-[#1C2B1E]/60 mb-6">Gratis kennismakingsgesprek</motion.p>
            <motion.h2 variants={fadeUp} className="text-5xl sm:text-6xl md:text-8xl font-light text-[#1C2B1E] mb-6 leading-none" style={{ fontFamily: "var(--font-cormorant)" }}>
              Klaar om Bali te<br /><span className="italic">ontdekken?</span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-[#1C2B1E]/65 mb-12 text-lg leading-relaxed max-w-xl mx-auto">
              Plan een gratis kennismakingsgesprek met een van onze Bali-experts en ontdek hoe wij jouw droomreis werkelijkheid maken.
            </motion.p>
            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="magnetic-btn inline-flex items-center justify-center gap-2 px-12 py-5 bg-[#1C2B1E] text-[#C9A84C] text-xs tracking-[0.3em] uppercase hover:bg-[#243628]">
                Start jouw reis <IconArrowUpRight className="h-4 w-4" strokeWidth={2.2} />
              </Link>
              <Link href="/villas" className="magnetic-btn inline-flex items-center justify-center gap-2 px-12 py-5 border-2 border-[#1C2B1E]/30 text-[#1C2B1E] text-xs tracking-[0.3em] uppercase hover:border-[#1C2B1E] hover:bg-[#1C2B1E]/5">
                Bekijk Villa&apos;s <IconArrowRight className="h-4 w-4" strokeWidth={2.2} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
