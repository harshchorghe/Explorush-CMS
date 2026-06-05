import { client } from "@/lib/sanity";
import { tripsQuery } from "@/lib/queries";
import Image from "next/image";
import Link from "next/link";

export default async function TripsPage() {
  const trips = await client.fetch(tripsQuery);

  return (
    <div style={{ padding: 20 }}>
      <h1>🌍 Trips</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
          gap: "20px",
        }}
      >
        {trips.map((trip: any) => (
          <Link
            key={trip._id}
            href={`/trips/${trip.slug?.current}`}
            style={{
              border: "1px solid #ddd",
              borderRadius: "10px",
              overflow: "hidden",
              textDecoration: "none",
              color: "black",
            }}
          >
            {/* IMAGE */}
                    {trip.coverImage?.asset?.url && (
            <img
              src={trip.coverImage.asset.url}
              alt={trip.title}
              style={{
                width: "100%",
                height: "250px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          )}

            {/* CONTENT */}
            <div style={{ padding: "12px" }}>
              <h2>{trip.title}</h2>
              <p>{trip.location}</p>

              <p style={{ fontSize: "12px", opacity: 0.7 }}>
                {trip.type}
              </p>

              <p>
                {trip.description?.slice(0, 80)}...
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}