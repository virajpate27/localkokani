// src/app/admin/hotels/[id]/edit/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import HotelForm from "@/components/admin/HotelForm";
import { getHotelById } from "@/lib/services/hotelService";

export default function EditHotelPage() {
  const { id } = useParams();
  const router = useRouter();
  const [hotel, setHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function loadHotel() {
      try {
        const data = await getHotelById(id);
        if (!data) {
          setNotFoundState(true);
        } else {
          setHotel(data);
        }
      } catch (error) {
        console.error("Load hotel error:", error);
        setNotFoundState(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadHotel();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FiLoader className="animate-spin text-2xl text-primary dark:text-white" />
      </div>
    );
  }

  if (notFoundState) {
    return (
      <div className="card p-10 text-center">
        <p className="dark:dark:text-gray-500 mb-4">Hotel not found.</p>
        <button
          onClick={() => router.push("/admin/hotels")}
          className="text-secondary font-medium hover:underline"
        >
          Back to Hotels
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="dark:dark:text-gray-500 text-sm mb-6">
        Editing <span className="font-medium text-primary dark:text-white">{hotel.name}</span>
      </p>
      <HotelForm initialData={hotel} />
    </div>
  );
}