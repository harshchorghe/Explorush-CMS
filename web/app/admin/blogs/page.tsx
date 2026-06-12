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
      const res = await fetch("/api/admin/blogs/get-all");
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
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-purple-500" />
            Manage Blogs
          </h1>
          <p className="text-slate-400 mt-1">Publish, edit, and categorize stories & articles.</p>
        </div>

        <Link
          href="/admin/blogs/create"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl shadow-lg shadow-purple-600/20 hover:shadow-purple-500/30 transition duration-200 text-sm font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Blog
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search by title, author, or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
        />
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-900/40 border border-slate-850 rounded-2xl h-72 animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredBlogs.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/20 border border-slate-850 rounded-2xl">
          <p className="text-slate-500 text-base">No blogs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBlogs.map((blog) => (
            <div
              key={blog._id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Cover Image */}
                <div className="relative h-44 bg-slate-850 overflow-hidden">
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
                    <div className="absolute inset-0 flex items-center justify-center text-slate-650 bg-slate-900">
                      <BookOpen className="w-12 h-12" />
                    </div>
                  )}

                  {blog.category && (
                    <span className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold px-2.5 py-1.5 rounded-full border border-slate-800 text-purple-400 flex items-center gap-1">
                      <Tag className="w-3 h-3" />
                      {blog.category.title}
                    </span>
                  )}
                </div>

                <div className="p-6 space-y-4">
                  <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition line-clamp-2">
                    {blog.title}
                  </h3>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <User className="w-4 h-4 text-slate-500" />
                    <span>Written by {blog.author?.name || "Unknown"}</span>
                  </div>
                  
                  <p className="text-[11px] text-slate-500">
                    Published on {new Date(blog._createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 border-t border-slate-900/60 flex items-center justify-between gap-3 mt-4">
                {deleteConfirm === blog._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-rose-400 font-medium mr-auto">Are you sure?</span>
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
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <Link
                      href={`/admin/blogs/edit/${blog._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition flex-1 justify-center border border-slate-750"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => setDeleteConfirm(blog._id)}
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