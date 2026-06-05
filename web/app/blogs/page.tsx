import { client } from "@/lib/sanity";
import { blogsQuery } from "@/lib/queries";
import Link from "next/link";

export default async function BlogsPage() {
	const blogs = await client.fetch(blogsQuery);

	return (
		<main style={{ padding: 20, maxWidth: "1100px", margin: "0 auto" }}>
			<h1 style={{ fontSize: "32px", fontWeight: 700, marginBottom: "20px" }}>Blogs</h1>

			<div
				style={{
					display: "grid",
					gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
					gap: "20px",
				}}
			>
				{blogs.map((blog: any) => (
					<Link
						key={blog._id}
						href={`/blogs/${blog.slug?.current}`}
						style={{
							border: "1px solid #e5e5e5",
							borderRadius: "12px",
							padding: "18px",
							textDecoration: "none",
							color: "inherit",
							background: "white",
						}}
					>
						<h2 style={{ fontSize: "20px", marginBottom: "10px" }}>{blog.title}</h2>
						<p style={{ color: "#666", lineHeight: 1.6 }}>
							{blog.content?.slice(0, 140)}
							{blog.content?.length > 140 ? "..." : ""}
						</p>
					</Link>
				))}
			</div>
		</main>
	);
}
