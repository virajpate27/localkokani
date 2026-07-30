// src/components/ui/WishlistButton.jsx
"use client";

import { FiHeart } from "react-icons/fi";
import toast from "react-hot-toast";
import { useWishlist } from "@/context/WishlistContext";

export default function WishlistButton({ hotel, size = "text-lg", className = "" }) {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const saved = isInWishlist(hotel.id);

  const handleClick = (e) => {
    e.preventDefault(); // prevent navigating if this button sits inside a <Link>
    e.stopPropagation();
    toggleWishlist(hotel);
    toast.success(saved ? "Removed from wishlist" : "Added to wishlist", {
      icon: saved ? "💔" : "❤️",
    });
  };

  return (
    <button
      onClick={handleClick}
      aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
      className={`w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-sm hover:scale-110 transition-transform ${className}`}
    >
      <FiHeart
        className={`${size} transition-colors ${
          saved ? "text-red-500 fill-red-500" : "text-gray-400"
        }`}
      />
    </button>
  );
}