import Link from "next/link";
import { villas } from "@/lib/villas-data";

export default function AdminVillasPage() {
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1
            className="text-3xl font-light text-[#F5F0E8]"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Villa&apos;s
          </h1>
          <p className="text-[#F5F0E8]/40 text-sm mt-1">
            {villas.length} villa&apos;s in de collectie
          </p>
        </div>
        <Link
          href="/admin/villas/new"
          className="px-5 py-2.5 bg-[#C9A84C] text-[#1C2B1E] text-xs tracking-[0.25em] uppercase hover:bg-[#E8C96A] transition-all duration-200"
        >
          + Nieuwe villa
        </Link>
      </div>

      <div className="space-y-3">
        {villas.map((villa) => (
          <div
            key={villa.slug}
            className="bg-[#1C2B1E] border border-[#C9A84C]/15 hover:border-[#C9A84C]/30 transition-all duration-200 flex items-center gap-6 p-5"
          >
            {/* Icon */}
            <div className="w-14 h-14 bg-[#243628] flex items-center justify-center text-2xl shrink-0">
              {villa.cover_icon}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1">
                <h3 className="text-[#F5F0E8] font-light" style={{ fontFamily: "var(--font-cormorant)" }}>
                  {villa.name}
                </h3>
                <span className="bg-[#C9A84C] text-[#1C2B1E] text-[0.55rem] tracking-[0.2em] uppercase px-2 py-0.5">
                  {villa.tag}
                </span>
                <span className="text-[0.6rem] tracking-wider text-green-400 uppercase bg-green-400/10 border border-green-400/25 px-2 py-0.5">
                  Gepubliceerd
                </span>
              </div>
              <div className="flex flex-wrap gap-4 text-[#F5F0E8]/40 text-xs">
                <span>📍 {villa.location}</span>
                <span>{villa.bedrooms} slpk · {villa.bathrooms} badk</span>
                <span>{villa.guests_min}–{villa.guests_max} gasten</span>
                <span className="text-[#C9A84C]">€{villa.price_per_night}/nacht</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href={`/villas/${villa.slug}`}
                target="_blank"
                className="px-3 py-2 border border-[#C9A84C]/20 text-[#C9A84C] text-[0.6rem] tracking-wider uppercase hover:bg-[#C9A84C]/10 transition-colors"
              >
                Bekijken
              </Link>
              <Link
                href={`/admin/villas/${villa.slug}`}
                className="px-3 py-2 border border-[#C9A84C]/20 text-[#F5F0E8]/50 text-[0.6rem] tracking-wider uppercase hover:border-[#C9A84C]/50 hover:text-[#C9A84C] transition-colors"
              >
                Bewerken
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
