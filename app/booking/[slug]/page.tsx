import { notFound } from "next/navigation";
import { getVillaBySlug } from "@/lib/villas-data";
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

  return (
    <BookingClient
      villa={villa}
      initialCheckIn={sp.checkIn || ""}
      initialCheckOut={sp.checkOut || ""}
      initialGuests={sp.guests ? parseInt(sp.guests) : 2}
    />
  );
}
