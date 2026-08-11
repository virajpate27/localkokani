// src/app/admin/promotions/page.js
"use client";

import { useState, useEffect } from "react";
import { FiLoader, FiSave, FiZap, FiStar, FiCheck, FiX, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getPromotionPricing, updatePromotionPricing,
  getAllPromotionRequestsAdmin, approvePromotionRequest, rejectPromotionRequest,
  expireOutdatedPromotions, endPromotionEarly, DURATIONS,
} from "@/lib/services/promotionService";
import { triggerRevalidation } from "@/utils/revalidate";
import { formatCurrency } from "@/utils/helpers";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const tabs = [
  { value: "pending_payment", label: "Pending" },
  { value: "active", label: "Active" },
  { value: "all", label: "All" },
];

const statusStyles = {
  pending_payment: "bg-secondary/10 text-secondary",
  active: "bg-accent/10 text-accent-dark",
  completed: "bg-gray-100 text-gray-500",
  rejected: "bg-red-50 text-red-500",
  cancelled: "bg-gray-100 text-gray-400",
};

export default function AdminPromotionsPage() {
  const [pricing, setPricing] = useState(null);
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPricing, setIsSavingPricing] = useState(false);
  const [statusFilter, setStatusFilter] = useState("pending_payment");
  const [processingId, setProcessingId] = useState(null);
  const [rejectTarget, setRejectTarget] = useState(null);
  const [endEarlyTarget, setEndEarlyTarget] = useState(null);
  const [notes, setNotes] = useState("");

  const loadData = async () => {
    setIsLoading(true);
    const expiredCount = await expireOutdatedPromotions(); // lazy expiry runs every time this page loads
    if (expiredCount > 0) {
      toast(`${expiredCount} promotion(s) expired and were removed automatically`, { icon: "⏱️" });
    }
    const [pricingData, requestsData] = await Promise.all([
      getPromotionPricing(),
      getAllPromotionRequestsAdmin(),
    ]);
    setPricing(pricingData);
    setRequests(requestsData);
    setIsLoading(false);
  };

  useEffect(() => { loadData(); }, []);

  const handlePricingChange = (type, durationKey, value) => {
    setPricing((prev) => ({
      ...prev,
      [type]: { ...prev[type], [durationKey]: Number(value) || 0 },
    }));
  };

  const handleSavePricing = async () => {
    setIsSavingPricing(true);
    try {
      await updatePromotionPricing(pricing);
      toast.success("Pricing updated");
    } catch {
      toast.error("Failed to update pricing");
    } finally {
      setIsSavingPricing(false);
    }
  };

  const handleApprove = async (request) => {
    setProcessingId(request.id);
    try {
      await approvePromotionRequest(request.id, request);
      setRequests((prev) => prev.map((r) => (r.id === request.id ? { ...r, status: "active" } : r)));
      await triggerRevalidation([
        "/", "/destinations", `/${request.entityType}s`,
        `/${request.entityType}s/${request.entitySlug}`,
        `/destinations/${request.destinationSlug}`,
      ]);
      toast.success(`${request.entityName} is now ${request.promotionType}`);
    } catch (error) {
      console.error("Approve promotion error:", error);
      toast.error("Failed to approve");
    } finally {
      setProcessingId(null);
    }
  };

  const handleRejectConfirm = async () => {
    if (!rejectTarget) return;
    setProcessingId(rejectTarget.id);
    try {
      await rejectPromotionRequest(rejectTarget.id, notes);
      setRequests((prev) => prev.map((r) => (r.id === rejectTarget.id ? { ...r, status: "rejected" } : r)));
      toast.success("Request rejected");
    } catch {
      toast.error("Failed to reject");
    } finally {
      setProcessingId(null);
      setRejectTarget(null);
      setNotes("");
    }
  };

  const handleEndEarlyConfirm = async () => {
    if (!endEarlyTarget) return;
    setProcessingId(endEarlyTarget.id);
    try {
      await endPromotionEarly(endEarlyTarget.id, endEarlyTarget);
      setRequests((prev) => prev.map((r) => (r.id === endEarlyTarget.id ? { ...r, status: "completed" } : r)));
      await triggerRevalidation([
        "/", "/destinations", `/${endEarlyTarget.entityType}s`,
        `/${endEarlyTarget.entityType}s/${endEarlyTarget.entitySlug}`,
      ]);
      toast.success("Promotion ended");
    } catch {
      toast.error("Failed to end promotion");
    } finally {
      setProcessingId(null);
      setEndEarlyTarget(null);
    }
  };

  const filteredRequests = statusFilter === "all" ? requests : requests.filter((r) => r.status === statusFilter);
  const pendingCount = requests.filter((r) => r.status === "pending_payment").length;

  if (isLoading) return <div className="flex justify-center py-20"><FiLoader className="animate-spin text-2xl text-primary" /></div>;

  return (
    <div className="space-y-8 max-w-4xl">
      {/* Pricing Editor */}
      <div className="card p-6">
        <h2 className="font-display font-semibold text-lg text-primary mb-4">Pricing Settings</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {["sponsored", "featured"].map((type) => (
            <div key={type}>
              <p className="flex items-center gap-1.5 font-medium text-primary text-sm mb-3 capitalize">
                {type === "sponsored" ? <FiZap className="text-accent-dark" /> : <FiStar className="text-primary" />}
                {type} Placement
              </p>
              <div className="space-y-2">
                {DURATIONS.map((d) => (
                  <div key={d.key} className="flex items-center justify-between gap-3">
                    <label className="text-gray-500 text-sm">{d.label}</label>
                    <div className="relative w-28">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">₹</span>
                      <input
                        type="number"
                        value={pricing[type][d.key]}
                        onChange={(e) => handlePricingChange(type, d.key, e.target.value)}
                        className="w-full pl-6 pr-2 py-2 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button onClick={handleSavePricing} disabled={isSavingPricing} className="btn-primary flex items-center gap-2 mt-5 disabled:opacity-60">
          <FiSave /> {isSavingPricing ? "Saving..." : "Save Pricing"}
        </button>
      </div>

      {/* Requests */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                statusFilter === tab.value ? "bg-primary text-white" : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {tab.label}
              {tab.value === "pending_payment" && pendingCount > 0 && <span className="ml-1.5 opacity-70">({pendingCount})</span>}
            </button>
          ))}
        </div>

        {filteredRequests.length === 0 ? (
          <div className="card p-10 text-center text-gray-400">No requests in this view</div>
        ) : (
          <div className="space-y-3">
            {filteredRequests.map((req) => (
              <div key={req.id} className="card p-5 flex items-center justify-between gap-4 flex-wrap">
                <div>
                  <div className="flex items-center gap-2">
                    {req.promotionType === "sponsored" ? <FiZap className="text-accent-dark text-sm" /> : <FiStar className="text-primary text-sm" />}
                    <p className="font-medium text-primary text-sm capitalize">{req.promotionType} — {req.entityName}</p>
                  </div>
                  <p className="text-gray-400 text-xs mt-1">
                    {req.ownerName} · {req.durationLabel} · {req.startDate} → {req.endDate} · {formatCurrency(req.price)}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${statusStyles[req.status]}`}>
                    {req.status.replace("_", " ")}
                  </span>
                  {req.status === "pending_payment" && (
                    <>
                      <button
                        onClick={() => handleApprove(req)}
                        disabled={processingId === req.id}
                        className="flex items-center gap-1.5 bg-accent/10 text-accent-dark hover:bg-accent hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50"
                      >
                        <FiCheck /> Approve
                      </button>
                      <button
                        onClick={() => setRejectTarget(req)}
                        className="flex items-center gap-1.5 bg-red-50 text-red-500 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                      >
                        <FiX /> Reject
                      </button>
                    </>
                  )}
                  {req.status === "active" && (
                    <button
                      onClick={() => setEndEarlyTarget(req)}
                      className="flex items-center gap-1.5 bg-orange-50 text-orange-500 hover:bg-orange-500 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
                    >
                      <FiClock /> End Early
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        isOpen={!!rejectTarget}
        title="Reject Promotion Request?"
        message={`Reject the ${rejectTarget?.promotionType} request for "${rejectTarget?.entityName}"?`}
        confirmLabel="Reject"
        isDangerous
        isLoading={processingId === rejectTarget?.id}
        onConfirm={handleRejectConfirm}
        onCancel={() => { setRejectTarget(null); setNotes(""); }}
      />

      <ConfirmDialog
        isOpen={!!endEarlyTarget}
        title="End Promotion Early?"
        message={`This will immediately remove "${endEarlyTarget?.entityName}" from ${endEarlyTarget?.promotionType} placement, before its paid period ends.`}
        confirmLabel="End Now"
        isDangerous
        isLoading={processingId === endEarlyTarget?.id}
        onConfirm={handleEndEarlyConfirm}
        onCancel={() => setEndEarlyTarget(null)}
      />
    </div>
  );
}