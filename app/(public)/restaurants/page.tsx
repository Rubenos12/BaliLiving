import { getPublishedRestaurants } from "@/lib/actions/restaurants";
import RestaurantsClient from "./RestaurantsClient";

export default async function RestaurantsPage() {
  const dbRestaurants = await getPublishedRestaurants();
  return <RestaurantsClient dbRestaurants={dbRestaurants} />;
}
