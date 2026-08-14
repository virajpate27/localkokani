// src/lib/services/promotionService.js
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, setDoc, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeDoc, serializeDocs } from "@/utils/helpers";
import { updateHotel } from "./hotelService";
import { updateRestaurant } from "./restaurantService";

export const DURATIONS = [
  { key: "week1", label: "1 Week", days: 7 },
  { key: "week2", label: "2 Weeks", days: 14 },
  { key: "week3", label: "3 Weeks", days: 21 },
  { key: "month1", label: "1 Month", days: 30 },
];

const PRICING_COLLECTION = "promotionPricing";
const REQUESTS_COLLECTION = "promotionRequests";

const DEFAULT_PRICING = {
  sponsored: { week1: 1500, week2: 2700, week3: 3900, month1: 4500 },
  featured: { week1: 1000, week2: 1700, week3: 2500, month1: 3000 },
};

// ─────────────────────────────────────────────
// PRICING
// ─────────────────────────────────────────────

export async function getPromotionPricing() {
  const docRef = doc(db, PRICING_COLLECTION, "config");
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return DEFAULT_PRICING;
  return docSnap.data();
}

export async function updatePromotionPricing(pricing) {
  const docRef = doc(db, PRICING_COLLECTION, "config");
  return setDoc(docRef, { ...pricing, updatedAt: serverTimestamp() }, { merge: true });
}

export function addDays(dateString, days) {
  const date = new Date(dateString);
  date.setDate(date.getDate() + days);
  return date.toISOString().split("T")[0];
}

function todayString() {
  return new Date().toISOString().split("T")[0];
}

// ─────────────────────────────────────────────
// REQUESTS
// ─────────────────────────────────────────────

export async function createPromotionRequest(data) {
  const durationConfig = DURATIONS.find((d) => d.key === data.duration);
  const endDate = addDays(data.startDate, durationConfig.days);

  return addDoc(collection(db, REQUESTS_COLLECTION), {
    ...data,
    durationLabel: durationConfig.label,
    durationDays: durationConfig.days,
    endDate,
    status: "pending_payment",
    adminNotes: "",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    approvedAt: null,
  });
}

export async function getAllPromotionRequestsAdmin() {
  const snap = await getDocs(query(collection(db, REQUESTS_COLLECTION), orderBy("createdAt", "desc")));
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getPromotionRequestsByOwner(ownerId) {
  const snap = await getDocs(
    query(collection(db, REQUESTS_COLLECTION), where("ownerId", "==", ownerId), orderBy("createdAt", "desc"))
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// Approve — confirms payment received, activates the promotion on the actual listing
export async function approvePromotionRequest(requestId, request, adminNotes = "") {

  const conflictSnap = await getDocs(
    query(
      collection(db, REQUESTS_COLLECTION),
      where("entityId", "==", request.entityId),
      where("promotionType", "==", request.promotionType),
      where("status", "in", ["scheduled", "active"])
    )
  );

  const hasRealOverlap = conflictSnap.docs.some((d) => {
    if (d.id === requestId) return false; // don't compare against itself
    const other = d.data();
    // Two date ranges overlap if: this.startDate <= other.endDate AND this.endDate >= other.startDate
    return request.startDate <= other.endDate && request.endDate >= other.startDate;
  });

  if (hasRealOverlap) {
    throw new Error("This listing already has an overlapping active or scheduled promotion of this type.");
  }

  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  const today = todayString();
  const isStartingNow = request.startDate <= today;

  await updateDoc(docRef, {
    status: isStartingNow ? "active" : "scheduled",
    adminNotes,
    approvedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  if (isStartingNow) {
    const untilField = request.promotionType === "featured" ? "featuredUntil" : "sponsoredUntil";
    const promotedAtField = request.promotionType === "featured" ? "featuredPromotedAt" : "sponsoredPromotedAt";
    const flagField = request.promotionType;
    const updateFn = request.entityType === "hotel" ? updateHotel : updateRestaurant;
    await updateFn(request.entityId, {
      [flagField]: true,
      [untilField]: request.endDate,
      [promotedAtField]: serverTimestamp(),
    });
  }

  return isStartingNow ? "active" : "scheduled";
}

export async function activateScheduledPromotions() {
  const snap = await getDocs(query(collection(db, REQUESTS_COLLECTION), where("status", "==", "scheduled")));
  const today = todayString();
  const dueToStart = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((r) => r.startDate <= today);

  for (const request of dueToStart) {
    const untilField = request.promotionType === "featured" ? "featuredUntil" : "sponsoredUntil";
    const promotedAtField = request.promotionType === "featured" ? "featuredPromotedAt" : "sponsoredPromotedAt"; // ⬅️ ADD
    const flagField = request.promotionType;
    const updateFn = request.entityType === "hotel" ? updateHotel : updateRestaurant;

    await updateFn(request.entityId, {
      [flagField]: true,
      [untilField]: request.endDate,
      [promotedAtField]: serverTimestamp(), // ⬅️ ADD
    });
    await updateDoc(doc(db, REQUESTS_COLLECTION, request.id), { status: "active", updatedAt: serverTimestamp() });
  }

  return dueToStart;
}

export async function rejectPromotionRequest(requestId, adminNotes = "") {
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  return updateDoc(docRef, {
    status: "rejected",
    adminNotes,
    updatedAt: serverTimestamp(),
  });
}

// Owner-initiated — only allowed while still pending payment/approval
export async function cancelPromotionRequest(requestId) {
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  return updateDoc(docRef, { status: "cancelled", updatedAt: serverTimestamp() });
}

// Manually end an active promotion early (admin override)
export async function endPromotionEarly(requestId, request) {
  const docRef = doc(db, REQUESTS_COLLECTION, requestId);
  await updateDoc(docRef, { status: "completed", updatedAt: serverTimestamp() });

  const untilField = request.promotionType === "featured" ? "featuredUntil" : "sponsoredUntil";
  const flagField = request.promotionType;
  const updateFn = request.entityType === "hotel" ? updateHotel : updateRestaurant;
  await updateFn(request.entityId, { [flagField]: false, [untilField]: null });
}

// Lazy expiry — call this whenever the admin promotions page loads.
// Finds "active" requests whose endDate has passed and turns off the flag on the listing.
export async function expireOutdatedPromotions() {
  const snap = await getDocs(query(collection(db, REQUESTS_COLLECTION), where("status", "==", "active")));
  const today = todayString();
  const expired = snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((r) => r.endDate < today);

  for (const request of expired) {
    const untilField = request.promotionType === "featured" ? "featuredUntil" : "sponsoredUntil";
    const flagField = request.promotionType;
    const updateFn = request.entityType === "hotel" ? updateHotel : updateRestaurant;

    await updateFn(request.entityId, { [flagField]: false, [untilField]: null });
    await updateDoc(doc(db, REQUESTS_COLLECTION, request.id), {
      status: "completed",
      updatedAt: serverTimestamp(),
    });
  }

  return expired.length;
}

export async function hasActiveOrScheduledPromotion(entityId, promotionType) {
  try {
    const res = await fetch("/api/promotions/check-conflict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ entityId, promotionType }),
    });
    const data = await res.json();
    return data.hasConflict || false;
  } catch (error) {
    console.error("Conflict check failed:", error);
    return false; // fail-open — admin-side approval check still catches real conflicts
  }
}

export async function getPendingPromotionRequestsCount() {
  const snap = await getDocs(
    query(collection(db, REQUESTS_COLLECTION), where("status", "==", "pending_payment"))
  );
  return snap.size;
}

export async function getExtendableRequestsByOwner(ownerId) {
  const snap = await getDocs(
    query(
      collection(db, REQUESTS_COLLECTION),
      where("ownerId", "==", ownerId),
      where("status", "in", ["scheduled", "active"])
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}