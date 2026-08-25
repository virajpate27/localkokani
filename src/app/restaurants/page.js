// src/app/restaurants/page.js
import { getAllRestaurants } from "@/lib/services/restaurantService";
import RestaurantsFilterGrid from "@/components/restaurants/RestaurantsFilterGrid";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const revalidate = 1800;

export const metadata = {
  title: "Restaurants | Local Kokani",
  description: "Discover handpicked restaurants across top destinations — from fine dining to local favorites.",
  alternates: { canonical: "/restaurants" },
};

export default async function RestaurantsPage() {
  const restaurants = await getAllRestaurants();

  return (
    <>
      <div className="bg-secondary dark:bg-gray-900">
        <Breadcrumbs items={[{ name: "Restaurants", url: "/restaurants" }]} />
      </div>

       <section className="bg-primary py-8">
        <div className="container-custom text-center">
          <span className="inline-block text-white bg-white/10 backdrop-blur-md dark:bg-gray-900/10 dark:text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            {restaurants.length} Restaurants
          </span>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white">
            Discover Great Places to Eat
          </h1>
          <p className="text-white/80 mt-4 max-w-xl mx-auto">
            Filter by cuisine, budget, or rating to find your perfect spot.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-950 min-h-[60vh]">
        <div className="container-custom">
          <RestaurantsFilterGrid restaurants={restaurants} />
        </div>
      </section>
    </>
  );
}