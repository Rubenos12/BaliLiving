"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "./_actions/signOut";

const NAV = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/bookings", label: "Boekingen" },
  { href: "/admin/calendar", label: "Kalender" },
  { href: "/admin/visums", label: "Visums" },
  { href: "/admin/analytics", label: "Analytics" },
  { href: "/admin/villas", label: "Villa's" },
  { href: "/admin/tours", label: "Tours" },
  { href: "/admin/transfers", label: "Transfers" },
  { href: "/admin/restaurants", label: "Restaurants" },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    // Hidden on mobile — AdminMobileNav handles navigation there
    <aside className="hidden md:flex w-60 shrink-0 bg-[#0F1A10] border-r border-[#C9A84C]/12 flex-col">
      {/* Brand */}
      <div className="px-6 pt-8 pb-6 border-b border-[#C9A84C]/10">
        <Link href="/admin" className="block">
          <span
            className="text-base font-light tracking-[0.08em] text-[#F5F0E8] uppercase"
            style={{ fontFamily: "var(--font-cormorant)" }}
          >
            Bali<span className="text-[#C9A84C]">voor</span>Nederlanders
          </span>
          <p className="text-[0.55rem] tracking-[0.35em] text-[#C9A84C]/50 uppercase mt-1">
            Beheer
          </p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5">
        {NAV.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm rounded transition-all duration-150 ${
                active
                  ? "bg-[#C9A84C]/12 text-[#C9A84C] font-medium"
                  : "text-[#F5F0E8]/50 hover:text-[#F5F0E8]/80 hover:bg-[#1C2B1E]"
              }`}
            >
              <span
                className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                  active ? "bg-[#C9A84C]" : "bg-[#F5F0E8]/15"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-5 py-5 border-t border-[#C9A84C]/10 space-y-1">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-2 px-4 py-2 text-xs text-[#F5F0E8]/35 hover:text-[#C9A84C] transition-colors tracking-wide rounded hover:bg-[#1C2B1E]"
        >
          <span>↗</span> Bekijk website
        </Link>
        <form action={signOut}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-4 py-2 text-xs text-[#F5F0E8]/35 hover:text-red-400 transition-colors tracking-wide rounded hover:bg-[#1C2B1E] text-left"
          >
            <span>→</span> Uitloggen
          </button>
        </form>
      </div>
    </aside>
  );
}
