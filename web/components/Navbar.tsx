"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Compass } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Trips", href: "/trips" },
    { name: "Blogs", href: "/blogs" },
    { name: "Vlogs", href: "/vlogs" },
  ];

  const activeClass = "text-primary font-semibold border-b-2 border-accent";
  const inactiveClass = "text-charcoal/70 hover:text-primary transition-all duration-300 hover:border-b-2 hover:border-accent/40";

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-primary/10 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-2xl font-serif font-bold text-primary tracking-wide">
          <Compass className="w-6 h-6 text-accent animate-spin-slow" />
          EXPLORUSH
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-8 font-sans text-sm tracking-widest uppercase">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`pb-1 border-b-2 border-transparent transition-all duration-300 ${
                  isActive ? activeClass : inactiveClass
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button */}
        <div className="hidden md:block">
          <Link
            href="/trips"
            className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-primary font-sans font-semibold tracking-wider text-xs uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            Explore Trips
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-primary hover:text-accent transition-colors duration-300"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-cream border-b border-primary/10 py-6 px-6 shadow-xl flex flex-col gap-6 animate-fadeIn">
          <nav className="flex flex-col gap-4 font-sans text-sm tracking-widest uppercase">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`pb-1 border-b border-transparent w-max ${
                    isActive ? "text-primary font-bold border-accent" : "text-charcoal/70"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>
          <Link
            href="/trips"
            onClick={() => setIsOpen(false)}
            className="w-full text-center py-3 bg-accent text-primary font-sans font-semibold tracking-wider text-xs uppercase rounded-lg shadow-md"
          >
            Explore Trips
          </Link>
        </div>
      )}
    </header>
  );
}
