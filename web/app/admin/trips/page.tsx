"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Trash2, Edit, MapPin, Calendar, Compass, RefreshCw } from "lucide-react";

type Trip = {
  _id: string;
  title: string;
  location: string;
  type: string;
  startDate?: string;
  endDate?: string;
  coverImage?: {
    asset?: {
      url?: string;
    };
  };
};

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchTrips() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/trips/get-all", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setTrips(data.trips);
      }
    } catch (error) {
      console.error("Failed to load trips:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTrips();
  }, []);

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      const res = await fetch("/api/admin/trips/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setTrips(trips.filter((t) => t._id !== id));
        setDeleteConfirm(null);
      } else {
        alert("Failed to delete trip");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the trip");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredTrips = trips.filter((trip) => {
    const matchesSearch =
      trip.title.toLowerCase().includes(search.toLowerCase()) ||
      trip.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || trip.type === filterType;
    return matchesSearch && matchesType;
  });

  const tripTypes = [
    { label: "All Types", value: "all" },
    { label: "Trek", value: "trek" },
    { label: "City", value: "city" },
    { label: "Road Trip", value: "road" },
    { label: "International", value: "international" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3 font-serif">
            <Compass className="w-8 h-8 text-accent" />
            Manage Trips
          </h1>
          <p className="text-charcoal/70 mt-1 font-medium">Add, update, or remove travel trip packages.</p>
        </div>

        <Link
          href="/admin/trips/create"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary/95 text-cream rounded-xl shadow-sm transition duration-200 text-sm font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Trip
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-primary/10 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium shadow-sm"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {tripTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={`px-4 py-3 rounded-xl border text-sm font-semibold transition whitespace-nowrap shadow-sm ${
                filterType === t.value
                  ? "bg-primary border-primary text-cream"
                  : "bg-white border-primary/10 text-charcoal/70 hover:text-primary hover:border-primary/25"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white border border-primary/5 rounded-2xl h-64 animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-12 bg-white border border-primary/10 rounded-2xl shadow-sm">
          <p className="text-charcoal/50 text-base font-semibold">No trips found matching the criteria.</p>
          <button
            onClick={() => {
              setSearch("");
              setFilterType("all");
            }}
            className="mt-4 text-sm text-primary hover:text-secondary font-bold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip._id}
              className="bg-white border border-primary/10 rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-md transition duration-300 flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-48 bg-cream overflow-hidden">
                  {trip.coverImage?.asset?.url ? (
                    <Image
                      src={trip.coverImage.asset.url}
                      alt={trip.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-primary/30 bg-cream">
                      <Compass className="w-12 h-12" />
                    </div>
                  )}

                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/10 text-primary capitalize shadow-sm">
                    {trip.type}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition font-serif">
                    {trip.title}
                  </h3>

                  <div className="flex flex-col gap-2 text-sm text-charcoal/70">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary/50" />
                      <span className="font-medium">{trip.location}</span>
                    </div>

                    {(trip.startDate || trip.endDate) && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary/50" />
                        <span className="font-medium">
                          {trip.startDate
                            ? new Date(trip.startDate).toLocaleDateString()
                            : "Flexible"}{" "}
                          -{" "}
                          {trip.endDate ? new Date(trip.endDate).toLocaleDateString() : "Flexible"}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 border-t border-primary/5 flex items-center justify-between gap-3 mt-4">
                {deleteConfirm === trip._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-rose-600 font-bold mr-auto">Are you sure?</span>
                    <button
                      onClick={() => handleDelete(trip._id)}
                      disabled={deletingId === trip._id}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
                    >
                      {deletingId === trip._id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        "Yes, Delete"
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 bg-cream border border-primary/10 text-charcoal hover:bg-primary/5 rounded-lg text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/admin/trips/edit/${trip._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-cream hover:bg-primary/5 text-primary hover:text-primary rounded-xl text-sm font-semibold transition flex-1 justify-center border border-primary/10 shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => setDeleteConfirm(trip._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-50/50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-sm font-semibold transition border border-rose-200"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}