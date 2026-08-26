// src/lib/services/landingPageService.js
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, where, orderBy, limit as fbLimit, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeDoc, serializeDocs } from "@/utils/helpers";

const COLLECTION = "landingPages";

export async function getPublishedLandingPageBySlug(slug) {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("slug", "==", slug),
      where("published", "==", true),
      fbLimit(1)
    )
  );
  if (snap.empty) return null;
  const docSnap = snap.docs[0];
  return serializeDoc({ id: docSnap.id, ...docSnap.data() });
}

export async function getAllPublishedLandingPages() {
  const snap = await getDocs(query(collection(db, COLLECTION), where("published", "==", true)));
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getAllLandingPagesAdmin() {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getLandingPageById(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? serializeDoc({ id: docSnap.id, ...docSnap.data() }) : null;
}

export async function createLandingPage(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updateLandingPage(id, data) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
}

export async function deleteLandingPage(id) {
  const docRef = doc(db, COLLECTION, id);
  return deleteDoc(docRef);
}

// Helper: resolve a list of entity IDs into full documents, preserving order,
// silently skipping any that were deleted since being referenced.
export async function resolveEntities(ids = [], getByIdFn) {
  const results = await Promise.all(ids.map((id) => getByIdFn(id).catch(() => null)));
  return results.filter(Boolean);
}