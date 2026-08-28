// src/app/destinations/error.js
"use client";

import { useEffect } from "react";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";

export default function DestinationsListError({ error, reset }) {
  useEffect(() => {
    console.error("Destinations listing error:", error);
  }, [error]);

  return <ServiceUnavailable title="Couldn't load destinations right now" />;
}