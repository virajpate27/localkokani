// src/context/WishlistContext.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const WishlistContext = createContext(null);
const STORAGE_KEY = "Local Kokani_wishlist";

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        // Migrate old entries (no entityType) to default as "hotel"
        const migrated = parsed.map((item) => ({
          ...item,
          entityType: item.entityType || "hotel",
        }));
        setWishlist(migrated);
      }
    } catch (error) {
      console.error("Failed to load wishlist:", error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  }, [wishlist, isLoaded]);

  // Now checks BOTH id and entityType, since a hotel and restaurant could theoretically
  // share the same Firestore-generated id string across different collections
  const isInWishlist = (entityId, entityType = "hotel") =>
    wishlist.some((item) => item.id === entityId && item.entityType === entityType);

  const toggleWishlist = (item, entityType = "hotel") => {
    setWishlist((prev) => {
      const exists = prev.some((w) => w.id === item.id && w.entityType === entityType);
      if (exists) {
        return prev.filter((w) => !(w.id === item.id && w.entityType === entityType));
      }
      return [
        ...prev,
        {
          id: item.id,
          entityType,
          slug: item.slug,
          name: item.name,
          destinationName: item.destinationName,
          price: entityType === "restaurant" ? (item.costForTwo || null) : item.price,
          rating: item.rating,
          image: item.images?.[0]?.url || item.image || null,
          addedAt: new Date().toISOString(),
        },
      ];
    });
  };

  const removeFromWishlist = (entityId, entityType = "hotel") => {
    setWishlist((prev) =>
      prev.filter((item) => !(item.id === entityId && item.entityType === entityType))
    );
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