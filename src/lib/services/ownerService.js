// src/lib/services/ownerService.js
import { collection, doc, getDocs, getDoc, query, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { serializeDoc, serializeDocs } from "@/utils/helpers";
import { getApplicationsByOwner } from "./partnerService";

const COLLECTION = "owners";

export async function getAllOwnersAdmin() {
  const snap = await getDocs(query(collection(db, COLLECTION), orderBy("createdAt", "desc")));
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
}

export async function getOwnerById(uid) {
  const docRef = doc(db, COLLECTION, uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? serializeDoc({ id: docSnap.id, ...docSnap.data() }) : null;
}

// Combines an owner's profile with a summary of their applications —
// used to enrich the admin list view without a separate query per row for the count badge.
export async function getAllOwnersWithStats() {
  const owners = await getAllOwnersAdmin();

  const enriched = await Promise.all(
    owners.map(async (owner) => {
      const applications = await getApplicationsByOwner(owner.uid);
      return {
        ...owner,
        applicationCount: applications.length,
        approvedCount: applications.filter((a) => a.status === "approved").length,
        pendingCount: applications.filter((a) => a.status === "pending").length,
        rejectedCount: applications.filter((a) => a.status === "rejected").length,
        latestApplication: applications[0] || null, // already sorted by createdAt desc
      };
    })
  );

  return enriched;
}