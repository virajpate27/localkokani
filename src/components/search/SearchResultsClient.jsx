// src/components/search/SearchResultsClient.jsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { FiSearch, FiMapPin, FiHome, FiCoffee, FiStar, FiLoader } from "react-icons/fi";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/utils/helpers";
import EmptyState from "@/components/ui/EmptyState";
import { HotelGridSkeleton } from "@/components/ui/Skeleton";

export default function SearchResultsClient({
  initialQuery,
  initialHotels,
  initialDestinations,
  initialRestaurants, // ⬅️ ADD THIS PROP
}) {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(initialQuery);
  const [hotels, setHotels] = useState(initialHotels);
  const [destinations, setDestinations] = useState(initialDestinations);
  const [restaurants, setRestaurants] = useState(initialRestaurants || []); // ⬅️ ADD THIS
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);

  const debouncedValue = useDebounce(inputValue, 400);

  const runSearch = useCallback(async (searchQuery) => {
    if (!searchQuery.trim()) {
      setHotels([]);
      setDestinations([]);
      setRestaurants([]); // ⬅️ ADD THIS
      setHasSearched(false);
      return;
    }

    setIsLoading(true);
    setHasSearched(true);

    try {
      const res = await fetch(`/api/search/full?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setHotels(data.hotels || []);
      setDestinations(data.destinations || []);
      setRestaurants(data.restaurants || []); // ⬅️ ADD THIS
    } catch (error) {
      console.error("Search error:", error);
      setHotels([]);
      setDestinations([]);
      setRestaurants([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const [isFirstRun, setIsFirstRun] = useState(true);
  useEffect(() => {
    if (isFirstRun) {
      setIsFirstRun(false);
      return;
    }

    const newUrl = debouncedValue.trim()
      ? `/search?q=${encodeURIComponent(debouncedValue.trim())}`
      : "/search";
    window.history.replaceState(null, "", newUrl);

    runSearch(debouncedValue);
  }, [debouncedValue]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalResults = hotels.length + destinations.length + restaurants.length; // ⬅️ UPDATE THIS

  return (
    <>
      <section className="bg-hero-gradient py-12">
        <div className="container-custom">
          <h1 className="font-display font-bold text-3xl text-white text-center mb-6">
            Search Hotels, Restaurants & Destinations
          </h1>
          <div className="max-w-2xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-2">
            <div className="flex items-center gap-3 px-3 py-2.5">
              <FiSearch className="text-secondary text-xl shrink-0" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search destination, hotel, or restaurant..."
                aria-label="Search"
                autoFocus
                className="w-full outline-none dark:text-gray-300 placeholder:dark:dark:text-gray-500"
              />
              {isLoading && <FiLoader className="animate-spin dark:dark:text-gray-500 shrink-0" />}
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50 dark:bg-gray-950 min-h-[50vh]">
        <div className="container-custom">
          {!hasSearched ? (
            <EmptyState
              title="Start typing to search"
              description="Search by destination name, hotel or restaurant name, cuisine, or amenities."
            />
          ) : isLoading ? (
            <HotelGridSkeleton count={6} />
          ) : totalResults === 0 ? (
            <EmptyState
              title={`No results for "${inputValue}"`}
              description="Try a different destination, hotel, or restaurant name."
            />
          ) : (
            <>
              <p className="dark:text-gray-500 text-sm mb-8">
                <span className="font-semibold text-primary dark:text-white">{totalResults}</span>{" "}
                {totalResults === 1 ? "result" : "results"} for "
                <span className="font-medium text-primary dark:text-white">{inputValue}</span>"
              </p>

              {/* Destinations Section */}
              {destinations.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-display font-bold text-xl text-primary dark:text-white mb-5 flex items-center gap-2">
                    <FiMapPin className="text-secondary" />
                    Destinations ({destinations.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {destinations.map((dest) => (
                      <Link
                        key={dest.id}
                        href={`/destinations/${dest.slug}`}
                        className="group card overflow-hidden flex items-center gap-4 p-4 hover:-translate-y-1"
                      >
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                          {dest.image && (
                            <Image
                              src={dest.image}
                              alt={dest.title}
                              fill
                              sizes="80px"
                              className="object-cover group-hover:scale-110 transition-transform"
                            />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-display font-semibold text-primary dark:text-white truncate">
                            {dest.title}
                          </p>
                          <p className="dark:dark:text-gray-500 text-sm truncate">{dest.subtitle}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Hotels Section */}
              {hotels.length > 0 && (
                <div className="mb-12">
                  <h2 className="font-display font-bold text-xl text-primary dark:text-white mb-5 flex items-center gap-2">
                    <FiHome className="text-secondary" />
                    Hotels ({hotels.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {hotels.map((hotel) => (
                      <Link
                        key={hotel.id}
                        href={`/hotels/${hotel.slug}`}
                        className="group card overflow-hidden flex flex-col hover:-translate-y-1"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {hotel.image && (
                            <Image
                              src={hotel.image}
                              alt={hotel.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                          {hotel.rating > 0 && (
                            <div className="absolute top-3 left-3 bg-white dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold text-primary dark:text-white shadow-sm">
                              <FiStar className="text-accent fill-accent" />
                              {hotel.rating}
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <p className="text-secondary text-xs font-medium uppercase tracking-wide">
                            {hotel.subtitle}
                          </p>
                          <h3 className="font-display font-semibold text-lg text-primary dark:text-white mt-1.5 line-clamp-1">
                            {hotel.title}
                          </h3>
                          {hotel.price && (
                            <p className="font-display font-bold text-primary dark:text-white mt-3 pt-3 border-t dark:border-gray-800">
                              {formatCurrency(hotel.price)}
                              <span className="text-xs font-normal dark:dark:text-gray-500"> /night</span>
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* NEW: Restaurants Section */}
              {restaurants.length > 0 && (
                <div>
                  <h2 className="font-display font-bold text-xl text-primary dark:text-white mb-5 flex items-center gap-2">
                    <FiCoffee className="text-secondary" />
                    Restaurants ({restaurants.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map((restaurant) => (
                      <Link
                        key={restaurant.id}
                        href={`/restaurants/${restaurant.slug}`}
                        className="group card overflow-hidden flex flex-col hover:-translate-y-1"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {restaurant.image && (
                            <Image
                              src={restaurant.image}
                              alt={restaurant.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                          {restaurant.rating > 0 && (
                            <div className="absolute top-3 left-3 bg-white dark:bg-gray-900/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold text-primary dark:text-white shadow-sm">
                              <FiStar className="text-accent fill-accent" />
                              {restaurant.rating}
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <p className="text-secondary text-xs font-medium uppercase tracking-wide">
                            {restaurant.subtitle}
                          </p>
                          <h3 className="font-display font-semibold text-lg text-primary dark:text-white mt-1.5 line-clamp-1">
                            {restaurant.title}
                          </h3>
                          {restaurant.price && (
                            <p className="font-display font-bold text-primary dark:text-white mt-3 pt-3 border-t dark:border-gray-800">
                              {formatCurrency(restaurant.price)}
                              <span className="text-xs font-normal dark:dark:text-gray-500"> for two</span>
                            </p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}