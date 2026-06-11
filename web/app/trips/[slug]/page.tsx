import { client } from "@/lib/sanity";
import TripDetailsComponent from "@/components/trips/TripDetailsComponent";

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

  const trip = await client.fetch(query, { slug });

  return <TripDetailsComponent trip={trip} />;
}