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

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function createContactInquiry(payload: ContactInquiryPayload) {
  const supabase = await createClient();

  if (!payload.naam || !payload.email || !payload.bericht) {
    return { error: "Naam, e-mail en bericht zijn verplicht." };
  }
  if (!EMAIL_REGEX.test(payload.email)) {
    return { error: "Ongeldig e-mailadres." };
  }
  if (payload.naam.length > 100) {
    return { error: "Naam mag maximaal 100 tekens bevatten." };
  }
  if (payload.bericht.length > 2000) {
    return { error: "Bericht mag maximaal 2000 tekens bevatten." };
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
