import Link from "next/link";
import { client } from "@/lib/sanity";

async function getTrips() {
  return await client.fetch(`
    *[_type == "trip"] | order(_createdAt desc){
      _id,
      title,
      location,
      type,
      slug,
      _createdAt
    }
  `);
}

export default async function AdminTripsPage() {
  const trips = await getTrips();

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "bold",
          }}
        >
          Manage Trips
        </h1>

        <Link
          href="/admin/trips/create"
          style={{
            background: "#2563eb",
            color: "white",
            padding: "10px 20px",
            borderRadius: "8px",
            textDecoration: "none",
          }}
        >
          + New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div
          style={{
            background: "white",
            padding: "20px",
            borderRadius: "12px",
          }}
        >
          No trips found.
        </div>
      ) : (
        trips.map((trip: any) => (
          <div
            key={trip._id}
            style={{
              background: "white",
              padding: "20px",
              borderRadius: "12px",
              marginBottom: "15px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
            }}
          >
            <h2>{trip.title}</h2>

            <p>
              <strong>Location:</strong> {trip.location}
            </p>

            <p>
              <strong>Type:</strong> {trip.type}
            </p>

            <div
              style={{
                display: "flex",
                gap: "10px",
                marginTop: "15px",
              }}
            >
              <Link
                href={`/admin/trips/edit/${trip._id}`}
                style={{
                  background: "#16a34a",
                  color: "white",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                }}
              >
                Edit
              </Link>

              <button
                style={{
                  background: "#dc2626",
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "8px",
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}