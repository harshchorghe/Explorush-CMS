"use client";

import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Compass, ShieldCheck, Heart, Award } from "lucide-react";

type SanityImage = {
  asset?: {
    url?: string;
  };
};

type AuthorItem = {
  name: string;
  bio?: string;
  image?: SanityImage;
};

export default function AboutComponent({ author }: { author: AuthorItem | null }) {
  // If author bio is fetched from Sanity, use it or fall back to the curated text
  const authorName = author?.name || "Harsh Chorghe";
  const authorImage = "/about_me.jpg";

  return (
    <>
      <Navbar />

      <main className="bg-cream text-charcoal min-h-screen font-sans">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-20 pb-20 text-center space-y-6">
          <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
            Our Story & Philosophy
          </span>
          
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold text-primary leading-tight tracking-tight max-w-4xl mx-auto">
            Hi, I'm <span className="text-accent italic font-normal">{authorName}.</span>
          </h1>

          <p className="max-w-3xl mx-auto text-charcoal/80 text-base md:text-lg leading-relaxed font-sans font-medium">
            I'm a traveler, creator, and developer who believes that every journey has a story worth sharing. What started as a passion for exploring new places slowly turned into a desire to document experiences, connect with people, and inspire others to step outside their comfort zones.
          </p>
        </section>

        {/* DETAILED STORY SECTION */}
        <section className="max-w-6xl mx-auto px-6 pb-24">
          <div className="bg-white border border-primary/10 rounded-3xl p-8 md:p-16 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Col: Photo */}
            <div className="lg:col-span-5 relative aspect-[3/4] w-full rounded-2xl overflow-hidden shadow-md group">
              <Image
                src={authorImage}
                alt={authorName}
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            {/* Right Col: Details */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs uppercase tracking-widest text-accent font-bold bg-primary px-3 py-1 rounded">
                The Creator Behind Explorush
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary">
                Combining Travel & Technology
              </h2>
              <p className="text-charcoal/80 text-sm md:text-base leading-relaxed font-sans">
                Alongside my love for travel, I'm a technology enthusiast and developer who enjoys building digital experiences that solve real-world problems. Explorush is the result of combining these two passions—travel and technology.
              </p>
              <p className="text-charcoal/80 text-sm md:text-base leading-relaxed font-sans">
                Through Explorush, I share travel stories, destination guides, hidden gems, practical tips, and unforgettable experiences from the road. My goal is to help fellow travelers discover new places, travel smarter, and create memories that last a lifetime.
              </p>
            </div>
          </div>
        </section>

        {/* VALUES / WHAT YOU FIND HERE */}
        <section className="bg-primary text-cream py-24 border-y border-secondary/30 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />
          
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h2 className="text-center text-4xl md:text-5xl font-serif font-bold mb-16 text-white">
              What You'll Find Here
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: "Detailed Guides",
                  text: "Comprehensive itineraries, budgeting maps, and transit blueprints.",
                  icon: Compass,
                },
                {
                  title: "Video Journals",
                  text: "Cinematic travel vlogs that transport you directly to the location.",
                  icon: Award,
                },
                {
                  title: "Personal Diaries",
                  text: "Authentic, raw essays on the philosophies of slow-travel.",
                  icon: Heart,
                },
                {
                  title: "Local Experiences",
                  text: "Guides to regional food, cultural meetups, and local guides.",
                  icon: ShieldCheck,
                },
              ].map((val, idx) => {
                const Icon = val.icon;
                return (
                  <div
                    key={idx}
                    className="bg-secondary/15 border border-secondary/20 rounded-2xl p-8 hover:bg-secondary/25 transition-all duration-300 flex flex-col items-center text-center space-y-4 shadow-lg group"
                  >
                    <div className="p-4 bg-accent text-primary rounded-full group-hover:scale-110 transition-transform duration-300">
                      <Icon className="w-6 h-6 stroke-[2]" />
                    </div>
                    <h3 className="text-xl font-serif font-bold text-white">{val.title}</h3>
                    <p className="text-cream/70 text-xs md:text-sm font-sans leading-relaxed">
                      {val.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* BIO STATS & CALL TO ACTION */}
        <section className="py-24 max-w-5xl mx-auto px-6 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
            Let's explore the world, <br />
            <span className="text-accent italic font-normal">one journey at a time.</span>
          </h2>
          <p className="text-charcoal/80 text-base md:text-lg leading-relaxed max-w-2xl mx-auto font-sans">
            Whether you're looking for your next adventure, planning a group trip, or simply seeking inspiration, I'm glad you're here.
          </p>

          <div className="flex justify-center gap-4 pt-4">
            <Link
              href="/trips"
              className="px-6 py-3 bg-accent hover:bg-accent/90 text-primary font-sans font-semibold text-xs tracking-widest uppercase rounded-lg shadow-md transition-all duration-300 hover:-translate-y-0.5"
            >
              Explore Trips
            </Link>
            <Link
              href="/"
              className="px-6 py-3 border border-primary/20 hover:border-primary text-primary font-sans font-semibold text-xs tracking-widest uppercase rounded-lg transition-all duration-300 hover:-translate-y-0.5"
            >
              Back to Home
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}