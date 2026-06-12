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
      const res = await fetch("/api/admin/trips/get-all");
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Compass className="w-8 h-8 text-blue-500" />
            Manage Trips
          </h1>
          <p className="text-slate-400 mt-1">Add, update, or remove travel trip packages.</p>
        </div>

        <Link
          href="/admin/trips/create"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition duration-200 text-sm font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Trip
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {tripTypes.map((t) => (
            <button
              key={t.value}
              onClick={() => setFilterType(t.value)}
              className={`px-4 py-3 rounded-xl border text-sm font-medium transition whitespace-nowrap ${
                filterType === t.value
                  ? "bg-slate-800 border-blue-500 text-white"
                  : "bg-slate-900/40 border-slate-850 text-slate-400 hover:text-white hover:border-slate-800"
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
              className="bg-slate-900/40 border border-slate-850 rounded-2xl h-64 animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredTrips.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/20 border border-slate-850 rounded-2xl">
          <p className="text-slate-500 text-base">No trips found matching the criteria.</p>
          <button
            onClick={() => {
              setSearch("");
              setFilterType("all");
            }}
            className="mt-4 text-sm text-blue-400 hover:text-blue-300 font-semibold"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredTrips.map((trip) => (
            <div
              key={trip._id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-48 bg-slate-850 overflow-hidden">
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
                    <div className="absolute inset-0 flex items-center justify-center text-slate-600 bg-slate-900">
                      <Compass className="w-12 h-12" />
                    </div>
                  )}

                  <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-800 text-cyan-400 capitalize">
                    {trip.type}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition">
                    {trip.title}
                  </h3>

                  <div className="flex flex-col gap-2 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-slate-500" />
                      <span>{trip.location}</span>
                    </div>

                    {(trip.startDate || trip.endDate) && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span>
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
              <div className="p-6 pt-0 border-t border-slate-900/60 flex items-center justify-between gap-3 mt-4">
                {deleteConfirm === trip._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-rose-400 font-medium mr-auto">Are you sure?</span>
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
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/admin/trips/edit/${trip._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition flex-1 justify-center border border-slate-750"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => setDeleteConfirm(trip._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-600/10 hover:bg-rose-600 text-rose-400 hover:text-white rounded-xl text-sm font-semibold transition border border-rose-500/20"
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