import Link from "next/link";

const IconInstagram = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);


const IconWhatsApp = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-[#131E14] border-t border-[#C9A84C]/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex flex-col mb-6">
              <span
                className="text-xl font-light tracking-[0.12em] text-[#F5F0E8] uppercase"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Bali<span className="text-[#C9A84C]">voor</span>Nederlanders
              </span>
              <span className="text-[0.65rem] tracking-[0.35em] text-[#C9A84C] uppercase">
                Exclusieve Ervaringen
              </span>
            </div>
            <p className="text-[#F5F0E8]/50 text-sm leading-relaxed">
              Opgericht door Edwin & Citty — pure Bali-fanaten met een diep lokaal netwerk. Jouw totaalpakket voor Bali.
            </p>
          </div>

          {/* Diensten */}
          <div>
            <h4 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6">Diensten</h4>
            <ul className="space-y-3">
              {[
                { label: "Villa's Boeken", href: "/villas" },
                { label: "Tours & Excursies", href: "/tours" },
                { label: "Restaurants", href: "/restaurants" },
                { label: "Transfers", href: "/transfers" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#F5F0E8]/60 text-sm hover:text-[#C9A84C] transition-colors duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* BaliVoorNederlanders */}
          <div>
            <h4 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6">BaliVoorNederlanders</h4>
            <ul className="space-y-3">
              {[
                { label: "Over Ons", href: "/over-ons" },
                { label: "Veelgestelde Vragen", href: "/contact" },
                { label: "Contact", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-[#F5F0E8]/60 text-sm hover:text-[#C9A84C] transition-colors duration-300">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6">Contact</h4>
            <ul className="space-y-3 text-[#F5F0E8]/60 text-sm">
              <li>
                <a href="mailto:info@balivoornederlanders.nl" className="hover:text-[#C9A84C] transition-colors duration-300">
                  info@balivoornederlanders.nl
                </a>
              </li>
              <li>
                <a href="tel:+31201234567" className="hover:text-[#C9A84C] transition-colors duration-300">
                  +31 (0)20 123 4567
                </a>
              </li>
              <li className="pt-4">
                <div className="flex gap-2">
                  <a
                    href="https://www.instagram.com/balivoornederlanders"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-10 h-10 flex items-center justify-center text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors duration-300"
                  >
                    <IconInstagram />
                  </a>
                  <a
                    href="https://wa.me/31201234567?text=Hallo%2C%20ik%20ben%20ge%C3%AFnteresseerd%20in%20een%20villa%20op%20Bali."
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="WhatsApp"
                    className="w-10 h-10 flex items-center justify-center text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors duration-300"
                  >
                    <IconWhatsApp />
                  </a>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#C9A84C]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#F5F0E8]/30 text-xs tracking-wider">
            © {new Date().getFullYear()} BaliVoorNederlanders. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6">
            <Link href="/privacybeleid" className="text-[#F5F0E8]/30 text-xs hover:text-[#C9A84C] transition-colors duration-300">
              Privacybeleid
            </Link>
            <Link href="/contact" className="text-[#F5F0E8]/30 text-xs hover:text-[#C9A84C] transition-colors duration-300">
              Algemene Voorwaarden
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
