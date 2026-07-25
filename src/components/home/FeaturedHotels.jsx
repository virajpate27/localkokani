// src/components/home/FeaturedHotels.jsx
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import HotelCard from "@/components/hotels/HotelCard";
import { placeholderHotels } from "@/utils/placeholderData";

export default function FeaturedHotels() {
  const hotels = placeholderHotels; // Day 7: replace with Firestore fetch

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Handpicked
            </span>
            <h2 className="section-title mt-2">Featured Hotels</h2>
          </div>
          <Link
            href="/hotels"
            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:text-secondary transition-colors"
          >
            View all <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link href="/hotels" className="btn-primary inline-flex items-center gap-2">
            View all hotels <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}