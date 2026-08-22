// src/components/restaurants/RestaurantCard.jsx
import Link from "next/link";
import Image from "next/image";
import { FiStar, FiMapPin } from "react-icons/fi";
import { getOptimizedUrl } from "@/lib/cloudinary";
import { formatCurrency } from "@/utils/helpers";
import WishlistButton from "@/components/ui/WishlistButton";
import { getCuisineIcon } from "./CuisineGrid";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import SponsoredBadge from "@/components/ui/SponsoredBadge";
import CustomBadge from "@/components/ui/CustomBadge";
import AvailabilityBadge from "@/components/ui/AvailabilityBadge";

export default function RestaurantCard({ restaurant, priority = false, sponsored = false }) {
  const imageUrl =
    getOptimizedUrl(restaurant.images?.[0]?.url, { width: 600 }) ||
    "/placeholder-hotel.jpg";

  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="group card overflow-hidden flex flex-col hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image src={imageUrl} alt={restaurant.name} fill priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {restaurant.rating > 0 && (
            <div className="bg-white dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold text-primary dark:text-white shadow-sm">
              <FiStar className="text-accent fill-accent" />
              {restaurant.rating}
            </div>
          )}

        </div>
        <WishlistButton item={restaurant} entityType="restaurant" className="absolute top-3 right-3" />
        {sponsored && <SponsoredBadge />}
        <CustomBadge text={restaurant.customBadgeText} color={restaurant.customBadgeColor} />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="flex items-center gap-1 text-secondary text-xs font-medium uppercase tracking-wide">
          <FiMapPin /> {restaurant.destinationName}
        </p>

        <div className="flex">
          <h3 className="font-display font-semibold text-lg text-primary dark:text-white mt-1.5 line-clamp-1">
            {restaurant.name}
          </h3>
          {restaurant.verified && <VerifiedBadge showLabel={false} className="!p-2 !rounded-lg" />}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {(restaurant.cuisine || []).slice(0, 2).map((c) => {
            const Icon = getCuisineIcon(c);
            return (
              <span
                key={c}
                className="flex items-center gap-1 text-xs bg-gray-100 dark:text-gray-600 px-2 py-1 rounded-md"
              >
                <Icon className="text-accent-dark text-[11px]" />
                {c}
              </span>
            );
          })}

        </div>

        <AvailabilityBadge
          status={restaurant.availabilityStatus}
          message={restaurant.availabilityMessage}
        />

        <div className="flex items-center justify-between mt-4 pt-4 border-t dark:border-gray-800">
          <div>
            {restaurant.costForTwo ? (
              <>
                <p className="font-display font-bold text-primary dark:text-white text-sm">
                  {formatCurrency(restaurant.costForTwo)}
                  <span className="text-xs font-normal dark:text-gray-500"> for two</span>
                </p>

              </>
            ) : (
              <p className="text-primary dark:text-white font-semibold text-sm">{restaurant.priceRange}</p>
            )}
          </div>
          {restaurant.openingHours && (
            <span className="dark:text-gray-500 text-xs truncate max-w-[120px] text-right">
              {restaurant.openingHours}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}