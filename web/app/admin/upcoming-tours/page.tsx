"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Trash2, Edit, MapPin, Calendar, Compass, RefreshCw, Users, DollarSign } from "lucide-react";

type UpcomingTour = {
  _id: string;
  title: string;
  location: string;
  type: string;
  price?: string;
  totalSlots?: number;
  bookedSlots?: number;
  startDate?: string;
  endDate?: string;
  coverImage?: {
    asset?: {
      url?: string;
    };
  };
};

export default function AdminUpcomingToursPage() {
  const [tours, setTours] = useState<UpcomingTour[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchTours() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/upcoming-tours/get-all", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setTours(data.upcomingTours || []);
      }
    } catch (error) {
      console.error("Failed to load upcoming tours:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTours();
  }, []);

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      const res = await fetch("/api/admin/upcoming-tours/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setTours(tours.filter((t) => t._id !== id));
        setDeleteConfirm(null);
      } else {
        alert("Failed to delete upcoming tour");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the upcoming tour");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredTours = tours.filter((tour) => {
    const matchesSearch =
      tour.title.toLowerCase().includes(search.toLowerCase()) ||
      tour.location.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || tour.type === filterType;
    return matchesSearch && matchesType;
  });

  const tourTypes = [
    { label: "All Types", value: "all" },
    { label: "Trek", value: "trek" },
    { label: "Expedition", value: "expedition" },
    { label: "Workshop", value: "workshop" },
    { label: "City Exploration", value: "city" },
    { label: "Road Trip", value: "road" },
    { label: "International", value: "international" },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3 font-serif">
            <Calendar className="w-8 h-8 text-accent" />
            Manage Upcoming Tours & Events
          </h1>
          <p className="text-charcoal/70 mt-1 font-medium">Add, update, or remove scheduled group tours, workshops, and slots.</p>
        </div>

        <Link
          href="/admin/upcoming-tours/create"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary/95 text-cream rounded-xl shadow-sm transition duration-200 text-sm font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Event / Tour
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
          {tourTypes.map((t) => (
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
      ) : filteredTours.length === 0 ? (
        <div className="text-center py-12 bg-white border border-primary/10 rounded-2xl shadow-sm">
          <p className="text-charcoal/50 text-base font-semibold">No upcoming tours or events found matching the criteria.</p>
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
          {filteredTours.map((tour) => (
            <div
              key={tour._id}
              className="bg-white border border-primary/10 rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-md transition duration-300 flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-48 bg-cream overflow-hidden">
                  {tour.coverImage?.asset?.url ? (
                    <Image
                      src={tour.coverImage.asset.url}
                      alt={tour.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-primary/30 bg-cream">
                      <Compass className="w-12 h-12 animate-pulse" />
                    </div>
                  )}

                  <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/10 text-primary capitalize shadow-sm">
                    {tour.type}
                  </span>
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-xl font-bold text-primary group-hover:text-secondary transition font-serif leading-snug">
                    {tour.title}
                  </h3>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-charcoal/70">
                    <div className="flex items-center gap-2 col-span-2">
                      <MapPin className="w-4 h-4 text-primary/50 shrink-0" />
                      <span className="font-medium truncate">{tour.location || "Online / Flexible"}</span>
                    </div>

                    {(tour.startDate || tour.endDate) && (
                      <div className="flex items-center gap-2 col-span-2">
                        <Calendar className="w-4 h-4 text-primary/50 shrink-0" />
                        <span className="font-medium">
                          {tour.startDate
                            ? new Date(tour.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Flexible"}{" "}
                          -{" "}
                          {tour.endDate
                            ? new Date(tour.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
                            : "Flexible"}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4 text-primary/50 shrink-0" />
                      <span className="font-semibold text-primary">{tour.price || "Contact Us"}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-primary/50 shrink-0" />
                      <span className="font-medium text-xs">
                        {tour.totalSlots
                          ? `${(tour.totalSlots || 0) - (tour.bookedSlots || 0)} / ${tour.totalSlots} left`
                          : "Unlimited slots"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 border-t border-primary/5 flex items-center justify-between gap-3 mt-4">
                {deleteConfirm === tour._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-rose-600 font-bold mr-auto">Are you sure?</span>
                    <button
                      onClick={() => handleDelete(tour._id)}
                      disabled={deletingId === tour._id}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
                    >
                      {deletingId === tour._id ? (
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
                      href={`/admin/upcoming-tours/edit/${tour._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-cream hover:bg-primary/5 text-primary hover:text-primary rounded-xl text-sm font-semibold transition flex-1 justify-center border border-primary/10 shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => setDeleteConfirm(tour._id)}
                      className="flex items-center gap-2 px-4 py-2 bg-rose-5/50 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-sm font-semibold transition border border-rose-200"
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
