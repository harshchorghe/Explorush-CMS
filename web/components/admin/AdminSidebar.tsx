"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    title: "Dashboard",
    href: "/admin",
  },
  {
    title: "Trips",
    href: "/admin/trips",
  },
  {
    title: "Blogs",
    href: "/admin/blogs",
  },
  {
    title: "Vlogs",
    href: "/admin/vlogs",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      style={{
        width: "250px",
        background: "#111827",
        color: "white",
        minHeight: "100vh",
        padding: "24px",
      }}
    >
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "bold",
          marginBottom: "40px",
        }}
      >
        Explorush Admin
      </h2>

      <nav>
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            style={{
              display: "block",
              padding: "12px",
              marginBottom: "10px",
              borderRadius: "8px",
              background:
                pathname === link.href ? "#2563eb" : "transparent",
              color: "white",
              textDecoration: "none",
            }}
          >
            {link.title}
          </Link>
        ))}
      </nav>
    </aside>
  );
}