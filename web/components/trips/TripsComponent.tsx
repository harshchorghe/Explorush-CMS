"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { MapPin, Tag, Compass, Wallet, Share2, Check } from "lucide-react";

type Trip = {
  _id: string;
  title: string;
  slug?: { current?: string };
  location?: string;
  type?: string;
  budget?: string;
  description?: string;
  coverImage?: { asset?: { url?: string } };
};

export default function TripsComponent({ trips }: { trips: Trip[] }) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [copiedTripId, setCopiedTripId] = useState<string | null>(null);

  const handleShareCard = async (trip: Trip) => {
    const shareUrl = `${window.location.origin}/trips/${trip.slug?.current || ""}`;
    const shareData = {
      title: trip.title,
      text: trip.description || `Check out this journey: ${trip.title}`,
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log("Share failed/cancelled:", err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopiedTripId(trip._id);
        setTimeout(() => setCopiedTripId(null), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  const tripTypes = ["all", "trek", "city", "road", "international"];

  const filteredTrips = selectedType === "all" 
    ? trips 
    : trips.filter(t => t.type?.toLowerCase() === selectedType);

  return (
    <>
      <Navbar />

      <main className="bg-cream text-charcoal min-h-screen font-sans">
        {/* HERO HEADER */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
            Journeys
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary">
            Explore Trips & Expeditions
          </h1>
          <p className="text-sm md:text-base text-charcoal/70 max-w-xl mx-auto leading-relaxed">
            Detailed routes, daily plans, gear recommendations, and reflections from custom-mapped trekking trails, road trips, and city expeditions.
          </p>
        </section>

        {/* FILTERS */}
        <section className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex flex-wrap justify-center items-center gap-3">
            {tripTypes.map((type) => (
              <button
                key={type}
                onClick={() => setSelectedType(type)}
                className={`px-5 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 border ${
                  selectedType === type
                    ? "bg-primary text-cream border-primary shadow-md"
                    : "bg-white text-primary border-primary/10 hover:border-primary/30"
                }`}
              >
                {type === "all" ? "All Expeditions" : `${type}s`}
              </button>
            ))}
          </div>
        </section>

        {/* TRIPS GRID */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          {filteredTrips.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-primary/5 p-12 max-w-md mx-auto space-y-4">
              <Compass className="w-12 h-12 text-secondary/30 mx-auto animate-pulse" />
              <h3 className="text-xl font-serif font-bold text-primary">No Trips Logged</h3>
              <p className="text-xs text-charcoal/60 leading-relaxed font-sans">
                We haven't indexed any travel journals matching the "{selectedType}" filter category in the database yet. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map((trip) => (
                <div
                  key={trip._id}
                  className="bg-white rounded-2xl overflow-hidden border border-primary/5 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between group"
                >
                  <div>
                    {/* Image */}
                    <div className="relative h-60 overflow-hidden bg-primary/10">
                      {trip.coverImage?.asset?.url ? (
                        <Image
                          src={trip.coverImage.asset.url}
                          alt={trip.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 380px"
                          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Compass className="w-12 h-12 text-secondary/20" />
                        </div>
                      )}
                      
                      <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                        {trip.type ? (
                          <span className="bg-primary/95 text-accent text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                            <Tag className="w-2.5 h-2.5" />
                            {trip.type}
                          </span>
                        ) : (
                          <div />
                        )}
                        
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleShareCard(trip);
                          }}
                          className="p-2 bg-white/90 hover:bg-white text-primary hover:text-accent rounded-full shadow-md transition-all duration-300 flex items-center justify-center"
                          title="Share trip"
                        >
                          {copiedTripId === trip._id ? (
                            <Check className="w-3.5 h-3.5 text-accent" />
                          ) : (
                            <Share2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-3">
                      {(trip.location || trip.budget) && (
                        <div className="flex flex-wrap items-center gap-3 text-secondary text-[10px] font-bold uppercase tracking-widest font-sans">
                          {trip.location && (
                            <div className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-accent" />
                              {trip.location}
                            </div>
                          )}
                          {trip.budget && (
                            <div className="flex items-center gap-1 bg-secondary/10 px-2.5 py-0.5 rounded-full text-primary">
                              <Wallet className="w-3.5 h-3.5 text-accent" />
                              {trip.budget}
                            </div>
                          )}
                        </div>
                      )}
                      <h3 className="text-xl font-serif font-bold text-primary line-clamp-1 group-hover:text-accent transition-colors duration-200">
                        {trip.title}
                      </h3>
                      {trip.description && (
                        <p className="text-sm text-charcoal/70 line-clamp-3 leading-relaxed font-sans">
                          {trip.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Footer Link & Share */}
                  {/* Footer Link */}
                  <div className="p-6 pt-0 border-t border-primary/5 mt-4">
                    <Link
                      href={trip.slug?.current ? `/trips/${trip.slug.current}` : "/trips"}
                      className="inline-flex items-center gap-2 text-primary font-serif font-bold text-sm hover:text-accent transition-colors duration-200 group"
                    >
                      Open Travel Journal <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}