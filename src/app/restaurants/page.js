// src/app/restaurants/page.js
import { getAllRestaurants } from "@/lib/services/restaurantService";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";


export const revalidate = 1800;

export const metadata = {
  title: "Restaurants | StayFinder",
  description: "Discover handpicked restaurants across top destinations — from fine dining to local favorites.",
  alternates: { canonical: "/restaurants" },
};

export default async function RestaurantsPage() {
  const restaurants = await getAllRestaurants();

  return (
    <>
      <div className="bg-white">
        <Breadcrumbs items={[{ name: "Restaurants", url: "/restaurants" }]} />
      </div>

      <section className="bg-hero-gradient py-14">
        <div className="container-custom text-center">
          <span className="inline-block bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            {restaurants.length} Restaurants
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white">
            Discover Great Places to Eat
          </h1>
          <p className="text-white/80 mt-4 max-w-xl mx-auto">
            Handpicked restaurants near your favorite destinations.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-[50vh]">
        <div className="container-custom">
          {restaurants.length === 0 ? (
            <EmptyState title="No restaurants yet" description="Check back soon." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {restaurants.map((r, i) => (
                <RestaurantCard key={r.id} restaurant={r} priority={i < 2} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}