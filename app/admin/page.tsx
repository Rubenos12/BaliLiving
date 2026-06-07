import Link from "next/link";
import { villas } from "@/lib/villas-data";

// Placeholder stats — will come from Supabase
const stats = [
  { label: "Openstaande aanvragen", value: "0", color: "text-yellow-400" },
  { label: "Bevestigde boekingen", value: "0", color: "text-green-400" },
  { label: "Totaal villa's", value: String(villas.length), color: "text-[#C9A84C]" },
  { label: "Omzet deze maand", value: "€0", color: "text-[#C9A84C]" },
];

const quickActions = [
  { href: "/admin/bookings", label: "Bekijk alle boekingen", icon: "◉" },
  { href: "/admin/villas/new", label: "Nieuwe villa toevoegen", icon: "+" },
  { href: "/admin/villas", label: "Villa's beheren", icon: "◎" },
];

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1
          className="text-3xl font-light text-[#F5F0E8]"
          style={{ fontFamily: "var(--font-cormorant)" }}
        >
          Dashboard
        </h1>
        <p className="text-[#F5F0E8]/40 text-sm mt-1">
          Welkom, Edwin & Citty. Hier is een overzicht van vandaag.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-[#1C2B1E] border border-[#C9A84C]/15 p-5">
            <div
              className={`text-3xl font-light mb-1 ${s.color}`}
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              {s.value}
            </div>
            <div className="text-[#F5F0E8]/40 text-xs tracking-wider">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="mb-8">
        <h2 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-4">Snelle acties</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-3 bg-[#1C2B1E] border border-[#C9A84C]/15 hover:border-[#C9A84C]/40 p-4 transition-all duration-200"
            >
              <span className="text-[#C9A84C] text-lg w-6 text-center">{a.icon}</span>
              <span className="text-[#F5F0E8]/70 text-sm">{a.label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Setup notice */}
      <div className="bg-[#1C2B1E] border border-[#C9A84C]/20 p-6">
        <h3 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-3">Volgende stap: Supabase koppelen</h3>
        <p className="text-[#F5F0E8]/55 text-sm leading-relaxed mb-4">
          De admin is gereed. Koppel Supabase om boekingen op te slaan, foto&apos;s te uploaden
          en de beschikbaarheidskalender te activeren. Vraag Edwin of Citty om de setup te voltooien.
        </p>
        <div className="space-y-2 text-sm text-[#F5F0E8]/40">
          <p>1. Maak een Supabase project aan op supabase.com</p>
          <p>2. Voeg NEXT_PUBLIC_SUPABASE_URL en NEXT_PUBLIC_SUPABASE_ANON_KEY toe aan Vercel</p>
          <p>3. Vraag de developer om de database tabellen aan te maken</p>
        </div>
      </div>
    </div>
  );
}
