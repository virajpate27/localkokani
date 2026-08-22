// src/components/restaurants/RestaurantsFilterGrid.jsx
"use client";

import { useState, useMemo } from "react";
import { FiFilter, FiX, FiChevronDown, FiCheckCircle } from "react-icons/fi";
import RestaurantCard from "./RestaurantCard";
import EmptyState from "@/components/ui/EmptyState";

const COST_RANGES = [
  { label: "Any Budget", min: 0, max: Infinity },
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 – ₹1,000", min: 500, max: 1000 },
  { label: "₹1,000 – ₹2,000", min: 1000, max: 2000 },
  { label: "Above ₹2,000", min: 2000, max: Infinity },
];

const RATING_OPTIONS = [0, 3, 4, 4.5];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Cost: Low to High", value: "cost_asc" },
  { label: "Cost: High to Low", value: "cost_desc" },
  { label: "Rating: High to Low", value: "rating_desc" },
];

export default function RestaurantsFilterGrid({ restaurants }) {
  const [costRange, setCostRange] = useState(COST_RANGES[0]);
  const [minRating, setMinRating] = useState(0);
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract all unique cuisine tags from the dataset for the filter list
  const allCuisines = useMemo(() => {
    const set = new Set();
    restaurants.forEach((r) => (r.cuisine || []).forEach((c) => set.add(c)));
    return Array.from(set).slice(0, 8); // cap at 8 for clean UI
  }, [restaurants]);

  const toggleCuisine = (cuisine) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine)
        ? prev.filter((c) => c !== cuisine)
        : [...prev, cuisine]
    );
  };

  const filteredRestaurants = useMemo(() => {
    let result = restaurants.filter((r) => {
      // Restaurants without a costForTwo set should still show up under "Any Budget"
      const cost = r.costForTwo || 0;
      const inCostRange =
        costRange.label === "Any Budget" || (cost >= costRange.min && cost <= costRange.max);
      const meetsRating = r.rating >= minRating;
      const hasCuisines =
        selectedCuisines.length === 0 ||
        selectedCuisines.every((c) => (r.cuisine || []).includes(c));
      const meetsVerified = !verifiedOnly || r.verified === true;
      return inCostRange && meetsRating && hasCuisines && meetsVerified;
    });

    switch (sortBy) {
      case "cost_asc":
        result.sort((a, b) => (a.costForTwo || 0) - (b.costForTwo || 0));
        break;
      case "cost_desc":
        result.sort((a, b) => (b.costForTwo || 0) - (a.costForTwo || 0));
        break;
      case "rating_desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break; // "recommended" keeps original order
    }

    return result;
  }, [restaurants, costRange, minRating, selectedCuisines, verifiedOnly, sortBy]);

  const activeFilterCount =
    (costRange.label !== "Any Budget" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    selectedCuisines.length +
    (verifiedOnly ? 1 : 0);

  const clearFilters = () => {
    setCostRange(COST_RANGES[0]);
    setMinRating(0);
    setSelectedCuisines([]);
    setVerifiedOnly(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
      {/* Mobile filter toggle */}
      <button
        onClick={() => setShowMobileFilters(true)}
        className="lg:hidden flex items-center justify-center gap-2 border dark:border-gray-800 bg-white dark:bg-gray-900 rounded-xl py-3 font-medium text-primary dark:text-white"
      >
        <FiFilter />
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-accent text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </button>

      {/* Filter Sidebar */}
      <aside
        className={`${
          showMobileFilters
            ? "fixed inset-0 z-[60] bg-white dark:bg-gray-900 p-6 overflow-y-auto"
            : "hidden"
        } lg:block lg:static lg:bg-transparent lg:p-0`}
      >
        <div className="flex items-center justify-between lg:hidden mb-6">
          <h3 className="font-display font-bold text-xl text-primary dark:text-white">Filters</h3>
          <button onClick={() => setShowMobileFilters(false)}>
            <FiX className="text-2xl dark:text-gray-500" />
          </button>
        </div>

        <div className="card p-5 space-y-6 lg:sticky lg:top-24">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-semibold text-primary dark:text-white">Filters</h3>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-secondary font-medium hover:underline"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Cost for Two Range */}
          <div>
            <p className="font-medium text-sm dark:text-gray-300 mb-3">
              Cost for Two
            </p>
            <div className="space-y-2">
              {COST_RANGES.map((range) => (
                <label
                  key={range.label}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="costRange"
                    checked={costRange.label === range.label}
                    onChange={() => setCostRange(range)}
                    className="accent-secondary w-4 h-4"
                  />
                  <span className="text-sm dark:text-gray-300 group-hover:text-primary dark:text-white">
                    {range.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="pt-5 border-t dark:border-gray-800">
            <p className="font-medium text-sm dark:text-gray-300 mb-3">
              Minimum Rating
            </p>
            <div className="flex flex-wrap gap-2">
              {RATING_OPTIONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setMinRating(r)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                    minRating === r
                      ? "bg-primary text-white border-primary"
                      : "dark:border-gray-800 dark:text-gray-300 hover:border-primary"
                  }`}
                >
                  {r === 0 ? "Any" : `${r}+ ★`}
                </button>
              ))}
            </div>
          </div>

          {/* Verified Only */}
          <div className="pt-5 border-t dark:border-gray-800">
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-4 h-4 accent-secondary rounded"
              />
              <span className="text-sm dark:text-gray-300 group-hover:text-primary dark:text-white flex items-center gap-1.5">
                Verified only <FiCheckCircle className="text-primary dark:text-white text-xs" />
              </span>
            </label>
          </div>

          {/* Cuisine */}
          {allCuisines.length > 0 && (
            <div className="pt-5 border-t dark:border-gray-800">
              <p className="font-medium text-sm dark:text-gray-300 mb-3">
                Cuisine
              </p>
              <div className="space-y-2">
                {allCuisines.map((cuisine) => (
                  <label
                    key={cuisine}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedCuisines.includes(cuisine)}
                      onChange={() => toggleCuisine(cuisine)}
                      className="accent-secondary w-4 h-4 rounded"
                    />
                    <span className="text-sm dark:text-gray-300 group-hover:text-primary dark:text-white">
                      {cuisine}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mobile apply button */}
        <button
          onClick={() => setShowMobileFilters(false)}
          className="btn-primary w-full mt-6 lg:hidden"
        >
          Show {filteredRestaurants.length} Restaurants
        </button>
      </aside>

      {/* Results */}
      <div>
        {/* Sort bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="dark:text-gray-500 text-sm">
            <span className="font-semibold text-primary dark:text-white">
              {filteredRestaurants.length}
            </span>{" "}
            restaurants found
          </p>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg pl-4 pr-9 py-2 text-sm dark:text-gray-300 focus:outline-none focus:border-secondary cursor-pointer"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-gray-500 pointer-events-none text-sm" />
          </div>
        </div>

        {/* Grid */}
        {filteredRestaurants.length === 0 ? (
          <EmptyState
            title="No restaurants match your filters"
            description="Try adjusting your budget or removing some filters."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}