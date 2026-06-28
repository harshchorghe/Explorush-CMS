"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, MapPin, Calendar, Clock, Tag, Share2, Check, XCircle, AlertCircle, User, Info, X, Loader2 } from "lucide-react";

type ItineraryItem = {
  day: string;
  plan: string;
};

type GalleryItem = {
  url: string;
};

type UpcomingTourDetails = {
  _id?: string;
  title: string;
  location?: string;
  type?: string;
  price?: string;
  totalSlots?: number;
  bookedSlots?: number;
  description?: string;
  startDate?: string;
  endDate?: string;
  coverImage?: { asset?: { url?: string } };
  gallery?: GalleryItem[];
  itinerary?: ItineraryItem[];
  guidelines?: string[];
  included?: string[];
  excluded?: string[];
  author?: { name: string; image?: { asset?: { url?: string } } };
};

export default function UpcomingTourDetailsComponent({ tour }: { tour: UpcomingTourDetails }) {
  const [copied, setCopied] = useState(false);
  const [localBookedSlots, setLocalBookedSlots] = useState(tour?.bookedSlots || 0);

  // Modal & Form States
  const [showDemoInfoModal, setShowDemoInfoModal] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [parentPhone, setParentPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState<string | null>(null);

  if (!tour) {
    return (
      <main className="min-h-screen bg-cream flex flex-col justify-center items-center font-sans space-y-4">
        <h2 className="text-2xl font-serif font-bold text-primary">Event / Tour Not Found ❌</h2>
        <Link href="/" className="text-accent underline text-sm">
          Return to Home Page
        </Link>
      </main>
    );
  }

  const slotsLeft = (tour.totalSlots || 0) - localBookedSlots;
  const isFilled = slotsLeft <= 0;
  const hasGallery = tour.gallery && tour.gallery.length > 0;
  const hasItinerary = tour.itinerary && tour.itinerary.length > 0;
  const hasGuidelines = tour.guidelines && tour.guidelines.length > 0;
  const hasIncluded = tour.included && tour.included.length > 0;
  const hasExcluded = tour.excluded && tour.excluded.length > 0;

  async function handleShare() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  }

  async function handleBookingSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!tour._id) return;

    try {
      setSubmitting(true);
      setBookingError(null);

      const res = await fetch("/api/upcoming-tours/book-slot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tourId: tour._id,
          name,
          email,
          phone,
          parentPhone,
          address,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setBookingSuccess(true);
        setLocalBookedSlots(data.updatedBookedSlots);
        // Clear form values
        setName("");
        setEmail("");
        setPhone("");
        setParentPhone("");
        setAddress("");
      } else {
        setBookingError(data.error || "Failed to reserve spot");
      }
    } catch (err: any) {
      console.error(err);
      setBookingError("An unexpected error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="bg-cream text-charcoal min-h-screen font-sans pb-20 lg:pb-0">
        {/* HERO HEADER */}
        <section className="relative h-[55vh] md:h-[65vh] w-full overflow-hidden bg-primary">
          {tour.coverImage?.asset?.url && (
            <Image
              src={tour.coverImage.asset.url}
              alt={tour.title}
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
              href="/"
              className="flex items-center gap-2 px-4 py-2 bg-cream/15 hover:bg-cream/25 text-cream border border-cream/20 backdrop-blur-md rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-colors duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
          </div>

          {/* Details Overlay */}
          <div className="absolute bottom-16 left-6 right-6 md:left-16 md:right-16 max-w-7xl mx-auto z-10 text-cream space-y-4">
            {tour.type && (
              <span className="inline-flex items-center gap-1 bg-accent text-primary text-[10px] md:text-xs font-semibold px-3.5 py-1.5 rounded-full uppercase tracking-wider w-max shadow-md">
                <Tag className="w-3.5 h-3.5" />
                {tour.type}
              </span>
            )}
            <h1 className="text-4xl md:text-6xl font-serif font-bold tracking-tight text-white max-w-4xl drop-shadow-md">
              {tour.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-cream/80 font-sans pt-2">
              {tour.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-accent fill-accent/10" />
                  {tour.location}
                </span>
              )}
              {tour.startDate && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent" />
                  {new Date(tour.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  {tour.endDate && (
                    <>
                      <span>—</span>
                      {new Date(tour.endDate).toLocaleDateString("en-US", {
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
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Content Column */}
            <div className="lg:col-span-2 space-y-12">
              {/* DESCRIPTION CARD */}
              <div className="bg-white border border-primary/10 rounded-3xl p-8 md:p-12 shadow-md space-y-4">
                <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
                  The Journey Plan
                </span>
                <h2 className="text-3xl font-serif font-bold text-primary pb-3 border-b border-primary/5">
                  About This Expedition
                </h2>
                <p className="text-charcoal/80 text-sm md:text-base leading-relaxed font-sans whitespace-pre-line pt-2">
                  {tour.description || "No overview available for this event."}
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
                      Event Itinerary
                    </h2>
                  </div>

                  <div className="space-y-6 relative border-l border-accent/40 pl-6 ml-4">
                    {tour.itinerary!.map((item, idx) => (
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

              {/* GUIDELINES */}
              {hasGuidelines && (
                <div className="space-y-8">
                  <div className="border-b border-primary/5 pb-4">
                    <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
                      Requirements
                    </span>
                    <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mt-2">
                      Guidelines & Preparation
                    </h2>
                  </div>

                  <div className="bg-white border border-primary/10 rounded-3xl p-8 shadow-sm space-y-4">
                    <ul className="space-y-4">
                      {tour.guidelines!.map((rule, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span className="text-sm md:text-base text-charcoal/80 font-sans leading-relaxed">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* INCLUSIONS & EXCLUSIONS */}
              {(hasIncluded || hasExcluded) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Included */}
                  {hasIncluded && (
                    <div className="space-y-4">
                      <h3 className="font-serif font-bold text-xl text-primary border-b border-primary/5 pb-2">
                        What's Included
                      </h3>
                      <ul className="space-y-3">
                        {tour.included!.map((inc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-600 font-bold text-base shrink-0 mt-0.5">✓</span>
                            <span className="text-sm text-charcoal/80 font-sans">{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Excluded */}
                  {hasExcluded && (
                    <div className="space-y-4">
                      <h3 className="font-serif font-bold text-xl text-primary border-b border-primary/5 pb-2">
                        What's Excluded
                      </h3>
                      <ul className="space-y-3">
                        {tour.excluded!.map((exc, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold text-base shrink-0 mt-0.5">✗</span>
                            <span className="text-sm text-charcoal/80 font-sans">{exc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                      Event Gallery
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {tour.gallery!
                      .filter((img) => img && img.url)
                      .map((img, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-video rounded-xl overflow-hidden shadow-sm hover:shadow-lg border border-primary/5 hover:scale-102 transition-all duration-300"
                        >
                          <Image
                            src={img.url}
                            alt={`Tour Snapshot ${idx + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 250px"
                            className="object-cover"
                          />
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Sidebar Booking & Sharing Card */}
            <div className="space-y-6">
              {/* Slots Counter Card */}
              <div className="bg-white border border-primary/10 rounded-3xl p-6 md:p-8 shadow-md space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
                    Cost & Booking
                  </span>
                  <div className="text-3xl font-extrabold text-primary font-serif mt-2">
                    {tour.price || "Contact Us"}
                  </div>
                  <p className="text-xs text-charcoal/50 font-sans font-medium mt-1">all inclusive cost per explorer</p>
                </div>

                <div className="border-t border-primary/5 pt-4 space-y-3 font-sans text-sm">
                  <div className="flex justify-between font-medium">
                    <span className="text-charcoal/60">Total Slots</span>
                    <span className="text-primary font-semibold">{tour.totalSlots || "Unlimited"}</span>
                  </div>
                  <div className="flex justify-between font-medium">
                    <span className="text-charcoal/60">Booked Slots</span>
                    <span className="text-primary font-semibold">{localBookedSlots}</span>
                  </div>
                  <div className="flex justify-between font-medium border-t border-primary/5 pt-3">
                    <span className="text-charcoal/80 font-bold">Remaining Slots</span>
                    <span className={`font-bold ${isFilled ? "text-rose-600" : "text-emerald-600"}`}>
                      {isFilled ? "No slots left (Filled)" : `${slotsLeft} slots available`}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 pt-2">
                  {!isFilled ? (
                    <button
                      onClick={() => {
                        setShowDemoInfoModal(true);
                      }}
                      className="w-full py-3.5 bg-primary hover:bg-secondary text-cream text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors duration-300 shadow-sm"
                    >
                      Reserve A Spot
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3.5 bg-charcoal/10 text-charcoal/40 text-xs font-sans font-bold uppercase tracking-wider rounded-xl cursor-not-allowed"
                    >
                      Registration Filled
                    </button>
                  )}

                  {/* Share button */}
                  <button
                    onClick={handleShare}
                    className="w-full py-3 bg-cream hover:bg-primary/5 text-primary border border-primary/10 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-600 animate-bounce" />
                        <span className="text-emerald-700 font-semibold">Plan Link Copied!</span>
                      </>
                    ) : (
                      <>
                        <Share2 className="w-4 h-4" />
                        <span>Copy Plan Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Guide Info Card */}
              {tour.author && (
                <div className="bg-white border border-primary/10 rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="font-serif font-bold text-primary border-b border-primary/5 pb-2 flex items-center gap-2 text-base">
                    <User className="w-4 h-4 text-accent" /> Lead Tour Guide
                  </h4>
                  <div className="flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden bg-primary/15 border border-primary/10 shrink-0">
                      {tour.author.image?.asset?.url ? (
                        <Image src={tour.author.image.asset.url} alt={tour.author.name} fill className="object-cover" />
                      ) : (
                        <User className="w-6 h-6 m-3 text-primary/30" />
                      )}
                    </div>
                    <div>
                      <h5 className="font-bold text-primary text-sm font-sans">{tour.author.name}</h5>
                      <span className="text-[10px] text-accent font-bold uppercase tracking-widest">Certified Guide</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* SLOT BOOKING MODAL POPUP */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-primary/10 rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-charcoal/70 bg-cream/50 hover:bg-cream rounded-xl transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {bookingSuccess ? (
              <div className="text-center py-6 space-y-4 font-sans">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-serif font-bold text-primary">Booking Successful!</h3>
                <p className="text-sm text-charcoal/70 leading-relaxed max-w-sm mx-auto">
                  Your spot has been successfully reserved. Our team will contact you shortly with the final itinerary and payment details.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="mt-4 px-6 py-2.5 bg-primary hover:bg-secondary text-cream text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all duration-300"
                >
                  Awesome
                </button>
              </div>
            ) : (
              <div className="space-y-6 font-sans">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-primary">Reserve Your Spot</h3>
                  <p className="text-xs text-charcoal/50 mt-1 font-medium leading-relaxed">
                    Join the expedition to <span className="text-primary font-bold">{tour.title}</span>. Fill in the fields below.
                  </p>
                </div>

                {bookingError && (
                  <div className="flex items-center gap-2.5 bg-rose-50 border border-rose-200 text-rose-600 p-3.5 rounded-xl text-xs font-semibold">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{bookingError}</span>
                  </div>
                )}

                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  {/* Name */}
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal/70 font-semibold uppercase tracking-wider">Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Harsh Chorghe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-2.5 bg-cream/10 border border-primary/10 rounded-xl text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-primary transition font-medium"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal/70 font-semibold uppercase tracking-wider">Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-cream/10 border border-primary/10 rounded-xl text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-primary transition font-medium"
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal/70 font-semibold uppercase tracking-wider">Phone Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-cream/10 border border-primary/10 rounded-xl text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-primary transition font-medium"
                    />
                  </div>

                  {/* Parent / Emergency Phone */}
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal/70 font-semibold uppercase tracking-wider">Parent / Emergency Contact Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. +91 99999 88888"
                      value={parentPhone}
                      onChange={(e) => setParentPhone(e.target.value)}
                      className="w-full px-4 py-2.5 bg-cream/10 border border-primary/10 rounded-xl text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-primary transition font-medium"
                    />
                  </div>

                  {/* Address */}
                  <div className="space-y-1">
                    <label className="text-xs text-charcoal/70 font-semibold uppercase tracking-wider">Home Address *</label>
                    <textarea
                      required
                      placeholder="Flat No, Apartment, Street name, City, Zipcode..."
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 bg-cream/10 border border-primary/10 rounded-xl text-sm text-charcoal placeholder-charcoal/30 focus:outline-none focus:border-primary transition resize-none font-medium"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full py-3 mt-2 bg-primary hover:bg-secondary text-cream text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-cream" />
                        <span>Reserving Slot...</span>
                      </>
                    ) : (
                      <span>Submit Booking</span>
                    )}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAYMENT & DEMO INFO MODAL POPUP */}
      {showDemoInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary/60 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border border-primary/10 rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative text-center space-y-5 font-sans">
            {/* Close Button */}
            <button
              onClick={() => setShowDemoInfoModal(false)}
              className="absolute top-4 right-4 p-2 text-charcoal/40 hover:text-charcoal/70 bg-cream/50 hover:bg-cream rounded-xl transition-colors outline-none"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Icon */}
            <div className="w-16 h-16 bg-accent/15 rounded-full flex items-center justify-center mx-auto text-accent mt-2">
              <Info className="w-8 h-8" />
            </div>

            {/* Details */}
            <div className="space-y-2.5">
              <h3 className="text-2xl font-serif font-bold text-primary">Demo Booking Mode</h3>
              <p className="text-sm text-charcoal/80 leading-relaxed font-sans">
                Please note that **payment gateway integration is coming soon**.
              </p>
              <p className="text-xs text-charcoal/60 leading-relaxed font-sans">
                This booking flow is operating in **Demo Mode**. You can proceed to test fill the registration form for free. No real transaction will occur.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={() => {
                  setShowDemoInfoModal(false);
                  setShowModal(true);
                  setBookingSuccess(false);
                  setBookingError(null);
                }}
                className="w-full py-3 bg-primary hover:bg-secondary text-cream text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors duration-300 shadow-sm cursor-pointer outline-none"
              >
                Proceed to Registration
              </button>
              <button
                onClick={() => setShowDemoInfoModal(false)}
                className="w-full py-3 bg-transparent hover:bg-charcoal/5 text-charcoal/70 border border-charcoal/10 text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors duration-300 cursor-pointer outline-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE STICKY BOTTOM BOOKING BAR */}
      {!isFilled && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-md border-t border-primary/10 px-6 py-4 flex items-center justify-between shadow-2xl animate-fade-in">
          <div className="flex flex-col">
            <span className="text-[10px] text-charcoal/50 uppercase tracking-widest font-sans font-bold">Total Cost</span>
            <span className="text-xl font-bold font-serif text-primary">{tour.price || "Contact Us"}</span>
            <span className="text-[10px] text-emerald-600 font-sans font-bold">{slotsLeft} slots left</span>
          </div>
          <button
            onClick={() => {
              setShowDemoInfoModal(true);
            }}
            className="px-6 py-3.5 bg-primary hover:bg-secondary text-cream text-xs font-sans font-bold uppercase tracking-wider rounded-xl transition-colors duration-300 shadow-md"
          >
            Reserve Spot
          </button>
        </div>
      )}
      {isFilled && (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-cream/95 backdrop-blur-md border-t border-primary/10 px-6 py-4 flex items-center justify-between shadow-2xl">
          <div className="flex flex-col">
            <span className="text-[10px] text-charcoal/50 uppercase tracking-widest font-sans font-bold">Total Cost</span>
            <span className="text-xl font-bold font-serif text-primary/50 line-through">{tour.price || "Contact Us"}</span>
            <span className="text-[10px] text-rose-500 font-sans font-bold">Fully Booked</span>
          </div>
          <button
            disabled
            className="px-6 py-3.5 bg-charcoal/10 text-charcoal/40 text-xs font-sans font-bold uppercase tracking-wider rounded-xl cursor-not-allowed"
          >
            Filled
          </button>
        </div>
      )}

      <Footer />
    </>
  );
}
