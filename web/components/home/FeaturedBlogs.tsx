"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Clock, Calendar } from "lucide-react";

type BlogPreviewItem = {
  _id: string;
  title: string;
  slug?: { current?: string };
  coverImage?: { asset?: { url?: string } };
  _createdAt: string;
  category?: { title: string };
  content: string;
};

export default function FeaturedBlogs({ blogs }: { blogs: BlogPreviewItem[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollAmount = clientWidth * 0.75;
      scrollRef.current.scrollTo({
        left: direction === "left" ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const getReadingTime = (text?: string) => {
    if (!text) return "3 min read";
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <section className="py-20 bg-cream border-t border-primary/5">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-secondary font-semibold font-sans">
              Read Articles
            </span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mt-2">
              Magazine-Style Blogs
            </h2>
          </div>
          {/* Controls & Link */}
          <div className="flex items-center gap-6">
            <Link
              href="/blogs"
              className="inline-flex items-center gap-2 font-sans font-bold text-xs uppercase tracking-widest text-primary hover:text-accent border-b border-primary/20 pb-1 transition-colors duration-300"
            >
              View All Articles
            </Link>
            <div className="flex gap-3">
              <button
                onClick={() => scroll("left")}
                className="p-3 bg-white border border-primary/10 rounded-full text-primary hover:bg-primary hover:text-cream transition-all duration-300 shadow-sm"
                aria-label="Previous posts"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                className="p-3 bg-white border border-primary/10 rounded-full text-primary hover:bg-primary hover:text-cream transition-all duration-300 shadow-sm"
                aria-label="Next posts"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroll container */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto scrollbar-none pb-6 snap-x snap-mandatory"
          style={{ scrollbarWidth: "none" }}
        >
          {blogs.map((blog) => (
            <article
              key={blog._id}
              className="min-w-[300px] md:min-w-[380px] max-w-[380px] bg-white rounded-2xl overflow-hidden border border-primary/5 shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex-shrink-0 snap-start flex flex-col group"
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
                      <Clock className="w-3.5 h-3.5" />
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
  );
}
