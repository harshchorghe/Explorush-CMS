"use client";

import Link from "next/link";

export default function BlogsComponent({
  blogs,
}: {
  blogs: any[];
}) {
  return (
    <main
      style={{
        background: "#050810",
        minHeight: "100vh",
        color: "#e8eaf6",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: "46px",
            height: "46px",
            borderRadius: "12px",
            background: "rgba(0,255,224,.05)",
            border: "1px solid rgba(0,255,224,.3)",
            color: "#00ffe0",
            textDecoration: "none",
            fontSize: "18px",
            marginBottom: "30px",
          }}
        >
          ←
        </Link>

        <h1
          style={{
            fontSize: "36px",
            fontWeight: 700,
            fontFamily: "Syne, sans-serif",
            marginBottom: "12px",
          }}
        >
          Blogs 
        </h1>

        <p
          style={{
            color: "#9aa0b4",
            marginBottom: "50px",
          }}
        >
          Travel stories, guides, experiences and insights.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",
            gap: "24px",
          }}
        >
          {blogs.map((blog: any) => (
            <Link
              key={blog._id}
              href={`/blogs/${blog.slug?.current}`}
              style={{
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,.03)",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: "20px",
                  padding: "24px",
                  height: "100%",
                  transition: "all .3s ease",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "6px 12px",
                    borderRadius: "999px",
                    background: "rgba(0,255,224,.08)",
                    border: "1px solid rgba(0,255,224,.25)",
                    color: "#00ffe0",
                    fontSize: "11px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                    marginBottom: "18px",
                  }}
                >
                  Travel Blog
                </div>

                <h2
                  style={{
                    fontSize: "24px",
                    fontWeight: 700,
                    marginBottom: "16px",
                    fontFamily: "Syne, sans-serif",
                  }}
                >
                  {blog.title}
                </h2>

                <p
                  style={{
                    color: "rgba(232,234,246,.7)",
                    lineHeight: 1.8,
                  }}
                >
                  {blog.content?.slice(0, 160)}
                  {blog.content?.length > 160 ? "..." : ""}
                </p>

                <div
                  style={{
                    marginTop: "20px",
                    color: "#00ffe0",
                    fontSize: "13px",
                    letterSpacing: "2px",
                    textTransform: "uppercase",
                  }}
                >
                  Read Article →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}