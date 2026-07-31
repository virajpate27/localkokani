// src/app/sitemap.js
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAllPublishedPosts } from "@/lib/services/blogService";
import { getAllRestaurants } from "@/lib/services/restaurantService";

const BASE_URL = "https://localkokani.vercel.app";

export default async function sitemap() {
  const staticRoutes = [
    {
      url: `${BASE_URL}/`,
      changeFrequency: "daily",
      priority: 1,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/destinations`,
      changeFrequency: "daily",
      priority: 0.9,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/hotels`,
      changeFrequency: "daily",
      priority: 0.9,
      lastModified: new Date(),
    },
  ];

  let destinationRoutes = [];
  let hotelRoutes = [];

  const posts = await getAllPublishedPosts();
  const blogRoutes = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    changeFrequency: "monthly",
    priority: 0.7,
    lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(),
  }));

  const restaurants = await getAllRestaurants();
  const restaurantRoutes = restaurants.map((r) => ({
    url: `${BASE_URL}/restaurants/${r.slug}`,
    changeFrequency: "weekly",
    priority: 0.7,
    lastModified: r.updatedAt ? new Date(r.updatedAt) : new Date(),
  }));

  try {
    const destSnap = await getDocs(collection(db, "destinations"));
    destinationRoutes = destSnap.docs
      .filter((doc) => !doc.data().archived)
      .map((doc) => ({
        url: `${BASE_URL}/destinations/${doc.data().slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
        lastModified: doc.data().updatedAt?.toDate() || new Date(),
      }));

    const hotelSnap = await getDocs(collection(db, "hotels"));
    hotelRoutes = hotelSnap.docs
      .filter((doc) => doc.data().status === "active")
      .map((doc) => ({
        url: `${BASE_URL}/hotels/${doc.data().slug}`,
        changeFrequency: "weekly",
        priority: 0.8,
        lastModified: doc.data().updatedAt?.toDate() || new Date(),
      }));
  } catch (err) {
    console.error("Sitemap generation error:", err);
  }

  return [...staticRoutes, ...destinationRoutes, ...hotelRoutes];
}
