"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { ArrowLeft, Tv, Upload, Trash2, Check, AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";

export default function EditVlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [thumbnail, setThumbnail] = useState<{ id: string; url: string } | null>(null);
  const [thumbnailUploading, setThumbnailUploading] = useState(false);

  // Fetch Vlog Details
  useEffect(() => {
    if (!id) return;

    async function fetchVlogDetails() {
      try {
        setLoading(true);
        const data = await client.fetch(
          `*[_id == $id][0] {
            _id,
            title,
            videoUrl,
            thumbnail {
              asset -> {
                _id,
                url
              }
            }
          }`,
          { id }
        );

        if (data) {
          setTitle(data.title || "");
          setVideoUrl(data.videoUrl || "");
          if (data.thumbnail?.asset) {
            setThumbnail({
              id: data.thumbnail.asset._id,
              url: data.thumbnail.asset.url,
            });
          }
        } else {
          setError("Vlog not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load vlog details");
      } finally {
        setLoading(false);
      }
    }

    fetchVlogDetails();
  }, [id]);

  // Helper validation for YouTube URL
  function validateYoutubeUrl(url: string) {
    if (!url) return true;
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
      setSaving(true);
      setError(null);

      const payload = {
        id,
        title,
        videoUrl,
        thumbnailAssetId: thumbnail ? thumbnail.id : null,
      };

      const res = await fetch("/api/admin/vlogs/update", {
        method: "PUT",
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
        setError(data.error || "Failed to update vlog");
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
        <RefreshCw className="w-8 h-8 text-rose-500 animate-spin" />
        <p className="text-slate-400">Loading vlog details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Back Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/vlogs"
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <Tv className="w-7 h-7 text-rose-500" />
            Edit Vlog
          </h1>
          <p className="text-slate-400 mt-1">Make changes to your published video link.</p>
        </div>
      </div>

      {/* Message Notifications */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl">
          <Check className="w-5 h-5 shrink-0" />
          <span>Vlog Updated Successfully! Redirecting...</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Input Fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">Vlog Details</h2>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Vlog Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Backpacking Through Spiti Valley - Day 1"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-rose-550 transition-colors"
              />
            </div>

            {/* YouTube Link */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">YouTube Video URL</label>
              <input
                type="url"
                placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-rose-550 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Media Cover & Save Action */}
        <div className="space-y-6">
          {/* Thumbnail upload card */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">Vlog Thumbnail</h2>

            {thumbnail ? (
              <div className="relative h-48 rounded-xl overflow-hidden group border border-slate-850">
                <Image src={thumbnail.url} alt="Thumbnail Preview" fill style={{ objectFit: "cover" }} />
                <button
                  type="button"
                  onClick={() => setThumbnail(null)}
                  className="absolute top-2 right-2 p-2 bg-slate-950/80 hover:bg-rose-600 rounded-xl text-slate-300 hover:text-white transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-800 hover:border-rose-500 rounded-xl cursor-pointer hover:bg-slate-900/20 transition group">
                <div className="text-center space-y-2 text-slate-500 group-hover:text-rose-455 transition">
                  <Upload className="w-8 h-8 mx-auto" />
                  <span className="text-xs font-semibold block">
                    {thumbnailUploading ? "Uploading..." : "Upload Thumbnail Image"}
                  </span>
                  <span className="text-[10px] text-slate-600 block">PNG, JPG up to 10MB</span>
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
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-3">
            <button
              type="submit"
              disabled={saving || success}
              className="w-full py-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-55 disabled:hover:bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-600/15 hover:shadow-rose-500/25 transition duration-200 flex items-center justify-center gap-2"
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
              href="/admin/vlogs"
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
