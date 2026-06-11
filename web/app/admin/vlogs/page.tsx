import Link from "next/link";

export default function AdminVlogsPage() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <h1>Manage Vlogs</h1>

        <Link
          href="/admin/vlogs/create"
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          + New Vlog
        </Link>
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        Vlogs will appear here.
      </div>
    </div>
  );
}