"use server";

import { createClient } from "@/lib/supabase/server";

export async function updateTransferRequestStatus(
  id: string,
  status: "confirmed" | "rejected"
) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("transfer_requests")
    .update({ status })
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
