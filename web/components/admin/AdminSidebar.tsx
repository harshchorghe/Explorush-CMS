"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Compass, BookOpen, Tv, ArrowLeft } from "lucide-react";

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
    <aside className="w-64 bg-slate-900 border-r border-slate-800 text-slate-100 min-h-screen flex flex-col justify-between p-6 shrink-0">
      <div>
        <div className="flex items-center gap-3 mb-10">
          <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 animate-pulse block"></span>
          <h2 className="text-xl font-bold tracking-wider text-white">Explorush Admin</h2>
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
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 font-medium ${
                  isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-white hover:bg-slate-800/50"
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                {link.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div>
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 transition-all duration-300 font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Site
        </Link>
      </div>
    </aside>
  );
}