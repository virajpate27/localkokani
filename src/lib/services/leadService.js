// src/lib/services/leadService.js
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeDocs } from "@/utils/helpers";

const COLLECTION = "leads";

export async function createLead(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
  });
}

export async function getAllLeads() {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy("createdAt", "desc"))
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function updateLeadStatus(id, status) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { status });
}

export async function deleteLead(id) {
  const docRef = doc(db, COLLECTION, id);
  return deleteDoc(docRef);
}