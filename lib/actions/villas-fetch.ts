import { createServiceClient } from "@/lib/supabase/server";
import { villas as staticVillas } from "@/lib/villas-data";
import type { Villa } from "@/lib/villas-data";

type MediaRow = { url: string; sort_order: number; type: string };

function buildVilla(v: Record<string, unknown>, mediaRows: MediaRow[]): Villa {
  const mediaImages = mediaRows
    .filter((m) => m.type === "photo")
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((m) => m.url);
  const fallback = staticVillas.find((s) => s.slug === v.slug);
  const images = mediaImages.length > 0 ? mediaImages : (fallback?.images ?? []);
  return {
    slug: v.slug as string,
    name: v.name as string,
    location: v.location as string,
    region: v.region as string,
    guests_min: v.guests_min as number,
    guests_max: v.guests_max as number,
    bedrooms: v.bedrooms as number,
    bathrooms: v.bathrooms as number,
    tag: v.tag as string,
    short_description: v.short_description as string,
    long_description: v.long_description as string,
    price_per_night: v.price_per_night as number,
    amenities: (v.amenities as string[]) ?? [],
    highlights: (v.highlights as string[]) ?? [],
    cover_icon: (v.cover_icon as string) ?? "🏡",
    images,
    published: v.published as boolean,
  };
}

export async function fetchVillas(): Promise<Villa[]> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("villas")
      .select("*, villa_media(url, sort_order, type)")
      .eq("published", true)
      .order("created_at", { ascending: true });
    if (!data || data.length === 0) return staticVillas;
    return data.map((v: Record<string, unknown>) => buildVilla(v, (v.villa_media as MediaRow[]) ?? []));
  } catch {
    return staticVillas;
  }
}

export async function fetchVillaBySlug(slug: string): Promise<Villa | null> {
  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("villas")
      .select("*, villa_media(url, sort_order, type)")
      .eq("slug", slug)
      .single();
    if (!data) return staticVillas.find((v) => v.slug === slug) ?? null;
    return buildVilla(data, data.villa_media ?? []);
  } catch {
    return staticVillas.find((v) => v.slug === slug) ?? null;
  }
}
