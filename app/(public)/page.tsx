import type { Metadata } from "next";
import { fetchVillas } from "@/lib/actions/villas-fetch";
import HomeClient from "./HomeClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "BaliLiving — Luxe Bali Villa's, Tours & Meer",
  description: "BaliLiving regelt jouw perfecte Bali-reis. Exclusieve villa's, privé tours, de beste restaurants en stijlvolle transfers — volledig ontzorgd.",
  alternates: { canonical: "https://www.baliliving.nl" },
  openGraph: {
    title: "BaliLiving — Bali op zijn best",
    description: "Van luxe villa's en privé tours tot restaurantreserveringen — wij regelen elk detail van jouw perfecte Bali reis.",
    url: "https://www.baliliving.nl",
  },
};

export default async function HomePage() {
  const allVillas = await fetchVillas();
  const featuredVillas = allVillas.slice(0, 3);
  return <HomeClient villas={featuredVillas} />;
}
