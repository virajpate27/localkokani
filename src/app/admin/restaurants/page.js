// src/app/admin/restaurants/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiPlus, FiEdit2, FiTrash2, FiLoader, FiCoffee, FiStar,
  FiArchive, FiRotateCcw, FiCheckSquare, FiSquare,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getAllRestaurantsAdmin,
  deleteRestaurant,
  archiveRestaurant,
  restoreRestaurant,
} from "@/lib/services/restaurantService";
import { incrementRestaurantCount } from "@/lib/services/destinationService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { triggerRevalidation } from "@/utils/revalidate";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const statusStyles = {
  active: "bg-accent/10 text-accent-dark",
  draft: "bg-gray-100 text-gray-500",
  archived: "bg-orange-50 text-orange-500",
};

const statusTabs = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export default function AdminRestaurantsPage() {
  const [restaurants, setRestaurants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkAction, setBulkAction] = useState(null); // "archive" | "delete" | null

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

  const filteredRestaurants =
    statusFilter === "all" ? restaurants : restaurants.filter((r) => r.status === statusFilter);

  const toggleSelect = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]));
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredRestaurants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredRestaurants.map((r) => r.id));
    }
  };

  // Single-item archive/restore — immediate, no confirm needed (reversible)
  const handleArchive = async (restaurant) => {
    try {
      await archiveRestaurant(restaurant.id);
      setRestaurants((prev) =>
        prev.map((r) => (r.id === restaurant.id ? { ...r, status: "archived" } : r))
      );
      await triggerRevalidation([
        "/restaurants",
        `/restaurants/${restaurant.slug}`,
        `/destinations/${restaurant.destinationSlug}`,
      ]);
      toast.success(`${restaurant.name} archived — hidden from public site`);
    } catch (error) {
      console.error("Archive error:", error);
      toast.error("Failed to archive restaurant");
    }
  };

  const handleRestore = async (restaurant) => {
    try {
      await restoreRestaurant(restaurant.id);
      setRestaurants((prev) =>
        prev.map((r) => (r.id === restaurant.id ? { ...r, status: "active" } : r))
      );
      await triggerRevalidation([
        "/restaurants",
        `/restaurants/${restaurant.slug}`,
        `/destinations/${restaurant.destinationSlug}`,
      ]);
      toast.success(`${restaurant.name} restored — now visible to public`);
    } catch (error) {
      console.error("Restore error:", error);
      toast.error("Failed to restore restaurant");
    }
  };

  // Permanent delete (single)
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsProcessing(true);
    try {
      await deleteRestaurant(deleteTarget.id);
      await incrementRestaurantCount(deleteTarget.destinationId, -1);
      for (const img of deleteTarget.images || []) {
        if (img.publicId) await deleteFromCloudinary(img.publicId);
      }
      await triggerRevalidation(["/restaurants", "/destinations", `/destinations/${deleteTarget.destinationSlug}`]);
      toast.success("Restaurant permanently deleted");
      setRestaurants((prev) => prev.filter((r) => r.id !== deleteTarget.id));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete restaurant");
    } finally {
      setIsProcessing(false);
      setDeleteTarget(null);
    }
  };

  // Bulk archive
  const handleBulkArchive = async () => {
    setIsProcessing(true);
    try {
      await Promise.all(selectedIds.map((id) => archiveRestaurant(id)));
      setRestaurants((prev) =>
        prev.map((r) => (selectedIds.includes(r.id) ? { ...r, status: "archived" } : r))
      );
      await triggerRevalidation(["/restaurants"]);
      toast.success(`${selectedIds.length} restaurants archived`);
      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk archive error:", error);
      toast.error("Some restaurants failed to archive");
    } finally {
      setIsProcessing(false);
      setBulkAction(null);
    }
  };

  // Bulk permanent delete
  const handleBulkDelete = async () => {
    setIsProcessing(true);
    const targets = restaurants.filter((r) => selectedIds.includes(r.id));
    try {
      for (const restaurant of targets) {
        await deleteRestaurant(restaurant.id);
        await incrementRestaurantCount(restaurant.destinationId, -1);
        for (const img of restaurant.images || []) {
          if (img.publicId) await deleteFromCloudinary(img.publicId);
        }
      }
      await triggerRevalidation(["/restaurants", "/destinations"]);
      toast.success(`${targets.length} restaurants permanently deleted`);
      setRestaurants((prev) => prev.filter((r) => !selectedIds.includes(r.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("Some restaurants failed to delete");
    } finally {
      setIsProcessing(false);
      setBulkAction(null);
    }
  };

  return (
    <div>
      {/* Status Tabs */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          {statusTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setStatusFilter(tab.value);
                setSelectedIds([]);
              }}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                statusFilter === tab.value
                  ? "bg-primary text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Link href="/admin/restaurants/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Restaurant
        </Link>
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 mb-4">
          <p className="text-primary text-sm font-medium">{selectedIds.length} selected</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkAction("archive")}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-orange-500 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <FiArchive /> Archive
            </button>
            <button
              onClick={() => setBulkAction("delete")}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <FiTrash2 /> Delete Permanently
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-2xl text-primary" />
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="card p-12 text-center">
          <FiCoffee className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No restaurants in this view</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3.5 w-10">
                    <button onClick={toggleSelectAll} aria-label="Select all">
                      {selectedIds.length === filteredRestaurants.length ? (
                        <FiCheckSquare className="text-primary" />
                      ) : (
                        <FiSquare className="text-gray-300" />
                      )}
                    </button>
                  </th>
                  <th className="px-5 py-3.5 font-medium">Restaurant</th>
                  <th className="px-5 py-3.5 font-medium">Destination</th>
                  <th className="px-5 py-3.5 font-medium">Price</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRestaurants.map((restaurant) => (
                  <tr key={restaurant.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleSelect(restaurant.id)} aria-label="Select">
                        {selectedIds.includes(restaurant.id) ? (
                          <FiCheckSquare className="text-primary" />
                        ) : (
                          <FiSquare className="text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          {restaurant.images?.[0]?.url && (
                            <Image
                              src={restaurant.images[0].url}
                              alt={restaurant.name}
                              fill
                              sizes="48px"
                              className="object-cover"
                            />
                          )}
                        </div>
                        <span className="font-medium text-primary">{restaurant.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{restaurant.destinationName}</td>
                    <td className="px-5 py-3.5 text-gray-600">{restaurant.priceRange}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${
                          statusStyles[restaurant.status] || statusStyles.active
                        }`}
                      >
                        {restaurant.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/restaurants/${restaurant.id}/edit`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-secondary/10 hover:text-secondary transition-colors"
                          aria-label="Edit"
                        >
                          <FiEdit2 className="text-sm" />
                        </Link>
                        {restaurant.status === "archived" ? (
                          <button
                            onClick={() => handleRestore(restaurant)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-secondary/10 hover:text-secondary transition-colors"
                            aria-label="Restore"
                            title="Restore to active"
                          >
                            <FiRotateCcw className="text-sm" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleArchive(restaurant)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                            aria-label="Archive"
                            title="Archive (hide from public)"
                          >
                            <FiArchive className="text-sm" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(restaurant)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          aria-label="Delete permanently"
                          title="Delete permanently"
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
        title="Permanently Delete Restaurant?"
        message={`This will permanently delete "${deleteTarget?.name}" and all its photos. This cannot be undone. Consider archiving instead if you might need this listing again.`}
        confirmLabel="Delete Permanently"
        isDangerous
        isLoading={isProcessing}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      <ConfirmDialog
        isOpen={bulkAction === "archive"}
        title="Archive Selected Restaurants?"
        message={`${selectedIds.length} restaurants will be hidden from the public site but can be restored anytime.`}
        confirmLabel="Archive"
        isLoading={isProcessing}
        onConfirm={handleBulkArchive}
        onCancel={() => setBulkAction(null)}
      />

      <ConfirmDialog
        isOpen={bulkAction === "delete"}
        title="Permanently Delete Selected Restaurants?"
        message={`${selectedIds.length} restaurants and all their photos will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete Permanently"
        isDangerous
        isLoading={isProcessing}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkAction(null)}
      />
    </div>
  );
}