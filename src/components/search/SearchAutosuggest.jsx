// src/components/search/SearchAutosuggest.jsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiSearch, FiMapPin, FiHome, FiX, FiLoader, FiCoffee } from "react-icons/fi";
import { useDebounce } from "@/hooks/useDebounce";
import { formatCurrency } from "@/utils/helpers";

export default function SearchAutosuggest({
  placeholder = "Search destination or hotel name...",
  variant = "default", // "default" | "hero"
  onSearchSubmit,
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef(null);

  const debouncedQuery = useDebounce(query, 350);

  // Fetch results whenever the debounced query changes
  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) {
          setResults(data.results || []);
          setIsOpen(true);
        }
      })
      .catch((err) => {
        console.error("Search fetch error:", err);
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (result) => {
    setIsOpen(false);
    setQuery("");
    if (result.type === "hotel") {
      router.push(`/hotels/${result.slug}`);
    } else if (result.type === "restaurant") {
      router.push(`/restaurants/${result.slug}`);
    } else {
      router.push(`/destinations/${result.slug}`);
    }
  };

  const goToFullSearch = () => {
    if (!query.trim()) return;
    setIsOpen(false);
    if (onSearchSubmit) {
      onSearchSubmit(query.trim());
    } else {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) {
      if (e.key === "Enter") goToFullSearch();
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (activeIndex >= 0 && results[activeIndex]) {
        handleSelect(results[activeIndex]);
      } else {
        goToFullSearch();
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const isHero = variant === "hero";

  return (
    <div ref={containerRef} className="relative w-full">
      <div
        className={
          isHero
            ? "flex items-center gap-3 flex-1 px-4 py-3"
            : "flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5"
        }
      >
        <FiSearch className={isHero ? "text-secondary text-xl shrink-0" : "text-gray-400 shrink-0"} />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder={placeholder}
          aria-label="Search destination or hotel"
          className="w-full outline-none bg-transparent text-gray-700 placeholder:text-gray-400 text-sm"
        />
        {isLoading && <FiLoader className="animate-spin text-gray-400 shrink-0" />}
        {query && !isLoading && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setIsOpen(false);
            }}
            aria-label="Clear search"
          >
            <FiX className="text-gray-400 hover:text-gray-600 shrink-0" />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-100 max-h-[400px] overflow-y-auto z-50">
          {results.length === 0 && !isLoading ? (
            <div className="p-6 text-center text-gray-400 text-sm">
              No results for "{query}"
            </div>
          ) : (
            <>
              {results.map((result, index) => (
                <button
                  key={`${result.type}-${result.id}`}
                  onClick={() => handleSelect(result)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${activeIndex === index ? "bg-gray-50" : "hover:bg-gray-50"
                    }`}
                >
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                    {result.image && (
                      <Image
                        src={result.image}
                        alt={result.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-primary text-sm truncate">
                      {result.title}
                    </p>
                    <p className="text-gray-400 text-xs flex items-center gap-1 truncate">
                      {result.type === "hotel" ? (
                        <FiHome />
                      ) : result.type === "restaurant" ? (
                        <FiCoffee />
                      ) : (
                        <FiMapPin />
                      )}
                      {result.subtitle}
                    </p>
                  </div>
                  {(result.type === "hotel" || result.type === "restaurant") && result.price && (
                    <span className="text-primary font-semibold text-sm shrink-0">
                      {formatCurrency(result.price)}
                    </span>
                  )}
                </button>
              ))}
              <button
                onClick={goToFullSearch}
                className="w-full text-center py-3 text-secondary font-medium text-sm border-t border-gray-100 hover:bg-gray-50"
              >
                See all results for "{query}"
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}