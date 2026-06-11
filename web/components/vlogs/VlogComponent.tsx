import Image from "next/image";
import Link from "next/link";

export default function VlogComponent({
  vlogs,
}: {
  vlogs: any[];
}) {
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
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px 24px",
        }}
      >
        <Link
          href="/"
          style={{
            color: "#00ffe0",
            textDecoration: "none",
            fontSize: "14px",
          }}
        >
          ← Back to Home
        </Link>

        <h1
          style={{
            fontSize: "36px",
            fontWeight: 700,
            marginTop: "20px",
            marginBottom: "10px",
            fontFamily: "Syne, sans-serif",
          }}
        >
          Vlogs 🎥
        </h1>

        <p
          style={{
            color: "#9aa0b4",
            marginBottom: "40px",
          }}
        >
          Travel stories captured through video.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(300px,1fr))",
            gap: "24px",
          }}
        >
          {vlogs.map((vlog: any) => (
            <Link
              key={vlog._id}
              href={`/vlogs/${vlog.slug?.current}`}
              style={{
                textDecoration: "none",
                color: "#fff",
              }}
            >
              <div
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: "18px",
                  overflow: "hidden",
                  height: "100%",
                }}
              >
                {vlog.thumbnail?.asset?.url && (
                  <div
                    style={{
                      position: "relative",
                      height: "220px",
                    }}
                  >
                    <Image
                      src={vlog.thumbnail.asset.url}
                      alt={vlog.title}
                      fill
                      style={{
                        objectFit: "cover",
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    padding: "18px",
                  }}
                >
                  <h2
                    style={{
                      fontSize: "18px",
                      lineHeight: 1.5,
                    }}
                  >
                    {vlog.title}
                  </h2>

                  <div
                    style={{
                      marginTop: "12px",
                      color: "#00ffe0",
                      fontSize: "13px",
                    }}
                  >
                    Watch Vlog →
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}