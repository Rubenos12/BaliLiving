import AdminSidebar from "./AdminSidebar";
import AdminMobileNav from "./AdminMobileNav";

export const metadata = {
  title: "Admin — BaliLiving",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
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
