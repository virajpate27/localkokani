// src/app/admin/destinations/[id]/edit/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import DestinationForm from "@/components/admin/DestinationForm";
import { getDestinationById } from "@/lib/services/destinationService";

export default function EditDestinationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [destination, setDestination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function loadDestination() {
      try {
        const data = await getDestinationById(id);
        if (!data) {
          setNotFoundState(true);
        } else {
          setDestination(data);
        }
      } catch (error) {
        console.error("Load destination error:", error);
        setNotFoundState(true);
      } finally {
        setIsLoading(false);
      }
    }
    loadDestination();
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
        <p className="dark:text-gray-500 mb-4">Destination not found.</p>
        <button
          onClick={() => router.push("/admin/destinations")}
          className="text-secondary font-medium hover:underline"
        >
          Back to Destinations
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="dark:text-gray-500 text-sm mb-6">
        Editing <span className="font-medium text-primary dark:text-white">{destination.name}</span>
      </p>
      <DestinationForm initialData={destination} />
    </div>
  );
}