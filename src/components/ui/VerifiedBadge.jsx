// src/components/ui/VerifiedBadge.jsx
import { FiCheckCircle } from "react-icons/fi";
import { IoShieldCheckmark } from "react-icons/io5";


export default function VerifiedBadge({ size = "text-xs", showLabel = true, className = "" }) {
  return (
    <span
      className={`inline-flex items-center text-[#0157fc] text-xl shadow-sm`}
      title="Premium Owner"
    >
      <IoShieldCheckmark className="shrink-0" />
      
      {/* {showLabel && "Premium"} */}
    </span>
  );
}