"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, BookOpen, Tv, ArrowLeft, Calendar } from "lucide-react";

const links = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Trips",
    href: "/admin/trips",
    icon: Compass,
  },
  {
    title: "Upcoming Tours",
    href: "/admin/upcoming-tours",
    icon: Calendar,
  },
  {
    title: "Blogs",
    href: "/admin/blogs",
    icon: BookOpen,
  },
  {
    title: "Vlogs",
    href: "/admin/vlogs",
    icon: Tv,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-primary border-r border-secondary/20 text-cream min-h-screen flex flex-col justify-between p-6 shrink-0">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <span className="w-3.5 h-3.5 rounded-full bg-accent animate-pulse block"></span>
          <h2 className="text-xl font-serif font-bold tracking-wider text-cream">Explorush Admin</h2>
        </div>

        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href || (link.href !== "/admin" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-semibold ${
                  isActive
                    ? "bg-accent text-primary shadow-md shadow-accent/10"
                    : "text-cream/70 hover:text-cream hover:bg-white/10"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-cream/70"}`} />
                {link.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-cream/70 hover:text-cream hover:bg-white/10 transition-all duration-300 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}