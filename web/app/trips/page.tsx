import { client } from "@/lib/sanity";
import { tripsQuery } from "@/lib/queries";
import TripsComponent from "@/components/trips/TripsComponent";

export default async function TripsPage() {
  const trips = await client.fetch(tripsQuery);

  return <TripsComponent trips={trips} />;
}