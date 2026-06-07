"use server";

import { createClient } from "@/lib/supabase/server";

export type ContactInquiryPayload = {
  naam: string;
  email: string;
  telefoon?: string;
  interesse?: string;
  reisdatum?: string;
  bericht: string;
};

export async function createContactInquiry(payload: ContactInquiryPayload) {
  const supabase = await createClient();

  if (!payload.naam || !payload.email || !payload.bericht) {
    return { error: "Naam, e-mail en bericht zijn verplicht." };
  }

  const { error } = await supabase.from("contact_inquiries").insert([
    {
      naam: payload.naam,
      email: payload.email,
      telefoon: payload.telefoon || "",
      interesse: payload.interesse || "",
      reisdatum: payload.reisdatum || "",
      bericht: payload.bericht,
    },
  ]);

  if (error) return { error: error.message };
  return { success: true };
}
