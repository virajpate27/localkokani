// src/components/ui/WishlistButton.jsx
"use client";

import { FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistButton({ item, entityType = "hotel", size = "text-lg", className = "" }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(item.id, entityType);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(item, entityType);
    toast.success(saved ? "Removed from wishlist" : "Added to wishlist", {
      icon: saved ? "💔" : "❤️",
    });
  };

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={`w-9 h-9 rounded-full bg-white dark:bg-gray-900/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform ${className}`}
    >
      <FiHeart
        className={`${size} transition-colors ${
          saved ? "text-red-500 fill-red-500" : "dark:dark:text-gray-500"
        }`}
      />
    </button>
  );
}