// src/app/admin/restaurants/new/page.js
import RestaurantForm from "@/components/admin/RestaurantForm";

export default function NewRestaurantPage() {
  return (
    <div>
      <p className="text-gray-400 text-sm mb-6">Add a new restaurant listing.</p>
      <RestaurantForm />
    </div>
  );
}