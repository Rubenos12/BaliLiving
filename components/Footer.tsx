import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#131E14] border-t border-[#C9A84C]/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex flex-col mb-6">
              <span
                className="text-2xl font-light tracking-[0.2em] text-[#F5F0E8] uppercase"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                Bali<span className="text-[#C9A84C]">Living</span>
              </span>
              <span className="text-[0.55rem] tracking-[0.35em] text-[#C9A84C] uppercase">
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

          {/* BaliLiving */}
          <div>
            <h4 className="text-[#C9A84C] text-xs tracking-[0.3em] uppercase mb-6">BaliLiving</h4>
            <ul className="space-y-3">
              {[
                { label: "Over Ons", href: "/over-ons" },
                { label: "Contact", href: "/contact" },
                { label: "Veelgestelde Vragen", href: "#" },
                { label: "Reistips", href: "#" },
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
              <li>info@baliliving.nl</li>
              <li>+31 (0)20 123 4567</li>
              <li className="pt-4">
                <div className="flex gap-4">
                  {["Instagram", "Facebook", "WhatsApp"].map((social) => (
                    <Link
                      key={social}
                      href="#"
                      className="text-xs tracking-wider text-[#F5F0E8]/40 hover:text-[#C9A84C] transition-colors duration-300"
                    >
                      {social}
                    </Link>
                  ))}
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-[#C9A84C]/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[#F5F0E8]/30 text-xs tracking-wider">
            © {new Date().getFullYear()} BaliLiving. Alle rechten voorbehouden.
          </p>
          <div className="flex gap-6">
            {["Privacybeleid", "Algemene Voorwaarden"].map((item) => (
              <Link key={item} href="#" className="text-[#F5F0E8]/30 text-xs hover:text-[#C9A84C] transition-colors duration-300">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
