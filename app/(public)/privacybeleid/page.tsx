import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacybeleid",
  description: "Het privacybeleid van BaliLiving — hoe wij omgaan met jouw persoonsgegevens.",
  robots: { index: false },
};

export default function PrivacybeleidPage() {
  return (
    <main className="min-h-screen bg-[#1C2B1E] pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-[#C9A84C] text-xs tracking-[0.4em] uppercase mb-4">Juridisch</p>
        <h1
          className="text-4xl md:text-5xl font-light text-[#F5F0E8] mb-12"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Privacybeleid
        </h1>

        <div className="prose prose-invert max-w-none text-[#F5F0E8]/70 space-y-8 text-sm leading-relaxed">
          <section>
            <h2 className="text-[#F5F0E8] text-xl font-light mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
              1. Wie zijn wij?
            </h2>
            <p>
              BaliLiving is een reisdienstverlener gespecialiseerd in exclusieve villa&apos;s, tours, restaurants en
              transfers op Bali. BaliLiving is opgericht door Edwin &amp; Citty en is bereikbaar via{" "}
              <a href="mailto:info@baliliving.nl" className="text-[#C9A84C] hover:text-[#E8C96A]">
                info@baliliving.nl
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F0E8] text-xl font-light mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
              2. Welke gegevens verzamelen wij?
            </h2>
            <p>Wij verwerken de volgende persoonsgegevens, uitsluitend wanneer jij deze zelf aan ons verstrekt:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Naam en contactgegevens (e-mailadres, telefoonnummer)</li>
              <li>Reisgegevens (villa, data, aantal gasten, notities)</li>
              <li>Betaalgegevens (alleen via onze betalingsprovider — wij slaan geen kaartgegevens op)</li>
              <li>
                Paspoortgegevens (alleen bij visumservice, optioneel en uitsluitend voor de dienstverlening)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-[#F5F0E8] text-xl font-light mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
              3. Waarvoor gebruiken wij jouw gegevens?
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Verwerking en bevestiging van boekingsaanvragen</li>
              <li>Contact opnemen bij vragen of ter bevestiging</li>
              <li>Uitvoering van de visumservice (indien van toepassing)</li>
              <li>Verbetering van onze dienstverlening</li>
            </ul>
            <p className="mt-3">
              Wij verkopen, verhuren of delen jouw gegevens <strong>nooit</strong> met derden voor commerciële
              doeleinden.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F0E8] text-xl font-light mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
              4. Bewaartermijnen
            </h2>
            <p>
              Wij bewaren jouw gegevens niet langer dan noodzakelijk voor de uitvoering van de dienst. Boekingsgegevens
              worden maximaal 2 jaar bewaard ten behoeve van de administratie. Visumgegevens worden direct na
              verwerking van de aanvraag verwijderd. Op verzoek verwijderen wij jouw gegevens eerder.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F0E8] text-xl font-light mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
              5. Beveiliging
            </h2>
            <p>
              Wij nemen passende technische en organisatorische maatregelen om jouw gegevens te beschermen tegen
              ongeautoriseerde toegang, verlies of misbruik. Onze website maakt gebruik van HTTPS-versleuteling.
              Gegevens worden opgeslagen via Supabase, een ISO 27001-gecertificeerde infrastructuur.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F0E8] text-xl font-light mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
              6. Jouw rechten (AVG / GDPR)
            </h2>
            <p>Op grond van de Algemene Verordening Gegevensbescherming (AVG) heb jij het recht op:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Inzage in jouw persoonsgegevens</li>
              <li>Correctie van onjuiste gegevens</li>
              <li>Verwijdering van jouw gegevens (&apos;recht op vergetelheid&apos;)</li>
              <li>Beperking van de verwerking</li>
              <li>Overdraagbaarheid van jouw gegevens</li>
              <li>Bezwaar maken tegen de verwerking</li>
            </ul>
            <p className="mt-3">
              Stuur een e-mail naar{" "}
              <a href="mailto:info@baliliving.nl" className="text-[#C9A84C] hover:text-[#E8C96A]">
                info@baliliving.nl
              </a>{" "}
              om een van deze rechten uit te oefenen. Wij reageren binnen 30 dagen.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F0E8] text-xl font-light mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
              7. Cookies en analyse
            </h2>
            <p>
              Wij maken gebruik van Vercel Analytics voor anonieme bezoekersstatistieken. Er worden geen
              persoonsgegevens opgeslagen en er zijn geen tracking cookies. Er worden geen advertentienetwerken
              gebruikt.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F0E8] text-xl font-light mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
              8. Klachten
            </h2>
            <p>
              Heb je een klacht over de verwerking van jouw gegevens? Je kunt een klacht indienen bij de Autoriteit
              Persoonsgegevens:{" "}
              <span className="text-[#F5F0E8]/50">www.autoriteitpersoonsgegevens.nl</span>.
            </p>
          </section>

          <section>
            <h2 className="text-[#F5F0E8] text-xl font-light mb-3" style={{ fontFamily: "var(--font-cormorant)" }}>
              9. Wijzigingen
            </h2>
            <p>
              Wij kunnen dit privacybeleid van tijd tot tijd bijwerken. De meest actuele versie is altijd beschikbaar
              op deze pagina. Laatste update: juni 2026.
            </p>
          </section>
        </div>

        <div className="mt-16 pt-8 border-t border-[#C9A84C]/10">
          <Link
            href="/"
            className="text-[#C9A84C] text-xs tracking-[0.2em] uppercase hover:text-[#E8C96A] transition-colors"
          >
            ← Terug naar home
          </Link>
        </div>
      </div>
    </main>
  );
}
