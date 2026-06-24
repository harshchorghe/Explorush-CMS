"use client";

import { useState } from "react";
import {
  Send,
  CheckCircle2,
  User,
  Mail,
  FileText,
  Phone,
  Briefcase,
  IndianRupee,
  Link2,
  Download,
  AlertCircle,
  RefreshCw
} from "lucide-react";

type MediaKitInfo = {
  title: string;
  fileUrl: string;
} | null;

export default function ContactSection({ mediaKit }: { mediaKit?: MediaKitInfo }) {
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    collabType: "brand_sponsorship",
    budget: "flexible",
    details: "",
    links: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/collaboration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (data.success) {
        setIsSubmitted(true);
        setFormData({
          name: "",
          company: "",
          email: "",
          phone: "",
          collabType: "brand_sponsorship",
          budget: "flexible",
          details: "",
          links: "",
        });
      } else {
        setError(data.error || "Failed to submit request. Please try again.");
      }
    } catch (err: any) {
      console.error("Submission error:", err);
      setError("A network error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="collaborate" className="py-24 bg-cream border-t border-primary/5">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
            Work with us
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
            Let's Collaborate
          </h2>
          <p className="text-charcoal/70 text-sm max-w-md mx-auto leading-relaxed">
            Partner with Explorush on brand sponsorships, high-end content creation, hotel reviews, or destination marketing.
          </p>
        </div>

        {/* Content Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Brand Statement & Media Kit */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white border border-primary/10 rounded-3xl p-8 shadow-sm space-y-6">
              <h3 className="text-2xl font-serif font-bold text-primary">Partnering with Explorush</h3>
              
              <p className="text-sm text-charcoal/80 leading-relaxed">
                Explorush is more than a travel blog—it's an interactive storytelling hub that inspires a highly engaged circle of global explorers. By combining high-definition travel photography, cinematic vlogs, and custom digital experiences, we build real connections with our audience.
              </p>

              <div className="space-y-4 border-t border-primary/5 pt-6">
                <h4 className="text-xs uppercase tracking-wider text-primary font-bold">Key Niches</h4>
                <div className="flex flex-wrap gap-2">
                  {["Adventure Travel", "Sustainable Tourism", "Tech & Gear Reviews", "Hotel & Resort Features", "Itineraries"].map((niche) => (
                    <span
                      key={niche}
                      className="text-[11px] font-semibold text-secondary bg-secondary/10 px-3 py-1 rounded-full"
                    >
                      {niche}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Media Kit Card */}
            <div className="bg-primary text-cream rounded-3xl p-8 relative overflow-hidden shadow-lg group">
              {/* Decorative grid */}
              <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:25px_25px]" />
              
              <div className="relative z-10 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-accent text-primary rounded-2xl shadow-md group-hover:scale-105 transition-transform duration-300">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-lg text-white">Press & Media Kit</h4>
                    <p className="text-[10px] uppercase tracking-wider text-accent font-bold">Sponsorship Blueprint</p>
                  </div>
                </div>

                <p className="text-xs text-cream/80 leading-relaxed">
                  Download our official media kit for comprehensive insights on audience demographics, engagement metrics, past collaborations, and pricing details.
                </p>

                {mediaKit?.fileUrl ? (
                  <a
                    href={mediaKit.fileUrl}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3.5 bg-accent hover:bg-accent/90 text-primary font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition duration-300 flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-98"
                  >
                    <Download className="w-4 h-4 text-primary" />
                    Download Media Kit
                  </a>
                ) : (
                  <div className="w-full py-3.5 bg-secondary/25 border border-secondary/35 text-cream/70 font-sans font-bold text-xs uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 select-none">
                    <AlertCircle className="w-4 h-4 text-accent" />
                    Media Kit Coming Soon
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-7 bg-white border border-primary/10 rounded-3xl p-8 md:p-10 shadow-xl relative overflow-hidden transition-all duration-300">
            {isSubmitted ? (
              /* Success State */
              <div className="text-center py-16 flex flex-col items-center justify-center gap-6 animate-scaleIn">
                <div className="p-4 bg-accent/10 text-accent rounded-full border border-accent/20">
                  <CheckCircle2 className="w-16 h-16 text-primary fill-accent animate-pulse" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-serif font-bold text-primary">
                    Proposal Logged!
                  </h3>
                  <p className="text-sm text-charcoal/70 max-w-sm mx-auto leading-relaxed font-sans font-medium">
                    Thank you for your interest. Your collaboration details have been saved, and an email confirmation has been dispatched. Harsh will get back to you shortly.
                  </p>
                </div>
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 px-6 py-3 bg-primary text-cream hover:bg-secondary font-sans font-semibold tracking-wider text-xs uppercase rounded-lg shadow transition-colors duration-300 cursor-pointer"
                >
                  Send Another Request
                </button>
              </div>
            ) : (
              /* Form Fields */
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {error && (
                  <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-100 rounded-xl p-4 text-sm font-semibold">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                      Full Name *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-charcoal/40">
                        <User className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Harsh Chorghe"
                        className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-primary focus:bg-white text-charcoal transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Company / Brand Name */}
                  <div className="space-y-2">
                    <label htmlFor="company" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                      Company / Brand Name *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-charcoal/40">
                        <Briefcase className="w-4 h-4" />
                      </span>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="e.g. GoPro, Tourism Switzerland"
                        className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-primary focus:bg-white text-charcoal transition-all duration-300"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                      Email Address *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-charcoal/40">
                        <Mail className="w-4 h-4" />
                      </span>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="e.g. partner@company.com"
                        className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-primary focus:bg-white text-charcoal transition-all duration-300"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-charcoal/40">
                        <Phone className="w-4 h-4" />
                      </span>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="e.g. +1 (555) 019-2834"
                        className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-primary focus:bg-white text-charcoal transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Collaboration Type */}
                  <div className="space-y-2">
                    <label htmlFor="collabType" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                      Collaboration Type *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-charcoal/40">
                        <Briefcase className="w-4 h-4" />
                      </span>
                      <select
                        id="collabType"
                        name="collabType"
                        value={formData.collabType}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-primary focus:bg-white text-charcoal transition-all duration-300 outline-none appearance-none cursor-pointer"
                      >
                        <option value="brand_sponsorship">Brand Sponsorship</option>
                        <option value="destination_marketing">Destination Marketing</option>
                        <option value="hotel_resort_review">Hotel/Resort Review</option>
                        <option value="content_creation">Content Creation</option>
                        <option value="group_trip_partnership">Group Trip Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  {/* Budget Range */}
                  <div className="space-y-2">
                    <label htmlFor="budget" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                      Budget Range *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-3.5 text-charcoal/40">
                        <IndianRupee className="w-4 h-4" />
                      </span>
                      <select
                        id="budget"
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-primary focus:bg-white text-charcoal transition-all duration-300 outline-none appearance-none cursor-pointer"
                      >
                        <option value="under_1k">Under ₹1,000</option>
                        <option value="1k_5k">₹1,000 - ₹5,000</option>
                        <option value="5k_10k">₹5,000 - ₹10,000</option>
                        <option value="10k_plus">₹10,000+</option>
                        <option value="flexible">Flexible / Contact Us</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Website / Social Media Links */}
                <div className="space-y-2">
                  <label htmlFor="links" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                    Website or Social Media Links
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3.5 text-charcoal/40">
                      <Link2 className="w-4 h-4" />
                    </span>
                    <input
                      type="url"
                      id="links"
                      name="links"
                      value={formData.links}
                      onChange={handleChange}
                      placeholder="e.g. https://instagram.com/yourbrand"
                      className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-primary focus:bg-white text-charcoal transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="space-y-2">
                  <label htmlFor="details" className="text-xs uppercase tracking-wider text-primary font-bold font-sans">
                    Campaign & Collaboration Details *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-charcoal/40">
                      <FileText className="w-4 h-4" />
                    </span>
                    <textarea
                      id="details"
                      name="details"
                      rows={5}
                      value={formData.details}
                      onChange={handleChange}
                      placeholder="Outline your proposal, goals, timeline, and key deliverables..."
                      className="w-full pl-10 pr-4 py-3 bg-cream/35 border border-primary/10 rounded-xl font-sans text-sm focus:outline-none focus:border-primary focus:bg-white text-charcoal transition-all duration-300 resize-y"
                      required
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-primary font-sans font-semibold tracking-widest text-sm uppercase rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 transform active:scale-95 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <RefreshCw className="animate-spin h-5 w-5 text-primary" />
                      Logging Proposal...
                    </span>
                  ) : (
                    <>
                      <Send className="w-4 h-4 fill-primary stroke-none" />
                      Submit Proposal
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
