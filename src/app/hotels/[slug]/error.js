// src/app/hotels/[slug]/error.js
"use client";

import { useEffect } from "react";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";

export default function HotelError({ error, reset }) {
  useEffect(() => {
    console.error("Hotel page error:", error);
  }, [error]);

  return (
    <ServiceUnavailable
      title="Couldn't load this hotel"
      message="We're having trouble loading this page right now. Please try again, or reach us directly and we'll help you book."
    />
  );
}