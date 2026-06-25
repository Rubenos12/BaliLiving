"use client";

import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const BASE_NUMBER = "31201234567";

function buildWhatsAppUrl(pathname: string): string {
  let text = "Hallo, ik ben geïnteresseerd in een villa op Bali.";

  const villaMatch = pathname.match(/^\/villas\/([^/]+)/);
  if (villaMatch) {
    const slug = villaMatch[1]
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");
    text = `Hallo, ik ben geïnteresseerd in de villa "${slug}".`;
  } else if (pathname.startsWith("/booking/")) {
    text = "Hallo, ik wil graag een boeking bespreken.";
  } else if (pathname.startsWith("/transfers")) {
    text = "Hallo, ik heb een vraag over transfers op Bali.";
  } else if (pathname.startsWith("/tours")) {
    text = "Hallo, ik heb interesse in een tour op Bali.";
  }

  return `https://wa.me/${BASE_NUMBER}?text=${encodeURIComponent(text)}`;
}

export default function WhatsAppFAB() {
  const pathname = usePathname();
  const url = buildWhatsAppUrl(pathname);

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="WhatsApp ons"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 24, delay: 1.5 }}
      className="fixed right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] shadow-lg shadow-black/30 hover:bg-[#20b858] active:scale-90 transition-colors duration-200 group"
      style={{ bottom: "calc(6rem + env(safe-area-inset-bottom, 0px))" }}
    >
      {/* Tooltip on hover */}
      <span className="absolute right-16 bg-[#1C2B1E] text-[#F5F0E8] text-xs tracking-wider whitespace-nowrap px-3 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
        WhatsApp ons
      </span>
      <svg
        className="w-7 h-7 text-white"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden
      >
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
      </svg>
    </motion.a>
  );
}
