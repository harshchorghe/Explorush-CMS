"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Eye, Clock, Tv } from "lucide-react";

type Vlog = {
  _id: string;
  title: string;
  slug?: { current?: string };
  videoUrl?: string;
  thumbnail?: { asset?: { url?: string } };
};

export default function VlogsSection({ vlogs }: { vlogs: Vlog[] }) {
  const [activeVlog, setActiveVlog] = useState<Vlog | null>(vlogs[0] || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  if (!vlogs || vlogs.length === 0) return null;

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return "";
    try {
      const parsed = new URL(url);
      if (parsed.hostname === "youtu.be") {
        return `https://www.youtube.com/embed/${parsed.pathname.slice(1)}?autoplay=1`;
      }
      if (parsed.hostname.includes("youtube.com")) {
        const v = parsed.searchParams.get("v");
        if (v) return `https://www.youtube.com/embed/${v}?autoplay=1`;
      }
    } catch (e) {
      console.error(e);
    }
    return url;
  };

  // Mock overlays matching reference design
  const getMockDuration = (index: number) => {
    const mins = [14, 18, 12, 22, 10, 15];
    const secs = [32, 15, 45, 10, 55, 20];
    return `${mins[index % mins.length]}:${secs[index % secs.length]}`;
  };

  const getMockViews = (index: number) => {
    const views = ["120K", "85K", "240K", "150K", "95K", "310K"];
    return `${views[index % views.length]} views`;
  };

  const activeIndex = vlogs.findIndex(v => v._id === activeVlog?._id);

  return (
    <section className="py-20 bg-cream border-t border-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <span className="text-xs uppercase tracking-widest text-secondary font-semibold font-sans">
            Video Journals
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2">
            Travel Vlogs
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Side: Featured Vlog Player */}
          {activeVlog && (
            <div className="lg:col-span-2 space-y-4">
              <div 
                ref={playerRef}
                className="relative aspect-video w-full rounded-2xl overflow-hidden bg-primary shadow-lg border border-primary/10 scroll-mt-24"
              >
                {isPlaying && activeVlog.videoUrl ? (
                  <iframe
                    src={getYoutubeEmbedUrl(activeVlog.videoUrl)}
                    title={activeVlog.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-none"
                  />
                ) : (
                  <div 
                    className="relative w-full h-full cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                  >
                    {activeVlog.thumbnail?.asset?.url ? (
                      <Image
                        src={activeVlog.thumbnail.asset.url}
                        alt={activeVlog.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-primary flex items-center justify-center">
                        <Tv className="w-16 h-16 text-cream/20 animate-pulse" />
                      </div>
                    )}
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center group-hover:bg-primary/35 transition-colors duration-300">
                      <div className="p-4 bg-accent text-primary rounded-full shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                        <Play className="w-8 h-8 fill-primary" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-between items-start gap-4">
                <div>
                  <h3 className="text-2xl font-serif font-bold text-primary">
                    {activeVlog.title}
                  </h3>
                  <div className="flex items-center gap-4 text-xs text-charcoal/60 mt-2 font-sans font-medium">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-accent" />
                      {getMockDuration(activeIndex >= 0 ? activeIndex : 0)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5 text-accent" />
                      {getMockViews(activeIndex >= 0 ? activeIndex : 0)}
                    </span>
                  </div>
                </div>
                <Link
                  href={activeVlog.slug?.current ? `/vlogs/${activeVlog.slug.current}` : "/vlogs"}
                  className="px-4 py-2 border border-primary/10 hover:border-accent hover:text-accent font-sans font-bold text-xs uppercase tracking-wider rounded-lg text-primary transition-colors duration-300 flex-shrink-0"
                >
                  View Details
                </Link>
              </div>
            </div>
          )}

          {/* Right Side: Grid of Vlog Thumbnails */}
          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
            <h4 className="text-sm font-sans font-semibold tracking-wider text-secondary uppercase pb-2 border-b border-primary/10">
              More Vlogs
            </h4>
            
            <div className="flex flex-col gap-4">
              {vlogs.map((vlog, idx) => {
                const isActive = vlog._id === activeVlog?._id;
                return (
                  <button
                    key={vlog._id}
                    onClick={() => {
                      setActiveVlog(vlog);
                      setIsPlaying(true);
                      if (typeof window !== "undefined" && window.innerWidth < 1024 && playerRef.current) {
                        playerRef.current.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className={`flex gap-4 p-3 rounded-xl border text-left transition-all duration-300 w-full group ${
                      isActive
                        ? "bg-white border-accent shadow-md"
                        : "bg-white/50 border-primary/5 hover:bg-white hover:border-primary/15 hover:shadow-sm"
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative w-28 h-20 rounded-lg overflow-hidden flex-shrink-0 bg-primary/20">
                      {vlog.thumbnail?.asset?.url && (
                        <Image
                          src={vlog.thumbnail.asset.url}
                          alt={vlog.title}
                          fill
                          sizes="112px"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      )}
                      <div className="absolute inset-0 bg-primary/10 flex items-center justify-center group-hover:bg-primary/25 transition-colors duration-300">
                        <div className="p-1.5 bg-accent/90 rounded-full text-primary shadow-md">
                          <Play className="w-3 h-3 fill-primary" />
                        </div>
                      </div>
                    </div>

                    {/* Meta */}
                    <div className="flex flex-col justify-between py-1">
                      <h5 className="font-serif text-sm font-bold text-primary line-clamp-2 leading-snug group-hover:text-accent transition-colors duration-300">
                        {vlog.title}
                      </h5>
                      <span className="text-[10px] text-charcoal/50 font-sans tracking-wide">
                        {getMockDuration(idx)} • {getMockViews(idx)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
