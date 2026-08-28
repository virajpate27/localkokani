// src/app/error.js
"use client";

import { useEffect } from "react";
import ServiceUnavailable from "@/components/ui/ServiceUnavailable";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return <ServiceUnavailable />;
}