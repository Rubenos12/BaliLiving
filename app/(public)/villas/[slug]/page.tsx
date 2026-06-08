import { notFound } from "next/navigation";
import { villas } from "@/lib/villas-data";
import { fetchVillaBySlug } from "@/lib/actions/villas-fetch";
import { getVillaReviews, getVillaAverageRating } from "@/lib/actions/reviews";
import VillaDetailClient from "./VillaDetailClient";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return villas.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const villa = await fetchVillaBySlug(slug);
  if (!villa) return {};
  return {
    title: `${villa.name} — BaliLiving`,
    description: villa.short_description,
  };
}

export default async function VillaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const villa = await fetchVillaBySlug(slug);
  if (!villa) notFound();

  const [reviews, ratingData] = await Promise.allSettled([
    getVillaReviews(slug),
    getVillaAverageRating(slug),
  ]);
  const initialReviews = reviews.status === "fulfilled" ? reviews.value : [];
  const { avg = 0, count = 0 } =
    ratingData.status === "fulfilled" ? ratingData.value : {};

  return (
    <VillaDetailClient
      villa={villa}
      initialReviews={initialReviews}
      averageRating={avg}
      reviewCount={count}
    />
  );
}
