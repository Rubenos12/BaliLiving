import type { Metadata } from "next";
import { getPublishedTours } from "@/lib/actions/tours";
import ToursClient from "./ToursClient";

export const metadata: Metadata = {
  title: "Tours & Excursies op Bali",
  description: "Ontdek Bali met onze exclusieve tours en excursies. Rijstterrassen, tempels, surflessen, spa-dagen en meer — samengesteld door locals.",
  alternates: { canonical: "https://www.balivoornederlanders.nl/tours" },
  openGraph: {
    title: "Tours & Excursies op Bali — BaliVoorNederlanders",
    description: "Exclusieve tours op Bali, samengesteld door locals. Van rijstterrassen tot privé-stranddagen.",
    url: "https://www.balivoornederlanders.nl/tours",
  },
};

export default async function ToursPage() {
  const dbTours = await getPublishedTours();
  return <ToursClient dbTours={dbTours} />;
}
