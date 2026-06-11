import { client } from "@/lib/sanity";
import { tripsQuery } from "@/lib/queries";
import Image from "next/image";
import Link from "next/link";


export default async function TripsPage() {
  const trips = await client.fetch(tripsQuery);

  return (
    <main
      style={{
        background: "#050810",
        minHeight: "100vh",
        color: "#e8eaf6",
      }}
    >

     {/* BACK BUTTON */}
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
        letterSpacing: "1px",
        padding: "10px 18px",
        border: "1px solid rgba(0,255,224,0.3)",
        borderRadius: "12px",
        background: "rgba(0,255,224,0.05)",
      }}
    >
      ←
    </Link>
  </div>

      {/* HERO */}
      <section
        style={{
          padding: "80px 24px 80px",
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
            lineHeight: 1,
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
            fontSize: "16px",
          }}
        >
          Discover unforgettable destinations, hidden gems,
          mountain roads, beaches, local culture and real travel
          stories from every journey.
        </p>
      </section>

      {/* CONTENT */}
      <section
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        <div
          style={{
            marginBottom: "50px",
          }}
        >
          <p
            style={{
              color: "#00ffe0",
              letterSpacing: "4px",
              textTransform: "uppercase",
              fontSize: "12px",
              marginBottom: "12px",
            }}
          >
            Destinations
          </p>

          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(32px,5vw,60px)",
              fontWeight: 800,
            }}
          >
            All Trips
          </h2>
        </div>

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
                  backdropFilter: "blur(10px)",
                  transition: "all .35s ease",
                  height: "100%",
                }}
              >
                {/* IMAGE */}
                {trip.coverImage?.asset?.url && (
                  <div
                    style={{
                      position: "relative",
                      height: "250px",
                      overflow: "hidden",
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

                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(5,8,16,.85), transparent)",
                      }}
                    />
                  </div>
                )}

                {/* CONTENT */}
                <div
                  style={{
                    padding: "22px",
                  }}
                >
                  {trip.type && (
                    <div
                      style={{
                        display: "inline-block",
                        padding: "6px 12px",
                        borderRadius: "999px",
                        background:
                          "rgba(0,255,224,0.08)",
                        border:
                          "1px solid rgba(0,255,224,0.25)",
                        color: "#00ffe0",
                        fontSize: "11px",
                        letterSpacing: "2px",
                        textTransform: "uppercase",
                        marginBottom: "14px",
                      }}
                    >
                      {trip.type}
                    </div>
                  )}

                  <h3
                    style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      marginBottom: "10px",
                      fontFamily: "Syne, sans-serif",
                    }}
                  >
                    {trip.title}
                  </h3>

                  {trip.location && (
                    <p
                      style={{
                        color: "#9aa0b4",
                        marginBottom: "14px",
                        fontSize: "14px",
                      }}
                    >
                      📍 {trip.location}
                    </p>
                  )}

                  <p
                    style={{
                      color: "rgba(232,234,246,0.7)",
                      lineHeight: 1.7,
                      fontSize: "14px",
                    }}
                  >
                    {trip.description?.slice(0, 120)}...
                  </p>

                  <div
                    style={{
                      marginTop: "22px",
                      color: "#00ffe0",
                      fontSize: "13px",
                      letterSpacing: "2px",
                      textTransform: "uppercase",
                    }}
                  >
                    View Journey →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}