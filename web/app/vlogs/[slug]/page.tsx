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
		return (
			<div style={{ padding: 20 }}>
				<h2>Vlog not found</h2>
			</div>
		);
	}

	return (
		<main style={{ padding: 20, maxWidth: "900px", margin: "0 auto" }}>
			<h1 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "16px" }}>{vlog.title}</h1>

			{vlog.thumbnail?.asset?.url && (
				<Image
					src={vlog.thumbnail.asset.url}
					alt={vlog.title}
					width={1200}
					height={675}
					style={{ width: "100%", height: "auto", borderRadius: "12px" }}
				/>
			)}

			{vlog.videoUrl && (
				<p style={{ marginTop: "18px" }}>
					Watch here: <a href={vlog.videoUrl}>{vlog.videoUrl}</a>
				</p>
			)}
		</main>
	);
}
