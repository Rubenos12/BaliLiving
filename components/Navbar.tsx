"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

const links = [
  { href: "/villas", label: "Villa's" },
  { href: "/tours", label: "Tours" },
  { href: "/transfers", label: "Transfers" },
  { href: "/restaurants", label: "Restaurants" },
  { href: "/over-ons", label: "Over Ons" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#1C2B1E]/95 backdrop-blur-md border-b border-[#C9A84C]/20 py-4"
            : "bg-transparent py-8"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="group">
            <div className="flex flex-col">
              <span
                className="text-2xl font-light tracking-[0.2em] text-[#F5F0E8] uppercase"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Bali<span className="text-[#C9A84C]">Living</span>
              </span>
              <span className="text-[0.65rem] tracking-[0.35em] text-[#C9A84C] uppercase">
                Exclusieve Ervaringen
              </span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-[0.2em] uppercase transition-colors duration-300 ${
                  pathname === link.href
                    ? "text-[#C9A84C]"
                    : "text-[#F5F0E8]/80 hover:text-[#C9A84C]"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/contact"
              className="ml-4 px-6 py-2.5 border border-[#C9A84C] text-[#C9A84C] text-xs tracking-[0.2em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-300"
            >
              Boek Nu
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-3"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
          >
            <span
              className={`block w-6 h-px bg-[#C9A84C] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
            />
            <span
              className={`block w-6 h-px bg-[#C9A84C] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`block w-6 h-px bg-[#C9A84C] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#1C2B1E] flex flex-col items-center justify-center gap-6 sm:gap-10"
          >
            {links.map((link, i) => (
              <motion.div
                key={link.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
              >
                <Link
                  href={link.href}
                  className={`text-3xl font-light tracking-[0.15em] uppercase ${
                    pathname === link.href ? "text-[#C9A84C]" : "text-[#F5F0E8]"
                  }`}
                  style={{ fontFamily: "var(--font-cormorant)" }}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link
                href="/contact"
                className="mt-4 px-10 py-3 border border-[#C9A84C] text-[#C9A84C] text-xs tracking-[0.3em] uppercase hover:bg-[#C9A84C] hover:text-[#1C2B1E] transition-all duration-300"
              >
                Boek Nu
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
