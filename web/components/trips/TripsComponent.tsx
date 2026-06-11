"use client";

import Image from "next/image";
import Link from "next/link";

export default function TripsComponent({
  trips,
}: {
  trips: any[];
}) {
  return (
    <main
      style={{
        background: "#050810",
        minHeight: "100vh",
        color: "#e8eaf6",
      }}
    >
      {/* Back Button */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "24px 24px 0",
        }}
      >
        <Link
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            color: "#00ffe0",
            textDecoration: "none",
            fontSize: "14px",
            padding: "10px 18px",
            border: "1px solid rgba(0,255,224,0.3)",
            borderRadius: "12px",
            background: "rgba(0,255,224,0.05)",
          }}
        >
          ←
        </Link>
      </div>

      {/* Hero */}
      <section
        style={{
          padding: "80px 24px",
          textAlign: "center",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at center, rgba(0,255,224,0.08), transparent 60%)",
          }}
        />

        <p
          style={{
            color: "#00ffe0",
            letterSpacing: "4px",
            textTransform: "uppercase",
            fontSize: "12px",
            marginBottom: "16px",
          }}
        >
          Adventures Await
        </p>

        <h1
          style={{
            fontSize: "clamp(48px,8vw,100px)",
            fontWeight: 600,
            fontFamily: "Syne, sans-serif",
          }}
        >
          Explore Trips
        </h1>

        <p
          style={{
            maxWidth: "650px",
            margin: "24px auto 0",
            color: "rgba(232,234,246,0.65)",
            lineHeight: 1.8,
          }}
        >
          Discover unforgettable destinations, hidden gems,
          mountain roads, beaches, local culture and real travel
          stories from every journey.
        </p>
      </section>

      {/* Trips Grid */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(320px,1fr))",
            gap: "28px",
          }}
        >
          {trips.map((trip: any) => (
            <Link
              key={trip._id}
              href={`/trips/${trip.slug?.current}`}
              style={{
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "20px",
                  overflow: "hidden",
                }}
              >
                {trip.coverImage?.asset?.url && (
                  <div
                    style={{
                      position: "relative",
                      height: "250px",
                    }}
                  >
                    <Image
                      src={trip.coverImage.asset.url}
                      alt={trip.title}
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                <div style={{ padding: "22px" }}>
                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                    }}
                  >
                    {trip.title}
                  </h3>

                  <p
                    style={{
                      color: "#9aa0b4",
                      marginTop: "10px",
                    }}
                  >
                    📍 {trip.location}
                  </p>

                  <p
                    style={{
                      marginTop: "15px",
                      color: "rgba(232,234,246,0.7)",
                    }}
                  >
                    {trip.description?.slice(0, 120)}...
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}