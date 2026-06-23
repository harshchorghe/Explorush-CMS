"use client";

import { useState, useRef, useEffect } from "react";
import { X, ZoomIn, ChevronLeft, ChevronRight, Grid } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type GalleryImage = {
  url: string;
  alt: string;
  tripTitle?: string;
  location?: string;
};

export default function GallerySection({ images }: { images: GalleryImage[] }) {
  const [selectedCategory, setSelectedCategory] = useState("All Adventures");
  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [gridExpanded, setGridExpanded] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isAtStart, setIsAtStart] = useState(true);
  const [isAtEnd, setIsAtEnd] = useState(false);

  // Fallback high-quality travel images if none are found in the CMS trips
  const fallbackImages: GalleryImage[] = [
    { url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80", alt: "Sunset beach with golden sand and waves", tripTitle: "Beaches", location: "Goa, India" },
    { url: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=600&q=80", alt: "Road trip through a majestic red canyon", tripTitle: "Roadtrips", location: "Canyon, USA" },
    { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80", alt: "Scenic lake boat tour in early morning light", tripTitle: "Lakes", location: "Srinagar, India" },
    { url: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80", alt: "Travel maps planning and adventure gear", tripTitle: "Planning", location: "Basecamp" },
    { url: "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80", alt: "Hot air balloons drifting over Cappadocia landscape", tripTitle: "Cappadocia", location: "Turkey" },
    { url: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600&q=80", alt: "Mountain peak reflection on calm lake water", tripTitle: "Mountains", location: "Leh Ladakh" },
    { url: "https://images.unsplash.com/photo-1527631746610-bca00a040d60?w=800&q=80", alt: "Cascading waterfall surrounded by lush green cliffs", tripTitle: "Waterfalls", location: "Meghalaya" },
    { url: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&q=80", alt: "Kyoto Golden Pavilion temple reflecting in a pond", tripTitle: "Temples", location: "Kyoto, Japan" },
  ];

  const displayImages = images.length > 0 ? images : fallbackImages;

  // Filter logic
  const filteredImages = selectedCategory === "All Adventures"
    ? displayImages
    : displayImages.filter(img => img.tripTitle === selectedCategory);

  // Dynamic category list
  const categories = ["All Adventures", ...Array.from(new Set(displayImages.map(img => img.tripTitle).filter((title): title is string => !!title)))];

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setGridExpanded(false);
    
    // Reset scroll progress parameters immediately
    setScrollProgress(0);
    setIsAtStart(true);
    setIsAtEnd(false);
  };

  // Scroll checking logic
  const checkScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = el;
    
    setIsAtStart(scrollLeft <= 5);
    setIsAtEnd(scrollLeft + clientWidth >= scrollWidth - 5);
    
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll > 0) {
      setScrollProgress((scrollLeft / maxScroll) * 100);
    } else {
      setScrollProgress(0);
    }
  };

  // Scroll control
  const scroll = (direction: number) => {
    const el = scrollRef.current;
    if (!el) return;
    
    const scrollAmount = el.clientWidth * 0.75;
    el.scrollBy({
      left: direction * scrollAmount,
      behavior: "smooth"
    });
  };

  // Reset scroll and recheck state on changes
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    
    el.scrollLeft = 0;
    checkScrollState();
    
    el.addEventListener("scroll", checkScrollState);
    window.addEventListener("resize", checkScrollState);
    
    return () => {
      if (el) {
        el.removeEventListener("scroll", checkScrollState);
      }
      window.removeEventListener("resize", checkScrollState);
    };
  }, [selectedCategory, viewMode, displayImages.length]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredImages.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredImages.length) % filteredImages.length);
    }
  };

  // Grid view pagination
  const isGridExpandable = filteredImages.length > 8;
  const visibleImages = viewMode === "grid" && !gridExpanded 
    ? filteredImages.slice(0, 8) 
    : filteredImages;

  return (
    <section className="py-24 bg-cream border-t border-primary/5 relative">
      {/* Decorative grids */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[linear-gradient(rgba(31,75,67,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(31,75,67,0.1)_1px,transparent_1px)] bg-[size:40px_40px]" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Header with Mode Toggles */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <span className="text-xs uppercase tracking-widest text-secondary font-semibold font-sans">
              Explore Moments
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2">
              Moments on the Road
            </h2>
          </div>

          {/* View Toggles */}
          <div className="flex bg-primary/5 p-1.5 rounded-2xl border border-primary/10 select-none">
            <button
              onClick={() => setViewMode("slider")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-sans font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                viewMode === "slider"
                  ? "bg-primary text-cream shadow-md"
                  : "text-primary/70 hover:text-primary"
              }`}
            >
              <ChevronRight className="w-4 h-4 rotate-0 transition-transform" />
              Slider View
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-sans font-bold tracking-wider uppercase transition-all duration-300 cursor-pointer ${
                viewMode === "grid"
                  ? "bg-primary text-cream shadow-md"
                  : "text-primary/70 hover:text-primary"
              }`}
            >
              <Grid className="w-4 h-4" />
              Grid View
            </button>
          </div>
        </div>

        {/* Categories Horizontal Scroll Strip */}
        <div className="flex overflow-x-auto py-2 -mx-6 px-6 gap-3 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mb-12 justify-start md:justify-center">
          {categories.map((category) => {
            const isActive = category === selectedCategory;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`relative px-5 py-2.5 rounded-full text-xs font-sans font-bold uppercase tracking-wider transition-colors duration-300 whitespace-nowrap cursor-pointer z-10 ${
                  isActive ? "text-cream" : "text-primary/70 hover:text-primary bg-primary/5 hover:bg-primary/10 border border-primary/5"
                }`}
              >
                {category}
                {isActive && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute inset-0 bg-primary rounded-full -z-10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Content View Mode conditional rendering */}
        <AnimatePresence mode="wait">
          {viewMode === "slider" ? (
            <motion.div
              key="slider"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="relative w-full"
            >
              {/* Slider Track */}
              <div
                ref={scrollRef}
                className="flex gap-6 overflow-x-auto snap-x snap-mandatory py-4 scrollbar-none [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {filteredImages.map((image, idx) => (
                  <div
                    key={`${selectedCategory}-slider-${idx}`}
                    onClick={() => openLightbox(idx)}
                    className="group relative overflow-hidden rounded-3xl border border-primary/15 bg-white/5 shadow-md flex-shrink-0 w-[280px] sm:w-[340px] md:w-[380px] h-[380px] md:h-[450px] snap-start transition-all duration-500 hover:shadow-2xl cursor-pointer"
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-700 ease-out rounded-3xl"
                      loading="lazy"
                    />
                    
                    {/* Hover Zoom Indicator */}
                    <div className="absolute inset-0 flex items-center justify-center bg-primary/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 rounded-3xl">
                      <div className="p-4 bg-accent text-primary rounded-full shadow-lg scale-75 group-hover:scale-100 transition-all duration-300">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Dynamic Glassmorphic bottom banner */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/95 via-primary/60 to-transparent pt-24 p-6 flex flex-col justify-end text-cream translate-y-3 group-hover:translate-y-0 transition-transform duration-500 z-10 rounded-b-3xl">
                      <span className="text-[10px] text-accent font-sans font-bold uppercase tracking-widest mb-1.5 block">
                        📍 {image.location || "Expedition"}
                      </span>
                      <h4 className="text-xl font-serif font-bold tracking-wide line-clamp-1">
                        {image.tripTitle || "Adventure"}
                      </h4>
                      <p className="text-xs text-cream/70 line-clamp-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 font-sans">
                        {image.alt}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Slider controls: Progress bar and Nav Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-10 gap-6">
                {/* Visual Scroll progress track */}
                <div className="w-full sm:max-w-xs flex items-center gap-4">
                  <span className="text-[10px] font-sans font-bold tracking-wider text-primary/40 uppercase">01</span>
                  <div className="relative flex-1 h-[2px] bg-primary/10 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full bg-accent transition-all duration-200 ease-out"
                      style={{ width: `${scrollProgress}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-sans font-bold tracking-wider text-primary/40 uppercase">
                    {filteredImages.length.toString().padStart(2, "0")}
                  </span>
                </div>

                {/* Nav Arrows */}
                <div className="flex gap-4">
                  <button
                    onClick={() => scroll(-1)}
                    disabled={isAtStart}
                    className={`p-3 rounded-full border border-primary/25 text-primary flex items-center justify-center transition-all duration-300 ${
                      isAtStart
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-primary hover:text-cream hover:border-primary active:scale-90 cursor-pointer"
                    }`}
                    aria-label="Scroll Left"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => scroll(1)}
                    disabled={isAtEnd}
                    className={`p-3 rounded-full border border-primary/25 text-primary flex items-center justify-center transition-all duration-300 ${
                      isAtEnd
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:bg-primary hover:text-cream hover:border-primary active:scale-90 cursor-pointer"
                    }`}
                    aria-label="Scroll Right"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              {/* Masonry layout inside Grid View */}
              <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {visibleImages.map((image, idx) => (
                  <motion.div
                    key={`${selectedCategory}-grid-${idx}`}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    onClick={() => openLightbox(idx)}
                    className="relative overflow-hidden rounded-2xl border border-primary/10 shadow-sm hover:shadow-xl cursor-pointer group break-inside-avoid transition-all duration-300 bg-white/5"
                  >
                    <img
                      src={image.url}
                      alt={image.alt}
                      className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-700 ease-out rounded-2xl"
                    />
                    
                    {/* Hover detail panel */}
                    <div className="absolute inset-0 bg-primary/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 rounded-2xl z-10">
                      <div className="self-end p-2.5 bg-accent text-primary rounded-full shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                        <ZoomIn className="w-4 h-4" />
                      </div>
                      
                      <div className="text-cream transform translate-y-3 group-hover:translate-y-0 transition-transform duration-300">
                        <span className="text-[8px] uppercase tracking-widest text-accent font-sans font-bold">
                          📍 {image.location || "Expedition"}
                        </span>
                        <h4 className="text-sm font-serif font-bold tracking-wide">
                          {image.tripTitle || "Adventure"}
                        </h4>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Show More Pagination Toggle */}
              {isGridExpandable && (
                <div className="flex justify-center mt-12">
                  <button
                    onClick={() => setGridExpanded(!gridExpanded)}
                    className="px-6 py-3 bg-primary border border-primary text-cream hover:bg-secondary hover:border-secondary text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    {gridExpanded
                      ? "Show Less Photos"
                      : `Show More (+${filteredImages.length - 8} photos)`}
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Premium Lightbox Modal */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
            className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              className="absolute top-6 right-6 p-3 bg-cream/10 hover:bg-accent hover:text-primary text-cream rounded-full transition-all duration-300 cursor-pointer"
              aria-label="Close lightbox"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Arrow */}
            {filteredImages.length > 1 && (
              <button
                onClick={prevImage}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-3 bg-cream/10 hover:bg-accent hover:text-primary text-cream rounded-full transition-all duration-300 cursor-pointer hidden md:flex items-center justify-center"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
            )}

            {/* Right Arrow */}
            {filteredImages.length > 1 && (
              <button
                onClick={nextImage}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-3 bg-cream/10 hover:bg-accent hover:text-primary text-cream rounded-full transition-all duration-300 cursor-pointer hidden md:flex items-center justify-center"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            )}

            {/* Image slide count and captions */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.4 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[85vh] w-full h-full flex flex-col justify-center items-center cursor-default"
            >
              <img
                src={filteredImages[lightboxIndex].url}
                alt={filteredImages[lightboxIndex].alt}
                className="max-w-full max-h-[70vh] object-contain rounded-xl border border-cream/10 shadow-2xl"
              />
              
              {/* Context bottom panel */}
              <div className="absolute bottom-4 text-center max-w-xl w-full px-6 pointer-events-none select-none">
                <div className="inline-block bg-primary/95 border border-accent/25 rounded-2xl px-6 py-4 backdrop-blur-md text-cream shadow-2xl pointer-events-auto">
                  <span className="text-[10px] text-accent font-sans font-bold uppercase tracking-widest block mb-0.5">
                    📍 {filteredImages[lightboxIndex].location || "Expedition"}
                  </span>
                  <h4 className="text-base font-serif font-bold mb-1">
                    {filteredImages[lightboxIndex].tripTitle || "Adventure"}
                  </h4>
                  <p className="text-xs text-cream/70 font-sans leading-relaxed mb-2">
                    {filteredImages[lightboxIndex].alt}
                  </p>
                  <div className="text-[10px] font-sans font-bold text-accent/60 tracking-wider">
                    {lightboxIndex + 1} of {filteredImages.length}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
