// src/components/admin/PromotionBadge.jsx
import { FiStar, FiZap, FiClock } from "react-icons/fi";

export default function PromotionBadge({ featured, sponsored, featuredUntil, sponsoredUntil }) {
  const now = new Date();
  const isFeaturedLive = featured && featuredUntil && new Date(featuredUntil) >= now;
  const isSponsoredLive = sponsored && sponsoredUntil && new Date(sponsoredUntil) >= now;

  // Manually-toggled (no paid promotion tracking) — still show a subtle indicator
  const isFeaturedManual = featured && !featuredUntil;
  const isSponsoredManual = sponsored && !sponsoredUntil;

  if (!featured && !sponsored) {
    return <span className="text-gray-300 text-xs">—</span>;
  }

  return (
    <div className="flex flex-col gap-1">
      {(isFeaturedLive || isFeaturedManual) && (
        <span
          className="flex items-center gap-1 text-xs font-medium text-primary w-fit"
          title={isFeaturedLive ? `Paid promotion, until ${featuredUntil}` : "Manually featured"}
        >
          <FiStar className="text-[10px]" /> Featured
          {isFeaturedLive && <FiClock className="text-[9px] text-gray-400 ml-0.5" />}
        </span>
      )}
      {(isSponsoredLive || isSponsoredManual) && (
        <span
          className="flex items-center gap-1 text-xs font-medium text-accent-dark w-fit"
          title={isSponsoredLive ? `Paid promotion, until ${sponsoredUntil}` : "Manually sponsored"}
        >
          <FiZap className="text-[10px]" /> Sponsored
          {isSponsoredLive && <FiClock className="text-[9px] text-gray-400 ml-0.5" />}
        </span>
      )}
    </div>
  );
}