"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Globe } from "lucide-react";
import "leaflet/dist/leaflet.css";

type Trip = {
  _id: string;
  title: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  coverImage?: {
    asset?: {
      url?: string;
    };
  };
  slug?: {
    current?: string;
  };
  startDate?: string;
};

// Fallback coordinate dictionary for automated geocoding based on location name
const GEODIC: Record<string, { lat: number; lng: number }> = {
  "varanasi": { lat: 25.3176, lng: 82.9739 },
  "banaras": { lat: 25.3176, lng: 82.9739 },
  "kashi": { lat: 25.3176, lng: 82.9739 },
  "goa": { lat: 15.2993, lng: 74.1240 },
  "mahabaleshwar": { lat: 17.9258, lng: 73.6548 },
  "tokyo": { lat: 35.6762, lng: 139.6503 },
  "kyoto": { lat: 35.0116, lng: 135.7681 },
  "london": { lat: 51.5074, lng: -0.1278 },
  "paris": { lat: 48.8566, lng: 2.3522 },
  "new york": { lat: 40.7128, lng: -74.0060 },
  "sydney": { lat: -33.8688, lng: 151.2093 },
  "machu picchu": { lat: -13.1631, lng: -72.5450 },
  "santorini": { lat: 36.4166, lng: 25.4324 },
  "serengeti": { lat: -2.1540, lng: 34.6857 },
  "cape town": { lat: -33.9249, lng: 18.4241 },
  "delhi": { lat: 28.6139, lng: 77.2090 },
  "mumbai": { lat: 19.0760, lng: 72.8777 },
  "bangalore": { lat: 12.9716, lng: 77.5946 },
};

export default function GlobalFootprints({ trips }: { trips: Trip[] }) {
  // Map coordinates dynamically from either CMS inputs or automated local geocoding
  const displayPins = trips
    .map((trip) => {
      // 1. Prioritize manual coordinates if they exist in Sanity
      let lat = trip.latitude;
      let lng = trip.longitude;

      // 2. Fall back to local geocoding coordinate lookup if fields are empty
      if (typeof lat !== "number" || typeof lng !== "number") {
        const locLower = trip.location?.toLowerCase().trim() || "";
        const matchedKey = Object.keys(GEODIC).find(
          (key) => locLower.includes(key) || key.includes(locLower)
        );
        if (matchedKey) {
          lat = GEODIC[matchedKey].lat;
          lng = GEODIC[matchedKey].lng;
        }
      }

      // Skip trips that have no valid coordinate resolution
      if (typeof lat !== "number" || typeof lng !== "number") {
        return null;
      }

      const country = trip.location?.split(",").pop()?.trim() || "Destination";

      return {
        _id: trip._id,
        name: trip.location || trip.title,
        title: trip.title,
        country,
        lat,
        lng,
        coverImageUrl: trip.coverImage?.asset?.url,
        slug: trip.slug?.current || "",
        startDate: trip.startDate,
      };
    })
    .filter((pin): pin is NonNullable<typeof pin> => pin !== null);

  useEffect(() => {
    let mapInstance: any = null;

    // Only load Leaflet on the client side
    import("leaflet").then((L) => {
      const container = document.getElementById("map");
      if (!container || displayPins.length === 0) return;

      // Clean up previous map if it was already initialized
      if (container.hasChildNodes() && (container as any)._leaflet_id) {
        return;
      }

      // Center the map around the coordinates of the first pin, or default [20, 77] (India-centric)
      const baseLat = displayPins[0]?.lat || 20;
      const baseLng = displayPins[0]?.lng || 77;

      mapInstance = L.map("map", {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([baseLat, baseLng], 3);

      // Add a beautiful cream-colored light Voyager tile theme that matches the Explorush cream/sage aesthetic perfectly!
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20
      }).addTo(mapInstance);

      // Custom Marker divIcon matching our MapPin design perfectly
      const markerIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div class="relative w-8 h-8 -left-2 -top-2 flex items-center justify-center">
            <span class="absolute inset-0 w-8 h-8 rounded-full bg-accent/30 animate-ping"></span>
            <span class="absolute inset-0 w-12 h-12 -left-2 -top-2 rounded-full bg-accent/10 animate-pulse"></span>
            <div class="relative p-1.5 bg-accent text-primary rounded-full shadow-md border border-primary/20 hover:scale-125 transition-transform duration-300">
              <svg class="w-4 h-4 fill-primary stroke-accent" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Place pins and bind interactive tooltips/popups
      displayPins.forEach((pin) => {
        const marker = L.marker([pin.lat, pin.lng], { icon: markerIcon }).addTo(mapInstance);

        const dateString = pin.startDate
          ? new Date(pin.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
          : "";

        // Premium HTML layout for the hover tooltip/popup
        const popupContent = `
          <div class="custom-popup-card p-1 flex flex-col gap-2 font-sans text-primary">
            ${pin.coverImageUrl ? `<img src="${pin.coverImageUrl}" alt="${pin.title}" class="w-full h-24 object-cover rounded-lg shadow-sm" style="display:block;" />` : ""}
            <div class="flex flex-col gap-0.5" style="margin-top:2px;">
              <h4 class="font-serif font-bold text-xs leading-snug m-0 text-primary" style="font-size:11px;">${pin.title}</h4>
              <p class="text-[10px] text-charcoal/60 m-0 flex items-center gap-1" style="font-size:9px;">📍 ${pin.name}</p>
              ${dateString ? `<p class="text-[9px] text-accent font-bold uppercase tracking-wider m-0 mt-0.5" style="font-size:8px;">📅 ${dateString}</p>` : ""}
            </div>
            <a href="/trips/${pin.slug}" class="text-center py-2 mt-1 bg-primary hover:bg-secondary text-cream text-[10px] font-sans font-semibold uppercase tracking-wider rounded-lg block transition-all duration-300 hover:shadow-md" style="font-size:9px; text-decoration:none; color:#F8F4EC;">View Trip Details →</a>
          </div>
        `;

        marker.bindPopup(popupContent, {
          className: "custom-leaflet-popup",
          closeButton: false,
          minWidth: 200,
        });

        // Open popup on hover
        marker.on("mouseover", () => {
          marker.openPopup();
        });
      });

      // Connect locations using animated polyline paths
      if (displayPins.length > 1) {
        // Connect them back to the first pin (e.g. your starting/base location)
        displayPins.slice(1).forEach((pin) => {
          L.polyline([[displayPins[0].lat, displayPins[0].lng], [pin.lat, pin.lng]], {
            color: "#D8B47A", // Warm gold color
            weight: 1.5,
            dashArray: "6, 5",
            className: "animate-leaflet-route"
          }).addTo(mapInstance);
        });
      }
    });

    return () => {
      if (mapInstance) {
        mapInstance.remove();
      }
    };
  }, [displayPins.length]);

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

        {/* Leaflet Map Container */}
        <div className="relative bg-secondary/15 rounded-3xl border border-secondary/20 p-2 shadow-2xl overflow-hidden min-h-[400px] md:min-h-[500px]">
          {displayPins.length === 0 ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8 bg-secondary/10">
              <Globe className="w-12 h-12 text-accent/50 animate-pulse mb-3" />
              <p className="text-sm text-cream/70 font-sans">No travel pins found in database.</p>
            </div>
          ) : (
            <div id="map" className="w-full h-[400px] md:h-[500px] rounded-2xl z-10 leaflet-container-theme" />
          )}
        </div>
      </div>
    </section>
  );
}
