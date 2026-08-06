// src/app/hotels/[slug]/error.js
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

export default function HotelError({ error, reset }) {
  useEffect(() => {
    console.error("Hotel page error:", error);
  }, [error]);

  return (
    <div className="container-custom py-24 text-center">
      <FiAlertTriangle className="text-4xl text-red-400 mx-auto mb-4" />
      <h2 className="font-display font-semibold text-xl text-primary dark:text-white">
        Couldn't load this hotel
      </h2>
      <p className="dark:text-gray-500 mt-2">
        Something went wrong fetching this hotel's details.
      </p>
      <div className="flex justify-center gap-3 mt-6">
        <button onClick={reset} className="btn-primary flex items-center gap-2">
          <FiRefreshCw /> Try Again
        </button>
        <Link href="/hotels" className="text-secondary font-medium hover:underline self-center">
          Browse all hotels
        </Link>
      </div>
    </div>
  );
}