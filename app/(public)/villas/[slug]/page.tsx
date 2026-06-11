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
  const coverImage = villa.images?.[0] ?? "/og-default.jpg";
  return {
    title: villa.name,
    description: villa.short_description,
    openGraph: {
      title: `${villa.name} — BaliLiving`,
      description: villa.short_description,
      url: `https://www.baliliving.nl/villas/${slug}`,
      images: [{ url: coverImage, width: 1200, height: 800, alt: villa.name }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${villa.name} — BaliLiving`,
      description: villa.short_description,
      images: [coverImage],
    },
    alternates: { canonical: `https://www.baliliving.nl/villas/${slug}` },
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
