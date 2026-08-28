// src/app/restaurants/error.js
"use client";

import { useEffect } from "react";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";

export default function RestaurantsListError({ error, reset }) {
  useEffect(() => {
    console.error("Restaurants listing error:", error);
  }, [error]);

  return <ServiceUnavailable title="Couldn't load restaurants right now" />;
}