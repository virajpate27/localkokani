// src/lib/services/settingsService.js
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeDoc } from "@/utils/helpers";

const DOC_ID = "homepage";
const COLLECTION = "siteSettings";

export async function getSiteSettings() {
  const docRef = doc(db, COLLECTION, DOC_ID);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return { heroImage: null, logo: null };
  return serializeDoc({ id: docSnap.id, ...docSnap.data() });
}

export async function updateSiteSettings(data) {
  const docRef = doc(db, COLLECTION, DOC_ID);
  return setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}