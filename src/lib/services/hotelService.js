// src/lib/services/hotelService.js
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
  
  const COLLECTION = "hotels";
  
  export async function getAllHotels() {
    const snap = await getDocs(
      query(
        collection(db, COLLECTION),
        where("status", "==", "active"),
        orderBy("createdAt", "desc")
      )
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  
  export async function getFeaturedHotels(limitCount = 4) {
    const snap = await getDocs(
      query(
        collection(db, COLLECTION),
        where("featured", "==", true),
        where("status", "==", "active"),
        fbLimit(limitCount)
      )
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  
  export async function getHotelsByDestination(destinationId) {
    const snap = await getDocs(
      query(
        collection(db, COLLECTION),
        where("destinationId", "==", destinationId),
        where("status", "==", "active"),
        orderBy("price", "asc")
      )
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  
  export async function getHotelBySlug(slug) {
    const snap = await getDocs(
      query(collection(db, COLLECTION), where("slug", "==", slug), fbLimit(1))
    );
    if (snap.empty) return null;
    const docSnap = snap.docs[0];
    return { id: docSnap.id, ...docSnap.data() };
  }
  
  export async function getHotelById(id) {
    const docRef = doc(db, COLLECTION, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  }
  
  // Basic all hotels for admin (includes drafts)
  export async function getAllHotelsAdmin() {
    const snap = await getDocs(
      query(collection(db, COLLECTION), orderBy("createdAt", "desc"))
    );
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  
  export async function createHotel(data) {
    return addDoc(collection(db, COLLECTION), {
      ...data,
      rating: data.rating || 0,
      reviewCount: 0,
      status: data.status || "active",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  
  export async function updateHotel(id, data) {
    const docRef = doc(db, COLLECTION, id);
    return updateDoc(docRef, { ...data, updatedAt: serverTimestamp() });
  }
  
  export async function deleteHotel(id) {
    const docRef = doc(db, COLLECTION, id);
    return deleteDoc(docRef);
  }