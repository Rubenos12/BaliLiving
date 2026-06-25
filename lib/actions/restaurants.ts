"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireAdminUser } from "./admin-auth";

type RestaurantData = {
  name: string;
  location: string;
  cuisine: string;
  price_range: string;
  short_description: string;
  long_description: string;
  opening_hours: string;
  phone: string;
  website: string;
  image_url: string;
  tag: string;
  sfeer: string;
  published: boolean;
};

export async function createRestaurant(data: RestaurantData) {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase.from("restaurants").insert([data]);
  if (error) return { error: error.message };
  return { success: true };
}

export async function updateRestaurant(id: string, data: RestaurantData) {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase.from("restaurants").update(data).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function toggleRestaurantPublish(id: string, published: boolean) {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase.from("restaurants").update({ published: !published }).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function deleteRestaurant(id: string) {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase.from("restaurants").delete().eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}

export async function getAllRestaurants() {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { data } = await supabase.from("restaurants").select("*").order("name");
  return data ?? [];
}

export async function getPublishedRestaurants() {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from("restaurants")
    .select("*")
    .eq("published", true)
    .order("created_at", { ascending: true });
  return data ?? [];
}
