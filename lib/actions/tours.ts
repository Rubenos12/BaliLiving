"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireAdminUser } from "./admin-auth";

type TourData = {
  name: string;
  location: string;
  short_description: string;
  long_description: string;
  price_per_person: number;
  duration_hours: number;
  max_guests: number;
  image_url: string;
  tag: string;
  published: boolean;
};

export async function createTour(data: TourData) {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase.from("tours").insert([data]);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateTour(id: string, data: TourData) {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase.from("tours").update(data).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleTourPublish(id: string, published: boolean) {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase.from("tours").update({ published: !published }).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteTour(id: string) {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase.from("tours").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getAllTours() {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { data } = await supabase.from("tours").select("*").order("name");
  return data ?? [];
}

export async function getPublishedTours() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("tours")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: true });
  return data ?? [];
}
