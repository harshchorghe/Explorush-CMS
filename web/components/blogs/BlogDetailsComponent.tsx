"use client";

import Link from "next/link";

export default function BlogDetailsComponent({
  blog,
}: {
  blog: any;
}) {
  if (!blog) {
    return (
      <main
        style={{
          minHeight: "100vh",
          background: "#050810",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h2>Blog Not Found </h2>
      </main>
    );
  }

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
          maxWidth: "900px",
          margin: "0 auto",
          padding: "40px 24px 100px",
        }}
      >
        <Link
          href="/blogs"
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
            fontSize: "20px",
          }}
        >
          ←
        </Link>

        <div
          style={{
            marginTop: "50px",
          }}
        >
          <p
            style={{
              color: "#00ffe0",
              letterSpacing: "4px",
              textTransform: "uppercase",
              fontSize: "12px",
              marginBottom: "15px",
            }}
          >
            Travel Blog
          </p>

          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(38px,6vw,70px)",
              lineHeight: 1.1,
              marginBottom: "40px",
            }}
          >
            {blog.title}
          </h1>

          <div
            style={{
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.08)",
              borderRadius: "24px",
              padding: "40px",
            }}
          >
            <p
              style={{
                lineHeight: 2,
                fontSize: "17px",
                color: "#d4d9e5",
                whiteSpace: "pre-wrap",
              }}
            >
              {blog.content}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}