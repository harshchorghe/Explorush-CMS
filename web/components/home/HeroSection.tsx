"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

type HeroSlide = {
  image?: {
    asset?: {
      url?: string;
    };
  };
  caption?: string;
  subtitle?: string;
};

type HeroSectionProps = {
  hero: {
    title?: string;
    images?: HeroSlide[];
  } | null;
  authorBio?: string;
};

export default function HeroSection({ hero, authorBio }: HeroSectionProps) {
  // Only extract slideshow images from the CMS hero schema
  const slides = hero?.images?.map((s) => s.image?.asset?.url).filter(Boolean) || [];
  
  // Use static default travel images only if the hero document in CMS is not configured yet
  const defaultPlaceholders = [
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1800&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1800&q=80",
    "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1800&q=80"
  ];
  
  const imageUrls = slides.length > 0 ? slides : defaultPlaceholders;

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (imageUrls.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % imageUrls.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imageUrls.length]);

  return (
    <section className="relative min-h-[80vh] md:min-h-[85vh] flex items-center justify-start overflow-hidden border-b border-primary/10 bg-primary/10">
      {/* Background Slideshow (Fills entire screen) */}
      <div className="absolute inset-0 w-full h-full z-0 select-none">
        <AnimatePresence>
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={imageUrls[currentIndex] || ""}
              alt="Harsh Chorghe travel photo"
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </motion.div>
        </AnimatePresence>
        
        {/* Soft dark overlays to enhance contrast for the text on the left card */}
        <div className="absolute inset-0 bg-primary/10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Content Panel (Floating Green Card on the Left) */}
      <div className="relative z-20 w-full max-w-7xl mx-auto px-6 md:px-12 py-16 md:py-24">
        <div className="w-full max-w-lg bg-primary/95 md:bg-primary/90 md:backdrop-blur-md text-cream p-8 md:p-14 rounded-3xl shadow-2xl border border-white/10 space-y-8 animate-fadeIn">
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-accent font-bold font-sans">
              Explorer Portfolio
            </span>
            <h1 className="text-4xl md:text-5xl font-serif font-bold leading-tight tracking-tight">
              Explore Your <br />
              <span className="text-accent">Travel Story.</span>
            </h1>
            <p className="text-cream/80 text-sm md:text-base leading-relaxed font-sans font-medium">
              {authorBio
                ? `${authorBio.slice(0, 180)}...`
                : "Discover off-grid treks, hidden city streets, local cultures, and unfiltered journals from roads less traveled."}
            </p>
          </div>

          <div className="flex flex-wrap gap-4 pt-2">
            <Link
              href="/trips"
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-primary font-sans font-semibold text-xs tracking-widest uppercase rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Explore Trips
            </Link>
            <Link
              href="/blogs"
              className="px-6 py-3 border border-cream/20 hover:border-accent hover:text-accent font-sans font-semibold text-xs tracking-widest uppercase rounded-lg transition-all duration-300 backdrop-blur-sm"
            >
              Read Stories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
