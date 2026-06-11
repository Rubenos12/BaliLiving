import { MetadataRoute } from "next";
import { fetchVillas } from "@/lib/actions/villas-fetch";
import { createServiceClient } from "@/lib/supabase/server";

const BASE = "https://www.baliliving.nl";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE}/villas`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/tours`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/transfers`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/restaurants`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
    { url: `${BASE}/over-ons`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/visum`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacybeleid`, lastModified: now, changeFrequency: "yearly", priority: 0.3 },
  ];

  let villaRoutes: MetadataRoute.Sitemap = [];
  try {
    const villas = await fetchVillas();
    villaRoutes = villas.map((v) => ({
      url: `${BASE}/villas/${v.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.85,
    }));
  } catch {}

  let tourRoutes: MetadataRoute.Sitemap = [];
  try {
    const supabase = createServiceClient();
    const { data: tours } = await supabase
      .from("tours")
      .select("slug, updated_at")
      .eq("published", true);
    tourRoutes = (tours ?? []).map((t: { slug: string; updated_at: string }) => ({
      url: `${BASE}/tours/${t.slug}`,
      lastModified: new Date(t.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch {}

  return [...staticRoutes, ...villaRoutes, ...tourRoutes];
}
