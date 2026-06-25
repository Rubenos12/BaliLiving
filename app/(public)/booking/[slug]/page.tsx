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

  const datePattern = /^\d{4}-\d{2}-\d{2}$/;
  const safeCheckIn = datePattern.test(sp.checkIn ?? "") ? sp.checkIn! : "";
  const safeCheckOut = datePattern.test(sp.checkOut ?? "") ? sp.checkOut! : "";
  const safeGuests = Math.max(1, Math.min(20, parseInt(sp.guests ?? "2") || 2));

  return (
    <BookingClient
      villa={villa}
      villaId={villaId}
      blockedDates={blockedDates}
      initialCheckIn={safeCheckIn}
      initialCheckOut={safeCheckOut}
      initialGuests={safeGuests}
    />
  );
}
