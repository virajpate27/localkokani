// src/app/admin/hotels/new/page.js
import HotelForm from "@/components/admin/HotelForm";

export default function NewHotelPage() {
  return (
    <div>
      <p className="dark:dark:text-gray-500 text-sm mb-6">
        Fill in the details below to list a new hotel.
      </p>
      <HotelForm />
    </div>
  );
}