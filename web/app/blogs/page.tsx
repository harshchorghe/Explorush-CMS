import { client } from "@/lib/sanity";
import { blogsQuery } from "@/lib/queries";
import BlogsComponent from "@/components/blogs/BlogsComponent";

export default async function BlogsPage() {
  const blogs = await client.fetch(blogsQuery);

  return <BlogsComponent blogs={blogs} />;
}