"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Plus, Trash2, Edit, Tv, RefreshCw, ExternalLink } from "lucide-react";

type Vlog = {
  _id: string;
  title: string;
  videoUrl: string;
  _createdAt: string;
  thumbnail?: {
    asset?: {
      url?: string;
    };
  };
};

export default function AdminVlogsPage() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function fetchVlogs() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/vlogs/get-all");
      const data = await res.json();
      if (data.success) {
        setVlogs(data.vlogs);
      }
    } catch (error) {
      console.error("Failed to load vlogs:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVlogs();
  }, []);

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      const res = await fetch("/api/admin/vlogs/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setVlogs(vlogs.filter((v) => v._id !== id));
        setDeleteConfirm(null);
      } else {
        alert("Failed to delete vlog");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the vlog");
    } finally {
      setDeletingId(null);
    }
  }

  const filteredVlogs = vlogs.filter((vlog) => {
    return (
      vlog.title.toLowerCase().includes(search.toLowerCase()) ||
      vlog.videoUrl.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
            <Tv className="w-8 h-8 text-rose-500" />
            Manage Vlogs
          </h1>
          <p className="text-slate-400 mt-1">Publish, edit, and link your YouTube travel vlogs.</p>
        </div>

        <Link
          href="/admin/vlogs/create"
          className="flex items-center justify-center gap-2 px-5 py-3 bg-rose-600 hover:bg-rose-500 text-white rounded-xl shadow-lg shadow-rose-600/20 hover:shadow-rose-500/30 transition duration-200 text-sm font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Vlog
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="relative">
        <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
        <input
          type="text"
          placeholder="Search by title or video URL..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:border-rose-550 transition-colors"
        />
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-slate-900/40 border border-slate-850 rounded-2xl h-64 animate-pulse"
            ></div>
          ))}
        </div>
      ) : filteredVlogs.length === 0 ? (
        <div className="text-center py-12 bg-slate-900/20 border border-slate-850 rounded-2xl">
          <p className="text-slate-500 text-base">No vlogs found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVlogs.map((vlog) => (
            <div
              key={vlog._id}
              className="bg-slate-900/60 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail Image */}
                <div className="relative h-40 bg-slate-850 overflow-hidden">
                  {vlog.thumbnail?.asset?.url ? (
                    <Image
                      src={vlog.thumbnail.asset.url}
                      alt={vlog.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      style={{ objectFit: "cover" }}
                      className="group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-650 bg-slate-900">
                      <Tv className="w-12 h-12" />
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md text-[10px] font-semibold px-2.5 py-1 rounded-full border border-slate-800 text-rose-400">
                    YouTube
                  </div>
                </div>

                <div className="p-6 space-y-3">
                  <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition line-clamp-2">
                    {vlog.title}
                  </h3>

                  {vlog.videoUrl && (
                    <a
                      href={vlog.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition w-fit"
                    >
                      <span className="truncate max-w-[200px]">{vlog.videoUrl}</span>
                      <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    </a>
                  )}

                  <p className="text-[10px] text-slate-500 pt-1">
                    Added on {new Date(vlog._createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="p-6 pt-0 border-t border-slate-900/60 flex items-center justify-between gap-3 mt-2">
                {deleteConfirm === vlog._id ? (
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-xs text-rose-400 font-medium mr-auto">Confirm delete?</span>
                    <button
                      onClick={() => handleDelete(vlog._id)}
                      disabled={deletingId === vlog._id}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
                    >
                      {deletingId === vlog._id ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
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
                      href={`/admin/vlogs/edit/${vlog._id}`}
                      className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-sm font-semibold transition flex-1 justify-center border border-slate-750"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </Link>

                    <button
                      onClick={() => setDeleteConfirm(vlog._id)}
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