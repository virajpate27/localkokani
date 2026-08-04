// src/components/destinations/SponsoredListingsSection.jsx
import HotelCard from "@/components/hotels/HotelCard";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import SponsoredBadge from "@/components/ui/SponsoredBadge";
import { FiZap } from "react-icons/fi";

// Interleaves two arrays so the mix feels natural (hotel, restaurant, hotel, restaurant...)
// rather than showing all hotels first, then all restaurants.
function interleave(hotels, restaurants) {
  const result = [];
  const maxLength = Math.max(hotels.length, restaurants.length);

  for (let i = 0; i < maxLength; i++) {
    if (hotels[i]) result.push({ type: "hotel", data: hotels[i] });
    if (restaurants[i]) result.push({ type: "restaurant", data: restaurants[i] });
  }

  return result;
}

export default function SponsoredListingsSection({ sponsoredHotels = [], sponsoredRestaurants = [], destinationName }) {
  const mixedItems = interleave(sponsoredHotels, sponsoredRestaurants);

  if (mixedItems.length === 0) return null; // hide entirely if nothing is sponsored here

  return (
    <section className="py-16 bg-primary/5">
      <div className="container-custom">
        <div className="flex items-center gap-2 mb-2">
          <FiZap className="text-primary" />
          <span className="text-primary font-semibold text-sm uppercase tracking-wider">
            Promoted
          </span>
        </div>
        <h2 className="section-title mb-10">
          Recommended in {destinationName}
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {mixedItems.map(({ type, data }) => (
            <div key={`${type}-${data.id}`} className="relative">
              <SponsoredBadge />
              {type === "hotel" ? (
                <HotelCard hotel={data} />
              ) : (
                <RestaurantCard restaurant={data} />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}