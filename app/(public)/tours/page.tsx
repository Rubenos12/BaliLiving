import { getPublishedTours } from "@/lib/actions/tours";
import ToursClient from "./ToursClient";

export default async function ToursPage() {
  const dbTours = await getPublishedTours();
  return <ToursClient dbTours={dbTours} />;
}
