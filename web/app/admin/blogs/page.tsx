"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Trash2, Edit, BookOpen, RefreshCw, User, Tag } from "lucide-react";

type Blog = {
  _id: string;
  title: string;
  _createdAt: string;
  coverImage?: {
    asset?: {
      url?: string;
    };
  };
  author?: {
    name: string;
  };
  category?: {
    title: string;
  };
};

export default function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchBlogs() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/blogs/get-all", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs);
      }
    } catch (error) {
      console.error("Failed to load blogs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchBlogs();
  }, []);

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      const res = await fetch("/api/admin/blogs/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setBlogs(blogs.filter((b) => b._id !== id));
        setDeleteConfirm(null);
      } else {
        alert("Failed to delete blog");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the blog");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredBlogs = blogs.filter((blog) => {
    const searchString = search.toLowerCase();
    return (
      blog.title.toLowerCase().includes(searchString) ||
      blog.author?.name.toLowerCase().includes(searchString) ||
      blog.category?.title.toLowerCase().includes(searchString)
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3 font-serif">
            <BookOpen className="w-8 h-8 text-accent" />
            Manage Blogs
          </h1>
          <p className="text-charcoal/70 mt-1 font-medium">Publish, edit, and categorize stories & articles.</p>
        </div>

        <Link
          href="/admin/blogs/create"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-primary hover:bg-primary/95 text-cream rounded-xl shadow-sm transition duration-200 text-sm font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Blog
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-charcoal/40" />
        <input
          type="text"
          placeholder="Search by title, author, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white border border-primary/10 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium shadow-sm"
        />
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-primary/5 rounded-2xl h-72 animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12 bg-white border border-primary/10 rounded-2xl shadow-sm">
          <p className="text-charcoal/50 text-base font-semibold">No blogs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-white border border-primary/10 rounded-2xl overflow-hidden hover:border-primary/20 hover:shadow-md transition duration-300 flex flex-col justify-between group shadow-sm"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-44 bg-cream overflow-hidden">
                  {blog.coverImage?.asset?.url ? (
                    <Image
                      src={blog.coverImage.asset.url}
                      alt={blog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-primary/30 bg-cream">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}

                  {blog.category && (
                    <span className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[10px] font-semibold px-2.5 py-1.5 rounded-full border border-primary/10 text-primary flex items-center gap-1 shadow-sm">
                      <Tag className="w-3 h-3 text-accent" />
                      {blog.category.title}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-primary group-hover:text-secondary transition line-clamp-2 font-serif">
                    {blog.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-charcoal/70">
                    <User className="w-4 h-4 text-primary/50" />
                    <span className="font-medium">Written by {blog.author?.name || "Unknown"}</span>
                  </div>
                  
                  <p className="text-[11px] text-charcoal/50 font-medium">
                    Published on {new Date(blog._createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 border-t border-primary/5 flex items-center justify-between gap-3 mt-4">
                {deleteConfirm === blog._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-rose-600 font-bold mr-auto">Are you sure?</span>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      disabled={deletingId === blog._id}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
                    >
                      {deletingId === blog._id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        "Delete"
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
                      href={`/admin/blogs/edit/${blog._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-cream hover:bg-primary/5 text-primary hover:text-primary rounded-xl text-sm font-semibold transition flex-1 justify-center border border-primary/10 shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => setDeleteConfirm(blog._id)}
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