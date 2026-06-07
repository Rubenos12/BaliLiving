import { notFound } from "next/navigation";
import { getVillaBySlug, villas } from "@/lib/villas-data";
import VillaDetailClient from "./VillaDetailClient";

export async function generateStaticParams() {
  return villas.map((v) => ({ slug: v.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const villa = getVillaBySlug(slug);
  if (!villa) return {};
  return {
    title: `${villa.name} — BaliLiving`,
    description: villa.short_description,
  };
}

export default async function VillaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const villa = getVillaBySlug(slug);
  if (!villa) notFound();
  return <VillaDetailClient villa={villa} />;
}
