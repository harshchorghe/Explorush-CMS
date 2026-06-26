import { client } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import FeaturedBlogs from "@/components/home/FeaturedBlogs";
import UpcomingToursSection from "@/components/home/UpcomingToursSection";
import VlogsSection from "@/components/home/VlogsSection";
import GlobalFootprints from "@/components/home/GlobalFootprints";
import GallerySection from "@/components/home/GallerySection";
import ContactSection from "@/components/home/ContactSection";
import HeroSection from "@/components/home/HeroSection";
import { Compass, BookOpen, Clock, Calendar, Check, ArrowRight } from "lucide-react";
import WebsiteTour, { WebsiteTourSettings } from "@/components/home/WebsiteTour";

export const revalidate = 0;
export const dynamic = "force-dynamic";

type SanityImage = {
  asset?: {
    url?: string;
  };
};

type TripPreviewItem = {
  _id: string;
  title: string;
  slug?: { current?: string };
  location?: string;
  type?: string;
  budget?: string;
  description?: string;
  coverImage?: SanityImage;
  gallery?: { url: string }[];
  startDate?: string;
  latitude?: number;
  longitude?: number;
};

type BlogPreviewItem = {
  _id: string;
  title: string;
  slug?: { current?: string };
  coverImage?: SanityImage;
  _createdAt: string;
  category?: { title: string };
  content: string;
};

type VlogPreviewItem = {
  _id: string;
  title: string;
  slug?: { current?: string };
  videoUrl?: string;
  thumbnail?: SanityImage;
};

type AuthorItem = {
  name: string;
  bio?: string;
  image?: SanityImage;
};

type UpcomingTourPreviewItem = {
  _id: string;
  title: string;
  slug?: { current?: string };
  location?: string;
  type?: string;
  price?: string;
  totalSlots?: number;
  bookedSlots?: number;
  startDate?: string;
  endDate?: string;
  coverImage?: SanityImage;
  author?: { name: string };
};

type HomePageData = {
  trips: TripPreviewItem[];
  blogs: BlogPreviewItem[];
  vlogs: VlogPreviewItem[];
  author: AuthorItem | null;
  hero: {
    title?: string;
    images?: {
      caption?: string;
      subtitle?: string;
      image?: SanityImage;
    }[];
  } | null;
  upcomingTours: UpcomingTourPreviewItem[];
  totalTripsCount: number;
  totalBlogsCount: number;
  totalVlogsCount: number;
  totalUpcomingToursCount: number;
  mediaKit: {
    title: string;
    fileUrl: string;
  } | null;
  websiteTour: WebsiteTourSettings | null;
};

async function getHomepageData() {
  return await client.fetch<HomePageData>(
    `{
      "trips": *[_type == "trip"] | order(startDate desc)[0...8]{
        _id, title, slug, location, type, budget, description,
        coverImage{ asset->{ url } },
        gallery[]{ "url": asset->url },
        startDate,
        latitude,
        longitude
      },
      "blogs": *[_type == "blog"] | order(_createdAt desc)[0...6]{
        _id, title, slug, coverImage{ asset->{ url } },
        _createdAt, category->{ title }, content
      },
      "vlogs": *[_type == "vlog"] | order(_createdAt desc)[0...6]{
        _id, title, slug, videoUrl,
        thumbnail{ asset->{ url } }
      },
      "author": *[_type == "author"][0]{
        name, bio, image{ asset->{ url } }
      },
      "hero": *[_type == "hero"] | order(count(images) desc, _updatedAt desc)[0]{
        title,
        images[]{
          caption,
          subtitle,
          image{ asset->{ url } }
        }
      },
      "upcomingTours": *[_type == "upcomingTour"] | order(startDate asc)[0...3]{
        _id, title, slug, location, type, price, totalSlots, bookedSlots, startDate, endDate,
        coverImage{ asset->{ url } },
        author->{ name }
      },
      "totalTripsCount": count(*[_type == "trip"]),
      "totalBlogsCount": count(*[_type == "blog"]),
      "totalVlogsCount": count(*[_type == "vlog"]),
      "totalUpcomingToursCount": count(*[_type == "upcomingTour"]),
      "mediaKit": *[_type == "mediaKit" && _id == "media-kit-singleton"][0] {
        title,
        "fileUrl": file.asset->url
      },
      "websiteTour": *[_type == "websiteTourSettings"][0] {
        title,
        videoUrl,
        thumbnail{ asset->{ url } },
        description,
        buttonText,
        enableTour,
        showOnlyOnMobile,
        autoShowOnFirstVisit,
        showOnlyOnce
      }
    }`,
    {},
    {
      cache: "no-store",
      next: { revalidate: 0 }
    }
  );
}

export default async function HomePage() {
  const {
    trips,
    blogs,
    vlogs,
    author,
    hero,
    upcomingTours,
    totalTripsCount,
    totalBlogsCount,
    totalVlogsCount,
    totalUpcomingToursCount,
    mediaKit,
    websiteTour
  } = await getHomepageData();
  console.log("HOMEPAGE HERO DATA FETCHED:", JSON.stringify(hero, null, 2));

  // Dynamic statistics labels from CMS
  const tripsCountLabel = `${totalTripsCount || 0}+`;
  const vlogsCountLabel = `${totalVlogsCount || 0}+`;
  const blogsCountLabel = `${totalBlogsCount || 0}+`;
  const upcomingCountLabel = `${totalUpcomingToursCount || 0}+`;

  // Extract gallery images from CMS trips with trip details
  const galleryImages = trips
    .flatMap((trip) => {
      const gallery = trip.gallery || [];
      return gallery.map((img) => ({
        url: img.url,
        alt: img.url ? `${trip.title} - Snapshot` : "Expedition snapshot",
        tripTitle: trip.title || "Adventure",
        location: trip.location || ""
      }));
    })
    .filter((img): img is { url: string; alt: string; tripTitle: string; location: string } => !!(img && img.url));

  // Upcoming Trips (trips starting after today, or just latest 3 trips as featured group tours)
  const upcomingTrips = trips.slice(0, 3);

  // Helper to calculate reading time
  const getReadingTime = (text?: string) => {
    if (!text) return "3 min read";
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200); // 200 words per minute average reading speed
    return `${minutes} min read`;
  };

  const tickerItems = [
    "EXPEDITIONS", "TRAVEL VLOGS", "JOURNAL ENTRIES", "WANDERLUST", "ADVENTURES", "LOCAL DIARIES"
  ];
  const ticker = [...tickerItems, ...tickerItems, ...tickerItems];

  // Grayscale partner brands matching reference layout
  const partnerBrands = [
    { name: "BhargavEdits", logo: "BhargavEdits" },
    { name: "ChaseTheTastes", logo: "ChaseTheTastes" },
    { name: "Explorush", logo: "Explorush" },
    { name: "RecipeTadka", logo: "RecipeTadka" },
  ];
  const brandMarquee = [...partnerBrands, ...partnerBrands, ...partnerBrands];

  return (
    <>
      <Navbar />

      <main className="bg-cream min-h-screen text-charcoal overflow-x-hidden font-sans">
        {/* ── HERO SECTION WITH SMOOTH SLIDESHOW & BLENDED TRANSITIONS ── */}
        <HeroSection hero={hero} authorBio={author?.bio} />

        {/* ── STATISTICS CARDS OVERLAY ── */}
        <section className="relative z-20 -mt-16 max-w-5xl mx-auto px-6">
          <div className="bg-white rounded-2xl border border-primary/5 p-6 md:p-8 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-y-6 md:gap-y-0">
            {[
              { num: tripsCountLabel, label: "Total Trips" },
              { num: vlogsCountLabel, label: "Travel Vlogs" },
              { num: blogsCountLabel, label: "Travel Stories" },
              { num: upcomingCountLabel, label: "Upcoming Trips & Events" },
            ].map((stat, idx) => {
              // Custom borders to create a symmetric cross separator (+) on mobile and vertical dividers on desktop
              let borderClass = "";
              if (idx === 0) {
                borderClass = "border-r border-b border-primary/5 md:border-b-0 pb-4 md:pb-0";
              } else if (idx === 1) {
                borderClass = "border-b border-primary/5 md:border-b-0 md:border-r pb-4 md:pb-0";
              } else if (idx === 2) {
                borderClass = "border-r border-primary/5 md:border-r pt-4 md:pt-0";
              } else if (idx === 3) {
                borderClass = "pt-4 md:pt-0";
              }

              return (
                <div
                  key={idx}
                  className={`text-center flex flex-col justify-center items-center ${borderClass}`}
                >
                  <div className="text-3xl font-serif font-bold text-primary">
                    {stat.num}
                  </div>
                  <div className="text-[10px] text-charcoal/50 uppercase tracking-wider font-bold mt-1.5 font-sans">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ── WEBSITE TOUR SECTION ── */}
        <WebsiteTour settings={websiteTour} />

        {/* ── TICKER TAPE MARQUEE ── */}
        <div className="bg-primary border-y border-white/5 overflow-hidden py-6 mt-0 select-none">
          <div className="flex gap-16 whitespace-nowrap animate-marquee w-max">
            {ticker.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-sans font-bold tracking-widest text-white">
                <span>✦</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── ABOUT CREATOR SECTION ── */}
        <section className="py-16 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left image */}
          <div className="lg:col-span-5 relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
            <Image
              src="/about_me.jpg"
              alt={author?.name || "Harsh Chorghe"}
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>

          {/* Right Bio */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs uppercase tracking-widest text-secondary font-semibold font-sans">
              About Explorush
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary">
              Hey, I'm {author?.name || "Harsh Chorghe"}
            </h2>
            <p className="text-base text-charcoal/80 leading-relaxed font-sans">
              {author?.bio ||
                "I'm a traveler, creator, and developer who believes that every journey has a story worth sharing. Through Explorush, I share travel stories, destination guides, hidden gems, practical tips, and unforgettable experiences from the road to help fellow travelers discover new places and travel smarter."}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-primary/10">
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-primary text-lg">My Travel Mission</h4>
                <p className="text-sm text-charcoal/70 leading-relaxed font-sans">
                  To help fellow travelers discover new places, travel smarter, and create memories that last a lifetime through authentic stories and guides.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-serif font-bold text-primary text-lg">Personal Story</h4>
                <p className="text-sm text-charcoal/70 leading-relaxed font-sans">
                  What started as a passion for exploring new places slowly turned into a desire to document experiences, connect with people, and inspire others.
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-serif font-bold text-primary hover:text-accent transition-colors duration-300"
              >
                Read Full Bio Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── SOCIAL CONNECT SECTION ── */}
        <section className="py-12 bg-[#1F4B43] border-y border-primary/5">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/_explorush_/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white border border-white/10 hover:border-accent hover:bg-cream rounded-2xl p-6 transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-yellow-500 via-red-500 to-purple-600 flex items-center justify-center text-white shadow-sm shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-primary text-base">Instagram</h4>
                    <p className="text-xs text-charcoal/60 font-sans">@explorush • Daily Updates</p>
                  </div>
                </div>
                <span className="text-primary group-hover:text-accent font-sans font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1 transition-colors">
                  Follow <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              {/* YouTube */}
              <a
                href="https://www.youtube.com/@Harsh_Chorghe"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white border border-white/10 hover:border-accent hover:bg-cream rounded-2xl p-6 transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-sm shrink-0">
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                      <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-primary text-base">YouTube</h4>
                    <p className="text-xs text-charcoal/60 font-sans">@explorush • Travel Films</p>
                  </div>
                </div>
                <span className="text-primary group-hover:text-accent font-sans font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1 transition-colors">
                  Subscribe <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              {/* LinkedIn */}
              <a
                href="https://www.linkedin.com/in/harsh-chorghe-4b65b231b/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-white border border-white/10 hover:border-accent hover:bg-cream rounded-2xl p-6 transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-md hover:-translate-y-1"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#0077B5] flex items-center justify-center text-white shadow-sm shrink-0">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect x="2" y="9" width="4" height="12" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-primary text-base">LinkedIn</h4>
                    <p className="text-xs text-charcoal/60 font-sans">Harsh Chorghe • Professional</p>
                  </div>
                </div>
                <span className="text-primary group-hover:text-accent font-sans font-bold text-xs uppercase tracking-wider inline-flex items-center gap-1 transition-colors">
                  Connect <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </a>
            </div>
          </div>
        </section>

        {/* ── FEATURED DESTINATIONS CAROUSEL ── */}
        <FeaturedDestinations trips={trips} />

        {/* ── TRAVEL VLOGS SECTION ── */}
        <VlogsSection vlogs={vlogs} />

        {/* ── GLOBAL FOOTPRINTS INTERACTIVE MAP ── */}
        <GlobalFootprints trips={trips} />

        {/* ── PINTEREST TRAVEL GALLERY ── */}
        <GallerySection images={galleryImages} />

        {/* ── TRAVEL BLOGS SECTION ── */}
        <FeaturedBlogs blogs={blogs} />

        {/* ── UPCOMING TRIPS & EVENTS SECTION ── */}
        <UpcomingToursSection upcomingTours={upcomingTours} author={author} />

        {/* ── BRAND COLLABORATIONS STRIP ── */}
        <section className="py-12 bg-primary text-cream relative overflow-hidden">
          {/* Decorative grids */}
          <div className="absolute inset-0 opacity-5 pointer-events-none bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:30px_30px]" />

          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <h4 className="text-center text-xs uppercase tracking-widest text-accent font-bold font-sans mb-8">
              Trusted Partner Brands
            </h4>
          </div>

          <div className="bg-white border-y border-accent/30 overflow-hidden py-8 select-none relative z-10">
            <div className="flex gap-20 whitespace-nowrap animate-marquee w-max">
              {brandMarquee.map((partner, idx) => (
                <div
                  key={idx}
                  className="font-serif font-bold text-2xl md:text-3xl text-primary/50 tracking-widest uppercase grayscale hover:grayscale-0 hover:text-accent transition-all duration-300 select-none cursor-default inline-flex items-center"
                >
                  {partner.logo}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT US FORM SECTION ── */}
        <ContactSection mediaKit={mediaKit} />
      </main>

      <Footer />
    </>
  );
}