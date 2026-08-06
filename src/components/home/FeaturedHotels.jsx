// src/components/home/FeaturedHotels.jsx
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { getFeaturedHotels } from "@/lib/services/hotelService";
import FeaturedHotelsCarousel from "./FeaturedHotelsCarousel";

export default async function FeaturedHotels() {
  const hotels = await getFeaturedHotels(8); // fetch a few more since it's a scrollable carousel now, not a fixed grid

  if (!hotels.length) return null;

  return (
    <section className="py-20 bg-white dark:bg-gray-900 overflow-hidden">
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
            className="hidden sm:flex items-center gap-2 text-primary dark:text-white font-medium hover:text-secondary transition-colors"
          >
            View all <FiArrowRight />
          </Link>
        </div>
      </div>

      {/* Carousel sits outside container-custom so the "peek" card can extend to the edge on mobile */}
      <div className="container-custom">
        <FeaturedHotelsCarousel hotels={hotels} />
      </div>

      <div className="sm:hidden container-custom mt-6 text-center">
        <Link href="/hotels" className="btn-primary inline-flex items-center gap-2">
          View all hotels <FiArrowRight />
        </Link>
      </div>
    </section>
  );
}