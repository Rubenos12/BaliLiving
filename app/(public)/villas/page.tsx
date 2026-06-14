import type { Metadata } from "next";
import { fetchVillas } from "@/lib/actions/villas-fetch";
import { getVillaRatingsBatch } from "@/lib/actions/reviews";
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
  const ratings = await getVillaRatingsBatch(villas.map((v) => v.slug));
  const villasWithRatings = villas.map((v) => {
    const r = ratings.get(v.slug);
    return r ? { ...v, avg_rating: r.avg, review_count: r.count } : v;
  });
  return <VillasClient villas={villasWithRatings} />;
}
