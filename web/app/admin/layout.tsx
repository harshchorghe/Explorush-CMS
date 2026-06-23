import AdminSidebar from "@/components/admin/AdminSidebar";
import PasswordPrompt from "@/components/admin/PasswordPrompt";
import { cookies } from "next/headers";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isAuthenticated = cookieStore.get("admin_session")?.value === "explorush-admin-session-active";

  if (!isAuthenticated) {
    return <PasswordPrompt />;
  }

  return (
    <div className="flex flex-col md:flex-row bg-cream min-h-screen text-charcoal font-sans">
      <AdminSidebar />

      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}