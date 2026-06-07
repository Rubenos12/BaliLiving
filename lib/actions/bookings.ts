"use server";

import { createServiceClient } from "@/lib/supabase/server";

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

  // Double-check no conflicting bookings exist for these dates
  const dates: string[] = [];
  const start = new Date(payload.check_in);
  const end = new Date(payload.check_out);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
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
    .insert([{ ...payload, status: "pending" }])
    .select()
    .single();

  if (error) {
    console.error("Booking insert error:", error);
    return { error: "Er is iets misgegaan. Probeer het opnieuw of neem contact op." };
  }

  // Send push notification to all registered admin devices (fire and forget)
  void sendPushToAdminDevices(supabase, {
    title: "Nieuwe boekingsaanvraag",
    body: `${payload.guest_name} wil ${payload.villa_name} boeken (${payload.total_nights} nachten)`,
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
    // Push notification failure must not affect booking creation
  });
}

export async function getBookings(status?: string) {
  const supabase = createServiceClient();

  let query = supabase
    .from("bookings")
    .select("*, villas(name, location)")
    .order("created_at", { ascending: false });

  if (status && status !== "all") {
    query = query.eq("status", status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data;
}

export async function updateBookingStatus(
  bookingId: string,
  status: "accepted" | "rejected",
  adminNotes?: string
) {
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

  // If accepted, block all the dates so no one else can book
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
    await supabase.from("blocked_dates").upsert(dates, { onConflict: "villa_id,blocked_date" });
  }

  return { success: true };
}
