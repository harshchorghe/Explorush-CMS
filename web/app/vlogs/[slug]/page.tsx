import { client } from "@/lib/sanity";
import Image from "next/image";

export default async function VlogDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const query = `
    *[_type == "vlog" && slug.current == $slug][0]{
      _id,
      title,
      videoUrl,
      thumbnail{
        asset->{
          url
        }
      }
    }
  `;

  const vlog = await client.fetch(query, { slug });

  if (!vlog) {
    return <div style={{ padding: 20 }}>Vlog not found</div>;
  }

  return (
    <main
      style={{
        padding: 20,
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ fontSize: "32px", marginBottom: "20px" }}>
        {vlog.title}
      </h1>

      {vlog.videoUrl && (
        <div
          style={{
            position: "relative",
            width: "100%",
            paddingBottom: "56.25%",
            marginBottom: "20px",
          }}
        >
          <iframe
            src={convertToEmbed(vlog.videoUrl)}
            title={vlog.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
              borderRadius: "12px",
            }}
          />
        </div>
      )}

      {vlog.thumbnail?.asset?.url && (
        <Image
          src={vlog.thumbnail.asset.url}
          alt={vlog.title}
          width={1000}
          height={600}
          style={{
            width: "100%",
            height: "auto",
            borderRadius: "12px",
          }}
        />
      )}
    </main>
  );
}

/* ---------------- HELPER FUNCTION ---------------- */

function convertToEmbed(url: string) {
  try {
    const parsedUrl = new URL(url);

    // Handles: https://youtu.be/VIDEO_ID
    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }

    // Handles: https://www.youtube.com/watch?v=VIDEO_ID
    if (
      parsedUrl.hostname.includes("youtube.com") &&
      parsedUrl.searchParams.get("v")
    ) {
      return `https://www.youtube.com/embed/${parsedUrl.searchParams.get("v")}`;
    }

    return url;
  } catch {
    return "";
  }
}