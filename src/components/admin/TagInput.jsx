// src/components/admin/TagInput.jsx
"use client";

import { useState } from "react";
import { FiX, FiPlus } from "react-icons/fi";

const DEFAULT_SUGGESTED_TAGS = [
  "Free WiFi", "Pool", "Breakfast", "Spa", "Beach Access",
  "Mountain View", "Parking", "Air Conditioning", "Room Service",
  "Gym", "Bar", "Pet Friendly", "Airport Shuttle", "Bonfire",
];

export default function TagInput({
  value = [],
  onChange,
  label = "Amenities",
  suggestions = DEFAULT_SUGGESTED_TAGS, // ⬅️ now customizable per use-case
}) {
  const [inputValue, setInputValue] = useState("");

  const addTag = (tag) => {
    const trimmed = tag.trim();
    if (!trimmed) return;
    if (value.some((v) => v.toLowerCase() === trimmed.toLowerCase())) {
      setInputValue("");
      return;
    }
    onChange([...value, trimmed]);
    setInputValue("");
  };

  const removeTag = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(inputValue);
    } else if (e.key === "Backspace" && !inputValue && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const unusedSuggestions = suggestions.filter(
    (tag) => !value.some((v) => v.toLowerCase() === tag.toLowerCase())
  );

  return (
    <div>
      <label className="block text-sm font-medium dark:text-gray-300 mb-2">{label}</label>

      <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 rounded-xl border dark:border-gray-800 focus-within:border-secondary transition-colors min-h-[3rem]">
        {value.map((tag, index) => (
          <span
            key={index}
            className="flex items-center gap-1.5 bg-secondary/10 text-secondary text-sm font-medium px-2.5 py-1 rounded-lg"
          >
            {tag}
            <button type="button" onClick={() => removeTag(index)} className="hover:text-secondary-dark">
              <FiX className="text-xs" />
            </button>
          </span>
        ))}
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? "Type and press Enter to add..." : ""}
          className="flex-1 min-w-[120px] outline-none text-sm bg-transparent"
        />
      </div>

      {unusedSuggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2.5">
          {unusedSuggestions.slice(0, 8).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="flex items-center gap-1 text-xs dark:text-gray-500 border dark:border-gray-800 px-2.5 py-1 rounded-lg hover:border-secondary hover:text-secondary transition-colors"
            >
              <FiPlus className="text-[10px]" /> {tag}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}