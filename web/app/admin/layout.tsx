import AdminSidebar from "@/components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "flex",
      }}
    >
      <AdminSidebar />

      <main
        style={{
          flex: 1,
          padding: "30px",
          background: "#f5f7fb",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>
    </div>
  );
}