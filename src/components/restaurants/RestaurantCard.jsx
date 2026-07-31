// src/components/restaurants/RestaurantCard.jsx
import Link from "next/link";
import Image from "next/image";
import { FiStar, FiMapPin } from "react-icons/fi";
import { getOptimizedUrl } from "@/lib/cloudinary";

export default function RestaurantCard({ restaurant, priority = false }) {
  const imageUrl =
    getOptimizedUrl(restaurant.images?.[0]?.url, { width: 600 }) ||
    "/placeholder-hotel.jpg";

  return (
    <Link
      href={`/restaurants/${restaurant.slug}`}
      className="group card overflow-hidden flex flex-col hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={restaurant.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {restaurant.rating > 0 && (
          <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold text-primary shadow-sm">
            <FiStar className="text-accent fill-accent" />
            {restaurant.rating}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="flex items-center gap-1 text-secondary text-xs font-medium uppercase tracking-wide">
          <FiMapPin /> {restaurant.destinationName}
        </p>
        <h3 className="font-display font-semibold text-lg text-primary mt-1.5 line-clamp-1">
          {restaurant.name}
        </h3>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {(restaurant.cuisine || []).slice(0, 3).map((c) => (
            <span key={c} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
              {c}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <span className="text-primary font-semibold text-sm">
            {restaurant.priceRange}
          </span>
          {restaurant.openingHours && (
            <span className="text-gray-400 text-xs truncate max-w-[140px]">
              {restaurant.openingHours}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}