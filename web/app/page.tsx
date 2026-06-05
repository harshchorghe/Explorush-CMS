import { client } from "@/lib/sanity";
import Link from "next/link";
import Image from "next/image";

/* ---------------- FETCH DATA ---------------- */

async function getFeaturedTrips() {
  const query = `
    *[_type == "trip"] | order(startDate desc)[0...3]{
      _id,
      title,
      slug,
      location,
      coverImage{
        asset->{
          url
        }
      }
    }
  `;
  return await client.fetch(query);
}

async function getFeaturedBlogs() {
  const query = `
    *[_type == "blog"] | order(_createdAt desc)[0...3]{
      _id,
      title,
      slug,
      coverImage{
        asset->{
          url
        }
      }
    }
  `;
  return await client.fetch(query);
}

/* ---------------- PAGE ---------------- */

export default async function HomePage() {
  const trips = await getFeaturedTrips();
  const blogs = await getFeaturedBlogs();

  return (
    <div style={{ fontFamily: "sans-serif" }}>

      {/* ---------------- HERO SECTION ---------------- */}
      <section
        style={{
          height: "80vh",
          backgroundImage:
            "url('https://images.unsplash.com/photo-1501785888041-af3ef285b470')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          textAlign: "center",
          flexDirection: "column",
          padding: "20px",
        }}
      >
        <h1 style={{ fontSize: "50px", fontWeight: "bold" }}>
          Explorush 🌍
        </h1>

        <p style={{ fontSize: "18px", marginTop: "10px" }}>
          Explore. Travel. Experience.
        </p>

        <Link
          href="/trips"
          style={{
            marginTop: "20px",
            padding: "12px 20px",
            background: "white",
            color: "black",
            borderRadius: "8px",
            fontWeight: "bold",
          }}
        >
          Explore Trips
        </Link>
      </section>

      {/* ---------------- FEATURED TRIPS ---------------- */}
      <section style={{ padding: "40px" }}>
        <h2>🌍 Featured Trips</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
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
              {trip.coverImage?.asset?.url && (
                <Image
                  src={trip.coverImage.asset.url}
                  alt={trip.title}
                  width={400}
                  height={250}
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
              )}

              <div style={{ padding: "10px" }}>
                <h3>{trip.title}</h3>
                <p style={{ color: "gray" }}>{trip.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ---------------- FEATURED BLOGS ---------------- */}
      <section style={{ padding: "40px", background: "#f9f9f9" }}>
        <h2>📝 Latest Blogs</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {blogs.map((blog: any) => (
            <div
              key={blog._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                overflow: "hidden",
                background: "white",
              }}
            >
              {blog.coverImage?.asset?.url && (
                <Image
                  src={blog.coverImage.asset.url}
                  alt={blog.title}
                  width={400}
                  height={250}
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
              )}

              <div style={{ padding: "10px" }}>
                <h3>{blog.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer
        style={{
          padding: "30px",
          textAlign: "center",
          background: "#111",
          color: "white",
        }}
      >
        <p>© 2026 Explorush. All rights reserved.</p>
      </footer>

    </div>
  );
}