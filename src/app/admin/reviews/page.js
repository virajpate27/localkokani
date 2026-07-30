// src/app/admin/reviews/page.js
"use client";

import { useState, useEffect } from "react";
import { FiLoader, FiStar, FiCheck, FiX, FiMessageSquare } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getAllReviewsAdmin,
  approveReview,
  rejectReview,
} from "@/lib/services/reviewService";
import { triggerRevalidation } from "@/utils/revalidate";


const filterTabs = [
  { value: "pending", label: "Pending" },
  { value: "approved", label: "Approved" },
  { value: "all", label: "All" },
];
 
function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("pending");
  const [processingId, setProcessingId] = useState(null);

  const loadReviews = async () => {
    setIsLoading(true);
    try {
      const data = await getAllReviewsAdmin();
      setReviews(data);
    } catch (error) {
      console.error("Load reviews error:", error);
      toast.error("Failed to load reviews");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

 const handleApprove = async (review) => {
  setProcessingId(review.id);
  try {
    await approveReview(review.id, review.hotelId);
    setReviews((prev) =>
      prev.map((r) => (r.id === review.id ? { ...r, approved: true } : r))
    );

    // Need the hotel's slug to revalidate its public page — fetch it if not already available
    // Since review.hotelId is what we have, look it up via the hotel data we might already have,
    // or add hotelSlug to the review document itself at creation time (better long-term fix below)
    if (review.hotelSlug) {
      await triggerRevalidation([`/hotels/${review.hotelSlug}`]);
    }

    toast.success("Review approved and published");
  } catch (error) {
    console.error("Approve error:", error);
    toast.error("Failed to approve review");
  } finally {
    setProcessingId(null);
  }
};

  const handleReject = async (review) => {
  setProcessingId(review.id);
  try {
    await rejectReview(review.id, review.hotelId);
    setReviews((prev) => prev.filter((r) => r.id !== review.id));

    if (review.hotelSlug) {
      await triggerRevalidation([`/hotels/${review.hotelSlug}`]);
    }

    toast.success("Review rejected and removed");
  } catch (error) {
    console.error("Reject error:", error);
    toast.error("Failed to delete review");
  } finally {
    setProcessingId(null);
  }
};

  const filteredReviews = reviews.filter((r) => {
    if (filter === "pending") return !r.approved;
    if (filter === "approved") return r.approved;
    return true;
  });

  const pendingCount = reviews.filter((r) => !r.approved).length;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
              filter === tab.value
                ? "bg-primary text-white"
                : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {tab.label}
            {tab.value === "pending" && pendingCount > 0 && (
              <span className="ml-1.5 opacity-70">({pendingCount})</span>
            )}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-2xl text-primary" />
        </div>
      ) : filteredReviews.length === 0 ? (
        <div className="card p-12 text-center">
          <FiMessageSquare className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">
            {filter === "pending" ? "No reviews awaiting moderation" : "No reviews found"}
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
                    <p className="text-secondary text-sm font-medium">{review.hotelName}</p>
                    {review.approved && (
                      <span className="text-xs font-medium bg-accent/10 text-accent px-2 py-0.5 rounded-md">
                        Published
                      </span>
                    )}
                  </div>
                  <div className="flex gap-0.5 mt-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FiStar
                        key={i}
                        className={`text-xs ${
                          i < review.rating ? "text-accent fill-accent" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 text-sm mt-2">{review.comment}</p>
                  <p className="text-gray-400 text-xs mt-2">{formatDate(review.createdAt)}</p>
                </div>

                {!review.approved && (
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(review)}
                      disabled={processingId === review.id}
                      className="flex items-center gap-1.5 bg-accent/10 text-accent hover:bg-accent hover:text-white px-3.5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
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
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}