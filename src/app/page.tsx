import { getListings } from "@/features/listings/actions/listing-actions";
import { HomeContent } from "@/components/home/home-content";

export default async function Home() {
  const { data: listings } = await getListings({ limit: 8 });

  return <HomeContent listings={listings} />;
}
