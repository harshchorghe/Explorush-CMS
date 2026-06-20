"use client";

import { useState } from "react";
import Image from "next/image";
import { X, ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

type GalleryImage = {
  url: string;
  alt: string;
};

export default function GallerySection({ images }: { images: GalleryImage[] }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  // Fallback high-quality travel images if none are found in the CMS trips
  const displayImages = images.length > 0 ? images : [
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", alt: "Sunset beach" },
    { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80", alt: "Road trip canyon" },
    { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", alt: "Scenic lake boat" },
    { url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80", alt: "Travel maps planning" },
    { url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80", alt: "Hot air balloons Cappadocia" },
    { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80", alt: "Mountain reflection lake" },
    { url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80", alt: "Cascading waterfall" },
    { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", alt: "Kyoto golden pavilion temple" },
  ];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % displayImages.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + displayImages.length) % displayImages.length);
    }
  };

  return (
    <section className="py-20 bg-cream">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-secondary font-semibold font-sans">
            Gallery
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2">
            Moments on the Road
          </h2>
        </div>

        {/* Masonry Columns */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
          {displayImages.map((image, idx) => (
            <div
              key={idx}
              onClick={() => openLightbox(idx)}
              className="relative overflow-hidden rounded-2xl border border-primary/5 shadow-sm hover:shadow-xl cursor-pointer group break-inside-avoid transition-all duration-300"
            >
              <img
                src={image.url}
                alt={image.alt}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-2xl"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-2xl">
                <div className="p-3 bg-accent text-primary rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <ZoomIn className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-primary/95 flex items-center justify-center p-4 cursor-zoom-out animate-fadeIn"
        >
          {/* Close button */}
          <button
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-2.5 bg-cream/10 hover:bg-cream/20 text-cream rounded-full transition-colors duration-300 cursor-pointer"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Left button */}
          <button
            onClick={prevImage}
            className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-cream/10 hover:bg-cream/20 text-cream rounded-full transition-colors duration-300 cursor-pointer hidden md:block"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Right button */}
          <button
            onClick={nextImage}
            className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-cream/10 hover:bg-cream/20 text-cream rounded-full transition-colors duration-300 cursor-pointer hidden md:block"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Active Image */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[80vh] w-full h-full flex flex-col justify-center items-center cursor-default"
          >
            <img
              src={displayImages[lightboxIndex].url}
              alt={displayImages[lightboxIndex].alt}
              className="max-w-full max-h-[75vh] object-contain rounded-lg border border-cream/10 shadow-2xl animate-scaleIn"
            />
            {displayImages[lightboxIndex].alt && (
              <p className="text-cream/80 text-sm font-sans tracking-wide mt-4 text-center select-none bg-primary/80 px-4 py-1.5 rounded-full border border-cream/5">
                {displayImages[lightboxIndex].alt}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
