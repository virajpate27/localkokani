// src/components/ui/AvailabilityBadge.jsx
import { FiCheckCircle, FiAlertTriangle, FiXCircle } from "react-icons/fi";

const STATUS_CONFIG = {
  available: {
    icon: FiCheckCircle,
    label: "Available",
    classes: "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
  },
  limited: {
    icon: FiAlertTriangle,
    label: "Limited Availability",
    classes: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
  },
  soldout: {
    icon: FiXCircle,
    label: "Sold Out",
    classes: "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  },
};

export default function AvailabilityBadge({ status, message, size = "sm" }) {
  // "available" with no custom message is the default/expected state — don't clutter the UI with a badge for it.
  // Only show a badge when there's something worth flagging: limited, sold out, or a custom message.
  if (!status || (status === "available" && !message?.trim())) return null;

  const config = STATUS_CONFIG[status] || STATUS_CONFIG.available;
  const Icon = config.icon;
  const sizeClasses = size === "lg" ? "text-sm px-3 py-1.5" : "text-xs px-2.5 py-1";

  return (
    <span className={`inline-flex items-center gap-1.5 mt-2.5 font-medium rounded-lg ${sizeClasses} ${config.classes}`}>
      <Icon className={size === "lg" ? "text-base" : "text-xs"} />
      {message?.trim() || config.label}
    </span>
  );
}