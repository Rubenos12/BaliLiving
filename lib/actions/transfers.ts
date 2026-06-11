"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const transferSchema = z.object({
  from_location: z.string().min(1).max(200).trim(),
  to_location: z.string().min(1).max(200).trim(),
  transfer_date: z.string().min(1),
  transfer_time: z.string(),
  passengers: z.number().int().min(1).max(20),
  tier: z.enum(["normaal", "luxe", "vip"]),
  guest_name: z.string().min(1).max(200).trim(),
  guest_email: z.string().max(320).refine((v) => EMAIL_RE.test(v), "Ongeldig e-mailadres"),
  guest_phone: z.string().min(1).max(50),
  notes: z.string().max(2000).optional(),
  ai_recommendation: z.string().max(1000).optional(),
  estimated_travel_time: z.string().max(100).optional(),
  luggage: z.string().max(20).optional(),
  occasion: z.string().max(50).optional(),
});

export type TransferRequestPayload = z.infer<typeof transferSchema>;

export async function createTransferRequest(payload: TransferRequestPayload) {
  const parsed = transferSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: "Ongeldige invoer: " + parsed.error.issues[0]?.message };
  }
  const input = parsed.data;

  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transfer_requests")
    .insert([
      {
        from_location: input.from_location,
        to_location: input.to_location,
        transfer_date: input.transfer_date,
        transfer_time: input.transfer_time || null,
        passengers: input.passengers,
        tier: input.tier,
        guest_name: input.guest_name,
        guest_email: input.guest_email.trim().toLowerCase(),
        guest_phone: input.guest_phone,
        notes: input.notes || "",
        ai_recommendation: input.ai_recommendation || "",
        estimated_travel_time: input.estimated_travel_time || "",
        luggage: input.luggage || "",
        occasion: input.occasion || "",
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) return { error: error.message };
  return { data };
}
