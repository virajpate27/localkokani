// src/app/admin/restaurants/new/page.js
import { Suspense } from "react";

import RestaurantForm from "@/components/admin/RestaurantForm";

export default function NewRestaurantPage() {
  return (
    <div>
      <p className="text-gray-400 text-sm mb-6">
        Fill in the details below to list a new restaurant.
      </p>
   
       <Suspense fallback={<div className="text-gray-400">Loading form...</div>}>
        <RestaurantForm />
      </Suspense>
    </div>
  );
}