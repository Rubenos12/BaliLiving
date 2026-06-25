"use client";

import { motion, Variants } from "framer-motion";
import { useState } from "react";
import { createVisaApplication } from "@/lib/actions/visums";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } },
};

const stagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export default function VisumPage() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [form, setForm] = useState({
    applicant_name: "",
    applicant_email: "",
    applicant_phone: "",
    nationality: "",
    passport_number: "",
    passport_expiry: "",
    travel_date: "",
    return_date: "",
    num_travelers: "1",
    visa_type: "tourist" as "tourist" | "business" | "social" | "other",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "visa_type") {
      setForm({ ...form, visa_type: value as "tourist" | "business" | "social" | "other" });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError("");
    setSubmitting(true);
    const result = await createVisaApplication({
      applicant_name: form.applicant_name,
      applicant_email: form.applicant_email,
      applicant_phone: form.applicant_phone || undefined,
      nationality: form.nationality,
      passport_number: form.passport_number || undefined,
      passport_expiry: form.passport_expiry || undefined,
      travel_date: form.travel_date,
      return_date: form.return_date,
      num_travelers: parseInt(form.num_travelers) || 1,
      visa_type: form.visa_type,
      notes: form.notes || undefined,
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
              Visum Service
            </motion.p>
            <motion.h1
              variants={fadeUp}
              className="text-4xl sm:text-5xl md:text-8xl font-light text-[#F5F0E8] leading-none mb-6"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Visum voor
              <br />
              <span className="italic text-[#C9A84C]">Indonesië</span>
            </motion.h1>
            <motion.p variants={fadeUp} className="text-[#F5F0E8]/60 text-lg max-w-xl leading-relaxed">
              Wij regelen jouw Indonesisch visum snel en zonder gedoe. Vul het formulier in en wij nemen contact op om alles te bevestigen.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Main content */}
      <section className="py-28 max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-5 gap-16">
          {/* Info aside */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={stagger}
            className="md:col-span-2 space-y-10"
          >
            <motion.div variants={fadeUp}>
              <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6">Visum informatie</p>
              <div className="space-y-5">
                {[
                  { label: "Verwerkingstijd", value: "3–5 werkdagen" },
                  { label: "Geldigheid", value: "30 tot 60 dagen" },
                  { label: "Kosten", value: "Vanaf €35 p.p." },
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
              <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6">Wat hebben wij nodig</p>
              <ul className="space-y-3">
                {[
                  "Geldig paspoort (min. 6 maanden geldig)",
                  "Pasfoto (recente foto)",
                  "Vlucht- en hotelbevestiging",
                  "Reisdatums (heen en terug)",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-[#F5F0E8]/55 text-sm">
                    <span className="text-[#C9A84C] text-xs mt-0.5 shrink-0">✦</span>
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div variants={fadeUp} className="border-t border-[#C9A84C]/15 pt-10">
              <p className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">Waarom via BaliVoorNederlanders?</p>
              <p className="text-[#F5F0E8]/50 text-sm leading-relaxed">
                Wij hebben jarenlange ervaring met Indonesische visumaanvragen en werken samen met betrouwbare lokale partners. Geen verrassingen, geen wachtrijen.
              </p>
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
                    Aanvraag ontvangen
                  </h3>
                  <p className="text-[#F5F0E8]/55 leading-relaxed">
                    Bedankt voor je aanvraag. Wij nemen binnen 24 uur contact op om alles te bevestigen en je te informeren over de volgende stappen.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Persoonlijke gegevens */}
                <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase">Persoonlijke gegevens</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      Naam *
                    </label>
                    <input
                      type="text"
                      name="applicant_name"
                      value={form.applicant_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300 placeholder-[#F5F0E8]/20"
                      placeholder="Volledige naam"
                    />
                  </div>
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      E-mailadres *
                    </label>
                    <input
                      type="email"
                      name="applicant_email"
                      value={form.applicant_email}
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
                      name="applicant_phone"
                      value={form.applicant_phone}
                      onChange={handleChange}
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300 placeholder-[#F5F0E8]/20"
                      placeholder="+31 6 ..."
                    />
                  </div>
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      Nationaliteit *
                    </label>
                    <input
                      type="text"
                      name="nationality"
                      value={form.nationality}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300 placeholder-[#F5F0E8]/20"
                      placeholder="bijv. Nederlands"
                    />
                  </div>
                </div>

                {/* Paspoort */}
                <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase pt-2">Paspoort</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      Paspoortnummer
                    </label>
                    <input
                      type="text"
                      name="passport_number"
                      value={form.passport_number}
                      onChange={handleChange}
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300 placeholder-[#F5F0E8]/20"
                      placeholder="NL012345678"
                    />
                  </div>
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      Vervaldatum paspoort
                    </label>
                    <input
                      type="date"
                      name="passport_expiry"
                      value={form.passport_expiry}
                      onChange={handleChange}
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300"
                    />
                  </div>
                </div>

                {/* Reisgegevens */}
                <p className="text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase pt-2">Reisgegevens</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      Reisdatum *
                    </label>
                    <input
                      type="date"
                      name="travel_date"
                      value={form.travel_date}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      Terugreisdatum *
                    </label>
                    <input
                      type="date"
                      name="return_date"
                      value={form.return_date}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      Aantal reizigers *
                    </label>
                    <input
                      type="number"
                      name="num_travelers"
                      value={form.num_travelers}
                      onChange={handleChange}
                      required
                      min={1}
                      max={20}
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                      Visum type *
                    </label>
                    <select
                      name="visa_type"
                      value={form.visa_type}
                      onChange={handleChange}
                      required
                      className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8]/70 px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300"
                    >
                      <option value="tourist">Toerist</option>
                      <option value="business">Zakelijk</option>
                      <option value="social">Sociaal / Familie</option>
                      <option value="other">Anders</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[#C9A84C] text-[0.65rem] tracking-[0.3em] uppercase mb-2">
                    Opmerkingen
                  </label>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    rows={4}
                    className="w-full bg-[#1C2B1E] border border-[#C9A84C]/20 text-[#F5F0E8] px-4 py-3 text-sm focus:outline-none focus:border-[#C9A84C]/60 transition-colors duration-300 placeholder-[#F5F0E8]/20 resize-none"
                    placeholder="Bijzonderheden, vragen of specifieke wensen..."
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
                  {submitting ? "Versturen..." : "Visum aanvragen"}
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
