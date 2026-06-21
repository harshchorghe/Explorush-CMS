"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Calendar, Upload, Trash2, Plus, MapPin, Check, AlertCircle, DollarSign, Users, Info } from "lucide-react";
import Image from "next/image";

type ItineraryItem = {
  day: string;
  plan: string;
};

type Author = {
  _id: string;
  name: string;
};

export default function CreateUpcomingTourPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("trek");
  const [price, setPrice] = useState("");
  const [totalSlots, setTotalSlots] = useState<number>(0);
  const [bookedSlots, setBookedSlots] = useState<number>(0);
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [authorId, setAuthorId] = useState("");

  // Metadata items
  const [authors, setAuthors] = useState<Author[]>([]);
  const [guidelines, setGuidelines] = useState<string[]>([""]);
  const [included, setIncluded] = useState<string[]>([""]);
  const [excluded, setExcluded] = useState<string[]>([""]);

  // Media Upload States
  const [coverImage, setCoverImage] = useState<{ id: string; url: string } | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);
  const [gallery, setGallery] = useState<{ id: string; url: string }[]>([]);
  const [galleryUploading, setGalleryUploading] = useState(false);

  // Itinerary State
  const [itinerary, setItinerary] = useState<ItineraryItem[]>([
    { day: "Day 1", plan: "" }
  ]);

  // Fetch Authors
  useEffect(() => {
    async function loadAuthors() {
      try {
        const res = await fetch("/api/admin/authors");
        const data = await res.json();
        if (data.success) {
          setAuthors(data.authors || []);
        }
      } catch (err) {
        console.error("Failed to load authors:", err);
      }
    }
    loadAuthors();
  }, []);

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

  // List Helpers (Guidelines, Included, Excluded)
  function handleListChange(list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) {
    const updated = [...list];
    updated[index] = value;
    setList(updated);
  }

  function addListItem(list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>) {
    setList([...list, ""]);
  }

  function removeListItem(list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, index: number) {
    if (list.length === 1) {
      setList([""]);
      return;
    }
    setList(list.filter((_, i) => i !== index));
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
      setError("Event Title is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        title,
        location,
        type,
        price,
        totalSlots: Number(totalSlots),
        bookedSlots: Number(bookedSlots),
        description,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        authorId: authorId || undefined,
        coverImageAssetId: coverImage?.id || undefined,
        galleryAssetIds: gallery.map((g) => g.id),
        itinerary: itinerary.filter((item) => item.plan.trim() !== ""),
        guidelines: guidelines.filter((g) => g.trim() !== ""),
        included: included.filter((i) => i.trim() !== ""),
        excluded: excluded.filter((e) => e.trim() !== ""),
      };

      const res = await fetch("/api/admin/upcoming-tours/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/upcoming-tours");
        }, 1500);
      } else {
        setError(data.error || "Failed to create upcoming tour");
      }
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Back Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/upcoming-tours"
          className="p-2.5 bg-white border border-primary/10 rounded-xl text-charcoal/60 hover:text-primary hover:border-primary/25 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2 font-serif">
            <Calendar className="w-7 h-7 text-accent" />
            Create Upcoming Tour / Event
          </h1>
          <p className="text-charcoal/70 mt-1 font-medium">Publish a new scheduled adventure, tour, or online session.</p>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary p-4 rounded-xl font-semibold">
          <Check className="w-5 h-5 shrink-0" />
          <span>Tour Event Created Successfully! Redirecting...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-xl font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-primary border-b border-primary/5 pb-3 font-serif">Event Information</h2>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-charcoal/80">Event / Tour Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Spiti Valley Summer Expedition 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-cream/10 border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-charcoal/40 font-medium"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Location */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal/80 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-primary/50" /> Location
                </label>
                <input
                  type="text"
                  placeholder="e.g. Himachal Pradesh, India"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-cream/10 border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-charcoal/40 font-medium"
                />
              </div>

              {/* Type Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal/80">Event Type</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium"
                >
                  <option value="trek">Trek</option>
                  <option value="expedition">Expedition</option>
                  <option value="workshop">Workshop</option>
                  <option value="city">City Exploration</option>
                  <option value="road">Road Trip</option>
                  <option value="international">International</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Price */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal/80 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-primary/50" /> Price per Person
                </label>
                <input
                  type="text"
                  placeholder="e.g. $1,499"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full px-4 py-3 bg-cream/10 border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-charcoal/40 font-medium"
                />
              </div>

              {/* Total Slots */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal/80 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary/50" /> Total Slots
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 15"
                  value={totalSlots}
                  onChange={(e) => setTotalSlots(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-3 bg-cream/10 border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium"
                />
              </div>

              {/* Booked Slots */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal/80 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-primary/50" /> Booked Slots
                </label>
                <input
                  type="number"
                  min={0}
                  placeholder="e.g. 5"
                  value={bookedSlots}
                  onChange={(e) => setBookedSlots(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-4 py-3 bg-cream/10 border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Start Date */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal/80 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary/50" /> Start Date
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-cream/10 border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium"
                />
              </div>

              {/* End Date */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-charcoal/80 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary/50" /> End Date
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-cream/10 border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-charcoal/80">Overview / Description</label>
              <textarea
                placeholder="Write a descriptive overview of the upcoming adventure plan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                className="w-full px-4 py-3 bg-cream/10 border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors resize-none placeholder-charcoal/40 font-medium"
              />
            </div>
          </div>

          {/* Dynamic Itinerary Builder */}
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-primary/5 pb-3">
              <h2 className="text-lg font-bold text-primary font-serif">Itinerary Details</h2>
              <button
                type="button"
                onClick={addItineraryDay}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-secondary font-bold"
              >
                <Plus className="w-4 h-4" /> Add Day
              </button>
            </div>

            <div className="space-y-4">
              {itinerary.map((item, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl bg-cream/20 border border-primary/10 space-y-3 relative group"
                >
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={item.day}
                      onChange={(e) => handleItineraryChange(index, "day", e.target.value)}
                      placeholder={`e.g. Day ${index + 1}`}
                      className="bg-transparent text-sm font-bold text-primary border-b border-transparent focus:border-primary focus:outline-none w-1/3"
                    />
                    {itinerary.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItineraryDay(index)}
                        className="p-1.5 text-charcoal/50 hover:text-rose-600 rounded-lg hover:bg-rose-500/10 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <textarea
                    placeholder="Describe the plan and route map for this day..."
                    value={item.plan}
                    onChange={(e) => handleItineraryChange(index, "plan", e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-white border border-primary/10 rounded-lg text-sm text-charcoal focus:outline-none focus:border-primary transition resize-none placeholder-charcoal/40 font-medium"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Guidelines Builder */}
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b border-primary/5 pb-3">
              <h2 className="text-lg font-bold text-primary font-serif">Guidelines & Preparation Rules</h2>
              <button
                type="button"
                onClick={() => addListItem(guidelines, setGuidelines)}
                className="flex items-center gap-1.5 text-xs text-primary hover:text-secondary font-bold"
              >
                <Plus className="w-4 h-4" /> Add Rule
              </button>
            </div>

            <div className="space-y-3">
              {guidelines.map((rule, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={rule}
                    onChange={(e) => handleListChange(guidelines, setGuidelines, idx, e.target.value)}
                    placeholder="e.g. Minimum age limit is 18 years"
                    className="flex-1 px-4 py-2.5 bg-cream/10 border border-primary/10 rounded-xl text-sm text-charcoal focus:outline-none focus:border-primary placeholder-charcoal/40 font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => removeListItem(guidelines, setGuidelines, idx)}
                    className="p-2.5 text-charcoal/50 hover:text-rose-600 rounded-xl hover:bg-rose-500/10 transition border border-transparent hover:border-rose-100 shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Inclusions & Exclusions Builder */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Included */}
            <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-primary/5 pb-3">
                <h2 className="text-base font-bold text-primary font-serif">What's Included</h2>
                <button
                  type="button"
                  onClick={() => addListItem(included, setIncluded)}
                  className="flex items-center gap-1 text-xs text-primary hover:text-secondary font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              <div className="space-y-3">
                {included.map((inc, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={inc}
                      onChange={(e) => handleListChange(included, setIncluded, idx, e.target.value)}
                      placeholder="e.g. Accommodation on triple sharing"
                      className="flex-1 px-3 py-2 bg-cream/10 border border-primary/10 rounded-xl text-xs text-charcoal focus:outline-none focus:border-primary placeholder-charcoal/40 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem(included, setIncluded, idx)}
                      className="p-2 text-charcoal/50 hover:text-rose-600 rounded-lg hover:bg-rose-500/10 transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Excluded */}
            <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-6">
              <div className="flex justify-between items-center border-b border-primary/5 pb-3">
                <h2 className="text-base font-bold text-primary font-serif">What's Excluded</h2>
                <button
                  type="button"
                  onClick={() => addListItem(excluded, setExcluded)}
                  className="flex items-center gap-1 text-xs text-primary hover:text-secondary font-bold"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>

              <div className="space-y-3">
                {excluded.map((exc, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={exc}
                      onChange={(e) => handleListChange(excluded, setExcluded, idx, e.target.value)}
                      placeholder="e.g. Personal expenses and laundry"
                      className="flex-1 px-3 py-2 bg-cream/10 border border-primary/10 rounded-xl text-xs text-charcoal focus:outline-none focus:border-primary placeholder-charcoal/40 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => removeListItem(excluded, setExcluded, idx)}
                      className="p-2 text-charcoal/50 hover:text-rose-600 rounded-lg hover:bg-rose-500/10 transition shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Media / Metadata */}
        <div className="space-y-6">
          {/* Guide Selector */}
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-primary border-b border-primary/5 pb-3 font-serif">Guide / Author</h2>
            <div className="space-y-2">
              <label className="text-xs text-charcoal/60 font-semibold uppercase">Lead Tour Guide</label>
              <select
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary font-medium"
              >
                <option value="">Select Lead Guide...</option>
                {authors.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
              <p className="text-[10px] text-charcoal/50 flex items-start gap-1 font-medium leading-relaxed">
                <Info className="w-3.5 h-3.5 shrink-0 text-accent mt-0.5" />
                Guides are loaded from Sanity CMS authors. Add authors in sanity or blogs page if none exist.
              </p>
            </div>
          </div>

          {/* Cover Image Upload Card */}
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-primary border-b border-primary/5 pb-3 font-serif">Cover Image</h2>

            {coverImage ? (
              <div className="relative h-48 rounded-xl overflow-hidden group border border-primary/10 shadow-sm">
                <Image src={coverImage.url} alt="Cover Preview" fill style={{ objectFit: "cover" }} />
                <button
                  type="button"
                  onClick={() => setCoverImage(null)}
                  className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-rose-600 rounded-xl text-charcoal/70 hover:text-white transition shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-primary/10 hover:border-primary rounded-xl cursor-pointer hover:bg-primary/5 transition group">
                <div className="text-center space-y-2 text-charcoal/50 group-hover:text-primary transition">
                  <Upload className="w-8 h-8 mx-auto" />
                  <span className="text-xs font-semibold block">
                    {coverUploading ? "Uploading..." : "Upload Cover Image"}
                  </span>
                  <span className="text-[10px] text-charcoal/40 block">PNG, JPG up to 10MB</span>
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
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-primary border-b border-primary/5 pb-3 font-serif">Tour Gallery</h2>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-primary/10 hover:border-primary rounded-xl cursor-pointer hover:bg-primary/5 transition group">
              <div className="text-center space-y-2 text-charcoal/50 group-hover:text-primary transition">
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
                    className="relative h-16 rounded-lg overflow-hidden border border-primary/10 group"
                  >
                    <Image src={img.url} alt={`Gallery ${i}`} fill style={{ objectFit: "cover" }} />
                    <button
                      type="button"
                      onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                      className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-600 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-3">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-cream rounded-xl font-bold shadow-sm transition duration-200"
            >
              {loading ? "Publishing Event..." : "Publish Tour Event"}
            </button>
            <Link
              href="/admin/upcoming-tours"
              className="w-full block py-3 bg-cream hover:bg-primary/5 text-charcoal hover:text-primary rounded-xl font-bold transition text-center text-sm border border-primary/10 shadow-sm"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
