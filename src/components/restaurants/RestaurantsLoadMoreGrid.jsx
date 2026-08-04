// src/components/restaurants/RestaurantsLoadMoreGrid.jsx
"use client";

import { useState } from "react";
import { FiChevronDown, FiLoader } from "react-icons/fi";
import RestaurantCard from "./RestaurantCard";

const PAGE_SIZE = 4;

export default function RestaurantsLoadMoreGrid({ restaurants }) {
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  if (restaurants.length === 0) return null;

  const visibleRestaurants = restaurants.slice(0, visibleCount);
  const hasMore = visibleCount < restaurants.length;
  const remainingCount = restaurants.length - visibleCount;

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, restaurants.length));
      setIsLoadingMore(false);
    }, 300);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} />
        ))}
      </div>

      {hasMore && (
        <div className="text-center mt-10">
          <button
            onClick={handleLoadMore}
            disabled={isLoadingMore}
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-primary font-medium px-6 py-3 rounded-xl hover:border-secondary hover:text-secondary transition-colors disabled:opacity-60"
          >
            {isLoadingMore ? (
              <>
                <FiLoader className="animate-spin" /> Loading...
              </>
            ) : (
              <>
                Load More Restaurants
                <span className="text-gray-400 font-normal">
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