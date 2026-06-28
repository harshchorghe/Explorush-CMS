"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Play, Tv } from "lucide-react";

type Vlog = {
  _id: string;
  title: string;
  slug?: { current?: string };
  videoUrl?: string;
  thumbnail?: { asset?: { url?: string } };
};

export default function VlogComponent({ vlogs }: { vlogs: Vlog[] }) {


  return (
    <>
      <Navbar />

      <main className="bg-cream text-charcoal min-h-screen font-sans">
        {/* HERO HEADER */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
            Video Logs
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary">
            Travel Vlogs & Stories
          </h1>
          <p className="text-sm md:text-base text-charcoal/70 max-w-xl mx-auto leading-relaxed">
            Immersive cinematic journals, trekking diaries, and street capture vlogs mapped globally directly from active expeditions.
          </p>
        </section>

        {/* VLOGS GRID */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          {vlogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-primary/5 p-12 max-w-md mx-auto space-y-4">
              <Tv className="w-12 h-12 text-secondary/30 mx-auto animate-pulse" />
              <h3 className="text-xl font-serif font-bold text-primary">No Vlogs Found</h3>
              <p className="text-xs text-charcoal/60 leading-relaxed font-sans">
                We haven't indexed any travel vlogs in the database yet. Return to the homepage!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {vlogs.map((vlog, idx) => (
                <div
                  key={vlog._id}
                  className="bg-white rounded-2xl overflow-hidden border border-primary/5 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-500 flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail wrapper */}
                    <Link
                      href={vlog.slug?.current ? `/vlogs/${vlog.slug.current}` : "/vlogs"}
                      className="relative h-44 overflow-hidden block bg-primary/10"
                    >
                      {vlog.thumbnail?.asset?.url ? (
                        <Image
                          src={vlog.thumbnail.asset.url}
                          alt={vlog.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 380px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Play className="w-12 h-12 text-secondary/20" />
                        </div>
                      )}

                      {/* Play overlay button */}
                      <div className="absolute inset-0 bg-primary/15 flex items-center justify-center group-hover:bg-primary/25 transition-colors duration-300">
                        <div className="p-3 bg-accent text-primary rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                          <Play className="w-5 h-5 fill-primary stroke-none" />
                        </div>
                      </div>
                    </Link>

                    {/* Content Body */}
                    <div className="p-5">
                      <h3 className="text-base font-serif font-bold text-primary line-clamp-2 group-hover:text-accent transition-colors duration-200">
                        <Link href={vlog.slug?.current ? `/vlogs/${vlog.slug.current}` : "/vlogs"}>
                          {vlog.title}
                        </Link>
                      </h3>
                    </div>
                  </div>

                  {/* Action Link */}
                  <div className="p-5 pt-0 border-t border-primary/5">
                    <Link
                      href={vlog.slug?.current ? `/vlogs/${vlog.slug.current}` : "/vlogs"}
                      className="inline-flex items-center gap-2 text-primary font-serif font-bold text-xs hover:text-accent transition-colors duration-200 mt-2 group"
                    >
                      Watch Vlog Now <span className="transform group-hover:translate-x-1 transition-transform duration-300">→</span>
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