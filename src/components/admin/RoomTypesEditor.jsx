// src/components/admin/RoomTypesEditor.jsx
"use client";

import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function RoomTypesEditor({ value = [], onChange }) {
  const addRoom = () => {
    onChange([...value, { name: "", price: "", capacity: 2 }]);
  };

  const updateRoom = (index, field, fieldValue) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const removeRoom = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">
          Room Types <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <button
          type="button"
          onClick={addRoom}
          className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:underline"
        >
          <FiPlus /> Add Room Type
        </button>
      </div>

      {value.length === 0 ? (
        <p className="text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl p-5 text-center">
          No room types added yet
        </p>
      ) : (
        <div className="space-y-3">
          {value.map((room, index) => (
            <div
              key={index}
              className="grid grid-cols-1 sm:grid-cols-[1fr_140px_100px_auto] gap-3 items-center border border-gray-100 rounded-xl p-3"
            >
              <input
                type="text"
                value={room.name}
                onChange={(e) => updateRoom(index, "name", e.target.value)}
                placeholder="Room name (e.g. Deluxe Room)"
                className="px-3 py-2 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none"
              />
              <input
                type="number"
                value={room.price}
                onChange={(e) => updateRoom(index, "price", e.target.value)}
                placeholder="Price/night"
                className="px-3 py-2 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none"
              />
              <input
                type="number"
                value={room.capacity}
                onChange={(e) => updateRoom(index, "capacity", e.target.value)}
                placeholder="Guests"
                min={1}
                className="px-3 py-2 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none"
              />
              <button
                type="button"
                onClick={() => removeRoom(index)}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors justify-self-end sm:justify-self-center"
              >
                <FiTrash2 className="text-sm" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}