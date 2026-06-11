import type { Metadata } from "next";
import { fetchVillas } from "@/lib/actions/villas-fetch";
import VillasClient from "./VillasClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Luxe Villa's op Bali",
  description: "Ontdek onze exclusieve villa's op Bali. Van romantische hideaways in Ubud tot strandvilla's in Seminyak — persoonlijk geselecteerd door BaliLiving.",
  alternates: { canonical: "https://www.baliliving.nl/villas" },
  openGraph: {
    title: "Luxe Villa's op Bali — BaliLiving",
    description: "Exclusieve villa's op Bali, persoonlijk geselecteerd. Privépools, strandligging, chef-service en meer.",
    url: "https://www.baliliving.nl/villas",
  },
};

export default async function VillasPage() {
  const villas = await fetchVillas();
  return <VillasClient villas={villas} />;
}
