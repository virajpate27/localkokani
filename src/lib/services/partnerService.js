// src/lib/services/partnerService.js
import {
  collection, doc, getDocs, getDoc, addDoc, updateDoc, deleteDoc,
  query, orderBy, where, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeDoc, serializeDocs } from "@/utils/helpers";

const COLLECTION = "partnerApplications";

export function generateRegistrationId() {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `REG-${ts}-${rand}`;
}

function generatePartnerId() {
  const ts = Date.now().toString(36).toUpperCase();
  return `PTR-${ts}`;
}

export async function createPartnerApplication(data, ownerId) {
  const registrationId = generateRegistrationId();
  const docRef = await addDoc(collection(db, COLLECTION), {
    ...data,
    ownerId,
    registrationId,
    partnerId: null,
    status: "pending",
    submittedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    reviewedAt: null,
    reviewNotes: "",
  });
  return { id: docRef.id, registrationId };
}

export async function getAllPartnerApplicationsAdmin() {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy("createdAt", "desc"))
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getPartnerApplicationsByStatus(status) {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where("status", "==", status), orderBy("createdAt", "desc"))
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getPartnerApplicationById(id) {
  const docRef = doc(db, COLLECTION, id);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? serializeDoc({ id: docSnap.id, ...docSnap.data() }) : null;
}

export async function approvePartnerApplication(id, reviewNotes = "") {
  const partnerId = generatePartnerId();
  const docRef = doc(db, COLLECTION, id);
  await updateDoc(docRef, {
    status: "approved",
    partnerId,
    reviewNotes,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return partnerId;
}

export async function rejectPartnerApplication(id, reviewNotes = "") {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, {
    status: "rejected",
    reviewNotes,
    reviewedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function getPendingPartnerApplicationsCount() {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where("status", "==", "pending"))
  );
  return snap.size;
}

export async function deletePartnerApplication(id) {
  const docRef = doc(db, COLLECTION, id);
  return deleteDoc(docRef);
}

export async function getApplicationsByOwner(ownerId) {
  const snap = await getDocs(
    query(collection(db, COLLECTION), where("ownerId", "==", ownerId), orderBy("createdAt", "desc"))
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}