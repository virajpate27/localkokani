// src/components/destinations/SponsoredListingsSection.jsx
import HotelCard from "@/components/hotels/HotelCard";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { FiZap } from "react-icons/fi";

function interleave(hotels, restaurants) {
  const result = [];
  const maxLength = Math.max(hotels.length, restaurants.length);

  for (let i = 0; i < maxLength; i++) {
    if (hotels[i]) result.push({ type: "hotel", data: hotels[i] });
    if (restaurants[i]) result.push({ type: "restaurant", data: restaurants[i] });
  }

  return result;
}

export default function SponsoredListingsSection({
  sponsoredHotels = [],
  sponsoredRestaurants = [],
  destinationName,
  title, // ⬅️ ADD — allows overriding "Recommended in {destination}" per page context
  excludeHotelId,     // ⬅️ ADD — so a hotel detail page doesn't show itself in its own sponsored section
  excludeRestaurantId, // ⬅️ ADD — same for restaurant detail page
}) {
  const filteredHotels = excludeHotelId
    ? sponsoredHotels.filter((h) => h.id !== excludeHotelId)
    : sponsoredHotels;

  const filteredRestaurants = excludeRestaurantId
    ? sponsoredRestaurants.filter((r) => r.id !== excludeRestaurantId)
    : sponsoredRestaurants;

  const mixedItems = interleave(filteredHotels, filteredRestaurants);

  if (mixedItems.length === 0) return null;

  return (
    <section className="py-10 bg-primary/5">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <FiZap className="text-primary" />
          <span className="text-primary dark:text-white font-semibold text-sm uppercase tracking-wider">
            Premium
          </span>
        </div>
        <h2 className="section-title mb-10">
          {title || `Recommended in ${destinationName}`}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {mixedItems.map(({ type, data }) =>
            type === "hotel" ? (
              <HotelCard key={`hotel-${data.id}`} hotel={data} sponsored />
            ) : (
              <RestaurantCard key={`restaurant-${data.id}`} restaurant={data} sponsored />
            )
          )}
        </div>
      </div>
    </section>
  );
}