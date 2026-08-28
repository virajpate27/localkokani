// src/lib/services/leadService.js
import {
  collection, doc, getDocs, addDoc, updateDoc, deleteDoc, query, orderBy, serverTimestamp, getCountFromServer 
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeDocs } from "@/utils/helpers";

const COLLECTION = "leads";


export async function getNewLeadsCount() {
  const snap = await getCountFromServer(
    query(collection(db, COLLECTION), where("status", "==", "new"))
  );
  return snap.data().count;
}

export async function createLead(data) {
  return addDoc(collection(db, COLLECTION), {
    ...data,
    status: "new",
    createdAt: serverTimestamp(),
  });
}

// Normalizes old-format hotel leads (hotelId/hotelName) alongside new generalized ones
export async function getAllLeads() {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy("createdAt", "desc"))
  );
  return serializeDocs(
    snap.docs.map((d) => {
      const data = d.data();
      return {
        id: d.id,
        entityType: data.entityType || "hotel", // old leads had no entityType — assume hotel
        entityId: data.entityId || data.hotelId,
        entitySlug: data.entitySlug || data.hotelSlug,
        entityName: data.entityName || data.hotelName,
        name: data.name,
        phone: data.phone,
        email: data.email || "",
        checkIn: data.checkIn || "",
        checkOut: data.checkOut || "",
        date: data.date || "",       // restaurant reservation date
        time: data.time || "",       // restaurant reservation time
        guests: data.guests,
        message: data.message || "",
        status: data.status,
        source: data.source,
        createdAt: data.createdAt,
      };
    })
  );
}

export async function updateLeadStatus(id, status) {
  const docRef = doc(db, COLLECTION, id);
  return updateDoc(docRef, { status });
}

export async function deleteLead(id) {
  const docRef = doc(db, COLLECTION, id);
  return deleteDoc(docRef);
}