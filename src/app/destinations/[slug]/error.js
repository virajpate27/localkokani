// src/app/destinations/[slug]/error.js
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

export default function DestinationError({ error, reset }) {
  useEffect(() => {
    console.error("Destination page error:", error);
  }, [error]);

  return (
    <div className="container-custom py-24 text-center">
      <FiAlertTriangle className="text-4xl text-red-400 mx-auto mb-4" />
      <h2 className="font-display font-semibold text-xl text-primary">
        Couldn't load this destination
      </h2>
      <p className="text-gray-500 mt-2">
        Something went wrong fetching this destination's details.
      </p>
      <div className="flex justify-center gap-3 mt-6">
        <button onClick={reset} className="btn-primary flex items-center gap-2">
          <FiRefreshCw /> Try Again
        </button>
        <Link href="/destinations" className="text-secondary font-medium hover:underline self-center">
          Browse all destinations
        </Link>
      </div>
    </div>
  );
}