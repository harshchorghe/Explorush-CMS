"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  Tv,
  ArrowLeft,
  Calendar,
  Briefcase,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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
  {
    title: "Collaborations",
    href: "/admin/collaboration",
    icon: Briefcase,
  },
  {
    title: "Media Kit",
    href: "/admin/media-kit",
    icon: FileText,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  // Auto-close menu when navigating
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll behind when mobile sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const SidebarContent = () => (
    <>
      <div className="flex flex-col flex-1">
        <div className="flex items-center gap-3 mb-10">
          <span className="w-3.5 h-3.5 rounded-full bg-accent animate-pulse block"></span>
          <h2 className="text-xl font-serif font-bold tracking-wider text-cream">
            Explorush Admin
          </h2>
        </div>

        <nav className="space-y-1 flex-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive =
              pathname === link.href ||
              (link.href !== "/admin" && pathname.startsWith(link.href));
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
                <Icon
                  className={`w-5 h-5 ${isActive ? "text-primary" : "text-cream/70"}`}
                />
                {link.title}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-8 pt-4 border-t border-cream/10">
        <Link
          href="/"
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-cream/70 hover:text-cream hover:bg-white/10 transition-all duration-300 font-semibold"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Site
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sticky Top Header */}
      <div className="md:hidden w-full bg-primary text-cream flex items-center justify-between px-6 py-4 border-b border-secondary/20 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <span className="w-3.5 h-3.5 rounded-full bg-accent animate-pulse"></span>
          <h2 className="text-lg font-serif font-bold tracking-wider text-cream">
            Explorush Admin
          </h2>
        </div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-cream hover:text-accent transition-colors duration-200 cursor-pointer"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Desktop Persistent Sidebar (sticky to left screen) */}
      <aside className="hidden md:flex w-64 bg-primary border-r border-secondary/20 text-cream min-h-screen flex-col justify-between p-6 shrink-0 sticky top-0 h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Menu Drawer Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-charcoal/60 backdrop-blur-sm z-40 md:hidden"
            />
            {/* Drawer */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-primary text-cream flex flex-col justify-between p-6 z-50 shadow-2xl md:hidden"
            >
              <div className="absolute top-4 right-4 md:hidden">
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-cream hover:text-accent transition-colors duration-200 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}