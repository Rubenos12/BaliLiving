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
