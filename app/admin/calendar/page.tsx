import { createServiceClient } from "@/lib/supabase/server";
import CalendarClient from "./CalendarClient";

export const dynamic = "force-dynamic";

export default async function AdminCalendarPage() {
  let bookings: any[] = [];

  try {
    const supabase = createServiceClient();
    const { data } = await supabase
      .from("bookings")
      .select("*")
      .order("check_in", { ascending: true });
    bookings = data ?? [];
  } catch {
    // Supabase not configured yet — show empty state
  }

  return <CalendarClient bookings={bookings} />;
}
