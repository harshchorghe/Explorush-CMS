"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DropdownItem {
  label: string;
  href: string;
}

interface NavDropdownProps {
  triggerText: string;
  items: DropdownItem[];
  mode: "desktop" | "mobile";
  onItemClick?: () => void;
}

export default function NavDropdown({
  triggerText,
  items,
  mode,
  onItemClick,
}: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside (desktop only)
  useEffect(() => {
    if (mode !== "desktop") return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [mode]);

  const handleMouseEnter = () => {
    if (mode === "desktop") {
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (mode === "desktop") {
      setIsOpen(false);
    }
  };

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setIsOpen(!isOpen);
    } else if (e.key === "Escape") {
      setIsOpen(false);
      // Try to return focus to the trigger button
      const button = containerRef.current?.querySelector("button");
      if (button instanceof HTMLElement) {
        button.focus();
      }
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // If focus leaves the container, close the dropdown
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
    }
  };

  const handleLinkClick = () => {
    setIsOpen(false);
    if (onItemClick) {
      onItemClick();
    }
  };

  if (mode === "desktop") {
    return (
      <div
        ref={containerRef}
        className="relative inline-block text-left"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onBlur={handleBlur}
      >
        <button
          onClick={handleToggle}
          onKeyDown={handleKeyDown}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="px-6 py-2.5 bg-accent hover:bg-accent/90 text-primary font-sans font-semibold tracking-wider text-xs uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 flex items-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
        >
          <span>{triggerText}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-300 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 8, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-64 bg-cream/95 backdrop-blur-md border border-primary/10 rounded-xl shadow-xl py-2 z-50 overflow-hidden origin-top-right"
              role="menu"
            >
              {items.map((item, index) => (
                <Link
                  key={index}
                  href={item.href}
                  onClick={handleLinkClick}
                  className="flex items-center w-full px-5 py-3 text-left font-sans text-xs tracking-widest uppercase font-semibold text-charcoal/70 hover:text-primary hover:bg-accent/25 transition-all duration-300 border-b border-primary/5 last:border-0 outline-none focus-visible:bg-accent/25 focus-visible:text-primary"
                  role="menuitem"
                >
                  {item.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Mobile Mode (inline accordion)
  return (
    <div ref={containerRef} className="w-full">
      <button
        onClick={handleToggle}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className="w-full py-3 bg-accent text-primary font-sans font-semibold tracking-wider text-xs uppercase rounded-lg shadow-md flex items-center justify-center gap-2 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
      >
        <span>{triggerText}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden flex flex-col gap-1 w-full mt-2 pl-2"
            role="menu"
          >
            {items.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={handleLinkClick}
                className="w-full py-2.5 px-4 font-sans text-xs tracking-widest uppercase font-semibold text-charcoal/70 hover:text-primary transition-colors border-b border-primary/5 last:border-0 outline-none"
                role="menuitem"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
