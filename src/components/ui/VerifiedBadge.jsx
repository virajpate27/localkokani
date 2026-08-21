// src/components/ui/VerifiedBadge.jsx
import { FiCheckCircle } from "react-icons/fi";

export default function VerifiedBadge({ size = "text-xs", showLabel = true, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 bg-gradient-to-r from-primary to-secondary text-white font-medium px-2.5 py-1 rounded-lg shadow-sm ${size} ${className}`}
      title="Premium Owner"
    >
      <FiCheckCircle className="shrink-0" />
      {showLabel && "Premium"}
    </span>
  );
}