// src/lib/services/destinationService.js
import { serializeDocs, serializeDoc } from "@/utils/helpers";

// ... update each function's return statement:

export async function getAllDestinations() {
  const snap = await getDocs(
    query(collection(db, COLLECTION), orderBy("name", "asc"))
  );
  return serializeDocs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
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