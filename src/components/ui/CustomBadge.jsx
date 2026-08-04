// src/components/ui/CustomBadge.jsx
const BADGE_COLOR_STYLES = {
  primary: "bg-primary text-white",
  secondary: "bg-secondary text-white",
  accent: "bg-accent text-white",
  success: "bg-emerald-500 text-white",
  warning: "bg-orange-500 text-white",
  danger: "bg-red-500 text-white",
};

export default function CustomBadge({ text, color = "primary", position = "overlay" }) {
  if (!text?.trim()) return null;

  const colorClasses = BADGE_COLOR_STYLES[color] || BADGE_COLOR_STYLES.primary;

  if (position === "inline") {
    // Used on detail pages, next to the title — normal document flow, not absolutely positioned
    return (
      <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm ${colorClasses}`}>
        {text}
      </span>
    );
  }

  // Default: overlay mode — absolutely positioned on a card image (parent must be position:relative)
  return (
    <span className={`absolute bottom-3 right-3 z-10 text-xs font-semibold px-2.5 py-1 rounded-lg shadow-sm max-w-[calc(100%-1.5rem)] truncate ${colorClasses}`}>
      {text}
    </span>
  );
}