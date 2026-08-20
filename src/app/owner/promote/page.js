// src/app/owner/promote/page.js
"use client";

import { useState, useEffect } from "react";
import {
  FiLoader,
  FiZap,
  FiStar,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiXCircle,
  FiRefreshCw,
} from "react-icons/fi";
import toast from "react-hot-toast";
import OwnerProtectedRoute from "@/components/owner/OwnerProtectedRoute";
import { useOwnerAuth } from "@/context/OwnerAuthContext";
import { getHotelsByOwner } from "@/lib/services/hotelService";
import { getRestaurantsByOwner } from "@/lib/services/restaurantService";
import {
  getPromotionPricing,
  createPromotionRequest,
  getPromotionRequestsByOwner,
  cancelPromotionRequest,
  hasActiveOrScheduledPromotion,
  getExtendableRequestsByOwner,
  addDays,
  DURATIONS,
} from "@/lib/services/promotionService";
import { formatCurrency } from "@/utils/helpers";

const statusConfig = {
  pending_payment: {
    label: "Awaiting Approval",
    color: "bg-secondary/10 text-secondary",
    icon: FiClock,
  },
  scheduled: {
    label: "Scheduled",
    color: "bg-blue-50 text-blue-500",
    icon: FiCalendar,
  }, // ⬅️ ADD (FiCalendar already imported)
  active: {
    label: "Live",
    color: "bg-accent/10 text-accent-dark",
    icon: FiCheckCircle,
  },
  completed: {
    label: "Completed",
    color: "bg-gray-100 text-gray-500",
    icon: FiCheckCircle,
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-50 text-red-500",
    icon: FiXCircle,
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-400",
    icon: FiXCircle,
  },
};

function PromoteContent() {
  const { owner } = useOwnerAuth();
  const [listings, setListings] = useState([]);
  const [pricing, setPricing] = useState(null);
  const [requests, setRequests] = useState([]);
  const [extendableRequests, setExtendableRequests] = useState([]); // ⬅️ ADD
  const [isLoading, setIsLoading] = useState(true);

  const [selectedEntity, setSelectedEntity] = useState("");
  const [promotionType, setPromotionType] = useState("featured");
  const [duration, setDuration] = useState("week1");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extendingFrom, setExtendingFrom] = useState(null); // ⬅️ ADD — tracks which request we're extending, for UI messaging

  useEffect(() => {
    async function load() {
      const [hotels, restaurants, pricingData, requestsData, extendableData] =
        await Promise.all([
          getHotelsByOwner(owner.uid),
          getRestaurantsByOwner(owner.uid),
          getPromotionPricing(),
          getPromotionRequestsByOwner(owner.uid),
          getExtendableRequestsByOwner(owner.uid), // ⬅️ ADD
        ]);
      const allListings = [
        ...hotels
          .filter((h) => h.status === "active")
          .map((h) => ({ ...h, type: "hotel" })),
        ...restaurants
          .filter((r) => r.status === "active")
          .map((r) => ({ ...r, type: "restaurant" })),
      ];
      setListings(allListings);
      setPricing(pricingData);
      setRequests(requestsData);
      setExtendableRequests(extendableData); // ⬅️ ADD
      if (allListings.length > 0)
        setSelectedEntity(`${allListings[0].type}-${allListings[0].id}`);
      setIsLoading(false);
    }
    if (owner) load();
  }, [owner]);

  const selectedListing = listings.find(
    (l) => `${l.type}-${l.id}` === selectedEntity,
  );
  const price = pricing?.[promotionType]?.[duration] || 0;
  const durationConfig = DURATIONS.find((d) => d.key === duration);

  // NEW: pre-fill the form to extend an existing promotion
  const handleExtendClick = (request) => {
    setSelectedEntity(`${request.entityType}-${request.entityId}`);
    setPromotionType(request.promotionType);
    setDuration(request.duration); // default to same duration they had before — easy to change
    setStartDate(addDays(request.endDate, 1)); // starts the day after current promotion ends — no gap, no overlap
    setExtendingFrom(request);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!selectedListing) {
      toast.error("Select a property first");
      return;
    }

    setIsSubmitting(true);
    try {
      const alreadyHasOne = await hasActiveOrScheduledPromotion(
        selectedListing.id,
        promotionType,
      );
      // If we're extending, the "conflict" IS the promotion we're extending from — that's expected, not an error.
      // Only block if there's a conflict AND it's not the one we're intentionally extending.
      if (alreadyHasOne && !extendingFrom) {
        toast.error(
          `This listing already has a pending, scheduled, or active ${promotionType} promotion. Wait for it to complete before requesting another.`,
        );
        setIsSubmitting(false);
        return;
      }

      await createPromotionRequest({
        ownerId: owner.uid,
        ownerName: selectedListing.ownerName || "",
        entityType: selectedListing.type,
        entityId: selectedListing.id,
        entityName: selectedListing.name,
        entitySlug: selectedListing.slug,
        destinationSlug: selectedListing.destinationSlug,
        promotionType,
        duration,
        startDate,
        price,
      });
      toast.success(
        extendingFrom
          ? "Extension request submitted!"
          : "Request submitted! We'll confirm once payment is received.",
      );

      const [updated, updatedExtendable] = await Promise.all([
        getPromotionRequestsByOwner(owner.uid),
        getExtendableRequestsByOwner(owner.uid),
      ]);
      setRequests(updated);
      setExtendableRequests(updatedExtendable);
      setExtendingFrom(null); // reset extend mode after successful submit
    } catch (error) {
      console.error("Promotion request error:", error);
      toast.error("Failed to submit request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = async (requestId) => {
    try {
      await cancelPromotionRequest(requestId);
      setRequests((prev) =>
        prev.map((r) =>
          r.id === requestId ? { ...r, status: "cancelled" } : r,
        ),
      );
      toast.success("Request cancelled");
    } catch {
      toast.error("Failed to cancel request");
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <FiLoader className="animate-spin text-2xl text-primary" />
      </div>
    );

  if (listings.length === 0) {
    return (
      <div className="card p-10 text-center">
        <p className="text-gray-400">
          You don't have any live listings to promote yet.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-8">
      {/* NEW: Extendable Promotions Banner — shown above the form when applicable */}
      {extendableRequests.length > 0 && !extendingFrom && (
        <div className="card p-5 bg-secondary/5 border border-secondary/20">
          <h3 className="font-display font-semibold text-primary text-sm mb-3 flex items-center gap-2">
            <FiRefreshCw className="text-secondary" /> Keep Your Promotion Going
          </h3>
          <div className="space-y-2">
            {extendableRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between gap-3 bg-white rounded-lg p-3"
              >
                <div>
                  <p className="text-sm font-medium text-primary">
                    {req.entityName} —{" "}
                    <span className="capitalize">{req.promotionType}</span>
                  </p>
                  <p className="text-gray-400 text-xs">
                    {req.status === "active" ? "Live until" : "Starts"}{" "}
                    {req.status === "active" ? req.endDate : req.startDate}
                  </p>
                </div>
                <button
                  onClick={() => handleExtendClick(req)}
                  className="flex items-center gap-1.5 text-secondary text-xs font-medium hover:underline shrink-0"
                >
                  <FiRefreshCw className="text-xs" /> Extend
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* New Request Form */}
      <div className="card p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-bold text-xl text-primary">
            {extendingFrom ? "Extend Your Promotion" : "Promote a Listing"}
          </h2>
          {extendingFrom && (
            <button
              onClick={() => setExtendingFrom(null)}
              className="text-gray-400 text-xs font-medium hover:text-primary"
            >
              Cancel extension
            </button>
          )}
        </div>

        {extendingFrom && (
          <div className="bg-secondary/5 border border-secondary/20 rounded-xl p-3 text-sm text-gray-600">
            Extending <strong>{extendingFrom.entityName}</strong>'s{" "}
            {extendingFrom.promotionType} promotion. Your new period will start
            right after the current one ends — no gap in visibility.
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Property
          </label>
          <select
            value={selectedEntity}
            onChange={(e) => setSelectedEntity(e.target.value)}
            disabled={!!extendingFrom}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none bg-white disabled:bg-gray-50 disabled:text-gray-400"
          >
            {listings.map((l) => (
              <option key={`${l.type}-${l.id}`} value={`${l.type}-${l.id}`}>
                {l.name} ({l.type})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Placement Type
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPromotionType("featured")}
              disabled={!!extendingFrom}
              className={`p-4 rounded-xl border-2 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                promotionType === "featured"
                  ? "border-primary bg-primary/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FiStar className="text-primary mb-1" />
              <p className="font-medium text-primary text-sm">Featured</p>
              <p className="text-gray-400 text-xs">Homepage & top listings</p>
            </button>
            <button
              type="button"
              onClick={() => setPromotionType("sponsored")}
              disabled={!!extendingFrom}
              className={`p-4 rounded-xl border-2 text-left transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                promotionType === "sponsored"
                  ? "border-accent bg-accent/5"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <FiZap className="text-accent-dark mb-1" />
              <p className="font-medium text-primary text-sm">Sponsored</p>
              <p className="text-gray-400 text-xs">
                Destination page highlight
              </p>
            </button>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Duration
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DURATIONS.map((d) => (
              <button
                key={d.key}
                type="button"
                onClick={() => setDuration(d.key)}
                className={`p-3 rounded-xl border text-center transition-colors ${
                  duration === d.key
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <p className="text-xs text-gray-500">{d.label}</p>
                <p className="font-display font-bold text-primary text-sm mt-0.5">
                  {formatCurrency(pricing?.[promotionType]?.[d.key] || 0)}
                </p>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date{" "}
            {extendingFrom && (
              <span className="text-gray-400 font-normal">
                (auto-set to continue seamlessly)
              </span>
            )}
          </label>
          <div className="relative">
            <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="date"
              value={startDate}
              min={
                extendingFrom
                  ? startDate
                  : new Date().toISOString().split("T")[0]
              } // lock the min to the computed continuation date while extending
              onChange={(e) => setStartDate(e.target.value)}
              disabled={!!extendingFrom}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-gray-400 text-xs">Total Price</p>
            <p className="font-display font-bold text-2xl text-primary">
              {formatCurrency(price)}
            </p>
          </div>
          <p className="text-gray-400 text-xs text-right">
            {durationConfig?.label} of{" "}
            {promotionType === "featured" ? "Featured" : "Sponsored"} placement
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn-primary w-full disabled:opacity-60"
        >
          {isSubmitting
            ? "Submitting..."
            : extendingFrom
              ? "Submit Extension"
              : "Submit Request"}
        </button>
        <p className="text-gray-400 text-xs text-center">
          After submitting, our team will share payment instructions and
          activate your promotion once confirmed.
        </p>
      </div>

      {/* Request History — unchanged */}
      {requests.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-lg text-primary mb-4">
            Your Promotion Requests
          </h3>
          <div className="space-y-3">
            {requests.map((req) => {
              const config = statusConfig[req.status];
              const StatusIcon = config.icon;
              return (
                <div
                  key={req.id}
                  className="card p-4 flex items-center justify-between gap-4 flex-wrap"
                >
                  <div>
                    <p className="font-medium text-primary text-sm">
                      {req.entityName} —{" "}
                      <span className="capitalize">{req.promotionType}</span>
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {req.durationLabel} · {req.startDate} → {req.endDate} ·{" "}
                      {formatCurrency(req.price)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-lg ${config.color}`}
                    >
                      <StatusIcon className="text-xs" /> {config.label}
                    </span>
                    {req.status === "pending_payment" && (
                      <button
                        onClick={() => handleCancel(req.id)}
                        className="text-red-400 text-xs font-medium hover:underline"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OwnerPromotePage() {
  return (
    <OwnerProtectedRoute>
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container-custom">
          <OwnerPromoteHeader />
          <PromoteContent />
        </div>
      </div>
    </OwnerProtectedRoute>
  );
}

function OwnerPromoteHeader() {
  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-primary">
          Promote Your Listing
        </h1>
        <p className="text-gray-400 text-sm">
          Boost visibility with Featured or Sponsored placement
        </p>
      </div>
      <a
        href="/owner/dashboard"
        className="text-secondary text-sm font-medium hover:underline"
      >
        ← Back to Dashboard
      </a>
    </div>
  );
}
