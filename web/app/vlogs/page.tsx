import { client } from "@/lib/sanity";
import { vlogsQuery } from "@/lib/queries";
import VlogComponent from "@/components/vlogs/VlogComponent";

// Never cache this page — always fetch fresh data from Sanity
export const revalidate = 0;

export default async function VlogsPage() {
  const vlogs = await client.fetch(vlogsQuery, {}, { cache: "no-store" });

  return <VlogComponent vlogs={vlogs} />;
}