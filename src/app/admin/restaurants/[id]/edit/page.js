// src/app/admin/restaurants/[id]/edit/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import RestaurantForm from "@/components/admin/RestaurantForm";
import { getRestaurantById } from "@/lib/services/restaurantService";

export default function EditRestaurantPage() {
  const { id } = useParams();
  const router = useRouter();
  const [restaurant, setRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    getRestaurantById(id)
      .then((data) => (data ? setRestaurant(data) : setNotFoundState(true)))
      .catch(() => setNotFoundState(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FiLoader className="animate-spin text-2xl text-primary" />
      </div>
    );
  }

  if (notFoundState) {
    return (
      <div className="card p-10 text-center">
        <p className="text-gray-400 mb-4">Restaurant not found.</p>
        <button onClick={() => router.push("/admin/restaurants")} className="text-secondary font-medium hover:underline">
          Back to Restaurants
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-400 text-sm mb-6">
        Editing <span className="font-medium text-primary">{restaurant.name}</span>
      </p>
      <RestaurantForm initialData={restaurant} />
    </div>
  );
}