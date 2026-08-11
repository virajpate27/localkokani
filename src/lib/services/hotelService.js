// src/lib/services/hotelService.js
import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit as fbLimit,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeDoc, serializeDocs } from "@/utils/helpers";

const COLLECTION = "hotels";

// ─────────────────────────────────────────────
// PUBLIC READ QUERIES
// ─────────────────────────────────────────────

// All active hotels — used on /hotels listing page
export async function getAllHotels() {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// Featured hotels only — used on homepage
export async function getFeaturedHotels(limitCount = 4) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("featured", "==", true),
      where("status", "==", "active"),
      orderBy("featuredPromotedAt", "desc"), // ⬅️ ADD — newest promotion first
      fbLimit(limitCount)
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// Hotels within a specific destination — used on /destinations/[slug]
export async function getHotelsByDestination(destinationId) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("destinationId", "==", destinationId),
      where("status", "==", "active"),
      orderBy("price", "asc")
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// Single hotel by slug — used on /hotels/[slug] (Day 11)
export async function getHotelBySlug(slug) {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where("slug", "==", slug), fbLimit(1))
  );
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return serializeDoc({ id: docSnap.id, ...docSnap.data() });
}

// Single hotel by Firestore document ID — used in admin edit forms
export async function getHotelById(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? serializeDoc({ id: docSnap.id, ...docSnap.data() })
    : null;
}

// ─────────────────────────────────────────────
// ADMIN QUERIES
// ─────────────────────────────────────────────

// All hotels regardless of status (includes drafts) — used in admin panel
export async function getAllHotelsAdmin() {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy("createdAt", "desc"))
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// ─────────────────────────────────────────────
// WRITE OPERATIONS
// ─────────────────────────────────────────────

export async function createHotel(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    rating: data.rating || 0,
    reviewCount: 0,
    status: data.status || "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateHotel(id, data) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteHotel(id) {
  const docRef = doc(db, COLLECTION, id);
  return deleteDoc(docRef);
}

export async function archiveHotel(id) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { status: "archived", updatedAt: serverTimestamp() });
}

export async function restoreHotel(id) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { status: "active", updatedAt: serverTimestamp() });
}

export async function getSponsoredHotelsByDestination(destinationId, limitCount = 6) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("destinationId", "==", destinationId),
      where("sponsored", "==", true),
      where("status", "==", "active"),
      orderBy("sponsoredPromotedAt", "desc"), // ⬅️ ADD
      fbLimit(limitCount)
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getHotelsByOwner(ownerId) {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where("ownerId", "==", ownerId), orderBy("createdAt", "desc"))
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}


