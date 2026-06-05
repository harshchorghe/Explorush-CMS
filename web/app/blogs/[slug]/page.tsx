import { client } from "@/lib/sanity";

export default async function BlogDetailsPage({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;

	const query = `
		*[_type == "blog" && slug.current == $slug][0]{
			_id,
			title,
			content
		}
	`;

	const blog = await client.fetch(query, { slug });

	if (!blog) {
		return (
			<div style={{ padding: 20 }}>
				<h2>Blog not found</h2>
			</div>
		);
	}

	return (
		<main style={{ padding: 20, maxWidth: "800px", margin: "0 auto" }}>
			<h1 style={{ fontSize: "36px", fontWeight: 700, marginBottom: "16px" }}>{blog.title}</h1>
			<p style={{ lineHeight: 1.8, color: "#333", whiteSpace: "pre-wrap" }}>{blog.content}</p>
		</main>
	);
}
