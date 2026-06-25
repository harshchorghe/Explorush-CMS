import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminAuthWrapper from "@/components/admin/AdminAuthWrapper";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminAuthWrapper>
      <div className="flex flex-col md:flex-row bg-cream min-h-screen text-charcoal font-sans">
        <AdminSidebar />

        <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </AdminAuthWrapper>
  );
}