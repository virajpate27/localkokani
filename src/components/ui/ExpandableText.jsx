// src/components/ui/ExpandableText.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

export default function ExpandableText({ text, lines = 4, className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [needsTruncation, setNeedsTruncation] = useState(false);
  const textRef = useRef(null);

  // Detect whether the text actually overflows the clamp — no point showing
  // "Read More" if the content already fits within the line limit.
  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current;
      setNeedsTruncation(el.scrollHeight > el.clientHeight + 1); // +1 guards against sub-pixel rounding
    }
  }, [text]);

  if (!text?.trim()) return null;

  return (
    <div>
      <p
        ref={textRef}
        className={`text-gray-600 leading-relaxed whitespace-pre-line transition-all duration-300 ${
          !isExpanded ? `overflow-hidden` : ""
        } ${className}`}
        style={!isExpanded ? { display: "-webkit-box", WebkitLineClamp: lines, WebkitBoxOrient: "vertical" } : undefined}
      >
        {text}
      </p>

      {needsTruncation && (
        <button
          onClick={() => setIsExpanded((prev) => !prev)}
          className="flex items-center gap-1 text-secondary text-sm font-medium mt-2 hover:underline"
        >
          {isExpanded ? (
            <>Show Less <FiChevronUp className="text-xs" /></>
          ) : (
            <>Read More <FiChevronDown className="text-xs" /></>
          )}
        </button>
      )}
    </div>
  );
}