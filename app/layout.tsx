import type { Metadata, Viewport } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

const BASE_URL = "https://www.balivoornederlanders.nl";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "BaliVoorNederlanders — Jouw Exclusieve Bali Ervaring",
    template: "%s — BaliVoorNederlanders",
  },
  description: "BaliVoorNederlanders biedt complete ondersteuning voor jouw Bali reis. Boek villa's, tours, restaurants en meer. Exclusief, persoonlijk en op maat gemaakt voor Nederland.",
  keywords: "Bali, villa boeken, tours Bali, restaurants Bali, luxe reizen, BaliVoorNederlanders, Edwin Citty",
  authors: [{ name: "BaliVoorNederlanders" }],
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: BASE_URL,
    siteName: "BaliVoorNederlanders",
    title: "BaliVoorNederlanders — Jouw Exclusieve Bali Ervaring",
    description: "Exclusieve villa's, tours, restaurants en transfers op Bali. Persoonlijk geregeld door Edwin & Citty.",
    images: [{ url: "/og-default.jpg", width: 1200, height: 630, alt: "BaliVoorNederlanders" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "BaliVoorNederlanders — Jouw Exclusieve Bali Ervaring",
    description: "Exclusieve villa's, tours, restaurants en transfers op Bali.",
    images: ["/og-default.jpg"],
  },
  robots: { index: true, follow: true },
  alternates: { canonical: BASE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="nl"
      className={`${inter.variable} ${cormorant.variable} h-full`}
    >
      <body className="min-h-full flex flex-col antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
