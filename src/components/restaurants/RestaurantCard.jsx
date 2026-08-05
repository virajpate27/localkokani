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
            <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold text-primary shadow-sm">
              <FiStar className="text-accent fill-accent" />
              {restaurant.rating}
            </div>
          )}
          {restaurant.verified && <VerifiedBadge showLabel={false} className="!p-2 !rounded-lg" />}
        </div>
        <WishlistButton item={restaurant} entityType="restaurant" className="absolute top-3 right-3" />
        {sponsored && <SponsoredBadge />}
        <CustomBadge text={restaurant.customBadgeText} color={restaurant.customBadgeColor} /> 
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="flex items-center gap-1 text-secondary text-xs font-medium uppercase tracking-wide">
          <FiMapPin /> {restaurant.destinationName}
        </p>
        <h3 className="font-display font-semibold text-lg text-primary mt-1.5 line-clamp-1">
          {restaurant.name}
        </h3>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {(restaurant.cuisine || []).slice(0, 3).map((c) => {
            const Icon = getCuisineIcon(c);
            return (
              <span
                key={c}
                className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
              >
                <Icon className="text-accent-dark text-[11px]" />
                {c}
              </span>
            );
          })}
          <span
            key="more"
            className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
          >
            more..
          </span>
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            {restaurant.costForTwo ? (
              <>
                <p className="font-display font-bold text-primary text-sm">
                  {formatCurrency(restaurant.costForTwo)}
                  <span className="text-xs font-normal text-gray-400"> for two</span>
                </p>
                <p className="text-gray-400 text-xs">{restaurant.priceRange}</p>
              </>
            ) : (
              <p className="text-primary font-semibold text-sm">{restaurant.priceRange}</p>
            )}
          </div>
          {restaurant.openingHours && (
            <span className="text-gray-400 text-xs truncate max-w-[120px] text-right">
              {restaurant.openingHours}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}