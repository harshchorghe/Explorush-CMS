import AboutComponent from "@/components/about/AboutComponent";
import { client } from "@/lib/sanity";

export const revalidate = 0;
export const dynamic = "force-dynamic";

async function getAuthorData() {
  return await client.fetch(
    `*[_type == "author"][0]{
      name, bio, image{ asset->{ url } }
    }`,
    {},
    {
      cache: "no-store",
      next: { revalidate: 0 }
    }
  );
}

export default async function AboutPage() {
  const author = await getAuthorData();
  return <AboutComponent author={author} />;
}