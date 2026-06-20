"use client";

import Link from "next/link";
import { Compass } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-cream/90 pt-16 pb-8 border-t border-secondary/30 mt-auto">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Col 1: About */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2 text-2xl font-serif font-bold text-accent tracking-wide">
            <Compass className="w-6 h-6 text-accent" />
            EXPLORUSH
          </Link>
          <p className="text-sm text-cream/70 font-sans leading-relaxed">
            Real journeys. Raw stories. Every trip a chapter, every destination a world undiscovered. Explore the world through the eyes of a creator.
          </p>
          {/* Social Links */}
          <div className="flex gap-4">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/30 hover:bg-secondary/60 rounded-full text-accent transition-all duration-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/30 hover:bg-secondary/60 rounded-full text-accent transition-all duration-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
              </svg>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/30 hover:bg-secondary/60 rounded-full text-accent transition-all duration-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 bg-secondary/30 hover:bg-secondary/60 rounded-full text-accent transition-all duration-300">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            </a>
          </div>
        </div>

        {/* Col 2: Navigation */}
        <div className="space-y-4">
          <h4 className="text-sm font-serif font-bold text-accent tracking-wider uppercase">Navigation</h4>
          <ul className="flex flex-col gap-2 font-sans text-sm">
            <li><Link href="/" className="hover:text-accent transition-colors duration-200">Home</Link></li>
            <li><Link href="/about" className="hover:text-accent transition-colors duration-200">About Us</Link></li>
            <li><Link href="/trips" className="hover:text-accent transition-colors duration-200">Destinations</Link></li>
            <li><Link href="/blogs" className="hover:text-accent transition-colors duration-200">Travel Blogs</Link></li>
            <li><Link href="/vlogs" className="hover:text-accent transition-colors duration-200">Vlogs</Link></li>
          </ul>
        </div>

        {/* Col 3: Categories */}
        <div className="space-y-4">
          <h4 className="text-sm font-serif font-bold text-accent tracking-wider uppercase">Content Info</h4>
          <ul className="flex flex-col gap-2 font-sans text-sm">
            <li><Link href="/trips" className="hover:text-accent transition-colors duration-200">Featured Group Tours</Link></li>
            <li><Link href="/blogs" className="hover:text-accent transition-colors duration-200">Travel Guides</Link></li>
            <li><Link href="/about" className="hover:text-accent transition-colors duration-200">Collaborations</Link></li>
            <li><Link href="/admin" className="hover:text-accent transition-colors duration-200">CMS Admin Dashboard</Link></li>
          </ul>
        </div>

        {/* Col 4: Newsletter */}
        <div className="space-y-4">
          <h4 className="text-sm font-serif font-bold text-accent tracking-wider uppercase">Newsletter</h4>
          <p className="text-xs text-cream/70 font-sans leading-relaxed">
            Subscribe to get notifications about upcoming group trips, workshops, and exclusive travel diaries.
          </p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 py-2 bg-secondary/20 border border-secondary/40 rounded-lg text-cream placeholder-cream/40 text-xs focus:outline-none focus:border-accent w-full"
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-accent hover:bg-accent/90 text-primary font-sans font-semibold text-xs uppercase rounded-lg transition-colors duration-300"
            >
              Join
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-secondary/20 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-cream/50 gap-4">
        <p>© {new Date().getFullYear()} Explorush. All rights reserved.</p>
        <p className="flex gap-4">
          <Link href="/" className="hover:text-accent">Terms of Service</Link>
          <Link href="/" className="hover:text-accent">Privacy Policy</Link>
        </p>
      </div>
    </footer>
  );
}
