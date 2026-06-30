import { client } from "@/lib/sanity";
import BlogDetailsComponent from "@/components/blogs/BlogDetailsComponent";
import type { Metadata } from "next";

// Never cache this page
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const query = `
    *[_type == "blog" && slug.current == $slug][0]{
      title,
      content,
      coverImage{
        asset->{ url }
      }
    }
  `;

  const blog = await client.fetch(query, { slug }, { cache: "no-store" });

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  let description = "Read this travel log on Explorush.";
  if (blog.content) {
    const cleanContent = blog.content.replace(/\s+/g, " ").trim();
    if (cleanContent.length > 157) {
      description = cleanContent.substring(0, 157) + "...";
    } else if (cleanContent.length > 0) {
      description = cleanContent;
    }
  }

  const imageUrl = blog.coverImage?.asset?.url;

  return {
    title: blog.title,
    description: description,
    openGraph: {
      title: `${blog.title} | Explorush Blogs`,
      description: description,
      type: "article",
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | Explorush Blogs`,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function BlogDetailsPage({
  params,
}: Props) {
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