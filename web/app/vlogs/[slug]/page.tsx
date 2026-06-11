import { client } from "@/lib/sanity";
import VlogDetailsComponent from "@/components/vlogs/VlogDetailsComponent";

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

  return <VlogDetailsComponent vlog={vlog} />;
}