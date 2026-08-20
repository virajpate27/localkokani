// src/components/home/FeaturedRestaurants.jsx
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import { getFeaturedRestaurants } from "@/lib/services/restaurantService";
import FeaturedRestaurantsCarousel from "./FeaturedRestaurantsCarousel";

export default async function FeaturedRestaurants() {
  const restaurants = await getFeaturedRestaurants(8);

  if (!restaurants.length) return null;

  return (
    <section className="py-14 bg-gray-50 dark:bg-gray-950 overflow-hidden">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Where to Eat
            </span>
            <h2 className="section-title mt-2">Featured Restaurants</h2>
          </div>
          <Link
            href="/restaurants"
            className="hidden sm:flex items-center gap-2 text-primary dark:text-white font-medium hover:text-secondary transition-colors"
          >
            View all <FiArrowRight />
          </Link>
        </div>
      </div>

      <div className="container-custom">
        <FeaturedRestaurantsCarousel restaurants={restaurants} />
      </div>

      <div className="sm:hidden container-custom mt-6 text-center">
        <Link href="/restaurants" className="btn-primary inline-flex items-center gap-2">
          View all restaurants <FiArrowRight />
        </Link>
      </div>
    </section>
  );
}