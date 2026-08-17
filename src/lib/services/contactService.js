// src/lib/services/contactService.js
import { collection, addDoc, getDocs, query, orderBy, serverTimestamp } from "firebase/firestore";
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