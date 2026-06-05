import { client } from "@/lib/sanity";
import Image from "next/image";

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
      coverImage{
        asset->{
          url
        }
      },
      startDate,
      endDate,
      gallery[]{
        asset->{
          url
        }
      },
      itinerary
    }
  `;

  const trip = await client.fetch(query, { slug });

  if (!trip) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Trip not found ❌</h2>
      </div>
    );
  }

  return (
    <div style={{ padding: 20, maxWidth: "900px", margin: "0 auto" }}>
      
      {/* TITLE */}
      <h1 style={{ fontSize: "32px", fontWeight: "bold" }}>
        {trip.title}
      </h1>

      {/* META INFO */}
      <p style={{ color: "gray", marginTop: 5 }}>
        📍 {trip.location} • 🧭 {trip.type}
      </p>

      {/* DATES */}
      {trip.startDate && trip.endDate && (
        <p style={{ marginTop: 5 }}>
          📅{" "}
          {new Date(trip.startDate).toDateString()} -{" "}
          {new Date(trip.endDate).toDateString()}
        </p>
      )}

      {/* COVER IMAGE */}
      {trip.coverImage?.asset?.url && (
        <div style={{ marginTop: 20 }}>
          <Image
            src={trip.coverImage.asset.url}
            alt={trip.title}
            width={900}
            height={450}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "12px",
            }}
          />
        </div>
      )}

      {/* DESCRIPTION */}
      <p style={{ marginTop: 20, lineHeight: "1.6" }}>
        {trip.description}
      </p>

      {/* GALLERY */}
      {trip.gallery?.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>📸 Gallery</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
              gap: "10px",
              marginTop: "10px",
            }}
          >
            {trip.gallery.map((img: any, index: number) => (
              <Image
                key={index}
                src={img.asset.url}
                alt="gallery"
                width={300}
                height={200}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ITINERARY */}
      {trip.itinerary?.length > 0 && (
        <div style={{ marginTop: 30 }}>
          <h2>🗺️ Itinerary</h2>

          <div style={{ marginTop: 10 }}>
            {trip.itinerary.map((item: any, index: number) => (
              <div
                key={index}
                style={{
                  padding: "10px",
                  borderLeft: "3px solid #333",
                  marginBottom: "10px",
                }}
              >
                <h4>{item.day}</h4>
                <p>{item.plan}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}