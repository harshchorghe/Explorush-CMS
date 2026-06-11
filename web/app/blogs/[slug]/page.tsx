import { client } from "@/lib/sanity";
import BlogDetailsComponent from "@/components/blogs/BlogDetailsComponent";

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

  return <BlogDetailsComponent blog={blog} />;
}