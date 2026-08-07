// src/app/admin/reviews/page.js
"use client";

import { useState, useEffect } from "react";
import { FiLoader, FiStar, FiCheck, FiX, FiMessageSquare, FiHome, FiCoffee, FiTrash2 } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getAllReviewsAdmin,
  approveReview,
  rejectReview,
  deleteReview,
  recalculateEntityRating,
} from "@/lib/services/reviewService";
import { triggerRevalidation } from "@/utils/revalidate";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const filterTabs = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "all", label: "All" },
];

const entityTypeTabs = [
  { value: "all", label: "All Types" },
  { value: "hotel", label: "Hotels" },
  { value: "restaurant", label: "Restaurants" },
];

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("pending");
  const [typeFilter, setTypeFilter] = useState("all");
  const [processingId, setProcessingId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null); // ⬅️ ADD — holds the approved review pending delete confirmation
  const [isDeleting, setIsDeleting] = useState(false); // ⬅️ ADD

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      setReviews(await getAllReviewsAdmin());
    } catch (error) {
      console.error("Load reviews error:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadReviews(); }, []);

  const revalidateEntityPage = async (review) => {
    if (!review.entitySlug) return;
    const path = review.entityType === "hotel"
      ? `/hotels/${review.entitySlug}`
      : `/restaurants/${review.entitySlug}`;
    await triggerRevalidation([path]);
  };

  const handleApprove = async (review) => {
    setProcessingId(review.id);
    try {
      await approveReview(review.id, review.entityType, review.entityId);
      setReviews((prev) => prev.map((r) => (r.id === review.id ? { ...r, approved: true } : r)));
      await revalidateEntityPage(review);
      toast.success("Review approved and published");
    } catch (error) {
      console.error("Approve error:", error);
      toast.error("Failed to approve review");
    } finally {
      setProcessingId(null);
    }
  };

  // Reject — for PENDING reviews only (never went public, no confirm needed, matches existing behavior)
  const handleReject = async (review) => {
    setProcessingId(review.id);
    try {
      await rejectReview(review.id, review.entityType, review.entityId);
      setReviews((prev) => prev.filter((r) => r.id !== review.id));
      await revalidateEntityPage(review);
      toast.success("Review rejected and removed");
    } catch (error) {
      console.error("Reject error:", error);
      toast.error("Failed to reject review");
    } finally {
      setProcessingId(null);
    }
  };

  // NEW: Delete — for APPROVED (live, public) reviews — requires confirmation
  const handleDeleteApprovedConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteReview(deleteTarget.id);
      await recalculateEntityRating(deleteTarget.entityType, deleteTarget.entityId);
      setReviews((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      await revalidateEntityPage(deleteTarget);
      toast.success("Review deleted and rating recalculated");
    } catch (error) {
      console.error("Delete review error:", error);
      toast.error("Failed to delete review");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredReviews = reviews.filter((r) => {
    const statusMatch =
      statusFilter === "pending" ? !r.approved :
      statusFilter === "approved" ? r.approved : true;
    const typeMatch = typeFilter === "all" || r.entityType === typeFilter;
    return statusMatch && typeMatch;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
          {filterTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                statusFilter === tab.value ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
              {tab.value === "pending" && pendingCount > 0 && (
                <span className="ml-1.5 opacity-70">({pendingCount})</span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {entityTypeTabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setTypeFilter(tab.value)}
              className={`text-sm font-medium px-3.5 py-2 rounded-lg transition-colors ${
                typeFilter === tab.value ? "bg-secondary text-white" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-2xl text-primary" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="card p-12 text-center">
          <FiMessageSquare className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">
            {statusFilter === "pending" ? "No reviews awaiting moderation" : "No reviews found"}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReviews.map((review) => (
            <div key={review.id} className="card p-5">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-primary">{review.guestName}</p>
                    <span className="text-gray-300">·</span>
                    <span className="flex items-center gap-1 text-secondary text-sm font-medium">
                      {review.entityType === "hotel" ? <FiHome className="text-xs" /> : <FiCoffee className="text-xs" />}
                      {review.entityName}
                    </span>
                    {review.approved && (
                      <span className="text-xs font-medium bg-accent/10 text-accent-dark px-2 py-0.5 rounded-md">
                        Published
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mt-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar key={i} className={`text-xs ${i < review.rating ? "text-accent fill-accent" : "text-gray-200"}`} />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                  <p className="text-gray-400 text-xs mt-2">{formatDate(review.createdAt)}</p>
                </div>

                {/* Actions — differ based on approval status */}
                <div className="flex items-center gap-2 shrink-0">
                  {!review.approved ? (
                    <>
                      <button
                        onClick={() => handleApprove(review)}
                        disabled={processingId === review.id}
                        className="flex items-center gap-1.5 bg-accent/10 text-accent-dark hover:bg-accent hover:text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button
                        onClick={() => handleReject(review)}
                        disabled={processingId === review.id}
                        className="flex items-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                      >
                        <FiX /> Reject
                      </button>
                    </>
                  ) : (
                    // NEW: Delete option for already-approved (live/public) reviews
                    <button
                      onClick={() => setDeleteTarget(review)}
                      className="flex items-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors"
                      aria-label="Delete review"
                    >
                      <FiTrash2 /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* NEW: Confirm dialog specifically for deleting an already-published review */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete This Review?"
        message={`This review by "${deleteTarget?.guestName}" is currently live on ${deleteTarget?.entityName}'s page. Deleting it will remove it permanently and recalculate the rating. This cannot be undone.`}
        confirmLabel="Delete Review"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteApprovedConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}