"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Play, Clock, Eye } from "lucide-react";

type VlogDetails = {
  title: string;
  videoUrl?: string;
  thumbnail?: { asset?: { url?: string } };
};

export default function VlogDetailsComponent({ vlog }: { vlog: VlogDetails }) {
  if (!vlog) {
    return (
      <main className="min-h-screen bg-cream flex flex-col justify-center items-center font-sans space-y-4">
        <h2 className="text-2xl font-serif font-bold text-primary">Vlog Not Found ❌</h2>
        <Link href="/vlogs" className="text-accent underline text-sm">
          Return to Vlogs
        </Link>
      </main>
    );
  }

  const convertToEmbed = (url: string) => {
    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.hostname === "youtu.be") {
        const videoId = parsedUrl.pathname.slice(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }

      if (
        parsedUrl.hostname.includes("youtube.com") &&
        parsedUrl.searchParams.get("v")
      ) {
        return `https://www.youtube.com/embed/${parsedUrl.searchParams.get("v")}`;
      }

      return url;
    } catch {
      return "";
    }
  };

  return (
    <>
      <Navbar />

      <main className="bg-cream text-charcoal min-h-screen font-sans pb-24">
        <div className="max-w-5xl mx-auto px-6 pt-12 space-y-8">
          {/* Back button */}
          <Link
            href="/vlogs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-primary hover:text-cream border border-primary/10 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 text-primary shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Vlogs
          </Link>

          {/* Heading */}
          <div className="space-y-4">
            <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-accent fill-accent" />
              Now Playing
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-primary leading-tight tracking-tight">
              {vlog.title}
            </h1>
          </div>

          {/* Embedded Player */}
          {vlog.videoUrl ? (
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden bg-primary shadow-xl border border-primary/10">
              <iframe
                src={convertToEmbed(vlog.videoUrl)}
                title={vlog.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-none"
              />
            </div>
          ) : vlog.thumbnail?.asset?.url ? (
            <div className="relative h-[45vh] md:h-[60vh] rounded-3xl overflow-hidden shadow-xl border border-primary/10">
              <Image
                src={vlog.thumbnail.asset.url}
                alt={vlog.title}
                fill
                priority
                className="object-cover"
              />
            </div>
          ) : null}

          {/* Details metadata */}
          <div className="bg-white border border-primary/10 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-primary text-lg">Journal Description</h4>
              <p className="text-sm text-charcoal/70 leading-relaxed font-sans">
                Watch this immersive visual documentation capturing real landscapes, street dynamics, and off-grid explorations.
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-sans font-bold text-secondary uppercase tracking-wider flex-shrink-0">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4 text-accent" />
                14:32 duration
              </span>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}