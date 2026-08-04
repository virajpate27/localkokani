// src/components/ui/SponsoredBadge.jsx
import { FiZap } from "react-icons/fi";

export default function SponsoredBadge() {
  return (
    <span className="absolute bottom-3 left-3 z-10 flex items-center gap-1 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm">
      <FiZap className="text-[11px] fill-white" />
      Sponsored
    </span>
  );
}