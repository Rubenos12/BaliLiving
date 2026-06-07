"use server";

import { createServiceClient } from "@/lib/supabase/server";

export async function getVillaIdBySlug(slug: string): Promise<string | null> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("villas")
    .select("id")
    .eq("slug", slug)
    .single();
  return data?.id ?? null;
}

export async function getBlockedDates(villaId: string): Promise<string[]> {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("blocked_dates")
    .select("blocked_date")
    .eq("villa_id", villaId);
  return (data ?? []).map((d: { blocked_date: string }) => d.blocked_date);
}

export async function saveVilla(formData: {
  slug: string;
  name: string;
  location: string;
  region: string;
  tag: string;
  short_description: string;
  long_description: string;
  guests_min: number;
  guests_max: number;
  bedrooms: number;
  bathrooms: number;
  price_per_night: number;
  amenities: string[];
  highlights: string[];
  cover_icon: string;
  published: boolean;
}) {
  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("villas")
    .upsert([{ ...formData, updated_at: new Date().toISOString() }], { onConflict: "slug" })
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}

export async function uploadVillaMedia(
  villaId: string,
  file: File,
  type: "photo" | "video"
) {
  const supabase = createServiceClient();
  const ext = file.name.split(".").pop();
  const path = `${villaId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("villa-media")
    .upload(path, file, { contentType: file.type, upsert: false });

  if (uploadError) return { error: uploadError.message };

  const { data: urlData } = supabase.storage
    .from("villa-media")
    .getPublicUrl(path);

  const { error: dbError } = await supabase.from("villa_media").insert([{
    villa_id: villaId,
    url: urlData.publicUrl,
    type,
    sort_order: 0,
  }]);

  if (dbError) return { error: dbError.message };
  return { url: urlData.publicUrl };
}
