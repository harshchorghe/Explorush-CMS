import { client } from "@/lib/sanity";
import { tripsQuery } from "@/lib/queries";
import TripsComponent from "@/components/trips/TripsComponent";

// Never cache this page — always fetch fresh data from Sanity
export const revalidate = 0;

export default async function TripsPage() {
  const trips = await client.fetch(tripsQuery, {}, { cache: "no-store" });

  return <TripsComponent trips={trips} />;
}