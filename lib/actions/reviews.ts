"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/actions/admin-auth";

export type ReviewPayload = {
  villa_slug: string;
  booking_id?: string;
  reviewer_name: string;
  reviewer_email: string;
  rating: number;
  review_text: string;
};

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
  if (!payload.reviewer_name || !payload.reviewer_email || !payload.review_text) {
    return { error: "Naam, e-mail en review tekst zijn verplicht." };
  }
  if (payload.rating < 1 || payload.rating > 5) {
    return { error: "Beoordeling moet tussen 1 en 5 zijn." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("villa_reviews").insert([
    {
      villa_slug: payload.villa_slug,
      booking_id: payload.booking_id ?? null,
      reviewer_name: payload.reviewer_name,
      reviewer_email: payload.reviewer_email,
      rating: payload.rating,
      review_text: payload.review_text,
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
