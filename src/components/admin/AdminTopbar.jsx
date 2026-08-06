// src/components/admin/AdminTopbar.jsx
"use client";

import { usePathname } from "next/navigation";

const pageTitles = {
  "/admin": "Dashboard",
  "/admin/destinations": "Destinations",
  "/admin/hotels": "Hotels",
  "/admin/restaurants": "Restaurants",
  "/admin/blog": "Blog",
  "/admin/reviews": "Reviews",
  "/admin/leads": "Leads & Enquiries",
};

export default function AdminTopbar() {
  const pathname = usePathname();

  // Find the best matching title (handles nested routes like /admin/hotels/new later)
  const title =
    pageTitles[pathname] ||
    Object.entries(pageTitles).find(([path]) => pathname?.startsWith(path))?.[1] ||
    "Admin";

  return (
    <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 px-6 lg:px-8 py-5 sticky top-0 z-20">
      <h1 className="font-display font-bold text-xl text-primary dark:text-white pl-12 lg:pl-0">
        {title}
      </h1>
    </div>
  );
}