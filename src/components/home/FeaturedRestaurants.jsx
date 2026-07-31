// src/components/home/FeaturedRestaurants.jsx
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import { getFeaturedRestaurants } from "@/lib/services/restaurantService";

export default async function FeaturedRestaurants() {
  const restaurants = await getFeaturedRestaurants(4);

  if (!restaurants.length) return null; // gracefully hide section if empty, same pattern as Day 7

  return (
    <section className="py-20 bg-gray-50">
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
            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:text-secondary transition-colors"
          >
            View all <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {restaurants.map((restaurant, index) => (
            <RestaurantCard key={restaurant.id} restaurant={restaurant} priority={index < 2} />
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link href="/restaurants" className="btn-primary inline-flex items-center gap-2">
            View all restaurants <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}