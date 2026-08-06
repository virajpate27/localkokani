// src/app/admin/restaurants/new/page.js
import RestaurantForm from "@/components/admin/RestaurantForm";

export default function NewRestaurantPage() {
  return (
    <div>
      <p className="dark:dark:text-gray-500 text-sm mb-6">Add a new restaurant listing.</p>
      <RestaurantForm />
    </div>
  );
}