import type { Metadata } from "next";
import TransfersClient from "./TransfersClient";

export const metadata: Metadata = {
  title: "Transfers op Bali",
  description: "Boek een privétransfer op Bali. Luchthavenpicks, dagtochten en speciale gelegenheden — in Normaal, Luxe of VIP. Direct geregeld door BaliLiving.",
  alternates: { canonical: "https://www.baliliving.nl/transfers" },
  openGraph: {
    title: "Transfers op Bali — BaliLiving",
    description: "Privétransfers op Bali in Normaal, Luxe of VIP. Luchthaven, dagtochten en speciale gelegenheden.",
    url: "https://www.baliliving.nl/transfers",
  },
};

export default function TransfersPage() {
  return <TransfersClient />;
}
