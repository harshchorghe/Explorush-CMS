import { client } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import VlogsSection from "@/components/home/VlogsSection";
import GlobalFootprints from "@/components/home/GlobalFootprints";
import GallerySection from "@/components/home/GallerySection";
import ContactSection from "@/components/home/ContactSection";
import HeroSection from "@/components/home/HeroSection";
import { Compass, BookOpen, Clock, Calendar, Check, ArrowRight } from "lucide-react";

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
};

async function getHomepageData() {
  return await client.fetch<HomePageData>(
    `{
      "trips": *[_type == "trip"] | order(startDate desc)[0...8]{
        _id, title, slug, location, type, description,
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
    mediaKit
  } = await getHomepageData();
  console.log("HOMEPAGE HERO DATA FETCHED:", JSON.stringify(hero, null, 2));

  // Dynamic statistics labels from CMS
  const tripsCountLabel = `${totalTripsCount || 0}+`;
  const vlogsCountLabel = `${totalVlogsCount || 0}+`;
  const blogsCountLabel = `${totalBlogsCount || 0}+`;
  const upcomingCountLabel = `${totalUpcomingToursCount || 0}+`;

  // Extract gallery images from CMS trips
  const galleryImages = trips
    .flatMap((trip) => trip.gallery || [])
    .filter((img): img is { url: string } => !!(img && img.url))
    .map((img) => ({ url: img.url, alt: "Expedition snapshot" }));

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
          <div className="bg-white rounded-2xl border border-primary/5 p-6 md:p-8 shadow-xl grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 divide-y md:divide-y-0 md:divide-x divide-primary/5">
            {[
              { num: tripsCountLabel, label: "Total Trips" },
              { num: vlogsCountLabel, label: "Travel Vlogs" },
              { num: blogsCountLabel, label: "Travel Stories" },
              { num: upcomingCountLabel, label: "Upcoming Trips & Events" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`text-center flex flex-col justify-center items-center py-4 md:py-0 ${idx >= 2 ? "pt-4 md:pt-0" : ""
                  }`}
              >
                <div className="text-3xl font-serif font-bold text-primary">
                  {stat.num}
                </div>
                <div className="text-[10px] text-charcoal/50 uppercase tracking-wider font-bold mt-1.5 font-sans">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── TICKER TAPE MARQUEE ── */}
        <div className="bg-secondary/15 border-y border-primary/5 overflow-hidden py-4 mt-16 select-none">
          <div className="flex gap-16 whitespace-nowrap animate-marquee w-max">
            {ticker.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 text-xs font-sans font-bold tracking-widest text-primary/70">
                <span>✦</span>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* ── ABOUT CREATOR SECTION ── */}
        <section className="py-24 max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Left image */}
          <div className="lg:col-span-5 relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50">
            <Image
              src={
                author?.image?.asset?.url ||
                "https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800&q=80"
              }
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

        {/* ── FEATURED DESTINATIONS CAROUSEL ── */}
        <FeaturedDestinations trips={trips} />

        {/* ── TRAVEL VLOGS SECTION ── */}
        <VlogsSection vlogs={vlogs} />

        {/* ── GLOBAL FOOTPRINTS INTERACTIVE MAP ── */}
        <GlobalFootprints trips={trips} />

        {/* ── PINTEREST TRAVEL GALLERY ── */}
        <GallerySection images={galleryImages} />

        {/* ── TRAVEL BLOGS SECTION ── */}
        <section className="py-20 bg-cream border-t border-primary/5">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-secondary font-semibold font-sans">
                  Read Articles
                </span>
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2">
                  Magazine-Style Blogs
                </h2>
              </div>
              <Link
                href="/blogs"
                className="inline-flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-widest text-primary hover:text-accent border-b border-primary/20 pb-1 transition-colors duration-300"
              >
                View All Articles
              </Link>
            </div>

            {/* Blog Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-2xl overflow-hidden border border-primary/5 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col group"
                >
                  {/* Image */}
                  <Link
                    href={blog.slug?.current ? `/blogs/${blog.slug.current}` : "/blogs"}
                    className="relative h-56 overflow-hidden block"
                  >
                    {blog.coverImage?.asset?.url ? (
                      <Image
                        src={blog.coverImage.asset.url}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 380px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-secondary/10 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-secondary/30" />
                      </div>
                    )}
                  </Link>

                  {/* Body */}
                  <div className="p-6 flex-grow flex flex-col justify-between">
                    <div>
                      {/* Meta info */}
                      <div className="flex items-center gap-3 text-[10px] uppercase font-sans font-bold text-secondary tracking-widest mb-3">
                        <span className="bg-primary/5 px-2.5 py-1 rounded">
                          {blog.category?.title || "Guide"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {getReadingTime(blog.content)}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-primary mb-3 line-clamp-2 group-hover:text-accent transition-colors duration-200">
                        <Link href={blog.slug?.current ? `/blogs/${blog.slug.current}` : "/blogs"}>
                          {blog.title}
                        </Link>
                      </h3>

                      <p className="text-sm text-charcoal/70 line-clamp-3 leading-relaxed font-sans mb-4">
                        {blog.content}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-primary/5 flex justify-between items-center text-xs text-charcoal/50 font-sans font-semibold">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(blog._createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                      <Link
                        href={blog.slug?.current ? `/blogs/${blog.slug.current}` : "/blogs"}
                        className="text-primary hover:text-accent font-serif font-bold flex items-center gap-1 transition-colors duration-200 text-sm"
                      >
                        Read Post <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* ── UPCOMING TRIPS & EVENTS SECTION ── */}
        <section className="py-20 bg-cream border-t border-primary/5">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-16">
              <span className="text-xs uppercase tracking-widest text-secondary font-semibold font-sans">
                Join the Adventure
              </span>
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2">
                Upcoming Group Tours & Events
              </h2>
              <p className="text-charcoal/70 text-sm max-w-md mx-auto mt-4 font-sans leading-relaxed">
                Connect with our explorer circle. Reserve a slot on group hikes, photography workshops, and virtual meetups.
              </p>
            </div>

            {/* Event Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {upcomingTours.length === 0 ? (
                <div className="col-span-3 text-center py-12 text-charcoal/60 font-sans font-medium bg-white/50 border border-primary/5 rounded-2xl">
                  No upcoming group tours scheduled at the moment. Check back soon or contact us to plan a custom trip!
                </div>
              ) : (
                upcomingTours.map((tour) => {
                  const slotsLeft = (tour.totalSlots || 0) - (tour.bookedSlots || 0);
                  const isFilled = slotsLeft <= 0;
                  const slotsLabel = isFilled ? "Filled" : `${slotsLeft} slots left`;

                  const dateLabel = tour.startDate
                    ? `${new Date(tour.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })} — ${new Date(tour.endDate || tour.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}`
                    : "Flexible dates";

                  const priceLabel = tour.price ? `${tour.price} / person` : "Contact Us";

                  return (
                    <div
                      key={tour._id}
                      className="bg-white border border-primary/10 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Badge info */}
                        <div className="flex justify-between items-center mb-4">
                          <span className="text-[10px] text-accent bg-primary font-sans font-bold uppercase tracking-widest px-2.5 py-1 rounded capitalize">
                            {tour.type || "Expedition"}
                          </span>
                          <span className={`text-[10px] font-sans font-bold uppercase tracking-wider ${isFilled ? "text-red-500" : "text-emerald-600"
                            }`}>
                            {slotsLabel}
                          </span>
                        </div>

                        <h3 className="text-2xl font-serif font-bold text-primary mb-2 line-clamp-2 leading-tight min-h-[3.5rem]">
                          {tour.title}
                        </h3>
                        <p className="text-xs text-charcoal/50 uppercase font-sans tracking-wider font-semibold mb-4 truncate">
                          📍 {tour.location || "Online / Flexible"}
                        </p>

                        <ul className="space-y-2 border-t border-primary/5 pt-4 text-sm text-charcoal/70 font-sans mb-6">
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-accent" />
                            <span>Dates: {dateLabel}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-accent" />
                            <span>Cost: {priceLabel}</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Check className="w-4 h-4 text-accent" />
                            <span>Guided by {tour.author?.name || author?.name || "Harsh"}</span>
                          </li>
                        </ul>
                      </div>

                      <Link
                        href={tour.slug?.current ? `/upcoming-tours/${tour.slug.current}` : "/upcoming-tours"}
                        className="w-full text-center py-3 bg-primary hover:bg-secondary text-cream text-xs font-sans font-semibold uppercase tracking-wider rounded-lg transition-colors duration-300"
                      >
                        {isFilled ? "View Details" : "Reserve Spot"}
                      </Link>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

        {/* ── BRAND COLLABORATIONS STRIP ── */}
        <section className="py-20 bg-primary text-cream relative overflow-hidden">
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