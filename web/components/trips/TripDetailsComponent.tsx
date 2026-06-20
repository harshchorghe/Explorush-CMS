"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Calendar, Clock, Tag } from "lucide-react";

type ItineraryItem = {
  day: string;
  plan: string;
};

type GalleryItem = {
  url: string;
};

type TripDetails = {
  title: string;
  location?: string;
  type?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  coverImage?: { asset?: { url?: string } };
  gallery?: GalleryItem[];
  itinerary?: ItineraryItem[];
};

export default function TripDetailsComponent({ trip }: { trip: TripDetails }) {
  if (!trip) {
    return (
      <main className="min-h-screen bg-cream flex flex-col justify-center items-center font-sans space-y-4">
        <h2 className="text-2xl font-serif font-bold text-primary">Trip Not Found ❌</h2>
        <Link href="/trips" className="text-accent underline text-sm">
          Return to Trips
        </Link>
      </main>
    );
  }

  const hasGallery = trip.gallery && trip.gallery.length > 0;
  const hasItinerary = trip.itinerary && trip.itinerary.length > 0;

  return (
    <>
      <Navbar />

      <main className="bg-cream text-charcoal min-h-screen font-sans">
        {/* HERO HEADER */}
        <section className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden bg-primary">
          {trip.coverImage?.asset?.url && (
            <Image
              src={trip.coverImage.asset.url}
              alt={trip.title}
              fill
              priority
              className="object-cover opacity-85"
            />
          )}
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/30 to-black/35" />

          {/* Floating Back Link */}
          <div className="absolute top-8 left-6 md:left-12 z-20">
            <Link
              href="/trips"
              className="flex items-center gap-2 px-4 py-2 bg-cream/15 hover:bg-cream/25 text-cream border border-cream/20 backdrop-blur-md rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Trips
            </Link>
          </div>

          {/* Details Overlay */}
          <div className="absolute bottom-16 left-6 right-6 md:left-16 md:right-16 max-w-7xl mx-auto z-10 text-cream space-y-4">
            {trip.type && (
              <span className="inline-flex items-center gap-1 bg-accent text-primary text-[10px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider w-max shadow-md">
                <Tag className="w-3.5 h-3.5" />
                {trip.type}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white max-w-4xl drop-shadow-md">
              {trip.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-cream/80 font-sans pt-2">
              {trip.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-accent fill-accent/10" />
                  {trip.location}
                </span>
              )}
              {trip.startDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent" />
                  {new Date(trip.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {trip.endDate && (
                    <>
                      <span>—</span>
                      {new Date(trip.endDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </>
                  )}
                </span>
              )}
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <section className="max-w-4xl mx-auto px-6 py-20 space-y-16">
          {/* DESCRIPTION CARD */}
          <div className="bg-white border border-primary/10 rounded-3xl p-8 md:p-12 shadow-xl space-y-4">
            <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
              Journal Entry
            </span>
            <h2 className="text-3xl font-serif font-bold text-primary pb-3 border-b border-primary/5">
              About This Journey
            </h2>
            <p className="text-charcoal/80 text-sm md:text-base leading-relaxed font-sans whitespace-pre-line pt-2">
              {trip.description}
            </p>
          </div>

          {/* ITINERARY */}
          {hasItinerary && (
            <div className="space-y-8">
              <div className="border-b border-primary/5 pb-4">
                <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
                  The Blueprint
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-2">
                  Trip Itinerary
                </h2>
              </div>

              <div className="space-y-6 relative border-l border-accent/40 pl-6 ml-4">
                {trip.itinerary!.map((item, idx) => (
                  <div key={idx} className="relative group">
                    {/* Pulsing indicator node */}
                    <span className="absolute -left-[31px] top-1.5 w-4.5 h-4.5 rounded-full bg-accent border-4 border-cream flex items-center justify-center shadow group-hover:scale-125 transition-transform duration-300" />
                    
                    <div className="bg-white border border-primary/10 rounded-2xl p-6 shadow-sm hover:shadow transition-shadow duration-300">
                      <h4 className="font-serif font-bold text-lg text-primary mb-2">
                        {item.day}
                      </h4>
                      <p className="text-sm text-charcoal/70 leading-relaxed font-sans">
                        {item.plan}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* PHOTO GALLERY */}
          {hasGallery && (
            <div className="space-y-8">
              <div className="border-b border-primary/5 pb-4">
                <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
                  Moments
                </span>
                <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-2">
                  Photo Snapshot Gallery
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {trip.gallery!
                  .filter((img) => img && img.url)
                  .map((img, idx) => (
                    <div
                      key={idx}
                      className="relative aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-primary/5 hover:scale-102 transition-all duration-300"
                    >
                      <Image
                        src={img.url}
                        alt={`Trip moment ${idx + 1}`}
                        fill
                        sizes="(max-width: 768px) 100vw, 250px"
                        className="object-cover"
                      />
                    </div>
                  ))}
              </div>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}