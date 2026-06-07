"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { signOut } from "./_actions/signOut";

// Inline SVG icons — no external dependency needed
function IconGrid() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" rx="1" opacity={0.9} />
      <rect x="14" y="3" width="7" height="7" rx="1" opacity={0.9} />
      <rect x="3" y="14" width="7" height="7" rx="1" opacity={0.9} />
      <rect x="14" y="14" width="7" height="7" rx="1" opacity={0.9} />
    </svg>
  );
}

function IconClipboard() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
      <rect x="9" y="3" width="6" height="4" rx="1" />
      <path d="M9 12h6M9 16h4" />
    </svg>
  );
}

function IconCalendar() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

function IconHome() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function IconDots() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <circle cx="12" cy="5" r="1" fill="currentColor" />
      <circle cx="12" cy="12" r="1" fill="currentColor" />
      <circle cx="12" cy="19" r="1" fill="currentColor" />
      <path d="M6 5h.01M6 12h.01M6 19h.01M18 5h.01M18 12h.01M18 19h.01" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-5 h-5">
      <path d="M6 6l12 12M6 18L18 6" />
    </svg>
  );
}

const PRIMARY_TABS = [
  { href: "/admin", label: "Dashboard", icon: <IconGrid />, exact: true },
  { href: "/admin/bookings", label: "Boekingen", icon: <IconClipboard /> },
  { href: "/admin/calendar", label: "Kalender", icon: <IconCalendar /> },
  { href: "/admin/villas", label: "Villa's", icon: <IconHome /> },
];

const MORE_ITEMS = [
  { href: "/admin/visums", label: "Visums" },
  { href: "/admin/tours", label: "Tours" },
  { href: "/admin/transfers", label: "Transfers" },
  { href: "/admin/restaurants", label: "Restaurants" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default function AdminMobileNav() {
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const isMoreActive = MORE_ITEMS.some((item) => isActive(item.href));

  return (
    <>
      {/* Slide-up "More" sheet */}
      {moreOpen && (
        <div className="fixed inset-0 z-40 flex flex-col justify-end md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMoreOpen(false)}
          />

          {/* Sheet */}
          <div className="relative bg-[#0F1A10] border-t border-[#C9A84C]/20 rounded-t-2xl pb-24 pt-2 z-50">
            {/* Handle bar */}
            <div className="w-10 h-1 bg-[#C9A84C]/30 rounded-full mx-auto mb-5" />

            <div className="px-5 mb-4">
              <p className="text-[#C9A84C] text-[0.6rem] tracking-[0.35em] uppercase">
                Meer
              </p>
            </div>

            <nav className="px-3 space-y-0.5">
              {MORE_ITEMS.map((item) => {
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMoreOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 rounded-lg text-sm transition-all ${
                      active
                        ? "bg-[#C9A84C]/12 text-[#C9A84C]"
                        : "text-[#F5F0E8]/60 hover:bg-[#1C2B1E] active:bg-[#1C2B1E]"
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

            <div className="mx-3 mt-4 pt-4 border-t border-[#C9A84C]/10 space-y-0.5">
              <Link
                href="/"
                target="_blank"
                onClick={() => setMoreOpen(false)}
                className="flex items-center gap-4 px-4 py-3.5 text-sm text-[#F5F0E8]/35 hover:text-[#C9A84C] rounded-lg hover:bg-[#1C2B1E] transition-all"
              >
                <span className="text-xs">↗</span>
                Bekijk website
              </Link>
              <form action={signOut}>
                <button
                  type="submit"
                  className="w-full flex items-center gap-4 px-4 py-3.5 text-sm text-[#F5F0E8]/35 hover:text-red-400 rounded-lg hover:bg-[#1C2B1E] transition-all text-left"
                >
                  <span className="text-xs">→</span>
                  Uitloggen
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Bottom tab bar — only on mobile */}
      <nav className="fixed bottom-0 inset-x-0 z-30 bg-[#0F1A10]/95 backdrop-blur-md border-t border-[#C9A84C]/15 md:hidden">
        {/* Safe area for iPhone home indicator */}
        <div className="flex items-center justify-around px-2 pt-2 pb-[env(safe-area-inset-bottom,8px)]">
          {PRIMARY_TABS.map((tab) => {
            const active = isActive(tab.href, tab.exact);
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[56px] rounded-xl transition-all duration-150 active:scale-95 ${
                  active
                    ? "text-[#C9A84C]"
                    : "text-[#F5F0E8]/35 hover:text-[#F5F0E8]/70"
                }`}
              >
                {tab.icon}
                <span className="text-[0.6rem] tracking-wider">{tab.label}</span>
                {active && (
                  <span className="w-1 h-1 rounded-full bg-[#C9A84C] -mt-0.5" />
                )}
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(!moreOpen)}
            className={`flex flex-col items-center gap-1 px-3 py-2 min-w-[56px] rounded-xl transition-all duration-150 active:scale-95 ${
              isMoreActive || moreOpen
                ? "text-[#C9A84C]"
                : "text-[#F5F0E8]/35 hover:text-[#F5F0E8]/70"
            }`}
          >
            {moreOpen ? <IconClose /> : <IconDots />}
            <span className="text-[0.6rem] tracking-wider">Meer</span>
            {(isMoreActive && !moreOpen) && (
              <span className="w-1 h-1 rounded-full bg-[#C9A84C] -mt-0.5" />
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
