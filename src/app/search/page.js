// src/app/search/page.js
import { searchAllFull } from "@/lib/services/searchService";
import SearchResultsClient from "@/components/search/SearchResultsClient";

export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  const query = q || "";

  return {
    title: query ? `Search results for "${query}" | StayFinder` : "Search | StayFinder",
    description: query
      ? `Explore hotels and destinations matching "${query}" on StayFinder.`
      : "Search hotels and destinations across StayFinder.",
    robots: { index: false, follow: true }, // search result pages shouldn't be indexed
  };
}

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  const { hotels, destinations } = query
    ? await searchAllFull(query)
    : { hotels: [], destinations: [] };

  return (
    <SearchResultsClient
      initialQuery={query}
      initialHotels={hotels}
      initialDestinations={destinations}
    />
  );
}