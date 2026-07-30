// src/context/WishlistContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "stayfinder_wishlist";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWishlist(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []); 

  // Persist to localStorage whenever it changes (but skip the initial mount)
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  }, [wishlist, isLoaded]);

  const isInWishlist = (hotelId) => wishlist.some((item) => item.id === hotelId);

  const toggleWishlist = (hotel) => {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === hotel.id);
      if (exists) {
        return prev.filter((item) => item.id !== hotel.id);
      }
      // Store only what we need to render the wishlist page — not the full hotel object
      return [
        ...prev,
        {
          id: hotel.id,
          slug: hotel.slug,
          name: hotel.name,
          destinationName: hotel.destinationName,
          price: hotel.price,
          rating: hotel.rating,
          image: hotel.images?.[0]?.url || hotel.image || null,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const removeFromWishlist = (hotelId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== hotelId));
  };

  const clearWishlist = () => setWishlist([]);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        isLoaded,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        count: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}