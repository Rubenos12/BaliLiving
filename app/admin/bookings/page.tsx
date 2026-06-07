import { createServiceClient } from "@/lib/supabase/server";
import BookingsClient from "./BookingsClient";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  let bookings: any[] = [];

  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("created_at", { ascending: false });
    bookings = data ?? [];
  } catch {
    // Supabase not configured yet — show empty state
  }

  return <BookingsClient bookings={bookings} />;
}
