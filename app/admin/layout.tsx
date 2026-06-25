import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AdminSidebar from "./AdminSidebar";
import AdminMobileNav from "./AdminMobileNav";

export const metadata = {
  title: "Admin — BaliVoorNederlanders",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Defense-in-depth: middleware protects routes, but we verify server-side too
  // to guard against middleware bypass vulnerabilities (e.g. CVE-2025-29927 pattern)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="min-h-screen bg-[#0F1A10] flex">
      {/* Desktop sidebar — hidden on mobile */}
      <AdminSidebar />

      {/* Main content — adds bottom padding on mobile for the fixed tab bar */}
      <main className="flex-1 overflow-auto min-h-screen pb-20 md:pb-0">
        {children}
      </main>

      {/* Mobile bottom navigation — hidden on desktop */}
      <AdminMobileNav />
    </div>
  );
}
