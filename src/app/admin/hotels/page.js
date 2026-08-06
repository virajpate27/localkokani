// src/app/admin/hotels/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiPlus, FiEdit2, FiTrash2, FiLoader, FiHome, FiStar,
  FiArchive, FiRotateCcw, FiCheckSquare, FiSquare
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getAllHotelsAdmin, deleteHotel, archiveHotel, restoreHotel,
} from "@/lib/services/hotelService";
import { incrementHotelCount } from "@/lib/services/destinationService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { formatCurrency } from "@/utils/helpers";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const statusStyles = {
  active: "bg-accent/10 text-accent",
  draft: "dark:bg-gray-800 dark:text-gray-500",
  archived: "bg-orange-50 text-orange-500",
};

const statusTabs = [
  { value: "all", label: "All" },
  { value: "active", label: "Active" },
  { value: "draft", label: "Draft" },
  { value: "archived", label: "Archived" },
];

export default function AdminHotelsPage() {
  const [hotels, setHotels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bulkAction, setBulkAction] = useState(null); // "archive" | "delete" | null

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

  const filteredHotels =
    statusFilter === "all" ? hotels : hotels.filter((h) => h.status === statusFilter);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredHotels.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredHotels.map((h) => h.id));
    }
  };

  // Single-item archive/restore (immediate, non-destructive — no confirm needed)
  const handleArchive = async (hotel) => {
    try {
      await archiveHotel(hotel.id);
      setHotels((prev) =>
        prev.map((h) => (h.id === hotel.id ? { ...h, status: "archived" } : h))
      );
      toast.success(`${hotel.name} archived — hidden from public site`);
    } catch (error) {
      console.error("Archive error:", error);
      toast.error("Failed to archive hotel");
    }
  };

  const handleRestore = async (hotel) => {
    try {
      await restoreHotel(hotel.id);
      setHotels((prev) =>
        prev.map((h) => (h.id === hotel.id ? { ...h, status: "active" } : h))
      );
      toast.success(`${hotel.name} restored — now visible to public`);
    } catch (error) {
      console.error("Restore error:", error);
      toast.error("Failed to restore hotel");
    }
  };

  // Permanent delete (single) — requires confirm dialog
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsProcessing(true);
    try {
      await deleteHotel(deleteTarget.id);
      await incrementHotelCount(deleteTarget.destinationId, -1);
      for (const img of deleteTarget.images || []) {
        if (img.publicId) await deleteFromCloudinary(img.publicId);
      }
      toast.success("Hotel permanently deleted");
      setHotels((prev) => prev.filter((h) => h.id !== deleteTarget.id));
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete hotel");
    } finally {
      setIsProcessing(false);
      setDeleteTarget(null);
    }
  };

  // Bulk archive
  const handleBulkArchive = async () => {
    setIsProcessing(true);
    try {
      await Promise.all(selectedIds.map((id) => archiveHotel(id)));
      setHotels((prev) =>
        prev.map((h) => (selectedIds.includes(h.id) ? { ...h, status: "archived" } : h))
      );
      toast.success(`${selectedIds.length} hotels archived`);
      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk archive error:", error);
      toast.error("Some hotels failed to archive");
    } finally {
      setIsProcessing(false);
      setBulkAction(null);
    }
  };

  // Bulk permanent delete
  const handleBulkDelete = async () => {
    setIsProcessing(true);
    const targets = hotels.filter((h) => selectedIds.includes(h.id));
    try {
      for (const hotel of targets) {
        await deleteHotel(hotel.id);
        await incrementHotelCount(hotel.destinationId, -1);
        for (const img of hotel.images || []) {
          if (img.publicId) await deleteFromCloudinary(img.publicId);
        }
      }
      toast.success(`${targets.length} hotels permanently deleted`);
      setHotels((prev) => prev.filter((h) => !selectedIds.includes(h.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error("Bulk delete error:", error);
      toast.error("Some hotels failed to delete");
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
                  : "bg-white dark:bg-gray-900 dark:text-gray-500 hover:dark:bg-gray-800 border dark:border-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <Link href="/admin/hotels/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> Add Hotel
        </Link>
      </div>

      {/* Bulk action bar */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between bg-primary/5 border border-primary/20 rounded-xl px-5 py-3 mb-4">
          <p className="text-primary dark:text-white text-sm font-medium">
            {selectedIds.length} selected
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setBulkAction("archive")}
              className="flex items-center gap-1.5 text-sm font-medium dark:text-gray-300 hover:text-orange-500 px-3 py-1.5 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <FiArchive /> Archive
            </button>
            <button
              onClick={() => setBulkAction("delete")}
              className="flex items-center gap-1.5 text-sm font-medium dark:text-gray-300 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
            >
              <FiTrash2 /> Delete Permanently
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-2xl text-primary dark:text-white" />
        </div>
      ) : filteredHotels.length === 0 ? (
        <div className="card p-12 text-center">
          <FiHome className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="dark:dark:text-gray-500">No hotels in this view</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-950 dark:text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3.5 w-10">
                    <button onClick={toggleSelectAll} aria-label="Select all">
                      {selectedIds.length === filteredHotels.length ? (
                        <FiCheckSquare className="text-primary dark:text-white" />
                      ) : (
                        <FiSquare className="text-gray-300" />
                      )}
                    </button>
                  </th>
                  <th className="px-5 py-3.5 font-medium">Hotel</th>
                  <th className="px-5 py-3.5 font-medium">Destination</th>
                  <th className="px-5 py-3.5 font-medium">Price</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredHotels.map((hotel) => (
                  <tr key={hotel.id} className="hover:bg-gray-50 dark:bg-gray-950">
                    <td className="px-5 py-3.5">
                      <button onClick={() => toggleSelect(hotel.id)} aria-label="Select">
                        {selectedIds.includes(hotel.id) ? (
                          <FiCheckSquare className="text-primary dark:text-white" />
                        ) : (
                          <FiSquare className="text-gray-300" />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 dark:bg-gray-800">
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
                        <span className="font-medium text-primary dark:text-white">{hotel.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 dark:text-gray-300">{hotel.destinationName}</td>
                    <td className="px-5 py-3.5 dark:text-gray-300">{formatCurrency(hotel.price)}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${statusStyles[hotel.status] || statusStyles.active}`}
                      >
                        {hotel.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/hotels/${hotel.id}/edit`}
                          className="w-8 h-8 rounded-lg flex items-center justify-center dark:dark:text-gray-500 hover:bg-secondary/10 hover:text-secondary transition-colors"
                          aria-label="Edit"
                        >
                          <FiEdit2 className="text-sm" />
                        </Link>
                        {hotel.status === "archived" ? (
                          <button
                            onClick={() => handleRestore(hotel)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center dark:dark:text-gray-500 hover:bg-secondary/10 hover:text-secondary transition-colors"
                            aria-label="Restore"
                            title="Restore to active"
                          >
                            <FiRotateCcw className="text-sm" />
                          </button>
                        ) : (
                          <button
                            onClick={() => handleArchive(hotel)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center dark:dark:text-gray-500 hover:bg-orange-50 hover:text-orange-500 transition-colors"
                            aria-label="Archive"
                            title="Archive (hide from public)"
                          >
                            <FiArchive className="text-sm" />
                          </button>
                        )}
                        <button
                          onClick={() => setDeleteTarget(hotel)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center dark:dark:text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
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

      {/* Single permanent delete confirm */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Permanently Delete Hotel?"
        message={`This will permanently delete "${deleteTarget?.name}" and all its photos. This cannot be undone. Consider archiving instead if you might need this listing again.`}
        confirmLabel="Delete Permanently"
        isDangerous
        isLoading={isProcessing}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />

      {/* Bulk archive confirm */}
      <ConfirmDialog
        isOpen={bulkAction === "archive"}
        title="Archive Selected Hotels?"
        message={`${selectedIds.length} hotels will be hidden from the public site but can be restored anytime.`}
        confirmLabel="Archive"
        isLoading={isProcessing}
        onConfirm={handleBulkArchive}
        onCancel={() => setBulkAction(null)}
      />

      {/* Bulk delete confirm */}
      <ConfirmDialog
        isOpen={bulkAction === "delete"}
        title="Permanently Delete Selected Hotels?"
        message={`${selectedIds.length} hotels and all their photos will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete Permanently"
        isDangerous
        isLoading={isProcessing}
        onConfirm={handleBulkDelete}
        onCancel={() => setBulkAction(null)}
      />
    </div>
  );
}