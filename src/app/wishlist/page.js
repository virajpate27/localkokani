// src/app/wishlist/page.js
export const metadata = {
  title: "My Wishlist | Local Kokani",
  robots: { index: false, follow: true },
};

import WishlistPageClient from "@/components/wishlist/WishlistPageClient";

export default function WishlistPage() {
  return <WishlistPageClient />;
}