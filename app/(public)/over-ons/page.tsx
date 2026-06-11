import type { Metadata } from "next";
import OverOnsClient from "./OverOnsClient";

export const metadata: Metadata = {
  title: "Over Ons",
  description: "Leer Edwin & Citty kennen — de gedreven Bali-fanaten achter BaliLiving. Met een diep lokaal netwerk zorgen zij voor jouw perfecte Bali-ervaring.",
  alternates: { canonical: "https://www.baliliving.nl/over-ons" },
  openGraph: {
    title: "Over Ons — BaliLiving",
    description: "Edwin & Citty — Bali-fanaten met een diep lokaal netwerk. Jouw perfecte Bali-reis, van begin tot eind.",
    url: "https://www.baliliving.nl/over-ons",
  },
};

export default function OverOnsPage() {
  return <OverOnsClient />;
}
