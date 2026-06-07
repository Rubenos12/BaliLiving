import Link from "next/link";
import { signOut } from "./_actions/signOut";

export const metadata = {
  title: "Admin — BaliLiving",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F1A10] flex">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-[#131E14] border-r border-[#C9A84C]/15 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-6 border-b border-[#C9A84C]/15">
          <Link href="/admin" className="flex flex-col">
            <span
              className="text-lg font-light tracking-[0.15em] text-[#F5F0E8]"
              style={{ fontFamily: "var(--font-cormorant)" }}
            >
              Bali<span className="text-[#C9A84C]">Living</span>
            </span>
            <span className="text-[0.55rem] tracking-[0.3em] text-[#C9A84C]/60 uppercase mt-0.5">
              Admin Panel
            </span>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {[
            { href: "/admin", label: "Dashboard", icon: "◈" },
            { href: "/admin/bookings", label: "Boekingen", icon: "◉" },
            { href: "/admin/villas", label: "Villa's", icon: "◎" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 text-sm text-[#F5F0E8]/60 hover:text-[#C9A84C] hover:bg-[#1C2B1E] rounded transition-all duration-200"
            >
              <span className="text-[#C9A84C]/50">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Bottom */}
        <div className="px-6 py-5 border-t border-[#C9A84C]/15 space-y-3">
          <Link
            href="/"
            className="block text-xs text-[#F5F0E8]/35 hover:text-[#C9A84C] transition-colors tracking-wider"
            target="_blank"
          >
            ↗ Bekijk website
          </Link>
          <form action={signOut}>
            <button
              type="submit"
              className="block text-xs text-[#F5F0E8]/35 hover:text-[#C9A84C] transition-colors tracking-wider w-full text-left"
            >
              Uitloggen
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
