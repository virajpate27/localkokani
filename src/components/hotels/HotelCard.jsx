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
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <div className="bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold text-primary shadow-sm">
            <FiStar className="text-accent fill-accent" />
            {hotel.rating}
          </div>
          {hotel.verified && <VerifiedBadge showLabel={false} className="!p-2 !rounded-lg" />}
        </div>
        <WishlistButton item={hotel} className="absolute top-3 right-3" />
          {sponsored && <SponsoredBadge />}
          <CustomBadge text={hotel.customBadgeText} color={hotel.customBadgeColor} />
      </div>

      <div className="p-5 flex flex-col flex-1">
        <p className="flex items-center gap-1 text-secondary text-xs font-medium uppercase tracking-wide">
          <FiMapPin /> {hotel.destinationName}
        </p>
        <h3 className="font-display font-semibold text-lg text-primary mt-1.5 line-clamp-1">
          {hotel.name}
        </h3>

        <div className="flex flex-wrap gap-1.5 mt-3">
          {(hotel.amenities || []).slice(0, 2).map((a) => (
            <span
              key={a}
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
            >
              
              {a}
            </span>
            
          ))}
           <span
            
              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md"
            >
              more..
            </span>
        </div>

        <div className="flex items-end justify-between mt-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-400">Starting from</p>
            <p className="font-display font-bold text-lg text-primary">
              {formatCurrency(hotel.price)}
              <span className="text-xs font-normal text-gray-400"> /night</span>
            </p>
          </div>
          <span className="text-xs text-gray-400">
            {hotel.reviewCount} reviews
          </span>
        </div>
      </div>
    </Link>
  );
}