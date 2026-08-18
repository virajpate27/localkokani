// src/app/sitemap.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://localkokani.vercel.app";

export default async function sitemap() {
  const staticRoutes = [
    { url: `${BASE_URL}/`, changeFrequency: "daily", priority: 1, lastModified: new Date() },
    { url: `${BASE_URL}/destinations`, changeFrequency: "daily", priority: 0.9, lastModified: new Date() },
    { url: `${BASE_URL}/hotels`, changeFrequency: "daily", priority: 0.9, lastModified: new Date() },
    { url: `${BASE_URL}/restaurants`, changeFrequency: "daily", priority: 0.9, lastModified: new Date() },
    { url: `${BASE_URL}/blog`, changeFrequency: "weekly", priority: 0.7, lastModified: new Date() },
    { url: `${BASE_URL}/about`, changeFrequency: "monthly", priority: 0.5, lastModified: new Date() },
    { url: `${BASE_URL}/contact`, changeFrequency: "monthly", priority: 0.5, lastModified: new Date() },
    { url: `${BASE_URL}/privacy-policy`, changeFrequency: "yearly", priority: 0.3, lastModified: new Date() },
    { url: `${BASE_URL}/terms`, changeFrequency: "yearly", priority: 0.3, lastModified: new Date() },
    { url: `${BASE_URL}/partner-with-us`, changeFrequency: "monthly", priority: 0.5, lastModified: new Date() },
  ];

  let destinationRoutes = [];
  let hotelRoutes = [];
  let restaurantRoutes = [];
  let blogRoutes = [];

  try {
    // Destinations — exclude archived
    const destSnap = await getDocs(collection(db, "destinations"));
    destinationRoutes = destSnap.docs
      .filter((doc) => !doc.data().archived)
      .map((doc) => ({
        url: `${BASE_URL}/destinations/${doc.data().slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
        lastModified: doc.data().updatedAt?.toDate() || new Date(),
      }));

    // Hotels — only active status
    const hotelSnap = await getDocs(collection(db, "hotels"));
    hotelRoutes = hotelSnap.docs
      .filter((doc) => doc.data().status === "active")
      .map((doc) => ({
        url: `${BASE_URL}/hotels/${doc.data().slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
        lastModified: doc.data().updatedAt?.toDate() || new Date(),
      }));

    // Restaurants — only active status
    const restaurantSnap = await getDocs(collection(db, "restaurants"));
    restaurantRoutes = restaurantSnap.docs
      .filter((doc) => doc.data().status === "active")
      .map((doc) => ({
        url: `${BASE_URL}/restaurants/${doc.data().slug}`,
        changeFrequency: "weekly",
        priority: 0.7,
        lastModified: doc.data().updatedAt?.toDate() || new Date(),
      }));

    // Blog posts — only published
    const postSnap = await getDocs(collection(db, "posts"));
    blogRoutes = postSnap.docs
      .filter((doc) => doc.data().published === true)
      .map((doc) => ({
        url: `${BASE_URL}/blog/${doc.data().slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
        lastModified: doc.data().updatedAt?.toDate() || new Date(),
      }));
  } catch (err) {
    console.error("Sitemap generation error:", err);
  }

  return [
    ...staticRoutes,
    ...destinationRoutes,
    ...hotelRoutes,
    ...restaurantRoutes,
    ...blogRoutes,
  ];
}