// src/app/hotels/error.js
"use client";

import { useEffect } from "react";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";

export default function HotelsListError({ error, reset }) {
  useEffect(() => {
    console.error("Hotels listing error:", error);
  }, [error]);

  return <ServiceUnavailable title="Couldn't load hotels right now" />;
}