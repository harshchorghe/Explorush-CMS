import Image from "next/image";
import Link from "next/link";

export default function VlogDetailsComponent({
  vlog,
}: {
  vlog: any;
}) {
  if (!vlog) {
    return (
      <main
        style={{
          background: "#050810",
          minHeight: "100vh",
          color: "#fff",
          padding: "40px",
        }}
      >
        Vlog not found
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
          maxWidth: "1100px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        <Link
          href="/vlogs"
          style={{
            color: "#00ffe0",
            textDecoration: "none",
          }}
        >
          ← Back to Vlogs
        </Link>

        <h1
          style={{
            fontSize: "38px",
            marginTop: "20px",
            marginBottom: "30px",
            fontFamily: "Syne, sans-serif",
          }}
        >
          {vlog.title}
        </h1>

        {vlog.videoUrl && (
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "56.25%",
              marginBottom: "30px",
            }}
          >
            <iframe
              src={convertToEmbed(vlog.videoUrl)}
              title={vlog.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
                borderRadius: "16px",
              }}
            />
          </div>
        )}

        {vlog.thumbnail?.asset?.url && (
          <Image
            src={vlog.thumbnail.asset.url}
            alt={vlog.title}
            width={1200}
            height={700}
            style={{
              width: "100%",
              height: "auto",
              borderRadius: "16px",
            }}
          />
        )}
      </div>
    </main>
  );
}

function convertToEmbed(url: string) {
  try {
    const parsedUrl = new URL(url);

    if (parsedUrl.hostname === "youtu.be") {
      const videoId = parsedUrl.pathname.slice(1);
      return `https://www.youtube.com/embed/${videoId}`;
    }

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