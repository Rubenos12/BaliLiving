"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdminUser } from "@/lib/actions/admin-auth";

export async function updateTransferRequestStatus(
  id: string,
  status: "confirmed" | "rejected",
  priceQuoted?: number,
  priceType?: "per_person" | "total"
) {
  await requireAdminUser();
  const supabase = await createClient();
  const updates: Record<string, unknown> = { status };
  if (priceQuoted !== undefined && priceType !== undefined) {
    updates.price_quoted = priceQuoted;
    updates.price_type = priceType;
  }
  const { error } = await supabase
    .from("transfer_requests")
    .update(updates)
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
