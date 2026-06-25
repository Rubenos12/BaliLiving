import type { Metadata } from "next";
import OverOnsClient from "./OverOnsClient";

export const metadata: Metadata = {
  title: "Over Ons",
  description: "Leer Edwin & Citty kennen — de gedreven Bali-fanaten achter BaliVoorNederlanders. Met een diep lokaal netwerk zorgen zij voor jouw perfecte Bali-ervaring.",
  alternates: { canonical: "https://www.balivoornederlanders.nl/over-ons" },
  openGraph: {
    title: "Over Ons — BaliVoorNederlanders",
    description: "Edwin & Citty — Bali-fanaten met een diep lokaal netwerk. Jouw perfecte Bali-reis, van begin tot eind.",
    url: "https://www.balivoornederlanders.nl/over-ons",
  },
};

export default function OverOnsPage() {
  return <OverOnsClient />;
}
