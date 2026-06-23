"use client";

import { useEffect, useState, useRef } from "react";
import {
  FileText,
  Upload,
  Trash2,
  Download,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Eye,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";

type MediaKitInfo = {
  title: string;
  fileUrl?: string;
  fileName?: string;
};

export default function AdminMediaKitPage() {
  const [mediaKit, setMediaKit] = useState<MediaKitInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [title, setTitle] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function fetchMediaKit() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/media-kit/get", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.mediaKit) {
        setMediaKit(data.mediaKit);
        setTitle(data.mediaKit.title || "");
      } else {
        setMediaKit(null);
        setTitle("");
      }
    } catch (error) {
      console.error("Failed to load Media Kit info:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMediaKit();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== "application/pdf") {
        alert("Please select a PDF file only.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert("Please provide a Title for the Media Kit.");
      return;
    }
    if (!mediaKit && !file) {
      alert("Please select a PDF file to upload.");
      return;
    }

    try {
      setIsSubmitting(true);
      setUploadSuccess(false);

      const formData = new FormData();
      formData.append("title", title);
      if (file) {
        formData.append("file", file);
      }

      const res = await fetch("/api/admin/media-kit/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setUploadSuccess(true);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        await fetchMediaKit();
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        alert("Failed to upload Media Kit: " + data.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("An error occurred during upload.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to remove the Media Kit? Brands will no longer be able to download it.")) {
      return;
    }

    try {
      setIsDeleting(true);
      const res = await fetch("/api/admin/media-kit/delete", {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMediaKit(null);
        setTitle("");
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        alert("Failed to delete Media Kit");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3 font-serif">
            <FileText className="w-8 h-8 text-accent" />
            Media Kit Management
          </h1>
          <p className="text-charcoal/70 mt-1 font-medium">
            Upload, replace, or delete your professional PDF Media Kit for brand partners.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Upload / Update Form */}
        <div className="lg:col-span-7 bg-white border border-primary/10 rounded-3xl p-6 md:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-bold text-primary font-serif border-b border-primary/5 pb-3">
            {mediaKit ? "Replace Media Kit" : "Upload Media Kit"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="text-xs uppercase tracking-wider text-primary font-bold">
                Media Kit Title *
              </label>
              <input
                type="text"
                id="title"
                placeholder="e.g. Explorush Media Kit 2026"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-primary text-charcoal transition-all duration-300"
                required
              />
            </div>

            {/* File Pick Input */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-primary font-bold block">
                PDF Document *
              </label>
              
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-primary/15 hover:border-primary/30 rounded-2xl p-8 text-center cursor-pointer transition bg-cream/10 hover:bg-cream/20 flex flex-col items-center justify-center gap-3"
              >
                <div className="p-3 bg-accent/15 rounded-full text-primary">
                  <Upload className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">
                    {file ? file.name : mediaKit ? "Choose a new PDF file to replace" : "Click to select a PDF"}
                  </p>
                  <p className="text-xs text-charcoal/50 mt-1 font-semibold">
                    PDF format only (Max 20MB)
                  </p>
                </div>
              </div>

              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />
            </div>

            {/* Success Banner */}
            {uploadSuccess && (
              <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm font-semibold">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                Media Kit updated and saved successfully!
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary hover:bg-secondary disabled:bg-primary/50 text-cream font-sans font-semibold tracking-widest text-sm uppercase rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <RefreshCw className="animate-spin h-5 w-5 text-cream" />
                  Uploading Assets...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  {mediaKit ? "Save & Replace Media Kit" : "Publish Media Kit"}
                </>
              )}
            </button>
          </form>
        </div>

        {/* Current Info Panel */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-primary/10 rounded-3xl p-6 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-primary font-serif border-b border-primary/5 pb-3">
              Active Status
            </h2>

            {loading ? (
              <div className="h-40 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-primary animate-spin" />
              </div>
            ) : mediaKit ? (
              <div className="space-y-5">
                <div className="flex items-start gap-3.5 bg-emerald-50/50 border border-emerald-100 rounded-2xl p-4">
                  <div className="p-2.5 bg-emerald-600 text-cream rounded-xl shadow-sm shrink-0">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-charcoal/50 uppercase tracking-wider font-bold">Current Document</p>
                    <h3 className="font-serif font-bold text-primary text-base truncate mt-0.5">{mediaKit.title}</h3>
                    <p className="text-[10px] text-charcoal/40 font-mono truncate mt-0.5" title={mediaKit.fileName}>
                      File: {mediaKit.fileName || "Stored PDF Asset"}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <a
                    href={mediaKit.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 border border-primary/10 hover:border-primary text-primary bg-white hover:bg-primary/5 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <Eye className="w-4 h-4 text-accent" />
                    Preview PDF
                  </a>

                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="w-full py-3 bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 rounded-xl text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    {isDeleting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                    Remove Media Kit
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 bg-cream/35 border border-primary/5 rounded-2xl flex flex-col items-center justify-center gap-3">
                <AlertCircle className="w-10 h-10 text-charcoal/30" />
                <div>
                  <h4 className="text-sm font-bold text-primary">No Media Kit Published</h4>
                  <p className="text-xs text-charcoal/50 max-w-[200px] mx-auto mt-1 font-medium leading-relaxed">
                    Collaborations section will display "Media Kit Coming Soon" until a PDF is uploaded.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
