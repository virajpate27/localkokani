// src/components/home/FeaturedRestaurantsCarousel.jsx
"use client";

import CardCarousel from "@/components/ui/CardCarousel";
import RestaurantCard from "@/components/restaurants/RestaurantCard";

export default function FeaturedRestaurantsCarousel({ restaurants }) {
  return (
    <CardCarousel
      items={restaurants}
      navPrefix="restaurants"
      renderItem={(restaurant, index) => <RestaurantCard restaurant={restaurant} priority={index < 2} />}
    />
  );
}