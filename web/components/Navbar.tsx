"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Compass, Share2, PhoneCall } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import NavDropdown from "@/components/NavDropdown";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const [activeFormType, setActiveFormType] = useState<"feedback" | "own-website" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [iframeLoading, setIframeLoading] = useState(true);

  // Reset iframe loading when modal toggles
  useEffect(() => {
    if (activeFormType) {
      setIframeLoading(true);
    }
  }, [activeFormType]);

  // Disable body scroll when modal is open
  useEffect(() => {
    if (activeFormType) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [activeFormType]);

  const handleShareModal = async (type: "feedback" | "own-website") => {
    const pagePath = type === "feedback" ? "website-feedback" : "get-your-own-website";
    const shareUrl = `${window.location.origin}/${pagePath}`;

    const shareData = {
      title: type === "feedback" ? "Explorush - Website Feedback" : "Explorush - Get Your Own Website",
      text: type === "feedback"
        ? "Help shape the journey! Provide your feedback for Explorush."
        : "Get your own custom-built premium website! Inquire here.",
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        setToastMessage("Thanks for sharing Explorush!");
        setTimeout(() => setToastMessage(null), 3000);
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          copyUrlToClipboard(shareUrl);
        }
      }
    } else {
      copyUrlToClipboard(shareUrl);
    }
  };

  const copyUrlToClipboard = (url: string) => {
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setToastMessage("Link copied successfully!");
        setTimeout(() => setToastMessage(null), 3000);
      })
      .catch(() => {
        setToastMessage("Failed to copy link.");
        setTimeout(() => setToastMessage(null), 3000);
      });
  };

  const links = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Trips", href: "/trips" },
    { name: "Blogs", href: "/blogs" },
    { name: "Vlogs", href: "/vlogs" },
  ];

  const dropdownItems = [
    {
      label: " Website Feedback",
      href: "/website-feedback",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setActiveFormType("feedback");
      },
    },
    {
      label: " Get Your Own Website",
      href: "/get-your-own-website",
      onClick: (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault();
        setActiveFormType("own-website");
      },
    },
    { label: " Collaborate", href: "/#collaborate" },
    { label: " Trip Registration", href: "/#upcoming-tours" },
  ];

  const activeClass = "text-primary font-semibold border-b-2 border-accent";
  const inactiveClass = "text-charcoal/70 hover:text-primary transition-all duration-300 hover:border-b-2 hover:border-accent/40";

  return (
    <header className="sticky top-0 z-50 bg-cream/90 backdrop-blur-md border-b border-primary/10 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
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
                className={`pb-1 border-b-2 border-transparent transition-all duration-300 ${isActive ? activeClass : inactiveClass
                  }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA Button (Dropdown) & Contact Button */}
        <div className="hidden md:flex items-center gap-2">
          <NavDropdown
            triggerText="Connect & Feedback"
            items={dropdownItems}
            mode="desktop"
          />
          <div className="relative group flex items-center">
            <Link
              href="/contact-us"
              className="p-2 text-charcoal/70 hover:text-primary transition-all duration-300 flex items-center justify-center cursor-pointer outline-none"
              aria-label="Contact"
            >
              <PhoneCall className="w-5 h-5" />
            </Link>
            <span className="absolute top-full left-1/2 -translate-x-1/2 mt-1 px-2 py-1 bg-[#2A2A2A] text-[#F8F4EC] text-[10px] font-sans tracking-wider uppercase font-bold rounded shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
              Contact
            </span>
          </div>
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
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="md:hidden absolute top-full left-0 w-full bg-cream border-b border-primary/10 py-6 px-6 shadow-xl flex flex-col gap-6"
          >
            <nav className="flex flex-col gap-4 font-sans text-sm tracking-widest uppercase">
              {links.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`pb-1 border-b border-transparent w-max ${isActive ? "text-primary font-bold border-accent" : "text-charcoal/70"
                      }`}
                  >
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex flex-col gap-3">
              <NavDropdown
                triggerText="Connect & Feedback"
                items={dropdownItems}
                mode="mobile"
                onItemClick={() => setIsOpen(false)}
              />
              <Link
                href="/contact-us"
                onClick={() => setIsOpen(false)}
                className="w-full py-3 bg-primary hover:bg-primary/95 text-cream hover:text-accent font-sans font-semibold tracking-wider text-xs uppercase rounded-lg shadow-md flex items-center justify-center gap-2 cursor-pointer outline-none transition-all duration-300"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                <span>Contact Us</span>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* POPUP MODAL OVERLAY */}
      <AnimatePresence>
        {activeFormType && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveFormType(null)}
              className="absolute inset-0 bg-charcoal/60 backdrop-blur-sm"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="relative bg-cream border border-primary/10 rounded-2xl shadow-2xl w-full max-h-[90vh] flex flex-col overflow-hidden z-10 transition-all duration-300 max-w-[980px]"
            >
              {/* Modal Header */}
              <div className="px-6 pt-6 pb-4 border-b border-primary/5 flex items-start justify-between">
                <div className="space-y-1 pr-8">
                  <span className="text-[10px] uppercase tracking-widest text-secondary font-bold font-sans">
                    {activeFormType === "feedback" ? "Connect & Feedback" : "Connect & Services"}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-primary">
                    {activeFormType === "feedback" ? "Website Feedback" : "Get Your Own Website"}
                  </h3>
                  <p className="text-charcoal/70 text-xs font-sans leading-relaxed">
                    {activeFormType === "feedback"
                      ? "We'd love to hear your thoughts, suggestions, or reports about your experience on Explorush."
                      : "Looking for a premium, custom-designed website to showcase your brand? Share your vision!"}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => handleShareModal(activeFormType)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-primary/20 hover:border-primary text-primary hover:bg-primary/5 font-sans font-semibold text-xs tracking-widest uppercase rounded-lg transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
                    title="Share this form link"
                  >
                    <Share2 className="w-3.5 h-3.5 text-accent" />
                    <span>Share Form</span>
                  </button>
                  <button
                    onClick={() => setActiveFormType(null)}
                    className="p-1.5 border border-primary/20 hover:border-primary text-primary hover:bg-primary/5 rounded-lg transition-all duration-300 cursor-pointer outline-none"
                    title="Close modal"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Modal Body (Iframe) */}
              <div className="flex-1 overflow-y-auto p-4 bg-white relative min-h-[400px]">
                {iframeLoading && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-white z-10 gap-3">
                    <Compass className="w-8 h-8 text-primary animate-spin-slow" />
                    <p className="text-xs text-charcoal/50 font-sans tracking-widest uppercase font-semibold">Loading Form...</p>
                  </div>
                )}
                <iframe
                  src={
                    activeFormType === "feedback"
                      ? "https://docs.google.com/forms/d/e/1FAIpQLSdKXHGoqY9GC4eBPhaIfVTy8oT3lzW9wA0fV6uKsSwoHnATzQ/viewform?embedded=true"
                      : "https://docs.google.com/forms/d/e/1FAIpQLScQ4HM7s_UF7uAORemyS7ppJnRJ11W6wHWKE7CiPOifInpM7Q/viewform?embedded=true"
                  }
                  width="100%"
                  height="1200"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title={activeFormType === "feedback" ? "Website Feedback Form" : "Get Your Own Website Form"}
                  className="w-full block"
                  loading="lazy"
                  onLoad={() => setIframeLoading(false)}
                >
                  Loading…
                </iframe>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-8 right-8 z-[110] px-6 py-3 bg-primary text-cream rounded-xl shadow-2xl border border-accent/20 flex items-center gap-3 font-sans text-sm font-medium"
          >
            <Compass className="w-4 h-4 text-accent animate-spin-slow" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
