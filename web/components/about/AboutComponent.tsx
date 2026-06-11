"use client";

import Link from "next/link";

export default function AboutComponent() {
  return (
    <main
      style={{
        background: "#050810",
        color: "#e8eaf6",
        minHeight: "100vh",
      }}
    >
      {/* BACK BUTTON */}
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "30px 24px 0",
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
            fontSize: "20px",
          }}
        >
          ←
        </Link>
      </div>

      {/* HERO */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 24px 120px",
          textAlign: "center",
        }}
      >
        <p
          style={{
            color: "#00ffe0",
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontSize: "12px",
            marginBottom: "20px",
          }}
        >
          About Explorush
        </p>

        <h1
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "clamp(48px,8vw,100px)",
            lineHeight: 1,
            marginBottom: "30px",
          }}
        >
          Travel Beyond
          <br />
          The Ordinary
        </h1>

        <p
          style={{
            maxWidth: "750px",
            margin: "0 auto",
            color: "#9aa0b4",
            fontSize: "18px",
            lineHeight: 1.9,
          }}
        >
          Explorush is more than a travel website. It is a collection of
          journeys, stories, experiences, adventures, and memories captured
          from roads less traveled.
        </p>
      </section>

      {/* STORY */}
      <section
        style={{
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "24px",
            padding: "50px",
          }}
        >
          <p
            style={{
              color: "#00ffe0",
              letterSpacing: "3px",
              textTransform: "uppercase",
              fontSize: "12px",
              marginBottom: "15px",
            }}
          >
            Our Story
          </p>

          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "42px",
              marginBottom: "25px",
            }}
          >
            Every Journey Has A Story
          </h2>

          <p
            style={{
              color: "#d4d9e5",
              lineHeight: 2,
              fontSize: "17px",
            }}
          >
            What started as a passion for travel and content creation slowly
            evolved into Explorush. Through mountain treks, coastal drives,
            hidden villages, and unforgettable sunsets, we discovered that
            every destination has a unique story waiting to be told.
            <br />
            <br />
            Explorush was created to document those experiences and inspire
            others to step outside their comfort zone and explore the world
            differently.
          </p>
        </div>
      </section>

      {/* FEATURES */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            fontFamily: "Syne, sans-serif",
            fontSize: "52px",
            marginBottom: "50px",
          }}
        >
          What You'll Find Here
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(280px,1fr))",
            gap: "24px",
          }}
        >
          {[
            {
              title: "🌍 Travel Guides",
              text: "Detailed destination guides and travel itineraries.",
            },
            {
              title: "🎥 Vlogs",
              text: "Visual storytelling through immersive travel videos.",
            },
            {
              title: "📖 Blogs",
              text: "Experiences, tips, lessons and travel insights.",
            },
            {
              title: "🥾 Adventures",
              text: "Treks, road trips and offbeat explorations.",
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                background: "rgba(255,255,255,.03)",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: "20px",
                padding: "30px",
              }}
            >
              <h3
                style={{
                  marginBottom: "15px",
                  fontSize: "24px",
                }}
              >
                {item.title}
              </h3>

              <p
                style={{
                  color: "#9aa0b4",
                  lineHeight: 1.8,
                }}
              >
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* STATS */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px 100px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(200px,1fr))",
            gap: "24px",
          }}
        >
          {[
            ["20+", "Trips"],
            ["50+", "Blogs"],
            ["25+", "Vlogs"],
            ["∞", "Memories"],
          ].map(([number, label], index) => (
            <div
              key={index}
              style={{
                textAlign: "center",
                padding: "40px",
                border: "1px solid rgba(255,255,255,.08)",
                borderRadius: "20px",
              }}
            >
              <h2
                style={{
                  fontSize: "48px",
                  color: "#00ffe0",
                }}
              >
                {number}
              </h2>

              <p
                style={{
                  color: "#9aa0b4",
                  marginTop: "10px",
                }}
              >
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section
        style={{
          textAlign: "center",
          padding: "0 24px 120px",
        }}
      >
        <h2
          style={{
            fontFamily: "Syne, sans-serif",
            fontSize: "52px",
            marginBottom: "20px",
          }}
        >
          The Journey Continues
        </h2>

        <p
          style={{
            color: "#9aa0b4",
            maxWidth: "650px",
            margin: "0 auto 40px",
            lineHeight: 1.8,
          }}
        >
          Join us as we continue exploring new destinations,
          discovering hidden gems and sharing stories from the road.
        </p>

        <Link
          href="/trips"
          style={{
            display: "inline-block",
            padding: "14px 30px",
            borderRadius: "12px",
            background: "#00ffe0",
            color: "#050810",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          Explore Trips
        </Link>
      </section>
    </main>
  );
}