// src/app/admin/partner-applications/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiLoader,
  FiCheck,
  FiX,
  FiExternalLink,
  FiCheckCircle,
  FiXCircle,
  FiPlus,
} from "react-icons/fi";
import toast from "react-hot-toast";
import {
  getPartnerApplicationById,
  approvePartnerApplication,
  rejectPartnerApplication,
} from "@/lib/services/partnerService";

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-2 gap-3 py-2 border-b border-gray-50 last:border-0">
      <p className="text-gray-400 text-sm">{label}</p>
      <p className="text-gray-700 text-sm font-medium text-right sm:text-left">
        {value || "—"}
      </p>
    </div>
  );
}

function AcceptanceRow({ label, accepted }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
      <p className="text-gray-600 text-sm">{label}</p>
      {accepted ? (
        <FiCheckCircle className="text-accent-dark shrink-0" />
      ) : (
        <FiXCircle className="text-red-400 shrink-0" />
      )}
    </div>
  );
}

export default function PartnerApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [notes, setNotes] = useState("");

  useEffect(() => {
    getPartnerApplicationById(id)
      .then((data) => {
        setApp(data);
        setNotes(data?.reviewNotes || "");
      })
      .finally(() => setIsLoading(false));
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

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <FiLoader className="animate-spin text-2xl text-primary" />
      </div>
    );
  if (!app)
    return (
      <div className="card p-10 text-center text-gray-400">
        Application not found.
      </div>
    );

  const isHotel = app.property?.type === "hotel";

  return (
    <div className="max-w-3xl space-y-6 pb-10">
      {/* Header / IDs */}
      <div className="card p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-gray-400 text-xs">Registration ID</p>
          <p className="font-mono font-medium text-primary">
            {app.registrationId}
          </p>
          {app.partnerId && (
            <>
              <p className="text-gray-400 text-xs mt-3">Partner ID</p>
              <p className="font-mono font-medium text-accent-dark">
                {app.partnerId}
              </p>
            </>
          )}
        </div>
        <span
          className={`text-xs font-medium px-3 py-1.5 rounded-lg capitalize ${
            app.status === "approved"
              ? "bg-accent/10 text-accent-dark"
              : app.status === "rejected"
                ? "bg-red-50 text-red-500"
                : "bg-secondary/10 text-secondary"
          }`}
        >
          {app.status}
        </span>
      </div>

      {app.status === "approved" && (
        <div className="card p-6 bg-accent/5 border border-accent/20">
          <h3 className="font-display font-semibold text-primary mb-2">
            Ready to Go Live
          </h3>
          <p className="text-gray-500 text-sm mb-4">
            This application is approved. Create the actual {app.property?.type}{" "}
            listing, pre-filled with the owner's submitted details.
          </p>
          <Link
            href={`/admin/${app.property?.type === "hotel" ? "hotels" : "restaurants"}/new?${new URLSearchParams(
              {
                ownerId: app.ownerId || "",
                ownerName: app.owner?.fullName || "",
                prefillName: app.property?.name || "",
                prefillDescription: app.property?.description || "",
                prefillAddress: app.location?.address || "",
              },
            ).toString()}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <FiPlus /> Create{" "}
            {app.property?.type === "hotel" ? "Hotel" : "Restaurant"} Listing
          </Link>
        </div>
      )}

      {/* Owner Details */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-primary mb-3">
          Owner Details
        </h3>
        <InfoRow label="Full Name" value={app.owner?.fullName} />
        <InfoRow label="Mobile" value={app.owner?.mobile} />
        <InfoRow label="WhatsApp" value={app.owner?.whatsapp} />
        <InfoRow label="Email" value={app.owner?.email} />
        <InfoRow label="Alternate Contact" value={app.owner?.altContact} />
      </div>

      {/* Property Details */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-primary mb-3">
          Property Details
        </h3>
        <InfoRow label="Property Name" value={app.property?.name} />
        <InfoRow label="Property Type" value={app.property?.type} />
        <InfoRow label="Description" value={app.property?.description} />
        {isHotel ? (
          <>
            <InfoRow label="Total Rooms" value={app.property?.totalRooms} />
            <InfoRow
              label="Max Guest Capacity"
              value={app.property?.maxGuestCapacity}
            />
          </>
        ) : (
          <>
            <InfoRow
              label="Seating Capacity"
              value={app.property?.seatingCapacity}
            />
            <InfoRow label="Cuisine Types" value={app.property?.cuisineTypes} />
          </>
        )}
      </div>

      {/* Location */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-primary mb-3">
          Location
        </h3>
        <InfoRow label="Address" value={app.location?.address} />
        <InfoRow label="Village / Town / City" value={app.location?.village} />
        <InfoRow label="Taluka" value={app.location?.taluka} />
        <InfoRow label="District" value={app.location?.district} />
        <InfoRow label="State" value={app.location?.state} />
        <InfoRow label="PIN Code" value={app.location?.pincode} />
        <InfoRow
          label="Nearby Attractions"
          value={app.location?.nearbyAttractions}
        />
        {app.location?.googleBusinessLink && (
          <div className="flex items-center justify-between py-2">
            <p className="text-gray-400 text-sm">Google Business Link</p>
            <a
              href={app.location.googleBusinessLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-secondary text-sm font-medium hover:underline"
            >
              Open <FiExternalLink className="text-xs" />
            </a>
          </div>
        )}
      </div>

      {/* Room Types — hotel only */}
      {isHotel && app.roomTypes?.length > 0 && (
        <div className="card p-6">
          <h3 className="font-display font-semibold text-primary mb-3">
            Room Types ({app.roomTypes.length})
          </h3>
          <div className="space-y-3">
            {app.roomTypes.map((room, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-sm">
                <p className="font-medium text-primary">{room.name}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2 text-gray-500">
                  <span>Rooms: {room.numberOfRooms}</span>
                  <span>Guests: {room.guestsPerRoom}</span>
                  <span>₹{room.startingPrice}/night</span>
                  <span>Weekend: ₹{room.weekendPrice || "—"}</span>
                </div>
                {room.amenities && (
                  <p className="text-gray-400 mt-2">{room.amenities}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos & Verification Documents */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-primary mb-3">
          Photos & Verification
        </h3>
        {app.photosLink && (
          <a
            href={app.photosLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:underline py-1.5"
          >
            <FiExternalLink /> View Property Photos (Google Drive)
          </a>
        )}
        {app.verification?.idProof?.url && (
          <a
            href={app.verification.idProof.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:underline py-1.5"
          >
            <FiExternalLink /> View ID Proof
          </a>
        )}
        {app.verification?.ownershipProof?.url && (
          <a
            href={app.verification.ownershipProof.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:underline py-1.5"
          >
            <FiExternalLink /> View Ownership Proof
          </a>
        )}
        <div className="mt-2">
          <AcceptanceRow
            label="Declaration: Documents are genuine / authorized"
            accepted={app.verification?.declarationAccepted}
          />
        </div>
      </div>

      {/* Policies */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-primary mb-3">
          {isHotel
            ? "Policies & Guest Information"
            : "Operating Hours & Guest Information"}
        </h3>
        <InfoRow
          label={isHotel ? "Check-in Time" : "Opening Time"}
          value={app.policies?.checkInTime}
        />
        <InfoRow
          label={isHotel ? "Check-out Time" : "Closing Time"}
          value={app.policies?.checkOutTime}
        />
        <InfoRow
          label={
            isHotel
              ? "Cancellation Policy"
              : "Reservation / Cancellation Policy"
          }
          value={app.policies?.cancellationPolicy}
        />
        <InfoRow
          label={isHotel ? "Child Policy" : "Dress Code / Child Policy"}
          value={app.policies?.childPolicy}
        />
        <InfoRow label="Pet Policy" value={app.policies?.petPolicy} />
        {isHotel && (
          <>
            <InfoRow
              label="ID Required at Check-in"
              value={app.policies?.idRequired}
            />
            <InfoRow
              label="Couples Allowed"
              value={app.policies?.couplesAllowed}
            />
          </>
        )}
      </div>

      {/* Plan */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-primary mb-3">
          Selected Plan
        </h3>
        <InfoRow label="Plan" value={app.plan} />
      </div>

      {/* Legal Acceptance */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-primary mb-3">
          Legal Acceptance
        </h3>
        <AcceptanceRow
          label="Owner or authorized representative"
          accepted={app.acceptance?.isOwnerOrAuthorized}
        />
        <AcceptanceRow
          label="Information is accurate"
          accepted={app.acceptance?.infoAccurate}
        />
        <AcceptanceRow
          label="Agreed to Partner Agreement"
          accepted={app.acceptance?.agreedPartnerAgreement}
        />
        <AcceptanceRow
          label="Agreed to Terms for Hotel Owners"
          accepted={app.acceptance?.agreedTerms}
        />
        <AcceptanceRow
          label="Read Privacy Policy"
          accepted={app.acceptance?.readPrivacyPolicy}
        />
        <AcceptanceRow
          label="Agreed to commission/subscription fee"
          accepted={app.acceptance?.agreedCommission}
        />
        <InfoRow label="Agreement Version" value={app.agreementVersion} />
        <InfoRow label="Terms Version" value={app.termsVersion} />
      </div>

      {/* Submission Metadata */}
      <div className="card p-6">
        <h3 className="font-display font-semibold text-primary mb-3">
          Submission Record
        </h3>
        <InfoRow label="Submitted On" value={formatDate(app.submittedAt)} />
        <InfoRow label="IP Address" value={app.ipAddress} />
      </div>

      {/* Review Action */}
      {app.status === "pending" && (
        <div className="card p-6 space-y-4">
          <h3 className="font-display font-semibold text-primary">
            Review Decision
          </h3>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Internal review notes (optional)"
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 bg-accent text-white font-medium py-3 rounded-xl disabled:opacity-60"
            >
              <FiCheck /> Approve
            </button>
            <button
              onClick={handleReject}
              disabled={isProcessing}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white font-medium py-3 rounded-xl disabled:opacity-60"
            >
              <FiX /> Reject
            </button>
          </div>
        </div>
      )}

      {app.status !== "pending" && app.reviewNotes && (
        <div className="card p-6">
          <h3 className="font-display font-semibold text-primary mb-2">
            Review Notes
          </h3>
          <p className="text-gray-600 text-sm">{app.reviewNotes}</p>
          <p className="text-gray-400 text-xs mt-2">
            Reviewed on {formatDate(app.reviewedAt)}
          </p>
        </div>
      )}
    </div>
  );
}
