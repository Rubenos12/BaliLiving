"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { requireAdminUser } from "./admin-auth";

export type BookingPayload = {
  villa_id: string;
  villa_name: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  guest_count: number;
  check_in: string;
  check_out: string;
  total_nights: number;
  total_price: number;
  notes: string;
};

export async function createBooking(payload: BookingPayload) {
  const supabase = createServiceClient();

  // Validate dates
  const checkIn = new Date(payload.check_in);
  const checkOut = new Date(payload.check_out);

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
    .eq("id", payload.villa_id)
    .eq("published", true)
    .single();

  if (!villa) {
    return { error: "Villa niet gevonden." };
  }

  if (payload.guest_count < 1 || payload.guest_count > villa.guests_max) {
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
    .eq("villa_id", payload.villa_id)
    .in("blocked_date", dates);

  if (blocked && blocked.length > 0) {
    return { error: "Een of meer geselecteerde datums zijn niet meer beschikbaar." };
  }

  const { data, error } = await supabase
    .from("bookings")
    .insert([
      {
        villa_id: payload.villa_id,
        villa_name: villa.name,
        guest_name: payload.guest_name.trim(),
        guest_email: payload.guest_email.trim().toLowerCase(),
        guest_phone: payload.guest_phone.trim(),
        guest_count: payload.guest_count,
        check_in: payload.check_in,
        check_out: payload.check_out,
        total_nights,
        total_price, // server-calculated, not from client
        notes: payload.notes.trim(),
        status: "pending",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Booking insert error:", error);
    return { error: "Er is iets misgegaan. Probeer het opnieuw of neem contact op." };
  }

  // Send push notification to admin devices (fire and forget)
  void sendPushToAdminDevices(supabase, {
    title: "Nieuwe boekingsaanvraag",
    body: `${payload.guest_name} wil ${villa.name} boeken (${total_nights} nachten)`,
    data: { bookingId: data.id },
  });

  return { data };
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

  return { success: true };
}
