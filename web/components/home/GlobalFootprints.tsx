"use client";

import { useState } from "react";
import { MapPin, Globe } from "lucide-react";

type Trip = {
  _id: string;
  title: string;
  location?: string;
  type?: string;
};

// Coordinate dictionary to place pins on our stylized SVG world map
const COORDINATE_MAP: Record<string, { x: number; y: number; country: string }> = {
  "kyoto": { x: 82, y: 40, country: "Japan" },
  "machu picchu": { x: 31, y: 70, country: "Peru" },
  "santorini": { x: 55, y: 39, country: "Greece" },
  "serengeti": { x: 58, y: 61, country: "Tanzania" },
  "london": { x: 48, y: 26, country: "United Kingdom" },
  "cape town": { x: 53, y: 77, country: "South Africa" },
  "tokyo": { x: 83, y: 39, country: "Japan" },
  "paris": { x: 49, y: 29, country: "France" },
  "new york": { x: 28, y: 32, country: "United States" },
  "sydney": { x: 88, y: 80, country: "Australia" },
};

export default function GlobalFootprints({ trips }: { trips: Trip[] }) {
  const [hoveredPin, setHoveredPin] = useState<{ name: string; country: string; x: number; y: number } | null>(null);

  // Extract unique locations from CMS trips that exist in our coordinate dictionary
  const activePins = trips
    .map((trip) => {
      const locLower = trip.location?.toLowerCase().trim() || "";
      // Match exact or contains
      const matchedKey = Object.keys(COORDINATE_MAP).find(
        (key) => locLower.includes(key) || key.includes(locLower)
      );
      if (matchedKey) {
        return {
          name: trip.location || "",
          ...COORDINATE_MAP[matchedKey],
        };
      }
      return null;
    })
    .filter((pin): pin is { name: string; x: number; y: number; country: string } => pin !== null)
    // De-duplicate pins
    .filter((pin, index, self) => self.findIndex((p) => p.name === pin.name) === index);

  // Add default pins if the CMS database is empty/uncoded
  const displayPins = activePins.length > 0 ? activePins : [
    { name: "Kyoto", x: 82, y: 40, country: "Japan" },
    { name: "Machu Picchu", x: 31, y: 70, country: "Peru" },
    { name: "Santorini", x: 55, y: 39, country: "Greece" },
    { name: "Serengeti", x: 58, y: 61, country: "Tanzania" },
    { name: "London", x: 48, y: 26, country: "United Kingdom" },
    { name: "Cape Town", x: 53, y: 77, country: "South Africa" },
  ];

  return (
    <section className="py-20 bg-primary text-cream relative overflow-hidden">
      {/* Decorative grids */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-xs uppercase tracking-widest text-accent font-semibold flex items-center justify-center gap-1.5 font-sans">
            <Globe className="w-4 h-4 animate-spin-slow" />
            Interactive Map
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold mt-2">
            Global Footprints
          </h2>
          <p className="text-cream/70 text-sm max-w-lg mx-auto mt-4 font-sans leading-relaxed">
            Hover over the gold coordinate pins to explore recent expedition hubs logged directly into our travel journals.
          </p>
        </div>

        {/* Map Container */}
        <div className="relative bg-secondary/15 rounded-3xl border border-secondary/20 p-6 md:p-12 shadow-2xl flex items-center justify-center min-h-[320px] md:min-h-[500px]">
          {/* SVG Map Outlines */}
          <svg
            viewBox="0 0 1000 500"
            className="w-full h-auto opacity-40 select-none"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
          >
            {/* North America */}
            <path
              d="M 100 100 Q 120 70, 200 80 T 300 120 T 320 200 Q 250 250, 180 230 T 150 250 Z"
              className="fill-secondary/20 stroke-cream/20"
            />
            {/* South America */}
            <path
              d="M 280 240 Q 330 250, 340 320 T 310 450 T 270 480 Q 250 400, 270 320 Z"
              className="fill-secondary/20 stroke-cream/20"
            />
            {/* Europe & Africa */}
            <path
              d="M 450 100 Q 520 80, 560 120 T 600 200 Q 580 250, 500 240 Q 480 320, 520 400 T 540 470 Q 480 470, 460 400 T 450 240 Z"
              className="fill-secondary/20 stroke-cream/20"
            />
            {/* Asia */}
            <path
              d="M 580 120 Q 700 80, 850 100 T 900 200 T 800 350 Q 720 380, 680 320 Q 640 250, 580 200 Z"
              className="fill-secondary/20 stroke-cream/20"
            />
            {/* Australia */}
            <path
              d="M 800 380 Q 860 380, 890 420 T 850 480 Q 800 460, 780 420 Z"
              className="fill-secondary/20 stroke-cream/20"
            />

            {/* Flight Arcs / Connection lines */}
            {displayPins.length > 1 &&
              displayPins.slice(1).map((pin, index) => {
                const prev = displayPins[0]; // Connect all back to the first pin (e.g. primary base)
                return (
                  <g key={index}>
                    <path
                      d={`M ${prev.x * 10} ${prev.y * 5} Q ${(prev.x + pin.x) * 5} ${
                        Math.min(prev.y, pin.y) * 5 - 50
                      }, ${pin.x * 10} ${pin.y * 5}`}
                      className="stroke-accent/40"
                      strokeWidth="1"
                      strokeDasharray="4,4"
                      fill="none"
                    />
                  </g>
                );
              })}
          </svg>

          {/* Interactive Absolute Pins */}
          <div className="absolute inset-0">
            {displayPins.map((pin, index) => {
              const xPercent = `${pin.x}%`;
              const yPercent = `${pin.y}%`;

              return (
                <div
                  key={index}
                  style={{ left: xPercent, top: yPercent }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredPin({ name: pin.name, country: pin.country, x: pin.x, y: pin.y })
                  }
                  onMouseLeave={() => setHoveredPin(null)}
                >
                  {/* Glowing waves */}
                  <span className="absolute inset-0 w-8 h-8 -left-4 -top-4 rounded-full bg-accent/20 animate-ping" />
                  <span className="absolute inset-0 w-12 h-12 -left-6 -top-6 rounded-full bg-accent/10 animate-pulse" />

                  {/* Marker Pin */}
                  <div className="relative p-1 bg-accent text-primary rounded-full shadow-md border border-primary/20 hover:scale-125 transition-transform duration-300">
                    <MapPin className="w-4 h-4 fill-primary stroke-accent" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Tooltip Overlay */}
          {hoveredPin && (
            <div
              style={{
                left: `${hoveredPin.x}%`,
                top: `${hoveredPin.y - 12}%`,
              }}
              className="absolute -translate-x-1/2 bg-cream text-primary text-xs py-3 px-4 rounded-xl border border-accent shadow-xl z-30 min-w-[140px] flex flex-col gap-1 pointer-events-none animate-fadeIn"
            >
              <span className="font-serif font-bold text-sm tracking-wide border-b border-primary/10 pb-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-accent fill-accent" />
                {hoveredPin.name}
              </span>
              <span className="text-[10px] text-charcoal/60 uppercase tracking-widest font-semibold font-sans mt-0.5">
                {hoveredPin.country}
              </span>
              <span className="text-[9px] text-accent font-bold uppercase tracking-wider mt-1 bg-primary px-1.5 py-0.5 rounded w-max">
                Visited Hub
              </span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
