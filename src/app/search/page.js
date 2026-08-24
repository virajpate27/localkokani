// src/app/search/page.js
import { searchAllFull } from "@/lib/services/searchService";
import SearchResultsClient from "@/components/search/SearchResultsClient";

export async function generateMetadata({ searchParams }) {
  const { q } = await searchParams;
  const query = q || "";

  return {
    title: query ? `Search results for "${query}" | Local Kokani` : "Search | Local Kokani",
    description: query
      ? `Explore hotels and destinations matching "${query}" on Local Kokani.`
      : "Search hotels and destinations across Local Kokani.",
    robots: { index: false, follow: true }, // search result pages shouldn't be indexed
  };
}

export default async function SearchPage({ searchParams }) {
  const { q } = await searchParams;
  const query = (q || "").trim();

  const { hotels, destinations, restaurants } = query
    ? await searchAllFull(query)
    : { hotels: [], destinations: [], restaurants: [] };

  return (
    <SearchResultsClient
      initialQuery={query}
      initialHotels={hotels}
      initialDestinations={destinations}
      initialRestaurants={restaurants} 
    />
  );
}