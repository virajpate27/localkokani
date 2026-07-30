// src/lib/services/blogService.js
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

const COLLECTION = "posts";

// Public: published posts only, newest first
export async function getAllPublishedPosts() {
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("published", "==", true), // ✅ already present
      orderBy("publishedAt", "desc")
    )
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getPublishedPostBySlug(slug) {
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

// Related posts — same destination, excluding the current post
export async function getRelatedPosts(destinationSlug, excludeId, limitCount = 3) {
  if (!destinationSlug) return [];
  const snap = await getDocs(
    query(
      collection(db, COLLECTION),
      where("destinationSlug", "==", destinationSlug),
      where("published", "==", true), // ✅ already present — this one is fine
      fbLimit(limitCount + 1)
    )
  );
  return serializeDocs(
    snap.docs
      .map((d) => ({ id: d.id, ...d.data() }))
      .filter((p) => p.id !== excludeId)
      .slice(0, limitCount)
  );
}

// Admin: all posts regardless of published status
export async function getAllPostsAdmin() {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy("createdAt", "desc"))
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getPostById(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? serializeDoc({ id: docSnap.id, ...docSnap.data() }) : null;
}

export async function createPost(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    publishedAt: data.published ? serverTimestamp() : null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updatePost(id, data, wasPublished) {
  const updates = { ...data, updatedAt: serverTimestamp() };
  // Set publishedAt only the first time a post transitions to published
  if (data.published && !wasPublished) {
    updates.publishedAt = serverTimestamp();
  }
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, updates);
}

export async function deletePost(id) {
  const docRef = doc(db, COLLECTION, id);
  return deleteDoc(docRef);
}