// src/lib/services/dashboardService.js
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAllLeads } from "./leadService";

export async function getDashboardStats() {
  const [destinationsCount, hotelsCount, leadsSnap] = await Promise.all([
    getCountFromServer(collection(db, "destinations")),
    getCountFromServer(collection(db, "hotels")),
     getCountFromServer(collection(db, "restaurants")),
    getCountFromServer(collection(db, "leads")),
  ]);

  return {
    destinations: destinationsCount.data().count,
    hotels: hotelsCount.data().count,
    restaurants: restaurantsCount.data().count,
    leads: leadsSnap.data().count,
  };
}

export async function getRecentLeads(limitCount = 5) {
  const allLeads = await getAllLeads(); // already sorted by createdAt desc
  return allLeads.slice(0, limitCount);
}

export async function getNewLeadsCount() {
  const allLeads = await getAllLeads();
  return allLeads.filter((lead) => lead.status === "new").length;
}