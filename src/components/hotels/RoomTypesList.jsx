// src/components/hotels/RoomTypesList.jsx
import { FiUsers } from "react-icons/fi";
import { formatCurrency } from "@/utils/helpers";

export default function RoomTypesList({ roomTypes = [] }) {
  if (roomTypes.length === 0) return null;

  return (
    <div className="space-y-3">
      {roomTypes.map((room, i) => (
        <div
          key={i}
          className="flex items-center justify-between border dark:border-gray-800 rounded-xl p-4 hover:border-secondary/40 transition-colors"
        >
          <div>
            <p className="font-medium text-primary dark:text-white">{room.name}</p>
            <p className="flex items-center gap-1.5 dark:text-gray-500 text-sm mt-1">
              <FiUsers /> Up to {room.capacity} guests
            </p>
          </div>
          <p className="font-display font-bold text-primary dark:text-white">
            {formatCurrency(room.price)}
            <span className="text-xs font-normal dark:text-gray-500 block text-right">
              /night
            </span>
          </p>
        </div>
      ))}
    </div>
  );
}