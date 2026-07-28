// src/app/admin/destinations/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiMapPin } from "react-icons/fi";
import toast from "react-hot-toast";
import { getAllDestinations, deleteDestination } from "@/lib/services/destinationService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadDestinations = async () => {
    setIsLoading(true);
    try {
      const data = await getAllDestinations();
      setDestinations(data);
    } catch (error) {
      console.error("Load destinations error:", error);
      toast.error("Failed to load destinations");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDestinations();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteDestination(deleteTarget.id);
      if (deleteTarget.image?.publicId) {
        await deleteFromCloudinary(deleteTarget.image.publicId);
      }
      toast.success("Destination deleted");
      setDestinations((prev) => prev.filter((d) => d.id !== deleteTarget.id));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete destination");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">
          {destinations.length} destinations total
        </p>
        <Link href="/admin/destinations/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Destination
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-2xl text-primary" />
        </div>
      ) : destinations.length === 0 ? (
        <div className="card p-12 text-center">
          <FiMapPin className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No destinations yet</p>
          <Link href="/admin/destinations/new" className="btn-primary inline-flex items-center gap-2">
            <FiPlus /> Add Your First Destination
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Destination</th>
                  <th className="px-5 py-3.5 font-medium">Country</th>
                  <th className="px-5 py-3.5 font-medium">Hotels</th>
                  <th className="px-5 py-3.5 font-medium">Featured</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {destinations.map((dest) => (
                  <tr key={dest.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          {dest.image?.url && (
                            <Image
                              src={dest.image.url}
                              alt={dest.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <span className="font-medium text-primary">{dest.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{dest.country}</td>
                    <td className="px-5 py-3.5 text-gray-600">{dest.hotelCount || 0}</td>
                    <td className="px-5 py-3.5">
                      {dest.featured ? (
                        <span className="text-xs font-medium bg-accent/10 text-accent px-2.5 py-1 rounded-lg">
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/destinations/${dest.id}/edit`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-secondary/10 hover:text-secondary transition-colors"
                          aria-label="Edit"
                        >
                          <FiEdit2 className="text-sm" />
                        </Link>
                        <button
                          onClick={() => setDeleteTarget(dest)}
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
        title="Delete Destination?"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This won't delete hotels already linked to it, but they may become unreachable via this destination page.`}
        confirmLabel="Delete"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}