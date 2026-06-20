"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { BookOpen, Clock, Calendar, ArrowRight } from "lucide-react";

type Blog = {
  _id: string;
  title: string;
  slug?: { current?: string };
  coverImage?: { asset?: { url?: string } };
  content: string;
  _createdAt: string;
  category?: { title: string };
};

export default function BlogsComponent({ blogs }: { blogs: Blog[] }) {
  const getReadingTime = (text?: string) => {
    if (!text) return "3 min read";
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <>
      <Navbar />

      <main className="bg-cream text-charcoal min-h-screen font-sans">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 pt-16 pb-12 text-center space-y-4">
          <span className="text-xs uppercase tracking-widest text-secondary font-bold font-sans">
            Journals
          </span>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-primary">
            The Travel Log
          </h1>
          <p className="text-sm md:text-base text-charcoal/70 max-w-xl mx-auto leading-relaxed">
            Musings on remote pathways, food stories, slow living, and technical guides written directly from the field.
          </p>
        </section>

        {/* BLOGS GRID */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          {blogs.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-primary/5 p-12 max-w-md mx-auto space-y-4">
              <BookOpen className="w-12 h-12 text-secondary/30 mx-auto animate-pulse" />
              <h3 className="text-xl font-serif font-bold text-primary">No Articles Written</h3>
              <p className="text-xs text-charcoal/60 leading-relaxed font-sans">
                We haven't indexed any journal records in the CMS blogs directory yet. Return to the homepage!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogs.map((blog) => (
                <article
                  key={blog._id}
                  className="bg-white rounded-2xl overflow-hidden border border-primary/5 shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Cover image */}
                    <Link
                      href={blog.slug?.current ? `/blogs/${blog.slug.current}` : "/blogs"}
                      className="relative h-56 overflow-hidden block bg-primary/10"
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
                        <div className="w-full h-full flex items-center justify-center">
                          <BookOpen className="w-12 h-12 text-secondary/20" />
                        </div>
                      )}
                    </Link>

                    {/* Body */}
                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-[10px] uppercase font-sans font-bold text-secondary tracking-widest">
                        <span className="bg-primary/5 px-2.5 py-1 rounded">
                          {blog.category?.title || "Wander"}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {getReadingTime(blog.content)}
                        </span>
                      </div>

                      <h3 className="text-xl font-serif font-bold text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors duration-200">
                        <Link href={blog.slug?.current ? `/blogs/${blog.slug.current}` : "/blogs"}>
                          {blog.title}
                        </Link>
                      </h3>

                      <p className="text-sm text-charcoal/70 line-clamp-3 leading-relaxed font-sans">
                        {blog.content}
                      </p>
                    </div>
                  </div>

                  {/* Footer metadata */}
                  <div className="p-6 pt-0 border-t border-primary/5 mt-4 flex justify-between items-center text-xs text-charcoal/50 font-sans font-semibold">
                    <span className="flex items-center gap-1 mt-4">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(blog._createdAt).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <Link
                      href={blog.slug?.current ? `/blogs/${blog.slug.current}` : "/blogs"}
                      className="text-primary hover:text-accent font-serif font-bold flex items-center gap-1 transition-colors duration-200 mt-4 text-sm"
                    >
                      Read Post <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}