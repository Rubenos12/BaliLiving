import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ConciergeChat from "@/components/ConciergeChat";
import WhatsAppFAB from "@/components/WhatsAppFAB";
import BackToTop from "@/components/BackToTop";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#C9A84C] focus:text-[#1C2B1E] focus:text-sm focus:tracking-wider"
      >
        Ga naar inhoud
      </a>
      <Navbar />
      <main id="main-content" className="flex-1">{children}</main>
      <Footer />
      <ConciergeChat />
      <WhatsAppFAB />
      <BackToTop />
    </>
  );
}
