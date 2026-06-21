"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, MapPin, Tag } from "lucide-react";

type Trip = {
  _id: string;
  title: string;
  slug?: { current?: string };
  location?: string;
  type?: string;
  description?: string;
  coverImage?: { asset?: { url?: string } };
};

export default function FeaturedDestinations({ trips }: { trips: Trip[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl rounded-2xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-secondary font-semibold font-sans">
              Destinations
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2">
              Featured Journeys
            </h2>
          </div>
          {/* Controls */}
          <div className="flex  gap-4">
            <button
              onClick={() => scroll("left")}
              className="p-3 bg-white border border-primary/10 rounded-full text-primary hover:bg-primary hover:text-cream transition-all duration-300 shadow-sm"
              aria-label="Previous destination"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 bg-white border border-primary/10 rounded-full text-primary hover:bg-primary hover:text-cream transition-all duration-300 shadow-sm"
              aria-label="Next destination"
            >
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-none pb-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="min-w-[300px] md:min-w-[380px] max-w-[380px] bg-white rounded-2xl overflow-hidden border border-primary/5 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex-shrink-0 snap-start flex flex-col group"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                {trip.coverImage?.asset?.url ? (
                  <Image
                    src={trip.coverImage.asset.url}
                    alt={trip.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 380px"
                    className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                ) : (
                  <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                    <MapPin className="w-12 h-12 text-secondary/30" />
                  </div>
                )}
                {/* Overlay Badge */}
                {trip.type && (
                  <div className="absolute top-4 left-4 bg-primary/95 text-accent text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-md">
                    <Tag className="w-3 h-3" />
                    {trip.type}
                  </div>
                )}
              </div>

              {/* Body */}
              <div className="p-6 flex-grow flex flex-col justify-between">
                <div>
                  {trip.location && (
                    <div className="flex items-center gap-1 text-secondary text-xs font-semibold uppercase tracking-widest mb-2 font-sans">
                      <MapPin className="w-3.5 h-3.5 text-accent" />
                      {trip.location}
                    </div>
                  )}
                  <h3 className="text-2xl font-serif font-bold text-primary mb-3 line-clamp-1 group-hover:text-accent transition-colors duration-300">
                    {trip.title}
                  </h3>
                  {trip.description && (
                    <p className="text-sm text-charcoal/80 leading-relaxed line-clamp-3 font-sans">
                      {trip.description}
                    </p>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-primary/5">
                  <Link
                    href={trip.slug?.current ? `/trips/${trip.slug.current}` : "/trips"}
                    className="inline-flex items-center gap-2 text-primary font-serif font-bold hover:text-accent transition-colors duration-300 text-sm"
                  >
                    Read Journal Story <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
