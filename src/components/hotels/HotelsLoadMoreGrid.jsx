// src/components/hotels/HotelsLoadMoreGrid.jsx
"use client";

import { useState } from "react";
import { FiChevronDown, FiLoader } from "react-icons/fi";
import HotelCard from "./HotelCard";
import EmptyState from "@/components/ui/EmptyState";

const PAGE_SIZE = 4;

export default function HotelsLoadMoreGrid({ hotels, destinationName }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  if (hotels.length === 0) {
    return (
      <EmptyState
        title={`No hotels listed in ${destinationName} yet`}
        description="Check back soon, or explore other destinations."
      />
    );
  }

  const visibleHotels = hotels.slice(0, visibleCount);
  const hasMore = visibleCount < hotels.length;
  const remainingCount = hotels.length - visibleCount;

  const handleLoadMore = () => {
    // Small artificial delay so the loading state is perceptible even on fast connections —
    // data is already in memory (fetched server-side), this is purely a UX affordance.
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, hotels.length));
      setIsLoadingMore(false);
    }, 300);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {visibleHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 bg-white dark:bg-gray-900 border dark:border-gray-800 text-primary dark:text-white font-medium px-6 py-3 rounded-xl hover:border-secondary hover:text-secondary transition-colors disabled:opacity-60"
          >
            {isLoadingMore ? (
              <>
                <FiLoader className="animate-spin" /> Loading...
              </>
            ) : (
              <>
                Load More Hotels
                <span className="dark:text-gray-500 font-normal">
                  ({Math.min(remainingCount, PAGE_SIZE)} more)
                </span>
                <FiChevronDown />
              </>
            )}
          </button>
        </div>
      )}
    </>
  );
}