// src/app/sitemap.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const BASE_URL = "https://yourdomain.com";

export default async function sitemap() {
  const staticRoutes = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/destinations`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/hotels`, changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/search`, changeFrequency: "weekly", priority: 0.6 },
  ];

  let destinationRoutes = [];
  let hotelRoutes = [];

  try {
    const destSnap = await getDocs(collection(db, "destinations"));
    destinationRoutes = destSnap.docs.map((doc) => ({
      url: `${BASE_URL}/destinations/${doc.data().slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));

    const hotelSnap = await getDocs(collection(db, "hotels"));
    hotelRoutes = hotelSnap.docs.map((doc) => ({
      url: `${BASE_URL}/hotels/${doc.data().slug}`,
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (err) {
    console.error("Sitemap generation error:", err);
  }

  return [...staticRoutes, ...destinationRoutes, ...hotelRoutes];
}