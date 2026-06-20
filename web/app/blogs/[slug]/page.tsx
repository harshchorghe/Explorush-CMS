import { client } from "@/lib/sanity";
import BlogDetailsComponent from "@/components/blogs/BlogDetailsComponent";

// Never cache this page
export const revalidate = 0;

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
      content,
      coverImage{
        asset->{ url }
      },
      _createdAt,
      category->{
        title
      },
      author->{
        name,
        image{ asset->{ url } }
      }
    }
  `;

  const blog = await client.fetch(query, { slug }, { cache: "no-store" });

  return <BlogDetailsComponent blog={blog} />;
}