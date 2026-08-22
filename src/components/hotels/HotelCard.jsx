// src/components/hotels/HotelCard.jsx
import Image from "next/image";
import Link from "next/link";
import { FiStar, FiMapPin } from "react-icons/fi";
import { formatCurrency } from "@/utils/helpers";
import { getOptimizedUrl } from "@/lib/cloudinary";
import WishlistButton from "@/components/ui/WishlistButton";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import SponsoredBadge from "@/components/ui/SponsoredBadge";
import CustomBadge from "@/components/ui/CustomBadge";
import AvailabilityBadge from "@/components/ui/AvailabilityBadge";

export default function HotelCard({ hotel, priority = false, sponsored = false }) {
  const imageUrl = getOptimizedUrl(hotel.images?.[0]?.url, { width: 600 }) || "/placeholder-hotel.jpg";

  return (
    <Link
      href={`/hotels/${hotel.slug}`}
      className="group card overflow-hidden flex flex-col hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={imageUrl}
          alt={hotel.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div class="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent"></div>
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="bg-white dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold text-primary dark:text-white shadow-sm">
            <FiStar className="text-accent fill-accent" />
            {hotel.rating}
           
          </div>
         
        </div>
        <WishlistButton item={hotel} className="absolute top-3 right-3" />
        {sponsored && <SponsoredBadge />}
        <CustomBadge text={hotel.customBadgeText} color={hotel.customBadgeColor} />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="flex items-center gap-1 text-secondary text-xs font-medium uppercase tracking-wide">
          <FiMapPin /> {hotel.destinationName}
        </p>
        <div className="flex">
          <h3 className="font-display font-semibold text-lg text-primary dark:text-white mt-1.5 line-clamp-1">
          {hotel.name}  
        </h3>

         {hotel.verified && <VerifiedBadge showLabel={false} className="!p-2 !rounded-lg" />}
        </div>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {(hotel.amenities || []).slice(0, 2).map((a) => (
            <span key={a} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
              {a}
            </span>
          ))}
        </div>

        <AvailabilityBadge
          status={hotel.availabilityStatus}
          message={hotel.availabilityMessage}
        />

        <div className="flex items-end justify-between mt-4 pt-4 border-t dark:border-gray-800">
          <div>
            <p className="text-xs dark:dark:text-gray-500">Starting from</p>
            <p className="font-display font-bold text-lg text-primary dark:text-white">
              {formatCurrency(hotel.price)}
              <span className="text-xs font-normal dark:dark:text-gray-500"> /night</span>
            </p>
          </div>
          <span className="text-xs dark:dark:text-gray-500">
            {hotel.reviewCount} reviews
          </span>
        </div>
      </div>
    </Link>
  );
}