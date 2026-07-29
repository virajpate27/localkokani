// src/components/ui/StarRatingInput.jsx
"use client";

import { useState } from "react";
import { FiStar } from "react-icons/fi";

export default function StarRatingInput({ value, onChange, size = "text-2xl" }) {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onMouseEnter={() => setHoverValue(star)}
          onMouseLeave={() => setHoverValue(0)}
          onClick={() => onChange(star)}
          className={`${size} transition-colors ${
            star <= (hoverValue || value) ? "text-accent" : "text-gray-200"
          }`}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <FiStar className={star <= (hoverValue || value) ? "fill-accent" : ""} />
        </button>
      ))}
    </div>
  );
}