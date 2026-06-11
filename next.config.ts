import type { NextConfig } from "next";

const CSP = [
  "default-src 'self'",
  // Scripts: Next.js inline runtime + Vercel Analytics
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  // Styles: Tailwind inline styles + Google Fonts
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  // Fonts
  "font-src 'self' https://fonts.gstatic.com data:",
  // Images: self, Supabase storage, Unsplash
  "img-src 'self' data: blob: https://brzjuxkyvrrqalafreoh.supabase.co https://images.unsplash.com",
  // API calls: Supabase, Anthropic, Expo push
  "connect-src 'self' https://brzjuxkyvrrqalafreoh.supabase.co wss://brzjuxkyvrrqalafreoh.supabase.co https://api.anthropic.com https://exp.host https://va.vercel-scripts.com",
  // Frames: deny everything
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "Content-Security-Policy", value: CSP },
];

const nextConfig: NextConfig = {
  transpilePackages: ["gsap", "lucide-react"],
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "brzjuxkyvrrqalafreoh.supabase.co",
      },
    ],
  },
};

export default nextConfig;
