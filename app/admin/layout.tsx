import AdminSidebar from "./AdminSidebar";

export const metadata = {
  title: "Admin — BaliLiving",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0F1A10] flex">
      <AdminSidebar />
      <main className="flex-1 overflow-auto min-h-screen">
        {children}
      </main>
    </div>
  );
}
