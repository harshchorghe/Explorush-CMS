"use client";

import { useState } from "react";
import Link from "next/link";
import { Compass, X, AlertCircle } from "lucide-react";

export default function Footer() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [issueType, setIssueType] = useState("bug");
  const [description, setDescription] = useState("");

  const handleSubmitIssue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const subject = `[Explorush Support] ${issueType.toUpperCase()}: ${description.slice(0, 30)}${description.length > 30 ? "..." : ""}`;
    const body = `Hello Explorush Team,

I am reporting the following issue or providing feedback on Explorush.

Category: ${issueType.toUpperCase()}
Description:
${description}

--
Sent from Explorush App`;

    const mailtoUrl = `mailto:explorushofficial@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;

    setDescription("");
    setIsModalOpen(false);
  };
  return (
    <footer className="bg-primary text-cream/90 pt-6 pb-4 border-t border-secondary/30 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-y-6 md:gap-x-8">
        {/* Col 1: About */}
        <div className="space-y-3">
          <Link href="/" className="flex items-center gap-2 text-xl font-serif font-bold text-accent tracking-wide">
            <Compass className="w-5 h-5 text-accent" />
            EXPLORUSH
          </Link>
          <p className="text-xs text-cream/70 font-sans leading-relaxed max-w-sm">
            Real journeys. Raw stories. Every trip a chapter, every destination a world undiscovered. Explore the world through the eyes of a creator.
          </p>
          {/* Social Links */}
          <div className="flex gap-3 pt-1">
            <a href="https://www.instagram.com/_explorush_/" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/30 hover:bg-secondary/60 rounded-full text-accent transition-all duration-300" title="Instagram">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://www.youtube.com/@Harsh_Chorghe" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/30 hover:bg-secondary/60 rounded-full text-accent transition-all duration-300" title="YouTube">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
            <a href="https://www.linkedin.com/in/harsh-chorghe-4b65b231b/" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/30 hover:bg-secondary/60 rounded-full text-accent transition-all duration-300" title="LinkedIn">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-2">
          <h4 className="text-xs font-serif font-bold text-accent tracking-wider uppercase">Navigation</h4>
          <ul className="flex flex-col gap-1.5 font-sans text-xs">
            <li><Link href="/" className="hover:text-accent transition-colors duration-200">Home</Link></li>
            <li><Link href="/about" className="hover:text-accent transition-colors duration-200">About Us</Link></li>
            <li><Link href="/trips" className="hover:text-accent transition-colors duration-200">Destinations</Link></li>
            <li><Link href="/blogs" className="hover:text-accent transition-colors duration-200">Travel Blogs</Link></li>
            <li><Link href="/vlogs" className="hover:text-accent transition-colors duration-200">Vlogs</Link></li>
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div className="space-y-2">
          <h4 className="text-xs font-serif font-bold text-accent tracking-wider uppercase">Content Info</h4>
          <ul className="flex flex-col gap-1.5 font-sans text-xs">
            <li><Link href="/trips" className="hover:text-accent transition-colors duration-200">Featured Group Tours</Link></li>
            <li><Link href="/blogs" className="hover:text-accent transition-colors duration-200">Travel Guides</Link></li>
            <li><Link href="/about" className="hover:text-accent transition-colors duration-200">Collaborations</Link></li>
            <li>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="hover:text-accent transition-colors duration-200 text-left font-sans text-xs focus:outline-none"
              >
                Report an Issue
              </button>
            </li>
            <li><Link href="/admin" className="hover:text-accent transition-colors duration-200">CMS Admin Dashboard</Link></li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div className="space-y-2">
          <h4 className="text-xs font-serif font-bold text-accent tracking-wider uppercase">Newsletter</h4>
          <p className="text-[11px] text-cream/70 font-sans leading-relaxed">
            Subscribe to get notifications about upcoming group trips, workshops, and exclusive travel diaries.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2 pt-1">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 py-1.5 bg-secondary/20 border border-secondary/40 rounded-lg text-cream placeholder-cream/40 text-xs focus:outline-none focus:border-accent w-full"
              required
            />
            <button
              type="submit"
              className="px-3 py-1.5 bg-accent hover:bg-accent/90 text-primary font-sans font-semibold text-xs uppercase rounded-lg transition-colors duration-300"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-secondary/20 mt-6 pt-3 flex flex-col md:flex-row items-center justify-between text-[11px] text-cream/50 gap-3">
        <p>© {new Date().getFullYear()} Explorush. All rights reserved.</p>
        <p className="flex gap-4">
          <Link href="/" className="hover:text-accent">Terms of Service</Link>
          <Link href="/" className="hover:text-accent">Privacy Policy</Link>
        </p>
      </div>

      {/* Support & Issue Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-primary/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-cream border border-secondary/35 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative p-6 space-y-4 text-charcoal">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="p-1.5 rounded-full text-charcoal/60 hover:text-primary hover:bg-secondary/20 transition-all duration-300 absolute top-4 right-4"
              aria-label="Close modal"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Header */}
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-lg text-primary flex items-center gap-2">
                <Compass className="w-5 h-5 text-accent animate-spin-slow" />
                Report an Issue
              </h3>
              <p className="text-xs text-charcoal/60">
                Help us improve Explorush. Share what went wrong, and we will open a free email draft for you to send.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitIssue} className="space-y-4 pt-1">
              {/* Category */}
              <div className="space-y-1">
                <label htmlFor="issue-category" className="text-[10px] uppercase tracking-wider text-primary font-bold">
                  Issue Type
                </label>
                <select
                  id="issue-category"
                  value={issueType}
                  onChange={(e) => setIssueType(e.target.value)}
                  className="w-full px-3 py-2.5 bg-white border border-primary/10 rounded-xl font-sans text-xs focus:outline-none focus:border-primary text-charcoal outline-none cursor-pointer"
                >
                  <option value="bug">Bug / Technical Issue</option>
                  <option value="content_error">Content Error</option>
                  <option value="feature_request">Feature Request</option>
                  <option value="general_feedback">General Feedback</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label htmlFor="issue-description" className="text-[10px] uppercase tracking-wider text-primary font-bold">
                  Problem Description *
                </label>
                <textarea
                  id="issue-description"
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe the issue in detail. If applicable, mention the page URL or what action caused the error..."
                  className="w-full px-3 py-2.5 bg-white border border-primary/10 rounded-xl font-sans text-xs focus:outline-none focus:border-primary text-charcoal outline-none resize-none h-28"
                />
              </div>

              {/* Notice */}
              <p className="text-[10px] text-charcoal/50 leading-relaxed">
                Clicking submit will open a draft email pre-filled with your description using your device's native email client. Sending is 100% free.
              </p>

              {/* Submit */}
              <button
                type="submit"
                className="w-full py-3 bg-accent hover:bg-accent/90 text-primary font-sans font-bold text-xs uppercase tracking-widest rounded-xl transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2 transform active:scale-98 cursor-pointer"
              >
                Open Email Draft
              </button>
            </form>
          </div>
        </div>
      )}
    </footer>
  );
}
