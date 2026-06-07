import { notFound } from "next/navigation";
import { getVillaBySlug } from "@/lib/villas-data";
import { getVillaIdBySlug } from "@/lib/actions/villas";
import BookingClient from "./BookingClient";

export default async function BookingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ checkIn?: string; checkOut?: string; guests?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const villa = getVillaBySlug(slug);
  if (!villa) notFound();

  // Fetch real UUID from Supabase so booking is linked to the correct villa row
  const villaId = (await getVillaIdBySlug(slug)) ?? slug;

  return (
    <BookingClient
      villa={villa}
      villaId={villaId}
      initialCheckIn={sp.checkIn || ""}
      initialCheckOut={sp.checkOut || ""}
      initialGuests={sp.guests ? parseInt(sp.guests) : 2}
    />
  );
}
