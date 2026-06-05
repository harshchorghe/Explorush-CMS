import { client } from "@/lib/sanity";
import { vlogsQuery } from "@/lib/queries";
import Image from "next/image";
import Link from "next/link";

export default async function VlogsPage() {
	const vlogs = await client.fetch(vlogsQuery);

	return (
		<main style={{ padding: 20, maxWidth: "1100px", margin: "0 auto" }}>
			<h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "20px" }}>Vlogs</h1>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
					gap: "20px",
				}}
			>
				{vlogs.map((vlog: any) => (
					<Link
						key={vlog._id}
						href={`/vlogs/${vlog.slug?.current}`}
						style={{
							border: "1px solid #e5e5e5",
							borderRadius: "12px",
							overflow: "hidden",
							textDecoration: "none",
							color: "inherit",
							background: "white",
						}}
					>
						{vlog.thumbnail?.asset?.url && (
							<Image
								src={vlog.thumbnail.asset.url}
								alt={vlog.title}
								width={800}
								height={450}
								style={{ width: "100%", height: "220px", objectFit: "cover" }}
							/>
						)}

						<div style={{ padding: "18px" }}>
							<h2 style={{ fontSize: "20px", marginBottom: "8px" }}>{vlog.title}</h2>
							<p style={{ color: "#666" }}>{vlog.videoUrl}</p>
						</div>
					</Link>
				))}
			</div>
		</main>
	);
}
