"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, X, ShieldAlert } from "lucide-react";

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
  const [selectedTourUrl, setSelectedTourUrl] = useState<string | null>(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const [showError, setShowError] = useState(false);
  const router = useRouter();

  const handleReserveClick = (e: React.MouseEvent, url: string, isFilled: boolean) => {
    if (isFilled) {
      return;
    }
    e.preventDefault();
    setSelectedTourUrl(url);
    setIsAgreed(false);
    setShowError(false);
  };

  const handleProceed = () => {
    if (!isAgreed) {
      setShowError(true);
      return;
    }
    if (selectedTourUrl) {
      router.push(selectedTourUrl);
      setSelectedTourUrl(null);
    }
  };

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
                    onClick={(e) => handleReserveClick(e, tour.slug?.current ? `/upcoming-tours/${tour.slug.current}` : "/upcoming-tours", isFilled)}
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

      {selectedTourUrl && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-cream border border-secondary/35 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative p-6 space-y-5 text-charcoal">
            {/* Close Button */}
            <button
              onClick={() => setSelectedTourUrl(null)}
              className="p-1.5 rounded-full text-charcoal/60 hover:text-primary hover:bg-secondary/20 transition-all duration-300 absolute top-4 right-4 cursor-pointer outline-none"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-2 text-center pt-2">
              <div className="mx-auto w-12 h-12 bg-accent/15 rounded-full flex items-center justify-center text-accent mb-1">
                <Check className="w-6 h-6 text-primary stroke-[3]" />
              </div>
              <h3 className="font-serif font-bold text-xl text-primary">
                Policy & Booking Consent
              </h3>
              <p className="text-xs text-charcoal/60 leading-relaxed max-w-xs mx-auto">
                Before proceeding with your reservation, please review and accept our platform policies.
              </p>
            </div>

            {/* Checkbox */}
            <div className="flex items-start gap-3 p-4 bg-white border border-primary/10 rounded-xl">
              <input
                type="checkbox"
                id="consent-check"
                checked={isAgreed}
                onChange={(e) => {
                  setIsAgreed(e.target.checked);
                  if (e.target.checked) setShowError(false);
                }}
                className="w-4 h-4 mt-0.5 accent-primary border-primary/20 rounded cursor-pointer shrink-0"
              />
              <label htmlFor="consent-check" className="text-xs text-charcoal/80 font-sans leading-relaxed cursor-pointer select-none font-medium">
                I have read and successfully accepted the{" "}
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-footer-modal", { detail: "terms" }))}
                  className="text-primary hover:text-accent font-semibold underline bg-transparent border-none p-0 cursor-pointer inline font-sans text-xs"
                >
                  Terms of Service
                </button>
                ,{" "}
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-footer-modal", { detail: "privacy" }))}
                  className="text-primary hover:text-accent font-semibold underline bg-transparent border-none p-0 cursor-pointer inline font-sans text-xs"
                >
                  Privacy Policy
                </button>
                , and{" "}
                <button
                  type="button"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-footer-modal", { detail: "refunds" }))}
                  className="text-primary hover:text-accent font-semibold underline bg-transparent border-none p-0 cursor-pointer inline font-sans text-xs"
                >
                  Refund & Cancellation Policy
                </button>
                .
              </label>
            </div>

            {showError && (
              <p className="text-rose-600 text-xs font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                Please accept the terms and policies to continue.
              </p>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setSelectedTourUrl(null)}
                className="flex-1 py-3 border border-primary/20 hover:border-primary text-primary font-sans font-semibold text-xs tracking-widest uppercase rounded-xl transition duration-300 cursor-pointer outline-none"
              >
                Cancel
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 py-3 bg-accent hover:bg-accent/90 text-primary font-sans font-bold text-xs tracking-widest uppercase rounded-xl transition duration-300 shadow-md hover:shadow-lg cursor-pointer outline-none"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
