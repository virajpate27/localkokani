// src/components/partner/PartnerRoomTypesEditor.jsx
"use client";

import { FiPlus, FiTrash2 } from "react-icons/fi";

export default function PartnerRoomTypesEditor({ value = [], onChange }) {
  const addRoom = () => {
    onChange([...value, { name: "", numberOfRooms: "", guestsPerRoom: "", startingPrice: "", weekendPrice: "", amenities: "" }]);
  };

  const updateRoom = (index, field, fieldValue) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const removeRoom = (index) => onChange(value.filter((_, i) => i !== index));

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-sm font-medium text-gray-700">Room Types</label>
        <button type="button" onClick={addRoom} className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:underline">
          <FiPlus /> Add Room Type
        </button>
      </div>

      {value.length === 0 ? (
        <p className="text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl p-5 text-center">
          Add at least one room type
        </p>
      ) : (
        <div className="space-y-4">
          {value.map((room, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 uppercase">Room Type {index + 1}</span>
                <button type="button" onClick={() => removeRoom(index)} className="text-gray-400 hover:text-red-500">
                  <FiTrash2 className="text-sm" />
                </button>
              </div>
              <input
                type="text"
                value={room.name}
                onChange={(e) => updateRoom(index, "name", e.target.value)}
                placeholder="Room Name (e.g. Deluxe AC Room)"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <input type="number" value={room.numberOfRooms} onChange={(e) => updateRoom(index, "numberOfRooms", e.target.value)} placeholder="No. of Rooms" className="px-3 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none" />
                <input type="number" value={room.guestsPerRoom} onChange={(e) => updateRoom(index, "guestsPerRoom", e.target.value)} placeholder="Guests/Room" className="px-3 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none" />
                <input type="number" value={room.startingPrice} onChange={(e) => updateRoom(index, "startingPrice", e.target.value)} placeholder="Price/Night ₹" className="px-3 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none" />
                <input type="number" value={room.weekendPrice} onChange={(e) => updateRoom(index, "weekendPrice", e.target.value)} placeholder="Weekend Price ₹" className="px-3 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none" />
              </div>
              <input
                type="text"
                value={room.amenities}
                onChange={(e) => updateRoom(index, "amenities", e.target.value)}
                placeholder="Amenities (comma separated — e.g. AC, WiFi, TV)"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}