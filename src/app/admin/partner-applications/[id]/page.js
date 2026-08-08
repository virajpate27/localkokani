// src/app/admin/partner-applications/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiLoader, FiCheck, FiX, FiExternalLink } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getPartnerApplicationById, approvePartnerApplication, rejectPartnerApplication,
} from "@/lib/services/partnerService";

export default function PartnerApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getPartnerApplicationById(id).then(setApp).finally(() => setIsLoading(false));
  }, [id]);

  const handleApprove = async () => {
    setIsProcessing(true);
    try {
      const partnerId = await approvePartnerApplication(id, notes);
      toast.success(`Approved — Partner ID: ${partnerId}`);
      router.push("/admin/partner-applications");
    } catch {
      toast.error("Failed to approve");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    setIsProcessing(true);
    try {
      await rejectPartnerApplication(id, notes);
      toast.success("Application rejected");
      router.push("/admin/partner-applications");
    } catch {
      toast.error("Failed to reject");
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><FiLoader className="animate-spin text-2xl text-primary" /></div>;
  if (!app) return <div className="card p-10 text-center text-gray-400">Application not found.</div>;

  return (
    <div className="max-w-3xl space-y-6">
      <div className="card p-6">
        <p className="text-gray-400 text-xs">Registration ID</p>
        <p className="font-mono font-medium text-primary">{app.registrationId}</p>
        {app.partnerId && (
          <>
            <p className="text-gray-400 text-xs mt-3">Partner ID</p>
            <p className="font-mono font-medium text-accent-dark">{app.partnerId}</p>
          </>
        )}
      </div>

      <div className="card p-6 space-y-2">
        <h3 className="font-display font-semibold text-primary">Owner</h3>
        <p className="text-sm text-gray-600">{app.owner?.fullName} · {app.owner?.mobile} · {app.owner?.email}</p>
      </div>

      <div className="card p-6 space-y-2">
        <h3 className="font-display font-semibold text-primary">Property</h3>
        <p className="text-sm text-gray-600 capitalize">{app.property?.type}: {app.property?.name}</p>
        <p className="text-sm text-gray-500">{app.property?.description}</p>
        <p className="text-sm text-gray-500">
          {app.location?.address}, {app.location?.village}, {app.location?.district}, {app.location?.state} - {app.location?.pincode}
        </p>
      </div>

      <div className="card p-6 space-y-2">
        <h3 className="font-display font-semibold text-primary">Photos & Verification</h3>
        {app.photosLink && (
          <a href={app.photosLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:underline">
            <FiExternalLink /> View Photos (Google Drive)
          </a>
        )}
        {app.verification?.idProof?.url && (
          <a href={app.verification.idProof.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:underline">
            <FiExternalLink /> View ID Proof
          </a>
        )}
        {app.verification?.ownershipProof?.url && (
          <a href={app.verification.ownershipProof.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:underline">
            <FiExternalLink /> View Ownership Proof
          </a>
        )}
      </div>

      {app.status === "pending" && (
        <div className="card p-6 space-y-4">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal review notes (optional)"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none resize-none"
          />
          <div className="flex gap-3">
            <button onClick={handleApprove} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 bg-accent text-white font-medium py-3 rounded-xl disabled:opacity-60">
              <FiCheck /> Approve
            </button>
            <button onClick={handleReject} disabled={isProcessing} className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-medium py-3 rounded-xl disabled:opacity-60">
              <FiX /> Reject
            </button>
          </div>
        </div>
      )}
    </div>
  );
}