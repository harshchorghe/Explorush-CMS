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

// Fallback coordinate dictionary for instant local geocoding
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
  "uttarakhand": { lat: 30.0668, lng: 79.0193 },
  "maharashtra": { lat: 19.7515, lng: 75.7139 },
  "himachal": { lat: 31.1048, lng: 77.1734 },
  "ladakh": { lat: 34.1526, lng: 77.5771 },
  "kashmir": { lat: 33.7782, lng: 76.5762 },
  "nepal": { lat: 28.3949, lng: 84.1240 },
  "sikkim": { lat: 27.5330, lng: 88.5122 },
  "kerala": { lat: 10.8505, lng: 76.2711 },
  "rajasthan": { lat: 27.0238, lng: 74.2179 },
  "ahmednagar": { lat: 19.0948, lng: 74.7480 },
  "kedarkantha": { lat: 31.0210, lng: 78.1724 },
  "kunjargad": { lat: 19.5484, lng: 73.7431 },
  "harishchandragad": { lat: 19.3842, lng: 73.7758 },
  "lonavala": { lat: 18.7543, lng: 73.4071 },
  "ratangad": { lat: 19.5258, lng: 73.7122 },
  "bhandardara": { lat: 19.5376, lng: 73.7656 },
};

export default function GlobalFootprints({ trips }: { trips: Trip[] }) {
  const [resolvedPins, setResolvedPins] = useState<any[]>([]);

  // Asynchronous coordinate resolution effect (Hybrid local + public Nominatim geocoder)
  useEffect(() => {
    // 1. Resolve what we can immediately (manual inputs or standard coordinates from local dictionary)
    const initialPins = trips
      .map((trip) => {
        let lat = trip.latitude;
        let lng = trip.longitude;

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

        if (typeof lat === "number" && typeof lng === "number") {
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
        }
        return null;
      })
      .filter((pin): pin is NonNullable<typeof pin> => pin !== null);

    const homePin = {
      _id: "home-vasai",
      name: "Vasai, India",
      title: "Vasai, India",
      country: "India",
      lat: 19.3820,
      lng: 72.8228,
      isHome: true,
    };

    setResolvedPins([homePin, ...initialPins]);

    // 2. Identify trips that require dynamic geocoding (no coordinates and not in local dictionary)
    const unresolvedTrips = trips.filter((trip) => {
      let lat = trip.latitude;
      let lng = trip.longitude;
      if (typeof lat === "number" && typeof lng === "number") return false;

      const locLower = trip.location?.toLowerCase().trim() || "";
      const isMatched = Object.keys(GEODIC).some(
        (key) => locLower.includes(key) || key.includes(locLower)
      );
      return !isMatched && !!trip.location;
    });

    if (unresolvedTrips.length === 0) return;

    // 3. Resolve coordinates asynchronously using OpenStreetMap's Nominatim geocoder (Progressive Fallback)
    const geocodeUnresolved = async () => {
      const newPins: any[] = [];

      for (let i = 0; i < unresolvedTrips.length; i++) {
        const trip = unresolvedTrips[i];
        try {
          // Delay requests by 1.1 seconds to respect Nominatim API rate limits
          if (i > 0) {
            await new Promise((resolve) => setTimeout(resolve, 1100));
          }

          let query = trip.location || "";
          let data = null;
          let found = false;

          // Progressive lookup: if full query fails, try dropping specific parts from left-to-right (split by commas)
          const queryParts = query.split(",");
          for (let attempt = 0; attempt < queryParts.length; attempt++) {
            const subQuery = queryParts.slice(attempt).join(",").trim();
            if (!subQuery) continue;

            // Wait a small buffer time for rate limit if we are retrying a sub-query
            if (attempt > 0) {
              await new Promise((resolve) => setTimeout(resolve, 300));
            }

            const response = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
                subQuery
              )}&limit=1`,
              {
                headers: {
                  "User-Agent": "Explorush-Travel-App",
                },
              }
            );
            data = await response.json();
            if (data && data.length > 0) {
              found = true;
              break;
            }
          }

          if (found && data && data.length > 0) {
            const lat = parseFloat(data[0].lat);
            const lng = parseFloat(data[0].lon);
            const country = trip.location?.split(",").pop()?.trim() || "Destination";

            newPins.push({
              _id: trip._id,
              name: trip.location || trip.title,
              title: trip.title,
              country,
              lat,
              lng,
              coverImageUrl: trip.coverImage?.asset?.url,
              slug: trip.slug?.current || "",
              startDate: trip.startDate,
            });
          }
        } catch (error) {
          console.error("OSM Geocoding failed for location:", trip.location, error);
        }
      }

      if (newPins.length > 0) {
        setResolvedPins((prev) => [...prev, ...newPins]);
      }
    };

    geocodeUnresolved();
  }, [trips]);

  useEffect(() => {
    let mapInstance: any = null;

    import("leaflet").then((L) => {
      const container = document.getElementById("map");
      if (!container || resolvedPins.length === 0) return;

      // Clean up previous map if it was already initialized
      if (container.hasChildNodes() && (container as any)._leaflet_id) {
        return;
      }

      // Center the map around the coordinates of the first pin, or default [20, 77] (India-centric)
      const baseLat = resolvedPins[0]?.lat || 20;
      const baseLng = resolvedPins[0]?.lng || 77;

      mapInstance = L.map("map", {
        zoomControl: true,
        scrollWheelZoom: false,
      }).setView([baseLat, baseLng], 3);

      // Add cream-colored Light Voyager map tiles
      L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: "abcd",
        maxZoom: 20
      }).addTo(mapInstance);

      // Custom divIcon matching MapPin design
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

      // Home base marker icon (using primary color base and accent/gold home icon)
      const homeMarkerIcon = L.divIcon({
        className: "custom-leaflet-marker-home",
        html: `
          <div class="relative w-8 h-8 -left-2 -top-2 flex items-center justify-center">
            <span class="absolute inset-0 w-8 h-8 rounded-full bg-primary/30 animate-ping"></span>
            <span class="absolute inset-0 w-12 h-12 -left-2 -top-2 rounded-full bg-primary/15 animate-pulse"></span>
            <div class="relative p-1.5 bg-primary text-accent rounded-full shadow-md border border-accent/20 hover:scale-125 transition-transform duration-300">
              <svg class="w-4 h-4 fill-accent stroke-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                <polyline points="9 22 9 12 15 12 15 22"></polyline>
              </svg>
            </div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      // Place pins and bind hover popups
      resolvedPins.forEach((pin) => {
        const iconToUse = pin.isHome ? homeMarkerIcon : markerIcon;
        const marker = L.marker([pin.lat, pin.lng], { icon: iconToUse }).addTo(mapInstance);

        const dateString = pin.startDate
          ? new Date(pin.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
          : "";

        const popupContent = pin.isHome
          ? `
            <div class="custom-popup-card p-2 flex flex-col gap-1 font-sans text-primary">
              <div class="flex flex-col gap-0.5">
                <h4 class="font-serif font-bold text-xs leading-snug m-0 text-primary" style="font-size:12px;">Harsh's Home Base</h4>
                <p class="text-[10px] text-accent font-bold uppercase tracking-wider m-0">🏡 Vasai, India</p>
                <p class="text-[10px] text-charcoal/70 m-0 mt-1 leading-relaxed" style="font-size:9.5px;">Starting point for all Explorush travel expeditions & digital projects.</p>
              </div>
            </div>
          `
          : `
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

        marker.on("mouseover", () => {
          marker.openPopup();
        });
      });

      // Connect locations using animated paths
      if (resolvedPins.length > 1) {
        resolvedPins.slice(1).forEach((pin) => {
          L.polyline([[resolvedPins[0].lat, resolvedPins[0].lng], [pin.lat, pin.lng]], {
            color: "#D8B47A",
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
  }, [resolvedPins]);

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
          {resolvedPins.length === 0 ? (
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
