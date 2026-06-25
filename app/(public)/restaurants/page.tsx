import type { Metadata } from "next";
import { getPublishedRestaurants } from "@/lib/actions/restaurants";
import RestaurantsClient from "./RestaurantsClient";

export const metadata: Metadata = {
  title: "Restaurants op Bali",
  description: "De beste restaurants op Bali, persoonlijk geselecteerd door BaliVoorNederlanders. Van beachclubs in Seminyak tot rijstterras-diners in Ubud.",
  alternates: { canonical: "https://www.balivoornederlanders.nl/restaurants" },
  openGraph: {
    title: "Restaurants op Bali — BaliVoorNederlanders",
    description: "Persoonlijk geselecteerde restaurants op Bali — van beachclubs tot rijstterras-diners.",
    url: "https://www.balivoornederlanders.nl/restaurants",
  },
};

export default async function RestaurantsPage() {
  const dbRestaurants = await getPublishedRestaurants();
  return <RestaurantsClient dbRestaurants={dbRestaurants} />;
}
