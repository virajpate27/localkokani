// src/lib/services/restaurantService.js
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

const COLLECTION = "restaurants";

// ─────────────────────────────────────────────
// PUBLIC READ QUERIES
// ─────────────────────────────────────────────

export async function getAllRestaurants() {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("status", "==", "active"),
      orderBy("createdAt", "desc")
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getFeaturedRestaurants(limitCount = 4) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("featured", "==", true),
      where("status", "==", "active"),
      fbLimit(limitCount)
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getRestaurantsByDestination(destinationId) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("destinationId", "==", destinationId),
      where("status", "==", "active"),
      orderBy("rating", "desc")
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getRestaurantBySlug(slug) {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where("slug", "==", slug), fbLimit(1))
  );
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return serializeDoc({ id: docSnap.id, ...docSnap.data() });
}

export async function getRestaurantById(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? serializeDoc({ id: docSnap.id, ...docSnap.data() }) : null;
}

// ─────────────────────────────────────────────
// ADMIN QUERIES
// ─────────────────────────────────────────────

export async function getAllRestaurantsAdmin() {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy("createdAt", "desc"))
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

// ─────────────────────────────────────────────
// WRITE OPERATIONS
// ─────────────────────────────────────────────

export async function createRestaurant(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    rating: data.rating || 0,
    reviewCount: 0,
    status: data.status || "active",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateRestaurant(id, data) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteRestaurant(id) {
  const docRef = doc(db, COLLECTION, id);
  return deleteDoc(docRef);
}

export async function archiveRestaurant(id) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { status: "archived", updatedAt: serverTimestamp() });
}

export async function restoreRestaurant(id) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { status: "active", updatedAt: serverTimestamp() });
}