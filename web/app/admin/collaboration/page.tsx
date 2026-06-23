"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Search,
  Trash2,
  Briefcase,
  Mail,
  Phone,
  DollarSign,
  Globe,
  RefreshCw,
  FileText,
  Clock,
  Filter,
  CheckCircle,
  XCircle,
  Eye,
  Info
} from "lucide-react";

type Collaboration = {
  _id: string;
  name: string;
  company: string;
  email: string;
  phone?: string;
  collabType: string;
  budget: string;
  details: string;
  links?: string;
  status: string;
  _createdAt: string;
};

export default function AdminCollaborationsPage() {
  const [requests, setRequests] = useState<Collaboration[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<Collaboration | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function fetchRequests() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/collaboration/get-all", { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setRequests(data.collaborations);
      }
    } catch (error) {
      console.error("Failed to load collaboration requests:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  async function handleDelete(id: string) {
    try {
      setDeletingId(id);
      const res = await fetch("/api/admin/collaboration/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests(requests.filter((r) => r._id !== id));
        setDeleteConfirm(null);
        if (selectedRequest?._id === id) {
          setSelectedRequest(null);
        }
      } else {
        alert("Failed to delete request");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("An error occurred while deleting the request");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleStatusChange(id: string, newStatus: string) {
    try {
      setUpdatingId(id);
      const res = await fetch("/api/admin/collaboration/update-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setRequests(
          requests.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
        );
        if (selectedRequest?._id === id) {
          setSelectedRequest({ ...selectedRequest, status: newStatus });
        }
      } else {
        alert("Failed to update status");
      }
    } catch (error) {
      console.error("Update status error:", error);
      alert("An error occurred while updating status");
    } finally {
      setUpdatingId(null);
    }
  }

  // Filter and Search logic
  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.name.toLowerCase().includes(search.toLowerCase()) ||
      req.company.toLowerCase().includes(search.toLowerCase()) ||
      req.email.toLowerCase().includes(search.toLowerCase()) ||
      req.details.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || req.status === statusFilter;
    const matchesType = typeFilter === "all" || req.collabType === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  // Helper Labels & Mappings
  const collabTypeLabels: Record<string, string> = {
    brand_sponsorship: "Brand Sponsorship",
    destination_marketing: "Destination Marketing",
    hotel_resort_review: "Hotel/Resort Review",
    content_creation: "Content Creation",
    group_trip_partnership: "Group Trip Partnership",
    other: "Other",
  };

  const budgetLabels: Record<string, string> = {
    under_1k: "Under $1k",
    "1k_5k": "$1k - $5k",
    "5k_10k": "$5k - $10k",
    "10k_plus": "$10k+",
    flexible: "Flexible / Contact Us",
  };

  const statusColors: Record<string, { bg: string; text: string; border: string }> = {
    new: { bg: "bg-blue-500/10", text: "text-blue-600", border: "border-blue-200" },
    contacted: { bg: "bg-yellow-500/10", text: "text-yellow-600", border: "border-yellow-200" },
    in_discussion: { bg: "bg-orange-500/10", text: "text-orange-600", border: "border-orange-200" },
    confirmed: { bg: "bg-emerald-500/10", text: "text-emerald-600", border: "border-emerald-200" },
    rejected: { bg: "bg-rose-500/10", text: "text-rose-600", border: "border-rose-200" },
  };

  // Metrics
  const totalCount = requests.length;
  const newCount = requests.filter((r) => r.status === "new").length;
  const inDiscussionCount = requests.filter((r) => r.status === "in_discussion").length;
  const confirmedCount = requests.filter((r) => r.status === "confirmed").length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-primary flex items-center gap-3 font-serif">
            <Briefcase className="w-8 h-8 text-accent" />
            Collaboration Requests
          </h1>
          <p className="text-charcoal/70 mt-1 font-medium">
            Review sponsorship offers, hotel reviews, and marketing proposals from brands.
          </p>
        </div>
      </div>

      {/* Stats Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Proposals", value: totalCount, bg: "bg-white", text: "text-primary" },
          { label: "New Offers", value: newCount, bg: "bg-blue-50/40 border-blue-100", text: "text-blue-600" },
          { label: "In Discussion", value: inDiscussionCount, bg: "bg-orange-50/40 border-orange-100", text: "text-orange-600" },
          { label: "Confirmed Deals", value: confirmedCount, bg: "bg-emerald-50/40 border-emerald-100", text: "text-emerald-600" },
        ].map((stat, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border border-primary/10 shadow-sm flex flex-col justify-center ${stat.bg}`}
          >
            <span className="text-xs font-semibold text-charcoal/50 uppercase tracking-wider">
              {stat.label}
            </span>
            <span className={`text-3xl font-extrabold mt-1 font-serif ${stat.text}`}>
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      {/* Search, Filter, and Action Strip */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-charcoal/40" />
          <input
            type="text"
            placeholder="Search proposals by Name, Brand, Email, details..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white border border-primary/10 rounded-xl text-charcoal placeholder-charcoal/40 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium shadow-sm"
          />
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Status Filter */}
          <div className="flex items-center bg-white border border-primary/10 rounded-xl px-3 py-2 shadow-sm gap-2">
            <Filter className="w-4 h-4 text-charcoal/40" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-transparent text-charcoal text-sm font-semibold outline-none cursor-pointer pr-4"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="in_discussion">In Discussion</option>
              <option value="confirmed">Confirmed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center bg-white border border-primary/10 rounded-xl px-3 py-2 shadow-sm gap-2">
            <Briefcase className="w-4 h-4 text-charcoal/40" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-charcoal text-sm font-semibold outline-none cursor-pointer pr-4"
            >
              <option value="all">All Types</option>
              <option value="brand_sponsorship">Brand Sponsorship</option>
              <option value="destination_marketing">Destination Marketing</option>
              <option value="hotel_resort_review">Hotel/Resort Review</option>
              <option value="content_creation">Content Creation</option>
              <option value="group_trip_partnership">Group Trip Partnership</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Proposals List */}
        <div className={`space-y-4 ${selectedRequest ? "lg:col-span-7" : "lg:col-span-12"}`}>
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl h-24 border border-primary/5 animate-pulse"></div>
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-16 bg-white border border-primary/10 rounded-2xl shadow-sm">
              <Info className="w-12 h-12 text-primary/30 mx-auto mb-3" />
              <p className="text-charcoal/50 text-base font-semibold">No collaboration requests found matching criteria.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map((req) => {
                const color = statusColors[req.status] || statusColors.new;
                const isSelected = selectedRequest?._id === req._id;

                return (
                  <div
                    key={req._id}
                    className={`bg-white border rounded-2xl p-5 hover:shadow-md transition duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer relative overflow-hidden shadow-sm ${
                      isSelected ? "border-primary shadow-md bg-primary/5" : "border-primary/10"
                    }`}
                    onClick={() => setSelectedRequest(req)}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-bold text-primary font-serif">
                          {req.company}
                        </h3>
                        <span
                          className={`text-[10px] px-2.5 py-0.5 rounded-full border uppercase tracking-wider font-bold ${color.bg} ${color.text} ${color.border}`}
                        >
                          {req.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-charcoal/60 font-semibold">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3.5 h-3.5 text-accent" />
                          {collabTypeLabels[req.collabType] || req.collabType || "Other"}
                        </span>
                        <span>•</span>
                        <span>Proposal from {req.name}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {new Date(req._createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                      <span className="text-sm font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-100">
                        {budgetLabels[req.budget] || req.budget}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRequest(req);
                        }}
                        className="p-2 bg-cream hover:bg-primary/10 rounded-xl border border-primary/5 text-primary transition shadow-sm"
                        title="View Details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Selected Request Detail Panel */}
        {selectedRequest && (
          <div className="lg:col-span-5 bg-white border border-primary/10 rounded-3xl p-6 shadow-lg space-y-6 sticky top-6 animate-fadeIn">
            {/* Header Detail */}
            <div className="flex justify-between items-start border-b border-primary/5 pb-4">
              <div>
                <h3 className="text-xl font-bold text-primary font-serif">{selectedRequest.company}</h3>
                <p className="text-xs text-charcoal/60 mt-0.5 font-medium">Proposed by {selectedRequest.name}</p>
              </div>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-charcoal/40 hover:text-charcoal text-xl font-semibold transition"
              >
                &times;
              </button>
            </div>

            {/* Quick Status Update */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-primary font-bold">Update Proposal Status</label>
              <div className="flex gap-2">
                <select
                  value={selectedRequest.status}
                  onChange={(e) => handleStatusChange(selectedRequest._id, e.target.value)}
                  disabled={updatingId === selectedRequest._id}
                  className="flex-grow bg-cream border border-primary/10 rounded-xl px-3 py-2 text-sm font-semibold text-charcoal outline-none focus:border-primary"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="in_discussion">In Discussion</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="rejected">Rejected</option>
                </select>
                {updatingId === selectedRequest._id && (
                  <div className="flex items-center justify-center px-3 bg-cream rounded-xl border border-primary/5">
                    <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                  </div>
                )}
              </div>
            </div>

            {/* Core Info Fields */}
            <div className="space-y-4 text-sm font-semibold">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cream rounded-lg text-primary">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-bold">Email Address</p>
                  <a href={`mailto:${selectedRequest.email}`} className="text-secondary hover:text-primary transition">
                    {selectedRequest.email}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-cream rounded-lg text-primary">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-bold">Phone Number</p>
                  <p className="text-charcoal">{selectedRequest.phone || "Not Provided"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-cream rounded-lg text-primary">
                  <DollarSign className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-bold">Budget Range</p>
                  <p className="text-emerald-700">{budgetLabels[selectedRequest.budget] || selectedRequest.budget}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2 bg-cream rounded-lg text-primary">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-charcoal/40 uppercase tracking-wider font-bold">Web/Social Links</p>
                  {selectedRequest.links ? (
                    <a
                      href={selectedRequest.links}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-primary transition truncate max-w-[200px] block"
                    >
                      {selectedRequest.links}
                    </a>
                  ) : (
                    <p className="text-charcoal/50 font-medium">Not Provided</p>
                  )}
                </div>
              </div>
            </div>

            {/* Campaign Details Textbox */}
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-wider text-primary font-bold flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5" />
                Campaign & Collaboration Details
              </label>
              <div className="bg-cream/40 border border-primary/5 rounded-2xl p-4 text-xs leading-relaxed text-charcoal whitespace-pre-wrap max-h-48 overflow-y-auto font-medium">
                {selectedRequest.details}
              </div>
            </div>

            {/* Delete Request Section */}
            <div className="pt-4 border-t border-primary/5">
              {deleteConfirm === selectedRequest._id ? (
                <div className="flex items-center justify-between bg-rose-50 border border-rose-200 rounded-xl p-3">
                  <span className="text-xs text-rose-700 font-bold">Confirm delete?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleDelete(selectedRequest._id)}
                      disabled={deletingId === selectedRequest._id}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 disabled:opacity-50"
                    >
                      {deletingId === selectedRequest._id ? (
                        <RefreshCw className="w-3 h-3 animate-spin" />
                      ) : (
                        "Delete"
                      )}
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="px-3 py-1.5 bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg text-xs font-bold transition"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setDeleteConfirm(selectedRequest._id)}
                  className="w-full flex items-center justify-center gap-2 py-3 border border-rose-200 bg-rose-50/30 hover:bg-rose-600 text-rose-600 hover:text-white rounded-xl text-sm font-semibold transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete Request
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
