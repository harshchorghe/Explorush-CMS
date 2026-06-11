import { client } from "@/lib/sanity";
import Image from "next/image";
import Link from "next/link";

export default async function TripDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const query = `
    *[_type == "trip" && slug.current == $slug][0]{
      _id,
      title,
      location,
      type,
      description,
      startDate,
      endDate,
      coverImage{
        asset->{url}
      },
     gallery[]{
      "url": asset->url
      },
      itinerary
    }
  `;

  const trip = await client.fetch(query, { slug });

  if (!trip) {
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
        <h2>Trip Not Found ❌</h2>
      </main>
    );
  }

  return (
    <main
      style={{
        background: "#050810",
        color: "#e8eaf6",
        minHeight: "100vh",
      }}
    >
      {/* HERO SECTION */}
      <section
        style={{
          position: "relative",
          height: "60vh",
          overflow: "hidden",
        }}
      >
        {trip?.coverImage?.asset?.url && (
          <>
            <Image
              src={trip.coverImage.asset.url}
              alt={trip.title}
              fill
              priority
              style={{
                objectFit: "cover",
              }}
            />

            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to top,#050810 8%,rgba(5,8,16,.65),rgba(5,8,16,.2))",
              }}
            />
          </>
        )}

        <div
          style={{
            position: "absolute",
            bottom: "70px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            maxWidth: "1200px",
            zIndex: 2,
          }}
        >
          {trip.type && (
            <span
              style={{
                padding: "8px 18px",
                borderRadius: "999px",
                background: "rgba(0,255,224,.08)",
                border: "1px solid rgba(0,255,224,.3)",
                color: "#00ffe0",
                letterSpacing: "2px",
                textTransform: "uppercase",
                fontSize: "12px",
              }}
            >
              {trip.type}
            </span>
          )}

          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontSize: "clamp(48px,8vw,100px)",
              fontWeight: 800,
              marginTop: "20px",
              lineHeight: 1,
            }}
          >
            {trip.title}
          </h1>

          <div
            style={{
              marginTop: "18px",
              color: "#c0c7d8",
              fontSize: "17px",
              display: "flex",
              flexWrap: "wrap",
              gap: "20px",
            }}
          >
            <span>📍 {trip.location}</span>

            {trip.startDate && trip.endDate && (
              <span>
                📅 {new Date(trip.startDate).toLocaleDateString()} —
                {" "}
                {new Date(trip.endDate).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 24px",
        }}
      >
        {/* DESCRIPTION */}
        <div
          style={{
            background: "rgba(255,255,255,.03)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "24px",
            padding: "40px",
            backdropFilter: "blur(10px)",
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
            Travel Story
          </p>

          <h2
            style={{
              fontFamily: "Syne, sans-serif",
              marginBottom: "25px",
              fontSize: "42px",
            }}
          >
            About This Journey
          </h2>

          <p
            style={{
              lineHeight: 2,
              color: "#d4d9e5",
              fontSize: "17px",
            }}
          >
            {trip.description}
          </p>
        </div>

        {/* GALLERY */}
{trip.gallery?.some((img: any) => img?.url) && (
  <div style={{ marginTop: "100px" }}>
    <p
      style={{
        color: "#00ffe0",
        letterSpacing: "4px",
        textTransform: "uppercase",
        fontSize: "12px",
      }}
    >
      Moments
    </p>

    <h2
      style={{
        fontFamily: "Syne, sans-serif",
        fontSize: "52px",
        marginTop: "12px",
        marginBottom: "40px",
      }}
    >
      Photo Gallery
    </h2>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
        gap: "20px",
      }}
    >
      {trip.gallery
        .filter((img: any) => img?.url)
        .map((img: any, index: number) => (
          <div
            key={index}
            style={{
              overflow: "hidden",
              borderRadius: "18px",
              border: "1px solid rgba(255,255,255,.08)",
            }}
          >
            <Image
              src={img.url}
              alt={`gallery-${index}`}
              width={500}
              height={350}
              style={{
                width: "100%",
                height: "280px",
                objectFit: "cover",
              }}
            />
          </div>
        ))}
    </div>
  </div>
)}

        {/* ITINERARY */}
        {trip.itinerary?.length > 0 && (
          <div style={{ marginTop: "100px" }}>
            <p
              style={{
                color: "#00ffe0",
                letterSpacing: "4px",
                textTransform: "uppercase",
                fontSize: "12px",
              }}
            >
              Journey Plan
            </p>

            <h2
              style={{
                fontFamily: "Syne, sans-serif",
                fontSize: "52px",
                marginTop: "12px",
                marginBottom: "50px",
              }}
            >
              Itinerary
            </h2>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "25px",
              }}
            >
              {trip.itinerary.map((item: any, index: number) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    gap: "20px",
                  }}
                >
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      background: "#00ffe0",
                      borderRadius: "50%",
                      marginTop: "12px",
                      flexShrink: 0,
                    }}
                  />

                  <div
                    style={{
                      width: "100%",
                      background: "rgba(255,255,255,.03)",
                      border:
                        "1px solid rgba(255,255,255,.08)",
                      borderRadius: "20px",
                      padding: "24px",
                    }}
                  >
                    <h3
                      style={{
                        color: "#00ffe0",
                        marginBottom: "10px",
                        fontSize: "20px",
                      }}
                    >
                      {item.day}
                    </h3>

                    <p
                      style={{
                        lineHeight: 1.8,
                        color: "#d4d9e5",
                      }}
                    >
                      {item.plan}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* BACK BUTTON */}
        <div
          style={{
            marginTop: "100px",
            textAlign: "center",
          }}
        >
          <Link
            href="/trips"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              padding: "14px 28px",
              border: "1px solid #00ffe0",
              borderRadius: "12px",
              textDecoration: "none",
              color: "#00ffe0",
              transition: ".3s",
            }}
          >
            ← Back To Trips
          </Link>
        </div>
      </section>
    </main>
  );
}