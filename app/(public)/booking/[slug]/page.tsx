import { notFound } from "next/navigation";
import { getVillaBySlug } from "@/lib/villas-data";
import { getVillaIdBySlug, getBlockedDates } from "@/lib/actions/villas";
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

  const villaId = (await getVillaIdBySlug(slug)) ?? slug;
  const blockedDates = await getBlockedDates(villaId);

  return (
    <BookingClient
      villa={villa}
      villaId={villaId}
      blockedDates={blockedDates}
      initialCheckIn={sp.checkIn || ""}
      initialCheckOut={sp.checkOut || ""}
      initialGuests={sp.guests ? parseInt(sp.guests) : 2}
    />
  );
}
