// src/app/restaurants/[slug]/error.js
"use client";

import { useEffect } from "react";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";

export default function RestaurantError({ error, reset }) {
  useEffect(() => {
    console.error("Restaurant page error:", error);
  }, [error]);

  return (
    <ServiceUnavailable
      title="Couldn't load this restaurant"
      message="We're having trouble loading this page right now. Please try again, or reach us directly."
    />
  );
}