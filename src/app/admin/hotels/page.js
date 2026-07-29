// src/app/admin/hotels/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiHome, FiStar } from "react-icons/fi";
import toast from "react-hot-toast";
import { getAllHotelsAdmin, deleteHotel } from "@/lib/services/hotelService";
import { incrementHotelCount } from "@/lib/services/destinationService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { formatCurrency } from "@/utils/helpers";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadHotels = async () => {
    setIsLoading(true);
    try {
      const data = await getAllHotelsAdmin();
      setHotels(data);
    } catch (error) {
      console.error("Load hotels error:", error);
      toast.error("Failed to load hotels");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteHotel(deleteTarget.id);
      await incrementHotelCount(deleteTarget.destinationId, -1);

      for (const img of deleteTarget.images || []) {
        if (img.publicId) await deleteFromCloudinary(img.publicId);
      }

      toast.success("Hotel deleted");
      setHotels((prev) => prev.filter((h) => h.id !== deleteTarget.id));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete hotel");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{hotels.length} hotels total</p>
        <Link href="/admin/hotels/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Hotel
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-2xl text-primary" />
        </div>
      ) : hotels.length === 0 ? (
        <div className="card p-12 text-center">
          <FiHome className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No hotels yet</p>
          <Link href="/admin/hotels/new" className="btn-primary inline-flex items-center gap-2">
            <FiPlus /> Add Your First Hotel
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Hotel</th>
                  <th className="px-5 py-3.5 font-medium">Destination</th>
                  <th className="px-5 py-3.5 font-medium">Price</th>
                  <th className="px-5 py-3.5 font-medium">Rating</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {hotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          {hotel.images?.[0]?.url && (
                            <Image
                              src={hotel.images[0].url}
                              alt={hotel.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <span className="font-medium text-primary">{hotel.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{hotel.destinationName}</td>
                    <td className="px-5 py-3.5 text-gray-600">{formatCurrency(hotel.price)}</td>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-1 text-gray-600">
                        <FiStar className="text-accent fill-accent text-xs" />
                        {hotel.rating || "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${
                          hotel.status === "active"
                            ? "bg-accent/10 text-accent"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {hotel.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/hotels/${hotel.id}/edit`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-secondary/10 hover:text-secondary transition-colors"
                          aria-label="Edit"
                        >
                          <FiEdit2 className="text-sm" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(hotel)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          aria-label="Delete"
                        >
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
        title="Delete Hotel?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}