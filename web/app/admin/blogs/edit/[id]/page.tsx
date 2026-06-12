"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { client } from "@/lib/sanity";
import { ArrowLeft, BookOpen, Upload, Trash2, User, Tag, Check, AlertCircle, RefreshCw } from "lucide-react";
import Image from "next/image";

type Author = {
  _id: string;
  name: string;
};

type Category = {
  _id: string;
  title: string;
};

export default function EditBlogPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lists
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [fetchingLists, setFetchingLists] = useState(true);

  // Form State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [coverImage, setCoverImage] = useState<{ id: string; url: string } | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);

  // Quick-Add Modal States
  const [showAuthorModal, setShowAuthorModal] = useState(false);
  const [newAuthorName, setNewAuthorName] = useState("");
  const [newAuthorBio, setNewAuthorBio] = useState("");
  const [authorCreating, setAuthorCreating] = useState(false);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [newCategoryTitle, setNewCategoryTitle] = useState("");
  const [categoryCreating, setCategoryCreating] = useState(false);

  // Fetch lists and blog details
  useEffect(() => {
    if (!id) return;

    async function fetchData() {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch metadata lists
        const [authorsRes, categoriesRes] = await Promise.all([
          fetch("/api/admin/authors"),
          fetch("/api/admin/categories")
        ]);
        const authorsData = await authorsRes.json();
        const categoriesData = await categoriesRes.json();

        if (authorsData.success) setAuthors(authorsData.authors);
        if (categoriesData.success) setCategories(categoriesData.categories);

        // 2. Fetch specific blog
        const blogData = await client.fetch(
          `*[_id == $id][0] {
            _id,
            title,
            content,
            author -> { _id },
            category -> { _id },
            coverImage {
              asset -> {
                _id,
                url
              }
            }
          }`,
          { id }
        );

        if (blogData) {
          setTitle(blogData.title || "");
          setContent(blogData.content || "");
          setAuthorId(blogData.author?._id || "");
          setCategoryId(blogData.category?._id || "");
          if (blogData.coverImage?.asset) {
            setCoverImage({
              id: blogData.coverImage.asset._id,
              url: blogData.coverImage.asset.url,
            });
          }
        } else {
          setError("Blog not found");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch blog details");
      } finally {
        setLoading(false);
        setFetchingLists(false);
      }
    }

    fetchData();
  }, [id]);

  // Handle Cover Upload
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

  // Quick Create Author
  async function handleQuickAuthorCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newAuthorName.trim()) return;

    try {
      setAuthorCreating(true);
      const res = await fetch("/api/admin/authors", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newAuthorName, bio: newAuthorBio }),
      });
      const data = await res.json();
      if (data.success) {
        setAuthors((prev) => [...prev, data.author]);
        setAuthorId(data.author._id);
        setShowAuthorModal(false);
        setNewAuthorName("");
        setNewAuthorBio("");
      } else {
        alert(data.error || "Failed to create author");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create author");
    } finally {
      setAuthorCreating(false);
    }
  }

  // Quick Create Category
  async function handleQuickCategoryCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newCategoryTitle.trim()) return;

    try {
      setCategoryCreating(true);
      const res = await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newCategoryTitle }),
      });
      const data = await res.json();
      if (data.success) {
        setCategories((prev) => [...prev, data.category]);
        setCategoryId(data.category._id);
        setShowCategoryModal(false);
        setNewCategoryTitle("");
      } else {
        alert(data.error || "Failed to create category");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to create category");
    } finally {
      setCategoryCreating(false);
    }
  }

  // Form Submit
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !content) {
      setError("Title and Content are required");
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const payload = {
        id,
        title,
        content,
        authorId: authorId || null,
        categoryId: categoryId || null,
        coverImageAssetId: coverImage ? coverImage.id : null,
      };

      const res = await fetch("/api/admin/blogs/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push("/admin/blogs");
        }, 1500);
      } else {
        setError(data.error || "Failed to update blog");
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
        <RefreshCw className="w-8 h-8 text-purple-550 animate-spin" />
        <p className="text-slate-400">Loading blog details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 relative">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/blogs"
          className="p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-700 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-purple-400" />
            Edit Blog
          </h1>
          <p className="text-slate-400 mt-1">Make changes to your published article.</p>
        </div>
      </div>

      {/* Message Notifications */}
      {success && (
        <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl">
          <Check className="w-5 h-5 shrink-0" />
          <span>Blog Updated Successfully! Redirecting...</span>
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
            <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">Blog Details</h2>

            {/* Title */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Blog Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. My Weekend Hike to Harishchandragad"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-purple-550 transition-colors"
              />
            </div>

            {/* Content Textarea */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Article Content *</label>
              <textarea
                placeholder="Start writing the story here..."
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-purple-550 transition-colors resize-none font-sans leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Right Panel - Metadata & Uploads */}
        <div className="space-y-6">
          {/* Metadata selection (author, category) */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-bold text-white border-b border-slate-850 pb-3">Metadata</h2>

            {/* Author */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-slate-500" /> Author
                </label>
                <button
                  type="button"
                  onClick={() => setShowAuthorModal(true)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold"
                >
                  + Add New
                </button>
              </div>
              <select
                disabled={fetchingLists}
                value={authorId}
                onChange={(e) => setAuthorId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-purple-550 transition-colors disabled:opacity-50"
              >
                <option value="">Select Author...</option>
                {authors.map((a) => (
                  <option key={a._id} value={a._id}>
                    {a.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Category */}
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-semibold text-slate-300 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-slate-500" /> Category
                </label>
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(true)}
                  className="text-xs text-purple-400 hover:text-purple-300 font-bold"
                >
                  + Add New
                </button>
              </div>
              <select
                disabled={fetchingLists}
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-3 bg-slate-950 border border-slate-850 rounded-xl text-slate-100 focus:outline-none focus:border-purple-550 transition-colors disabled:opacity-50"
              >
                <option value="">Select Category...</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

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
              <label className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-800 hover:border-purple-500 rounded-xl cursor-pointer hover:bg-slate-900/20 transition group">
                <div className="text-center space-y-2 text-slate-500 group-hover:text-purple-400 transition">
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

          {/* Save Action */}
          <div className="bg-slate-900/40 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 space-y-3">
            <button
              type="submit"
              disabled={saving || success}
              className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-55 disabled:hover:bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-600/15 hover:shadow-purple-500/25 transition duration-200 flex items-center justify-center gap-2"
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
              href="/admin/blogs"
              className="w-full block py-3 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-xl font-bold transition text-center text-sm border border-slate-800"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>

      {/* Author Modal */}
      {showAuthorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-white">Quick Add Author</h3>
            <form onSubmit={handleQuickAuthorCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase">Author Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={newAuthorName}
                  onChange={(e) => setNewAuthorName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-550 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase">Short Bio</label>
                <textarea
                  placeholder="e.g. Adventure photographer & writer"
                  value={newAuthorBio}
                  onChange={(e) => setNewAuthorBio(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-550 transition-colors resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAuthorModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={authorCreating}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {authorCreating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Save Author"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in duration-200">
            <h3 className="text-lg font-bold text-white">Quick Add Category</h3>
            <form onSubmit={handleQuickCategoryCreate} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs text-slate-400 font-semibold uppercase">Category Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Camping Guides"
                  value={newCategoryTitle}
                  onChange={(e) => setNewCategoryTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:border-purple-550 transition-colors"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-300 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={categoryCreating}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
                >
                  {categoryCreating ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Save Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
