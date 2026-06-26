"use client";

import React from "react";

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
  // Parse Google Drive URL to iframe embed URL
  const getGoogleDriveEmbedUrl = (url: string): string => {
    if (!url) return "";

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

  const embedUrl = getGoogleDriveEmbedUrl(settings.videoUrl);

  return (
    <section className="bg-primary border-y border-white/5 py-12 text-cream relative overflow-hidden">
      {/* Background Decorative Rings */}
      <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-white/[0.02] rounded-full blur-2xl pointer-events-none"></div>
      <div className="absolute -right-20 -top-20 w-80 h-80 bg-accent/[0.04] rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Title and Description */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs uppercase tracking-widest text-accent font-bold font-sans">
              Interactive Guide
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-extrabold tracking-tight leading-tight">
              {settings.title}
            </h2>
            {settings.description && (
              <p className="text-cream/85 text-base leading-relaxed font-medium font-sans">
                {settings.description}
              </p>
            )}
          </div>

          {/* Right Side: Embedded Video Player (plays in-place) */}
          <div className="lg:col-span-7 w-full">
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-black">
              <iframe
                src={embedUrl}
                title={settings.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0 absolute inset-0"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
