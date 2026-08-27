// src/components/hotels/AmenitiesGrid.jsx
import {
  FiWifi, FiCoffee, FiDroplet, FiWind,
  FiTv, FiTruck, FiSun, FiHeart, FiCheck
} from "react-icons/fi";

const AMENITY_ICONS = {
  "free wifi": FiWifi,
  wifi: FiWifi,
  pool: FiDroplet,
  breakfast: FiCoffee,
  spa: FiHeart,
  "air conditioning": FiWind,
  ac: FiWind,
  tv: FiTv,
  parking: FiTruck,
  "beach access": FiSun,
};

export function getAmenityIcon(amenity) { // ⬅️ CHANGED — added "export"
  const key = amenity.toLowerCase();
  const match = Object.keys(AMENITY_ICONS).find((k) => key.includes(k));
  return match ? AMENITY_ICONS[match] : FiCheck;
}

export default function AmenitiesGrid({ amenities = [] }) {
  if (amenities.length === 0) return null;

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
      {amenities.map((amenity) => {
        const Icon = getAmenityIcon(amenity); // ⬅️ CHANGED — use the now-exported function
        return (
          <div
            key={amenity}
            className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3"
          >
            <div className="w-9 h-9 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
              <Icon className="text-secondary" />
            </div>
            <span className="text-sm text-gray-700">{amenity}</span>
          </div>
        );
      })}
    </div>
  );
}