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
import { updateHotel, getHotelById } from "./hotelService";

const COLLECTION = "reviews";

// Public: only approved reviews for a specific hotel, newest first
export async function getApprovedReviewsForHotel(hotelId) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("hotelId", "==", hotelId),
      where("approved", "==", true),
      orderBy("createdAt", "desc")
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// Admin: all reviews regardless of approval status
export async function getAllReviewsAdmin() {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy("createdAt", "desc"))
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function createReview(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    approved: false, // requires admin approval before showing publicly
    createdAt: serverTimestamp(),
  });
}

export async function approveReview(reviewId, hotelId) {
  const docRef = doc(db, COLLECTION, reviewId);
  await updateDoc(docRef, { approved: true });
  await recalculateHotelRating(hotelId);
}

export async function rejectReview(reviewId, hotelId) {
  // "Reject" just deletes it — rejected reviews have no value to keep around
  await deleteReview(reviewId);
  await recalculateHotelRating(hotelId);
}

export async function deleteReview(reviewId) {
  const docRef = doc(db, COLLECTION, reviewId);
  return deleteDoc(docRef);
}

// Recalculates hotel.rating and hotel.reviewCount from all APPROVED reviews
export async function recalculateHotelRating(hotelId) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("hotelId", "==", hotelId),
      where("approved", "==", true)
    )
  );

  const reviews = snap.docs.map((d) => d.data());
  const reviewCount = reviews.length;

  if (reviewCount === 0) {
    // No approved reviews — don't wipe out an admin-set manual rating
    return;
  }

  const avgRating =
    reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviewCount;

  await updateHotel(hotelId, {
    rating: Math.round(avgRating * 10) / 10, // round to 1 decimal
    reviewCount,
  });
}