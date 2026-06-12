"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { ArrowLeft, Compass, Upload, Trash2, Plus, Calendar, MapPin, Check, AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";

type ItineraryItem = {
  _key?: string;
  day: string;
  plan: string;
};

export default function EditTripPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("trek");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // Media Upload States
  const [coverImage, setCoverImage] = useState<{ id: string; url: string } | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [gallery, setGallery] = useState<{ id: string; url: string }[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Itinerary State
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([]);

  // Fetch Trip Details
  useEffect(() => {
    if (!id) return;

    async function fetchTripDetails() {
      try {
        setLoading(true);
        const data = await client.fetch(
          `*[_id == $id][0] {
            _id,
            title,
            location,
            type,
            description,
            startDate,
            endDate,
            coverImage {
              asset -> {
                _id,
                url
              }
            },
            gallery[] {
              asset -> {
                _id,
                url
              }
            },
            itinerary[] {
              _key,
              day,
              plan
            }
          }`,
          { id }
        );

        if (data) {
          setTitle(data.title || "");
          setLocation(data.location || "");
          setType(data.type || "trek");
          setDescription(data.description || "");
          
          // Format Iso Date to local datetime format: YYYY-MM-DDThh:mm
          if (data.startDate) {
            setStartDate(new Date(data.startDate).toISOString().slice(0, 16));
          }
          if (data.endDate) {
            setEndDate(new Date(data.endDate).toISOString().slice(0, 16));
          }

          if (data.coverImage?.asset) {
            setCoverImage({
              id: data.coverImage.asset._id,
              url: data.coverImage.asset.url,
            });
          }

          if (data.gallery) {
            const galleryList = data.gallery
              .filter((g: any) => g?.asset)
              .map((g: any) => ({
                id: g.asset._id,
                url: g.asset.url,
              }));
            setGallery(galleryList);
          }

          if (data.itinerary) {
            setItinerary(data.itinerary);
          } else {
            setItinerary([{ day: "Day 1", plan: "" }]);
          }
        } else {
          setError("Trip not found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("Failed to load trip details");
      } finally {
        setLoading(false);
      }
    }

    fetchTripDetails();
  }, [id]);

  // Handle Cover Image Upload
  async function handleCoverUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setCoverUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setCoverImage({
          id: data.asset._id,
          url: data.asset.url,
        });
      } else {
        setError("Failed to upload cover image");
      }
    } catch (err) {
      console.error(err);
      setError("Cover image upload failed");
    } finally {
      setCoverUploading(false);
    }
  }

  // Handle Gallery Uploads
  async function handleGalleryUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      setGalleryUploading(true);
      setError(null);

      const uploadedImages: { id: string; url: string }[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (data.success) {
          uploadedImages.push({
            id: data.asset._id,
            url: data.asset.url,
          });
        }
      }

      setGallery((prev) => [...prev, ...uploadedImages]);
    } catch (err) {
      console.error(err);
      setError("Failed to upload some gallery images");
    } finally {
      setGalleryUploading(false);
    }
  }

  // Itinerary Helpers
  function handleItineraryChange(index: number, field: keyof ItineraryItem, value: string) {
    const updated = [...itinerary];
    updated[index][field] = value;
    setItinerary(updated);
  }

  function addItineraryDay() {
    setItinerary([...itinerary, { day: `Day ${itinerary.length + 1}`, plan: "" }]);
  }

  function removeItineraryDay(index: number) {
    if (itinerary.length === 1) return;
    setItinerary(itinerary.filter((_, i) => i !== index));
  }

  // Form Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) {
      setError("Trip Title is required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        id,
        title,
        location,
        type,
        description,
        startDate: startDate ? new Date(startDate).toISOString() : null,
        endDate: endDate ? new Date(endDate).toISOString() : null,
        coverImageAssetId: coverImage ? coverImage.id : null,
        galleryAssetIds: gallery.map((g) => g.id),
        itinerary: itinerary.filter((item) => item.plan.trim() !== ""),
      };

      const res = await fetch("/api/admin/trips/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/trips");
        }, 1500);
      } else {
        setError(data.error || "Failed to update trip");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-slate-400">Loading trip details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/trips"
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Compass className="w-7 h-7 text-blue-500" />
            Edit Trip
          </h1>
          <p className="text-slate-400 mt-1">Make changes to the travel package itinerary.</p>
        </div>
      </div>

      {/* Message Notifications */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl">
          <Check className="w-5 h-5 shrink-0" />
          <span>Trip Updated Successfully! Redirecting...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - Inputs */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">Trip Information</h2>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Trip Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Kedarkantha Snow Trek"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-slate-500" /> Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Uttarakhand, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300">Trip Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                >
                  <option value="trek">Trek</option>
                  <option value="city">City Exploration</option>
                  <option value="road">Road Trip</option>
                  <option value="international">International</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" /> Start Date
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-slate-500" /> End Date
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 transition-colors"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Description</label>
              <textarea
                placeholder="Write a descriptive overview of the trip journey..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={6}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-blue-500 transition-colors resize-none"
              />
            </div>
          </div>

          {/* Dynamic Itinerary Builder */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-850 pb-3">
              <h2 className="text-lg font-bold text-white">Itinerary Details</h2>
              <button
                type="button"
                onClick={addItineraryDay}
                className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 font-bold"
              >
                <Plus className="w-4 h-4" /> Add Day
              </button>
            </div>

            <div className="space-y-4">
              {itinerary.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-slate-950/60 border border-slate-850 space-y-3 relative group"
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={item.day}
                      onChange={(e) => handleItineraryChange(index, "day", e.target.value)}
                      placeholder={`Day ${index + 1}`}
                      className="bg-transparent text-sm font-bold text-white border-b border-transparent focus:border-blue-500 focus:outline-none w-1/3"
                    />
                    {itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(index)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-900/80 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    placeholder="Describe the plan and trail map for this day..."
                    value={item.plan}
                    onChange={(e) => handleItineraryChange(index, "plan", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-sm text-slate-300 focus:outline-none focus:border-blue-500 transition resize-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Media upload files */}
        <div className="space-y-6">
          {/* Cover Image Upload Card */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">Cover Image</h2>

            {coverImage ? (
              <div className="relative h-48 rounded-xl overflow-hidden group border border-slate-850">
                <Image src={coverImage.url} alt="Cover Preview" fill style={{ objectFit: "cover" }} />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="absolute top-2 right-2 p-2 bg-slate-950/80 hover:bg-rose-600 rounded-xl text-slate-300 hover:text-white transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-800 hover:border-blue-500 rounded-xl cursor-pointer hover:bg-slate-900/20 transition group">
                <div className="text-center space-y-2 text-slate-500 group-hover:text-blue-400 transition">
                  <Upload className="w-8 h-8 mx-auto" />
                  <span className="text-xs font-semibold block">
                    {coverUploading ? "Uploading..." : "Upload Cover Image"}
                  </span>
                  <span className="text-[10px] text-slate-600 block">PNG, JPG up to 10MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverUpload}
                  className="hidden"
                  disabled={coverUploading}
                />
              </label>
            )}
          </div>

          {/* Gallery Upload Card */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">Trip Gallery</h2>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-800 hover:border-blue-500 rounded-xl cursor-pointer hover:bg-slate-900/20 transition group">
              <div className="text-center space-y-2 text-slate-500 group-hover:text-blue-400 transition">
                <Upload className="w-6 h-6 mx-auto" />
                <span className="text-xs font-semibold block">
                  {galleryUploading ? "Uploading..." : "Add Gallery Images"}
                </span>
              </div>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
                disabled={galleryUploading}
              />
            </label>

            {gallery.length > 0 && (
              <div className="grid grid-cols-3 gap-2 pt-2">
                {gallery.map((img, i) => (
                  <div
                    key={img.id}
                    className="relative h-16 rounded-lg overflow-hidden border border-slate-850 group"
                  >
                    <Image src={img.url} alt={`Gallery ${i}`} fill style={{ objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Save Action */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-3">
            <button
              type="submit"
              disabled={saving || success}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-55 disabled:hover:bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-600/15 hover:shadow-blue-500/25 transition duration-200 flex items-center justify-center gap-2"
            >
              {saving ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" /> Saving Changes...
                </>
              ) : (
                "Save Changes"
              )}
            </button>
            <Link
              href="/admin/trips"
              className="w-full block py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl font-bold transition text-center text-sm border border-slate-800"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}