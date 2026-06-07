"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireAdminUser } from "./admin-auth";

export type VisaPayload = {
  applicant_name: string;
  applicant_email: string;
  applicant_phone?: string;
  nationality: string;
  passport_number?: string;
  passport_expiry?: string;
  travel_date: string;
  return_date: string;
  num_travelers: number;
  visa_type: "tourist" | "business" | "social" | "other";
  notes?: string;
};

// Public — used by the customer-facing application form (no auth required)
export async function createVisaApplication(payload: VisaPayload) {
  // Basic validation
  if (!payload.applicant_name?.trim() || !payload.applicant_email?.trim()) {
    return { error: "Naam en e-mailadres zijn verplicht." };
  }
  if (!payload.nationality?.trim()) {
    return { error: "Nationaliteit is verplicht." };
  }
  if (!payload.travel_date || !payload.return_date) {
    return { error: "Reisdatums zijn verplicht." };
  }
  const travel = new Date(payload.travel_date);
  const ret = new Date(payload.return_date);
  if (isNaN(travel.getTime()) || isNaN(ret.getTime()) || ret <= travel) {
    return { error: "Ongeldige reisdatums." };
  }
  if (payload.num_travelers < 1 || payload.num_travelers > 20) {
    return { error: "Aantal reizigers moet tussen 1 en 20 zijn." };
  }

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("visa_applications")
    .insert([
      {
        applicant_name: payload.applicant_name.trim(),
        applicant_email: payload.applicant_email.trim().toLowerCase(),
        applicant_phone: payload.applicant_phone?.trim() ?? null,
        nationality: payload.nationality.trim(),
        passport_number: payload.passport_number?.trim() ?? null,
        passport_expiry: payload.passport_expiry ?? null,
        travel_date: payload.travel_date,
        return_date: payload.return_date,
        num_travelers: payload.num_travelers,
        visa_type: payload.visa_type,
        notes: payload.notes?.trim() ?? null,
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Visa application insert error:", error);
    return { error: "Er is iets misgegaan. Probeer het opnieuw." };
  }

  return { data };
}

// Admin-only
export async function getVisaApplications() {
  await requireAdminUser();

  const supabase = createServiceClient();
  const { data, error } = await supabase
    .from("visa_applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

// Admin-only
export async function updateVisaStatus(
  id: string,
  status: "pending" | "in_progress" | "approved" | "rejected",
  adminNotes?: string
) {
  await requireAdminUser();

  const supabase = createServiceClient();
  const updatePayload: Record<string, string> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (adminNotes !== undefined) {
    updatePayload.admin_notes = adminNotes;
  }

  const { error } = await supabase
    .from("visa_applications")
    .update(updatePayload)
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}

// Admin-only
export async function deleteVisaApplication(id: string) {
  await requireAdminUser();

  const supabase = createServiceClient();
  const { error } = await supabase
    .from("visa_applications")
    .delete()
    .eq("id", id);

  if (error) return { error: error.message };
  return { success: true };
}
