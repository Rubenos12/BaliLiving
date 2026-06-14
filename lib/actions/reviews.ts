"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/actions/admin-auth";
import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const reviewSchema = z.object({
  villa_slug: z.string().min(1).max(100),
  booking_id: z.string().uuid().optional(),
  reviewer_name: z.string().min(1).max(200).trim(),
  reviewer_email: z.string().max(320).refine((v) => EMAIL_RE.test(v), "Ongeldig e-mailadres"),
  rating: z.number().int().min(1).max(5),
  review_text: z.string().min(1).max(5000).trim(),
});

export type ReviewPayload = z.infer<typeof reviewSchema>;

export type VillaReview = {
  id: string;
  villa_slug: string;
  booking_id: string | null;
  reviewer_name: string;
  rating: number;
  review_text: string;
  created_at: string;
};

export async function createReview(payload: ReviewPayload) {
  const parsed = reviewSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: "Ongeldige invoer: " + parsed.error.issues[0]?.message };
  }
  const input = parsed.data;

  const supabase = await createClient();
  const { error } = await supabase.from("villa_reviews").insert([
    {
      villa_slug: input.villa_slug,
      booking_id: input.booking_id ?? null,
      reviewer_name: input.reviewer_name,
      reviewer_email: input.reviewer_email.trim().toLowerCase(),
      rating: input.rating,
      review_text: input.review_text,
      published: false,
    },
  ]);

  if (error) return { error: error.message };
  return { success: true };
}

export async function getVillaReviews(villaSlug: string): Promise<VillaReview[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("villa_reviews")
    .select("id, villa_slug, booking_id, reviewer_name, rating, review_text, created_at")
    .eq("villa_slug", villaSlug)
    .eq("published", true)
    .order("created_at", { ascending: false });
  return (data as VillaReview[]) ?? [];
}

export async function getVillaAverageRating(
  villaSlug: string
): Promise<{ avg: number; count: number }> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("villa_reviews")
    .select("rating")
    .eq("villa_slug", villaSlug)
    .eq("published", true);

  if (!data || data.length === 0) return { avg: 0, count: 0 };
  const avg =
    data.reduce((s: number, r: { rating: number }) => s + r.rating, 0) /
    data.length;
  return { avg: Math.round(avg * 10) / 10, count: data.length };
}

export async function getVillaRatingsBatch(
  slugs: string[]
): Promise<Map<string, { avg: number; count: number }>> {
  if (slugs.length === 0) return new Map();
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("villa_reviews")
    .select("villa_slug, rating")
    .in("villa_slug", slugs)
    .eq("published", true);

  const map = new Map<string, { avg: number; count: number }>();
  if (!data) return map;

  const grouped: Record<string, number[]> = {};
  for (const row of data as { villa_slug: string; rating: number }[]) {
    if (!grouped[row.villa_slug]) grouped[row.villa_slug] = [];
    grouped[row.villa_slug].push(row.rating);
  }
  for (const [slug, ratings] of Object.entries(grouped)) {
    const avg = ratings.reduce((s, r) => s + r, 0) / ratings.length;
    map.set(slug, { avg: Math.round(avg * 10) / 10, count: ratings.length });
  }
  return map;
}

export async function publishReview(id: string, published: boolean) {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase
    .from("villa_reviews")
    .update({ published })
    .eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteReview(id: string) {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase.from("villa_reviews").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
