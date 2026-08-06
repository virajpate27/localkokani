// src/components/hotels/HotelsFilterGrid.jsx
"use client";

import { useState, useMemo } from "react";
import { FiFilter, FiX, FiChevronDown, FiCheckCircle } from "react-icons/fi";
import HotelCard from "./HotelCard";
import EmptyState from "@/components/ui/EmptyState";

const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under ₹3,000", min: 0, max: 3000 },
  { label: "₹3,000 – ₹6,000", min: 3000, max: 6000 },
  { label: "₹6,000 – ₹10,000", min: 6000, max: 10000 },
  { label: "Above ₹10,000", min: 10000, max: Infinity },
];

const RATING_OPTIONS = [0, 3, 4, 4.5];

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating: High to Low", value: "rating_desc" },
];

export default function HotelsFilterGrid({ hotels }) {
  const [priceRange, setPriceRange] = useState(PRICE_RANGES[0]);
  const [minRating, setMinRating] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("recommended");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Extract all unique amenities from the dataset for the filter list
  const allAmenities = useMemo(() => {
    const set = new Set();
    hotels.forEach((h) => (h.amenities || []).forEach((a) => set.add(a)));
    return Array.from(set).slice(0, 8); // cap at 8 for clean UI
  }, [hotels]);

  const toggleAmenity = (amenity) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  };

  const filteredHotels = useMemo(() => {
    let result = hotels.filter((h) => {
      const inPriceRange = h.price >= priceRange.min && h.price <= priceRange.max;
      const meetsRating = h.rating >= minRating;
      const hasAmenities =
        selectedAmenities.length === 0 ||
        selectedAmenities.every((a) => (h.amenities || []).includes(a));
      const meetsVerified = !verifiedOnly || h.verified === true;
      return inPriceRange && meetsRating && hasAmenities && meetsVerified;
    });

    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating_desc":
        result.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break; // "recommended" keeps original order
    }

    return result;
  }, [hotels, priceRange, minRating, selectedAmenities, verifiedOnly, sortBy]);

  const activeFilterCount =
    (priceRange.label !== "Any Price" ? 1 : 0) +
    (minRating > 0 ? 1 : 0) +
    selectedAmenities.length +
    (verifiedOnly ? 1 : 0);

  const clearFilters = () => {
    setPriceRange(PRICE_RANGES[0]);
    setMinRating(0);
    setSelectedAmenities([]);
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
            <FiX className="text-2xl dark:dark:text-gray-500" />
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

          {/* Price Range */}
          <div>
            <p className="font-medium text-sm dark:text-gray-300 mb-3">
              Price per night
            </p>
            <div className="space-y-2">
              {PRICE_RANGES.map((range) => (
                <label
                  key={range.label}
                  className="flex items-center gap-2 cursor-pointer group"
                >
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange.label === range.label}
                    onChange={() => setPriceRange(range)}
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

          {/* Amenities */}
          {allAmenities.length > 0 && (
            <div className="pt-5 border-t dark:border-gray-800">
              <p className="font-medium text-sm dark:text-gray-300 mb-3">
                Amenities
              </p>
              <div className="space-y-2">
                {allAmenities.map((amenity) => (
                  <label
                    key={amenity}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <input
                      type="checkbox"
                      checked={selectedAmenities.includes(amenity)}
                      onChange={() => toggleAmenity(amenity)}
                      className="accent-secondary w-4 h-4 rounded"
                    />
                    <span className="text-sm dark:text-gray-300 group-hover:text-primary dark:text-white">
                      {amenity}
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
          Show {filteredHotels.length} Hotels
        </button>
      </aside>

      {/* Results */}
      <div>
        {/* Sort bar */}
        <div className="flex items-center justify-between mb-6">
          <p className="dark:text-gray-500 text-sm">
            <span className="font-semibold text-primary dark:text-white">
              {filteredHotels.length}
            </span>{" "}
            hotels found
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
            <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 dark:dark:text-gray-500 pointer-events-none text-sm" />
          </div>
        </div>

        {/* Grid */}
        {filteredHotels.length === 0 ? (
          <EmptyState
            title="No hotels match your filters"
            description="Try adjusting your price range or removing some filters."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}