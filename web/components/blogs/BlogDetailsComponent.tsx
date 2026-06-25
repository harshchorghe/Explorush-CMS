"use client";

import { useState, useRef, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ArrowLeft, Clock, Calendar, User, Tag, Headphones } from "lucide-react";
import BlogAudioPlayer, { BlogAudioPlayerRef } from "@/components/blogs/BlogAudioPlayer";

type Author = {
  name: string;
  image?: { asset?: { url?: string } };
};

type Category = {
  title: string;
};

type BlogDetails = {
  title: string;
  content: string;
  coverImage?: { asset?: { url?: string } };
  _createdAt?: string;
  category?: Category;
  author?: Author;
};

export default function BlogDetailsComponent({ blog }: { blog: BlogDetails }) {
  const [activeParagraphIndex, setActiveParagraphIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const audioPlayerRef = useRef<BlogAudioPlayerRef>(null);

  const paragraphs = useMemo(() => {
    if (!blog?.content) return [];
    return blog.content
      .split(/\n+/)
      .map((p) => p.trim())
      .filter((p) => p.length > 0);
  }, [blog?.content]);

  if (!blog) {
    return (
      <main className="min-h-screen bg-cream flex flex-col justify-center items-center font-sans space-y-4">
        <h2 className="text-2xl font-serif font-bold text-primary">Blog Not Found ❌</h2>
        <Link href="/blogs" className="text-accent underline text-sm">
          Return to Blogs
        </Link>
      </main>
    );
  }

  const getReadingTime = (text?: string) => {
    if (!text) return "3 min read";
    const words = text.split(/\s+/).length;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min read`;
  };

  return (
    <>
      <Navbar />

      <main className="bg-cream text-charcoal min-h-screen font-sans pb-24">
        {/* HEADER AREA */}
        <div className="max-w-4xl mx-auto px-6 pt-12">
          {/* Back button */}
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-primary hover:text-cream border border-primary/10 rounded-lg text-xs font-sans font-bold uppercase tracking-wider transition-all duration-300 text-primary mb-12 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Blogs
          </Link>

          {/* Metadata */}
          <div className="space-y-4">
            {blog.category?.title && (
              <span className="bg-accent/10 border border-accent/30 text-primary text-[10px] md:text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider w-max shadow-sm inline-flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                {blog.category.title}
              </span>
            )}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-primary leading-tight tracking-tight drop-shadow-sm">
              {blog.title}
            </h1>

            {/* Author and Date Meta */}
            <div className="flex flex-wrap items-center gap-6 text-xs md:text-sm text-charcoal/60 pt-4 border-t border-primary/5 pb-4 font-sans font-medium">
              {blog.author && (
                <span className="flex items-center gap-2">
                  {blog.author.image?.asset?.url ? (
                    <div className="relative w-8 h-8 rounded-full overflow-hidden border border-accent">
                      <Image
                        src={blog.author.image.asset.url}
                        alt={blog.author.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ) : (
                    <User className="w-4 h-4 text-accent" />
                  )}
                  <span>By {blog.author.name}</span>
                </span>
              )}

              {blog._createdAt && (
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-accent" />
                  {new Date(blog._createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}

              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-accent" />
                {getReadingTime(blog.content)}
              </span>
            </div>
          </div>
        </div>

        {/* COVER IMAGE */}
        {blog.coverImage?.asset?.url && (
          <div className="max-w-5xl mx-auto px-6 py-8">
            <div className="relative h-[40vh] md:h-[55vh] rounded-3xl overflow-hidden shadow-xl border border-primary/10">
              <Image
                src={blog.coverImage.asset.url}
                alt={blog.title}
                fill
                priority
                className="object-cover"
              />
              <div className="absolute inset-0 bg-black/5" />
            </div>
          </div>
        )}

        {/* READING CONTAINER */}
        <article className="max-w-3xl mx-auto px-6 pt-8 space-y-6">
          {blog.content && (
            <BlogAudioPlayer
              ref={audioPlayerRef}
              title={blog.title}
              paragraphs={paragraphs}
              activeParagraphIndex={activeParagraphIndex}
              onParagraphChange={setActiveParagraphIndex}
              onPlayStateChange={(playing, paused) => {
                setIsPlaying(playing);
                setIsPaused(paused);
              }}
            />
          )}

          <div className="bg-white border border-primary/10 rounded-3xl p-6 md:p-12 shadow-xl">
            <div className="space-y-6 text-charcoal/80 text-base md:text-lg leading-relaxed font-sans select-text selection:bg-accent selection:text-primary">
              {paragraphs.map((para, idx) => {
                const isActive = isPlaying && activeParagraphIndex === idx;

                const handleParagraphClick = () => {
                  const selection = window.getSelection();
                  if (selection && selection.toString().trim().length > 0) {
                    return;
                  }
                  if (audioPlayerRef.current) {
                    audioPlayerRef.current.playParagraph(idx);
                  }
                };

                return (
                  <p
                    key={idx}
                    onClick={handleParagraphClick}
                    className={`group relative p-3 -mx-3 rounded-xl transition-all duration-300 cursor-pointer ${
                      isActive
                        ? "bg-accent/10 border-l-4 border-accent text-charcoal pl-4 font-semibold shadow-sm"
                        : "hover:bg-primary/5 hover:text-primary"
                    }`}
                  >
                    <span className="absolute -left-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 hidden md:inline-flex items-center justify-center w-5 h-5 rounded-full bg-accent/20 text-primary text-[10px] shadow-sm">
                      <Headphones className="w-3 h-3 text-primary" />
                    </span>
                    {para}
                  </p>
                );
              })}
            </div>
          </div>
        </article>
      </main>

      <Footer />
    </>
  );
}