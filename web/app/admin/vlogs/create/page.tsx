"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Tv, Upload, Trash2, Check, AlertCircle } from "lucide-react";
import Image from "next/image";

export default function CreateVlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState<{ id: string; url: string } | null>(null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  // Helper validation for YouTube URL
  function validateYoutubeUrl(url: string) {
    if (!url) return true; // Optional field in some schemas, but recommended
    const regex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
    return regex.test(url);
  }

  // Handle Thumbnail Upload
  async function handleThumbnailUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setThumbnailUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setThumbnail({
          id: data.asset._id,
          url: data.asset.url,
        });
      } else {
        setError("Failed to upload thumbnail image");
      }
    } catch (err) {
      console.error(err);
      setError("Thumbnail upload failed");
    } finally {
      setThumbnailUploading(false);
    }
  }

  // Form Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title) {
      setError("Vlog Title is required");
      return;
    }

    if (videoUrl && !validateYoutubeUrl(videoUrl)) {
      setError("Please enter a valid YouTube Video URL");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const payload = {
        title,
        videoUrl,
        thumbnailAssetId: thumbnail?.id || undefined,
      };

      const res = await fetch("/api/admin/vlogs/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/vlogs");
        }, 1500);
      } else {
        setError(data.error || "Failed to create vlog");
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
          href="/admin/vlogs"
          className="p-2.5 bg-white border border-primary/10 rounded-xl text-charcoal/60 hover:text-primary hover:border-primary/25 transition shadow-sm"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-2 font-serif">
            <Tv className="w-7 h-7 text-accent" />
            Publish New Vlog
          </h1>
          <p className="text-charcoal/70 mt-1 font-medium">Add a new YouTube vlog link to the video gallery.</p>
        </div>
      </div>

      {/* Message Notifications */}
      {success && (
        <div className="flex items-center gap-3 bg-primary/10 border border-primary/20 text-primary p-4 rounded-xl font-semibold">
          <Check className="w-5 h-5 shrink-0" />
          <span>Vlog Created Successfully! Redirecting...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 p-4 rounded-xl font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Input Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-primary border-b border-primary/5 pb-3 font-serif">Vlog Details</h2>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-charcoal/80">Vlog Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Backpacking Through Spiti Valley - Day 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-cream/10 border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-charcoal/40 font-medium"
              />
            </div>

            {/* YouTube Link */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-charcoal/80">YouTube Video URL</label>
              <input
                type="url"
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-3 bg-cream/10 border border-primary/10 rounded-xl text-charcoal focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors placeholder-charcoal/40 font-medium"
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Media Cover & Save Action */}
        <div className="space-y-6">
          {/* Thumbnail upload card */}
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-primary border-b border-primary/5 pb-3 font-serif">Vlog Thumbnail</h2>

            {thumbnail ? (
              <div className="relative h-48 rounded-xl overflow-hidden group border border-primary/10 shadow-sm">
                <Image src={thumbnail.url} alt="Thumbnail Preview" fill style={{ objectFit: "cover" }} />
                <button
                  type="button"
                  onClick={() => setThumbnail(null)}
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
                    {thumbnailUploading ? "Uploading..." : "Upload Thumbnail Image"}
                  </span>
                  <span className="text-[10px] text-charcoal/40 block">PNG, JPG up to 10MB</span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleThumbnailUpload}
                  className="hidden"
                  disabled={thumbnailUploading}
                />
              </label>
            )}
          </div>

          {/* Save Action */}
          <div className="bg-white border border-primary/10 shadow-sm rounded-2xl p-6 space-y-3">
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3 bg-primary hover:bg-primary/90 disabled:opacity-50 text-cream rounded-xl font-bold shadow-sm transition duration-200"
            >
              {loading ? "Publishing Vlog..." : "Publish Vlog Link"}
            </button>
            <Link
              href="/admin/vlogs"
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