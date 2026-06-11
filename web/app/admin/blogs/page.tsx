import Link from "next/link";

export default function AdminBlogsPage() {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "30px",
        }}
      >
        <h1>Manage Blogs</h1>

        <Link
          href="/admin/blogs/create"
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          + New Blog
        </Link>
      </div>

      <div
        style={{
          background: "white",
          padding: "20px",
          borderRadius: "12px",
        }}
      >
        Blogs will appear here.
      </div>
    </div>
  );
}