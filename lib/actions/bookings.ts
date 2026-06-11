"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireAdminUser } from "./admin-auth";
import { sendBookingConfirmation, sendBookingStatusUpdate } from "@/lib/email";
import { z } from "zod";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const bookingInputSchema = z.object({
  villa_id: z.string().uuid(),
  villa_name: z.string().max(200),
  guest_name: z.string().min(1).max(200).trim(),
  guest_email: z.string().max(320).refine((v) => EMAIL_RE.test(v), "Ongeldig e-mailadres"),
  guest_phone: z.string().max(50),
  guest_count: z.number().int().min(1).max(50),
  check_in: z.string(),
  check_out: z.string(),
  total_nights: z.number(),
  total_price: z.number(),
  notes: z.string().max(3000),
});

export type BookingPayload = z.infer<typeof bookingInputSchema>;

export async function createBooking(payload: BookingPayload) {
  const parsed = bookingInputSchema.safeParse(payload);
  if (!parsed.success) {
    return { error: "Ongeldige invoer: " + parsed.error.issues[0]?.message };
  }
  const input = parsed.data;

  const supabase = createServiceClient();

  // Validate dates
  const checkIn = new Date(input.check_in);
  const checkOut = new Date(input.check_out);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return { error: "Ongeldige datums opgegeven." };
  }
  if (checkOut <= checkIn) {
    return { error: "Check-out moet na check-in zijn." };
  }

  // Compute total_nights server-side — never trust the client
  const msPerDay = 1000 * 60 * 60 * 24;
  const total_nights = Math.round((checkOut.getTime() - checkIn.getTime()) / msPerDay);

  if (total_nights < 1 || total_nights > 90) {
    return { error: "Verblijfsduur moet tussen 1 en 90 nachten zijn." };
  }

  // Fetch villa to verify it exists and calculate real price server-side
  const { data: villa } = await supabase
    .from("villas")
    .select("id, name, price_per_night, guests_max")
    .eq("id", input.villa_id)
    .eq("published", true)
    .single();

  if (!villa) {
    return { error: "Villa niet gevonden." };
  }

  if (input.guest_count < 1 || input.guest_count > villa.guests_max) {
    return { error: `Maximaal ${villa.guests_max} gasten toegestaan voor deze villa.` };
  }

  // Calculate authoritative price server-side
  const total_price = villa.price_per_night * total_nights;

  // Build list of dates to check for conflicts
  const dates: string[] = [];
  for (let d = new Date(checkIn); d < checkOut; d.setDate(d.getDate() + 1)) {
    dates.push(d.toISOString().split("T")[0]);
  }

  const { data: blocked } = await supabase
    .from("blocked_dates")
    .select("blocked_date")
    .eq("villa_id", input.villa_id)
    .in("blocked_date", dates);

  if (blocked && blocked.length > 0) {
    return { error: "Een of meer geselecteerde datums zijn niet meer beschikbaar." };
  }

  const { data: booking, error } = await supabase
    .from("bookings")
    .insert([
      {
        villa_id: input.villa_id,
        villa_name: villa.name,
        guest_name: input.guest_name.trim(),
        guest_email: input.guest_email.trim().toLowerCase(),
        guest_phone: input.guest_phone.trim(),
        guest_count: input.guest_count,
        check_in: input.check_in,
        check_out: input.check_out,
        total_nights,
        total_price, // server-calculated, not from client
        notes: input.notes.trim(),
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Booking insert error:", error);
    return { error: "Er is iets misgegaan. Probeer het opnieuw of neem contact op." };
  }

  // Fire-and-forget: push notification + confirmation email
  void sendPushToAdminDevices(supabase, {
    title: "Nieuwe boekingsaanvraag",
    body: `${input.guest_name} wil ${villa.name} boeken (${total_nights} nachten)`,
    data: { bookingId: booking.id },
  });
  void sendBookingConfirmation({
    id: booking.id,
    guest_name: input.guest_name,
    guest_email: input.guest_email,
    villa_name: villa.name,
    check_in: input.check_in,
    check_out: input.check_out,
    total_nights,
    total_price,
    guest_count: input.guest_count,
  });

  return { data: booking };
}

async function sendPushToAdminDevices(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  notification: { title: string; body: string; data?: Record<string, string> }
) {
  const { data: devices } = await supabase
    .from("admin_devices")
    .select("push_token");

  if (!devices || devices.length === 0) return;

  const messages = devices.map((device: { push_token: string }) => ({
    to: device.push_token,
    sound: "default",
    title: notification.title,
    body: notification.body,
    data: notification.data ?? {},
  }));

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(messages),
  }).catch(() => {
    // Push notification failure must not block booking creation
  });
}

// Admin-only: requires authenticated user
export async function getBookings(status?: string) {
  await requireAdminUser();

  const supabase = createServiceClient();

  let query = supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

// Admin-only: requires authenticated user
export async function updateBookingStatus(
  bookingId: string,
  status: "accepted" | "rejected",
  adminNotes?: string
) {
  await requireAdminUser();

  const supabase = createServiceClient();

  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .single();

  if (fetchError || !booking) {
    return { error: "Boeking niet gevonden." };
  }

  // Before accepting: re-check that the dates are still free (prevent double-booking)
  if (status === "accepted") {
    const start = new Date(booking.check_in);
    const end = new Date(booking.check_out);
    const datesToCheck: string[] = [];
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      datesToCheck.push(d.toISOString().split("T")[0]);
    }

    const { data: alreadyBlocked } = await supabase
      .from("blocked_dates")
      .select("blocked_date")
      .eq("villa_id", booking.villa_id)
      .in("blocked_date", datesToCheck);

    if (alreadyBlocked && alreadyBlocked.length > 0) {
      return { error: "Een of meer datums zijn al geblokkeerd door een andere boeking. Dubbelboeking voorkomen." };
    }
  }

  const { error } = await supabase
    .from("bookings")
    .update({
      status,
      admin_notes: adminNotes || "",
      updated_at: new Date().toISOString(),
    })
    .eq("id", bookingId);

  if (error) return { error: error.message };

  // Block dates when accepted so no other booking can overlap
  if (status === "accepted") {
    const dates: { villa_id: string; blocked_date: string; reason: string }[] = [];
    const start = new Date(booking.check_in);
    const end = new Date(booking.check_out);
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      dates.push({
        villa_id: booking.villa_id,
        blocked_date: d.toISOString().split("T")[0],
        reason: "booking",
      });
    }
    await supabase
      .from("blocked_dates")
      .upsert(dates, { onConflict: "villa_id,blocked_date" });
  }

  // Notify guest of accept/reject (fire and forget)
  void sendBookingStatusUpdate({
    id: bookingId,
    guest_name: booking.guest_name,
    guest_email: booking.guest_email,
    villa_name: booking.villa_name,
    check_in: booking.check_in,
    check_out: booking.check_out,
    status,
    admin_notes: adminNotes,
  });

  return { success: true };
}
