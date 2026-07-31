// src/app/admin/restaurants/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiCoffee } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getAllRestaurantsAdmin,
  deleteRestaurant,
} from "@/lib/services/restaurantService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { incrementRestaurantCount } from "@/lib/services/destinationService";

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadRestaurants = async () => {
    setIsLoading(true);
    try {
      setRestaurants(await getAllRestaurantsAdmin());
    } catch {
      toast.error("Failed to load restaurants");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadRestaurants(); }, []);

  const handleDeleteConfirm = async () => {
  if (!deleteTarget) return;
  setIsDeleting(true);
  try {
    await deleteRestaurant(deleteTarget.id);
    await incrementRestaurantCount(deleteTarget.destinationId, -1); // ⬅️ ADD

    for (const img of deleteTarget.images || []) {
      if (img.publicId) await deleteFromCloudinary(img.publicId);
    }
    toast.success("Restaurant deleted");
    setRestaurants((prev) => prev.filter((r) => r.id !== deleteTarget.id));
  } catch {
    toast.error("Failed to delete restaurant");
  } finally {
    setIsDeleting(false);
    setDeleteTarget(null);
  }
};

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{restaurants.length} restaurants total</p>
        <Link href="/admin/restaurants/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Restaurant
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-2xl text-primary" />
        </div>
      ) : restaurants.length === 0 ? (
        <div className="card p-12 text-center">
          <FiCoffee className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No restaurants yet</p>
          <Link href="/admin/restaurants/new" className="btn-primary inline-flex items-center gap-2">
            <FiPlus /> Add Your First Restaurant
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Restaurant</th>
                  <th className="px-5 py-3.5 font-medium">Destination</th>
                  <th className="px-5 py-3.5 font-medium">Price</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {restaurants.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          {r.images?.[0]?.url && (
                            <Image src={r.images[0].url} alt={r.name} fill sizes="48px" className="object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-primary">{r.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{r.destinationName}</td>
                    <td className="px-5 py-3.5 text-gray-600">{r.priceRange}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${
                        r.status === "active" ? "bg-accent/10 text-accent-dark" : "bg-gray-100 text-gray-500"
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/restaurants/${r.id}/edit`} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-secondary/10 hover:text-secondary transition-colors">
                          <FiEdit2 className="text-sm" />
                        </Link>
                        <button onClick={() => setDeleteTarget(r)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Restaurant?"
        message={`Delete "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}