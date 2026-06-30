import { client } from "@/lib/sanity";
import TripDetailsComponent from "@/components/trips/TripDetailsComponent";
import type { Metadata } from "next";

// Never cache this page — always fetch fresh data from Sanity
export const revalidate = 0;

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const query = `
    *[_type == "trip" && slug.current == $slug][0]{
      title,
      description,
      coverImage{
        asset->{url}
      }
    }
  `;

  const trip = await client.fetch(query, { slug }, { cache: "no-store" });

  if (!trip) {
    return {
      title: "Trip Not Found",
    };
  }

  let description = "Explore this amazing travel experience on Explorush.";
  if (trip.description) {
    const cleanDescription = trip.description.replace(/\s+/g, " ").trim();
    if (cleanDescription.length > 157) {
      description = cleanDescription.substring(0, 157) + "...";
    } else if (cleanDescription.length > 0) {
      description = cleanDescription;
    }
  }

  const imageUrl = trip.coverImage?.asset?.url;

  return {
    title: trip.title,
    description: description,
    openGraph: {
      title: `${trip.title} | Explorush Trips`,
      description: description,
      type: "article",
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${trip.title} | Explorush Trips`,
      description: description,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function TripDetailsPage({
  params,
}: Props) {
  const { slug } = await params;

  const query = `
    *[_type == "trip" && slug.current == $slug][0]{
      _id,
      title,
      location,
      type,
      budget,
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