import { client } from "@/lib/sanity";
import { vlogsQuery } from "@/lib/queries";
import VlogComponent from "@/components/vlogs/VlogComponent";

export default async function VlogsPage() {
  const vlogs = await client.fetch(vlogsQuery);

  return <VlogComponent vlogs={vlogs} />;
}