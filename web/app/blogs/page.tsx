import { client } from "@/lib/sanity";
import { blogsQuery } from "@/lib/queries";
import BlogsComponent from "@/components/blogs/BlogsComponent";

// Never cache this page — always fetch fresh data from Sanity
export const revalidate = 0;

export default async function BlogsPage() {
  const blogs = await client.fetch(blogsQuery, {}, { cache: "no-store" });

  return <BlogsComponent blogs={blogs} />;
}