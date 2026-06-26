"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export interface WebsiteTourSettings {
  title: string;
  videoUrl: string;
  thumbnail?: {
    asset?: {
      url?: string;
    };
  };
  description?: string;
  buttonText?: string;
  enableTour: boolean;
  showOnlyOnMobile: boolean;
  autoShowOnFirstVisit: boolean;
  showOnlyOnce: boolean;
}

interface WebsiteTourProps {
  settings: WebsiteTourSettings | null;
}

export default function WebsiteTour({ settings }: WebsiteTourProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  // Parse Video URL (YouTube or Google Drive) to iframe embed URL
  const getVideoEmbedUrl = (url: string): string => {
    if (!url) return "";

    // YouTube Checks:
    // 1. check youtu.be/VIDEO_ID
    if (url.includes("youtu.be/")) {
      const parts = url.split("youtu.be/");
      const id = parts[parts.length - 1]?.split(/[?#]/)[0];
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    // 2. check youtube.com/watch?v=VIDEO_ID
    if (url.includes("youtube.com/watch")) {
      try {
        const parsed = new URL(url);
        const v = parsed.searchParams.get("v");
        if (v) return `https://www.youtube.com/embed/${v}`;
      } catch (e) {
        console.error(e);
      }
    }
    // 3. check youtube.com/embed/VIDEO_ID
    if (url.includes("youtube.com/embed/")) {
      return url;
    }

    // Google Drive Checks:
    // 1. Check folder share link: /drive/folders/FOLDER_ID
    const folderMatch = url.match(/\/drive\/folders\/([a-zA-Z0-9_-]+)/);
    if (folderMatch && folderMatch[1]) {
      return `https://drive.google.com/embeddedfolderview?id=${folderMatch[1]}#grid`;
    }

    // 2. Check file share link: /file/d/FILE_ID/...
    const fileDMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileDMatch && fileDMatch[1]) {
      return `https://drive.google.com/file/d/${fileDMatch[1]}/preview`;
    }

    // 3. Check open?id=FILE_ID
    const idMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      if (url.includes("/folders/")) {
        return `https://drive.google.com/embeddedfolderview?id=${idMatch[1]}#grid`;
      }
      return `https://drive.google.com/file/d/${idMatch[1]}/preview`;
    }

    return url; // fallback to original
  };

  if (!settings || !settings.enableTour || !settings.videoUrl) return null;

  const embedUrl = getVideoEmbedUrl(settings.videoUrl);

  return (
    <section className="bg-cream border-y border-primary/5 py-12 text-charcoal relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-primary/[0.03] rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-secondary/[0.04] rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Title and Description */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
              Interactive Guide
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight leading-tight text-primary">
              {settings.title}
            </h2>
            {settings.description && (
              <p className="text-charcoal/80 text-base leading-relaxed font-medium font-sans">
                {settings.description}
              </p>
            )}
          </div>

          {/* Right Side: Embedded Video Player (plays in-place) */}
          <div className="lg:col-span-7 w-full">
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-primary/10 bg-black">
              {isPlaying ? (
                <iframe
                  src={`${embedUrl}${embedUrl.includes('?') ? '&' : '?'}autoplay=1`}
                  title={settings.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full border-0 absolute inset-0"
                />
              ) : (
                <div 
                  className="absolute inset-0 w-full h-full cursor-pointer group"
                  onClick={() => setIsPlaying(true)}
                >
                  {settings.thumbnail?.asset?.url ? (
                    <Image
                      src={settings.thumbnail.asset.url}
                      alt={settings.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] bg-[size:16px_16px]" />
                    </div>
                  )}
                  {/* Dark Tint Overlay */}
                  <div className="absolute inset-0 bg-charcoal/30 group-hover:bg-charcoal/40 transition-colors duration-300" />
                  
                  {/* Pulsing Play Button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-accent text-primary rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform duration-300 relative">
                      {/* Pulse Ring */}
                      <div className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
                      <Play className="w-6 h-6 md:w-8 md:h-8 fill-primary translate-x-0.5" />
                    </div>
                  </div>

                  {/* Play Tour Badge */}
                  <div className="absolute bottom-4 right-4 bg-primary/95 text-accent text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg border border-accent/20 font-sans shadow-md">
                    Play Tour Video
                  </div>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
