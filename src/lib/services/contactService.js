// src/lib/services/contactService.js
import {
  collection, doc, addDoc, getDocs, updateDoc, deleteDoc, query, orderBy, serverTimestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeDocs } from "@/utils/helpers";

const COLLECTION = "contactMessages";

export async function createContactMessage(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
  });
}

export async function getAllContactMessagesAdmin() {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getNewContactMessagesCount() {
  const all = await getAllContactMessagesAdmin();
  return all.filter((m) => m.status === "new").length;
}

export async function updateContactMessageStatus(id, status) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { status });
}

export async function deleteContactMessage(id) {
  const docRef = doc(db, COLLECTION, id);
  return deleteDoc(docRef);
}