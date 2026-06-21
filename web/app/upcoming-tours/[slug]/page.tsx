import { client } from "@/lib/sanity";
import UpcomingTourDetailsComponent from "@/components/upcoming-tours/UpcomingTourDetailsComponent";

// Never cache this page — always fetch fresh data from Sanity
export const revalidate = 0;

export default async function UpcomingTourDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const query = `
    *[_type == "upcomingTour" && slug.current == $slug][0]{
      _id,
      title,
      location,
      type,
      price,
      totalSlots,
      bookedSlots,
      description,
      startDate,
      endDate,
      coverImage {
        asset -> {
          _id,
          url
        }
      },
      gallery[] {
        "url": asset -> url
      },
      itinerary[] {
        day,
        plan
      },
      guidelines,
      included,
      excluded,
      author -> {
        name,
        image {
          asset -> {
            _id,
            url
          }
        }
      }
    }
  `;

  const tour = await client.fetch(query, { slug }, { cache: "no-store" });

  return <UpcomingTourDetailsComponent tour={tour} />;
}
