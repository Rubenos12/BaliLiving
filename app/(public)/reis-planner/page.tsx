import type { Metadata } from "next";
import ReisPlannerClient from "./ReisPlannerClient";

export const metadata: Metadata = {
  title: "Reis Planner — Stel jouw Bali reis samen | BaliVoorNederlanders",
  description: "Laat onze AI jouw perfecte Bali-reis samenstellen. Van villa tot tours en restaurants — een persoonlijk reisplan in seconden.",
};

export default function ReisPlannerPage() {
  return (
    <main className="min-h-screen bg-[#131E14]">
      {/* Hero */}
      <section className="relative pt-28 sm:pt-40 pb-12 bg-[#131E14] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1A10] to-[#131E14]" />
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full border border-[#C9A84C]/5 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">AI Reis Planner</p>
          <h1
            className="text-5xl sm:text-7xl md:text-8xl font-light text-[#F5F0E8] leading-none mb-6"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Jouw Bali
            <br />
            <span className="italic text-[#C9A84C]">droomreis</span>
          </h1>
          <p className="text-[#F5F0E8]/55 text-lg max-w-xl mx-auto leading-relaxed">
            Vertel ons wanneer je gaat, met wie en wat je zoekt. Edwin & Citty&apos;s AI stelt een persoonlijk reisplan samen — van villa tot restaurants.
          </p>
        </div>
      </section>

      <ReisPlannerClient />
    </main>
  );
}
