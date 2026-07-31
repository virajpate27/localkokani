// src/lib/services/destinationService.js
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
  increment,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeDoc, serializeDocs } from "@/utils/helpers";


const COLLECTION = "destinations";

export async function getAllDestinations() {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy("name", "asc"))
  );
  return serializeDocs(
    snap.docs
      .map((d) => ({
        id: d.id,
        ...d.data(),
        hotelCount: d.data().hotelCount || 0,
        restaurantCount: d.data().restaurantCount || 0, // ⬅️ ADD THIS
      }))
      .filter((d) => !d.archived)
  );
}

export async function getFeaturedDestinations(limitCount = 4) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("featured", "==", true),
      fbLimit(limitCount)
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getDestinationBySlug(slug) {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where("slug", "==", slug), fbLimit(1))
  );
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return serializeDoc({ id: docSnap.id, ...docSnap.data() });
}

export async function getDestinationById(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists()
    ? serializeDoc({ id: docSnap.id, ...docSnap.data() })
    : null;
}

export async function createDestination(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    hotelCount: 0,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateDestination(id, data) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteDestination(id) {
  const docRef = doc(db, COLLECTION, id);
  return deleteDoc(docRef);
}

export async function incrementHotelCount(destinationId, amount = 1) {
  const docRef = doc(db, COLLECTION, destinationId);
  return updateDoc(docRef, { hotelCount: increment(amount) });
}

export async function incrementRestaurantCount(destinationId, amount = 1) {
  const docRef = doc(db, COLLECTION, destinationId);
  return updateDoc(docRef, { restaurantCount: increment(amount) });
}

export async function archiveDestination(id) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { archived: true, featured: false, updatedAt: serverTimestamp() });
}

export async function restoreDestination(id) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { archived: false, updatedAt: serverTimestamp() });
}