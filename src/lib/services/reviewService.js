// src/lib/services/reviewService.js
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeDocs } from "@/utils/helpers";
import { updateHotel } from "./hotelService";
import { updateRestaurant } from "./restaurantService";

const COLLECTION = "reviews";

// Public: only approved reviews for a specific entity (hotel OR restaurant), newest first
export async function getApprovedReviewsForEntity(entityType, entityId) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("entityType", "==", entityType),
      where("entityId", "==", entityId),
      where("approved", "==", true),
      orderBy("createdAt", "desc")
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// Backward-compatible wrapper — keeps existing hotel pages working unchanged
export async function getApprovedReviewsForHotel(hotelId) {
  return getApprovedReviewsForEntity("hotel", hotelId);
}

export async function getApprovedReviewsForRestaurant(restaurantId) {
  return getApprovedReviewsForEntity("restaurant", restaurantId);
}

// Admin: all reviews regardless of approval status, across both entity types
export async function getAllReviewsAdmin() {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy("createdAt", "desc"))
  );
  return serializeDocs(
    snap.docs.map((d) => {
      const data = d.data();
      // Normalize old-format hotel reviews (pre-migration) to the new shared shape
      return {
        id: d.id,
        entityType: data.entityType || "hotel", // old reviews had no entityType — assume hotel
        entityId: data.entityId || data.hotelId,
        entitySlug: data.entitySlug || data.hotelSlug,
        entityName: data.entityName || data.hotelName,
        guestName: data.guestName,
        rating: data.rating,
        comment: data.comment,
        approved: data.approved,
        createdAt: data.createdAt,
      };
    })
  );
}

export async function createReview(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    approved: false,
    createdAt: serverTimestamp(),
  });
}

export async function approveReview(reviewId, entityType, entityId) {
  const docRef = doc(db, COLLECTION, reviewId);
  await updateDoc(docRef, { approved: true });
  await recalculateEntityRating(entityType, entityId);
}

export async function rejectReview(reviewId, entityType, entityId) {
  await deleteReview(reviewId);
  await recalculateEntityRating(entityType, entityId);
}

export async function deleteReview(reviewId) {
  const docRef = doc(db, COLLECTION, reviewId);
  return deleteDoc(docRef);
}

// Recalculates rating/reviewCount for either a hotel or a restaurant
export async function recalculateEntityRating(entityType, entityId) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("entityType", "==", entityType),
      where("entityId", "==", entityId),
      where("approved", "==", true)
    )
  );

  const reviews = snap.docs.map((d) => d.data());
  const reviewCount = reviews.length;

  if (reviewCount === 0) return; // don't wipe an admin-set manual rating

  const avgRating = reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount;
  const roundedRating = Math.round(avgRating * 10) / 10;

  if (entityType === "hotel") {
    await updateHotel(entityId, { rating: roundedRating, reviewCount });
  } else if (entityType === "restaurant") {
    await updateRestaurant(entityId, { rating: roundedRating, reviewCount });
  }
}