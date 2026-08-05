// src/components/home/FeaturedHotelsCarousel.jsx
"use client";

import CardCarousel from "@/components/ui/CardCarousel";
import HotelCard from "@/components/hotels/HotelCard";

export default function FeaturedHotelsCarousel({ hotels }) {
  return (
    <CardCarousel
      items={hotels}
      navPrefix="hotels"
      renderItem={(hotel, index) => <HotelCard hotel={hotel} priority={index < 2} />}
    />
  );
}