"use server";

import { createClient } from "@/lib/supabase/server";

export type TransferRequestPayload = {
  from_location: string;
  to_location: string;
  transfer_date: string;
  transfer_time: string;
  passengers: number;
  tier: "normaal" | "luxe" | "vip";
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  notes?: string;
  ai_recommendation?: string;
  estimated_travel_time?: string;
  luggage?: string;
  occasion?: string;
};

export async function createTransferRequest(payload: TransferRequestPayload) {
  const supabase = await createClient();

  if (!payload.from_location || !payload.to_location) {
    return { error: "Vertrek- en aankomstlocatie zijn verplicht." };
  }
  if (!payload.transfer_date) {
    return { error: "Datum is verplicht." };
  }
  if (!payload.guest_name || !payload.guest_email || !payload.guest_phone) {
    return { error: "Naam, e-mail en telefoonnummer zijn verplicht." };
  }

  const { data, error } = await supabase
    .from("transfer_requests")
    .insert([
      {
        from_location: payload.from_location,
        to_location: payload.to_location,
        transfer_date: payload.transfer_date,
        transfer_time: payload.transfer_time || null,
        passengers: payload.passengers,
        tier: payload.tier,
        guest_name: payload.guest_name,
        guest_email: payload.guest_email,
        guest_phone: payload.guest_phone,
        notes: payload.notes || "",
        ai_recommendation: payload.ai_recommendation || "",
        estimated_travel_time: payload.estimated_travel_time || "",
        luggage: payload.luggage || "",
        occasion: payload.occasion || "",
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}
