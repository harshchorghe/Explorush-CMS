import { client } from "@/lib/sanity";
import TripDetailsComponent from "@/components/trips/TripDetailsComponent";

// Never cache this page — always fetch fresh data from Sanity
export const revalidate = 0;

export default async function TripDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const query = `
    *[_type == "trip" && slug.current == $slug][0]{
      _id,
      title,
      location,
      type,
      description,
      startDate,
      endDate,
      coverImage{
        asset->{url}
      },
      gallery[]{
        "url": asset->url
      },
      itinerary
    }
  `;

  const trip = await client.fetch(query, { slug }, { cache: "no-store" });

  return <TripDetailsComponent trip={trip} />;
}