import { fetchVillas } from "@/lib/actions/villas-fetch";
import VillasClient from "./VillasClient";

export const dynamic = "force-dynamic";

export default async function VillasPage() {
  const villas = await fetchVillas();
  return <VillasClient villas={villas} />;
}
