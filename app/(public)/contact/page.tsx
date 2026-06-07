"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { createContactInquiry } from "@/lib/actions/contact";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    naam: "",
    email: "",
    telefoon: "",
    interesse: "",
    reisdatum: "",
    bericht: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    const result = await createContactInquiry({
      naam: form.naam,
      email: form.email,
      telefoon: form.telefoon,
      interesse: form.interesse,
      reisdatum: form.reisdatum,
      bericht: form.bericht,
    });
    setSubmitting(false);
    if (result.error) {
      setSubmitError(result.error);
      return;
    }
    setSubmitted(true);
  };

  return (
    <>
      {/* Hero */}
      <section className="relative pt-28 sm:pt-40 md:pt-44 pb-16 sm:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0F1A10] to-[#1C2B1E]" />
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full border border-[#C9A84C]/10" />
        <div className="relative max-w-7xl mx-auto px-6">
          <motion.div variants={stagger} initial="hidden" animate="show">
            <motion.p variants={fadeUp} className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">
              Kom in contact
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-8xl font-light text-[#F5F0E8] leading-none mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Jouw reis
              <br />
              <span className="italic text-[#C9A84C]">begint hier</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/60 text-lg max-w-xl leading-relaxed">
              Vertel Edwin of Citty over jouw Bali droom. Wij nemen binnen 24 uur persoonlijk contact op voor een vrijblijvend gesprek.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact grid */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-16">
          {/* Contact info */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="md:col-span-2 space-y-10"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6">Direct Contact</p>
              <div className="space-y-5">
                {[
                  { label: "Email", value: "info@baliliving.nl" },
                  { label: "Telefoon", value: "+31 (0)20 123 4567" },
                  { label: "WhatsApp", value: "+31 6 12 34 56 78" },
                ].map((item) => (
                  <div key={item.label}>
                    <p className="text-[#F5F0E8]/35 text-xs tracking-[0.2em] uppercase mb-1">{item.label}</p>
                    <p className="text-[#F5F0E8] text-lg font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="border-t border-[#C9A84C]/15 pt-10">
              <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6">Bereikbaar</p>
              <div className="space-y-2 text-[#F5F0E8]/55 text-sm">
                <p>Maandag t/m vrijdag: 09:00–18:00</p>
                <p>Zaterdag: 10:00–15:00</p>
                <p className="text-[#C9A84C]/70">
                  Tijdens uw Bali verblijf: 24/7
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="border-t border-[#C9A84C]/15 pt-10">
              <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6">Volg ons</p>
              <div className="flex gap-4">
                {["Instagram", "Facebook", "YouTube"].map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="text-xs tracking-[0.15em] text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors duration-300"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={fadeUp}
            className="md:col-span-3"
          >
            {submitted ? (
              <div className="h-full flex items-center justify-center text-center border border-[#C9A84C]/20 p-16">
                <div>
                  <div className="text-[#C9A84C] text-5xl mb-6">✦</div>
                  <h3
                    className="text-4xl font-light text-[#F5F0E8] mb-4"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    Bericht ontvangen
                  </h3>
                  <p className="text-[#F5F0E8]/55 leading-relaxed">
                    Bedankt voor je bericht. Edwin of Citty neemt
                    binnen 24 uur persoonlijk contact met je op.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      Naam *
                    </label>
                    <input
                      type="text"
                      name="naam"
                      value={form.naam}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300 placeholder-[#F5F0E8]/20"
                      placeholder="Jouw naam"
                    />
                  </div>
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300 placeholder-[#F5F0E8]/20"
                      placeholder="jouw@email.nl"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      Telefoonnummer
                    </label>
                    <input
                      type="tel"
                      name="telefoon"
                      value={form.telefoon}
                      onChange={handleChange}
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300 placeholder-[#F5F0E8]/20"
                      placeholder="+31 6 ..."
                    />
                  </div>
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      Reisdatum
                    </label>
                    <input
                      type="text"
                      name="reisdatum"
                      value={form.reisdatum}
                      onChange={handleChange}
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300 placeholder-[#F5F0E8]/20"
                      placeholder="bijv. Juli 2025"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                    Interesse in
                  </label>
                  <select
                    name="interesse"
                    value={form.interesse}
                    onChange={handleChange}
                    className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8]/70 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300"
                  >
                    <option value="">Selecteer een dienst</option>
                    <option value="villas">Villa Boeking</option>
                    <option value="tours">Tours & Excursies</option>
                    <option value="transfers">Transfers</option>
                    <option value="restaurants">Restaurant Reserveringen</option>
                    <option value="alles">Complete reis planning</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                    Jouw bericht *
                  </label>
                  <textarea
                    name="bericht"
                    value={form.bericht}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300 placeholder-[#F5F0E8]/20 resize-none"
                    placeholder="Vertel ons over jouw droomreis naar Bali. Hoeveel personen, wat voor verblijf, welke ervaringen..."
                  />
                </div>

                {submitError && (
                  <p className="text-red-400 text-xs text-center">{submitError}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.3em] uppercase font-medium hover:bg-[#E8C96A] transition-all duration-300 disabled:opacity-60"
                >
                  {submitting ? "Versturen..." : "Verstuur Aanvraag"}
                </button>

                <p className="text-[#F5F0E8]/30 text-xs text-center leading-relaxed">
                  Wij nemen binnen 24 uur contact op. Jouw gegevens worden nooit gedeeld met derden.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </section>
    </>
  );
}
