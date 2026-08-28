// src/lib/services/searchService.js
import { unstable_cache } from "next/cache";
import { getAllHotels } from "./hotelService";
import { getAllDestinations } from "./destinationService";
import { getAllRestaurants } from "./restaurantService";

// Wrapped in Next.js's real data cache — persists correctly across serverless
// invocations on Vercel, unlike a plain module-level variable.
const getCachedSearchIndex = unstable_cache(
  async () => {
    const [hotels, destinations, restaurants] = await Promise.all([
      getAllHotels(),
      getAllDestinations(),
      getAllRestaurants(),
    ]);

    const hotelEntries = hotels.map((hotel) => ({
      type: "hotel",
      id: hotel.id,
      slug: hotel.slug,
      title: hotel.name,
      subtitle: hotel.destinationName,
      image: hotel.images?.[0]?.url,
      price: hotel.price,
      rating: hotel.rating,
      searchText: [
        hotel.name,
        hotel.destinationName,
        ...(hotel.amenities || []),
        ...(hotel.searchKeywords || []),
      ]
        .join(" ")
        .toLowerCase(),
    }));

    const destinationEntries = destinations.map((dest) => ({
      type: "destination",
      id: dest.id,
      slug: dest.slug,
      title: dest.name,
      subtitle: `${dest.country} · ${dest.hotelCount || 0} hotels`,
      image: dest.image?.url,
      searchText: [dest.name, dest.country].join(" ").toLowerCase(),
    }));

    const restaurantEntries = restaurants.map((restaurant) => ({
      type: "restaurant",
      id: restaurant.id,
      slug: restaurant.slug,
      title: restaurant.name,
      subtitle: restaurant.destinationName,
      image: restaurant.images?.[0]?.url,
      price: restaurant.costForTwo || null,
      rating: restaurant.rating,
      searchText: [
        restaurant.name,
        restaurant.destinationName,
        ...(restaurant.cuisine || []),
        ...(restaurant.searchKeywords || []),
      ]
        .join(" ")
        .toLowerCase(),
    }));

    return [...destinationEntries, ...hotelEntries, ...restaurantEntries];
  },
  ["search-index"], // cache key — same key = same cached result shared across all requests
  { revalidate: 300, tags: ["search-index"] } // 5 minutes, tagged for manual invalidation below
);

function scoreMatch(searchText, query) {
  if (searchText.startsWith(query)) return 3;
  if (searchText.split(" ").some((word) => word.startsWith(query))) return 2;
  if (searchText.includes(query)) return 1;
  return 0;
}

export async function searchAll(rawQuery, limitCount = 8) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return [];

  const index = await getCachedSearchIndex();

  const results = index
    .map((entry) => ({ ...entry, score: scoreMatch(entry.searchText, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return results.slice(0, limitCount);
}

export async function searchAllFull(rawQuery) {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return { hotels: [], destinations: [], restaurants: [] };

  const index = await getCachedSearchIndex();

  const matched = index
    .map((entry) => ({ ...entry, score: scoreMatch(entry.searchText, query) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    hotels: matched.filter((r) => r.type === "hotel"),
    destinations: matched.filter((r) => r.type === "destination"),
    restaurants: matched.filter((r) => r.type === "restaurant"),
  };
}