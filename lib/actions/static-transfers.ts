"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireAdminUser } from "./admin-auth";

type StaticTransferData = {
  name: string;
  from_location: string;
  to_location: string;
  price: number;
  vehicle_type: string;
  max_passengers: number;
  description: string;
  published: boolean;
};

export async function updateStaticTransfer(id: string, data: StaticTransferData) {
  await requireAdminUser();
  const supabase = createServiceClient();
  const { error } = await supabase.from("transfers").update(data).eq("id", id);
  if (error) return { error: error.message };
  return { success: true };
}
