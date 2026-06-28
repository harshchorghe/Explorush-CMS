"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

type UpcomingTourPreviewItem = {
  _id: string;
  title: string;
  slug?: { current?: string };
  location?: string;
  type?: string;
  price?: string;
  totalSlots?: number;
  bookedSlots?: number;
  startDate?: string;
  endDate?: string;
  coverImage?: { asset?: { url?: string } };
  author?: { name: string };
};

type UpcomingToursProps = {
  upcomingTours: UpcomingTourPreviewItem[];
  author?: { name: string } | null;
};

export default function UpcomingToursSection({ upcomingTours, author }: UpcomingToursProps) {
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
    <section id="upcoming-tours" className="py-12 bg-cream border-t border-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-secondary font-semibold font-sans">
              Join the Adventure
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2">
              Upcoming Group Tours & Events
            </h2>
            <p className="text-charcoal/70 text-sm mt-3 font-sans leading-relaxed max-w-md">
              Connect with our explorer circle. Reserve a slot on group hikes, photography workshops, and virtual meetups.
            </p>
          </div>
          {/* Controls */}
          <div className="flex gap-3">
            <button
              onClick={() => scroll("left")}
              className="p-3 bg-white border border-primary/10 rounded-full text-primary hover:bg-primary hover:text-cream transition-all duration-300 shadow-sm"
              aria-label="Previous tours"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll("right")}
              className="p-3 bg-white border border-primary/10 rounded-full text-primary hover:bg-primary hover:text-cream transition-all duration-300 shadow-sm"
              aria-label="Next tours"
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
          {upcomingTours.length === 0 ? (
            <div className="w-full text-center py-12 text-charcoal/60 font-sans font-medium bg-white/50 border border-primary/5 rounded-2xl">
              No upcoming group tours scheduled at the moment. Check back soon or contact us to plan a custom trip!
            </div>
          ) : (
            upcomingTours.map((tour) => {
              const slotsLeft = (tour.totalSlots || 0) - (tour.bookedSlots || 0);
              const isFilled = slotsLeft <= 0;
              const slotsLabel = isFilled ? "Filled" : `${slotsLeft} slots left`;

              const dateLabel = tour.startDate
                ? `${new Date(tour.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })} — ${new Date(tour.endDate || tour.startDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}`
                : "Flexible dates";

              const priceLabel = tour.price ? `${tour.price} / person` : "Contact Us";

              return (
                <div
                  key={tour._id}
                  className="min-w-[300px] md:min-w-[380px] max-w-[380px] bg-white border border-primary/10 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex-shrink-0 snap-start flex flex-col justify-between"
                >
                  <div>
                    {/* Badge info */}
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-[10px] text-accent bg-primary font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded capitalize">
                        {tour.type || "Expedition"}
                      </span>
                      <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${isFilled ? "text-red-500" : "text-emerald-600"
                        }`}>
                        {slotsLabel}
                      </span>
                    </div>

                    <h3 className="text-2xl font-serif font-bold text-primary mb-2 line-clamp-2 leading-tight min-h-[3.5rem]">
                      {tour.title}
                    </h3>
                    <p className="text-xs text-charcoal/50 uppercase font-sans tracking-wider font-semibold mb-4 truncate">
                      📍 {tour.location || "Online / Flexible"}
                    </p>

                    <ul className="space-y-2 border-t border-primary/5 pt-4 text-sm text-charcoal/70 font-sans mb-6">
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span>Dates: {dateLabel}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span>Cost: {priceLabel}</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-accent" />
                        <span>Guided by {tour.author?.name || author?.name || "Harsh"}</span>
                      </li>
                    </ul>
                  </div>

                  <Link
                    href={tour.slug?.current ? `/upcoming-tours/${tour.slug.current}` : "/upcoming-tours"}
                    className="w-full text-center py-3 bg-primary hover:bg-secondary text-cream text-xs font-sans font-semibold uppercase tracking-wider rounded-lg transition-colors duration-300"
                  >
                    {isFilled ? "View Details" : "Reserve Spot"}
                  </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
