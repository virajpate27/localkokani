// src/components/wishlist/WishlistPageClient.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { FiHeart, FiStar, FiTrash2, FiArrowRight, FiHome, FiCoffee } from "react-icons/fi";
import { useWishlist } from "@/context/WishlistContext";
import { formatCurrency } from "@/utils/helpers";
import EmptyState from "@/components/ui/EmptyState";

export default function WishlistPageClient() {
  const { wishlist, isLoaded, removeFromWishlist, clearWishlist } = useWishlist();

  return (
    <>
      <section className="bg-hero-gradient py-14">
        <div className="container-custom text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
            <FiHeart className="text-accent text-2xl" />
          </div>
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-white">
            My Wishlist
          </h1>
          <p className="text-white/80 mt-3">
            Hotels and restaurants you've saved for later — stored right on this device.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-[50vh]">
        <div className="container-custom">
          {!isLoaded ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="card overflow-hidden animate-pulse">
                  <div className="aspect-[4/3] bg-gray-200" />
                  <div className="p-5 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : wishlist.length === 0 ? (
            <div className="text-center py-10">
              <EmptyState
                title="Your wishlist is empty"
                description="Browse hotels and restaurants and tap the heart icon to save your favorites here."
              />
              <div className="flex justify-center gap-3 mt-6">
                <Link href="/hotels" className="btn-primary inline-flex items-center gap-2">
                  Browse Hotels <FiArrowRight />
                </Link>
                <Link
                  href="/restaurants"
                  className="bg-white border border-gray-200 text-primary font-medium px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  Browse Restaurants <FiArrowRight />
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <p className="text-gray-500 text-sm">
                  <span className="font-semibold text-primary">{wishlist.length}</span>{" "}
                  {wishlist.length === 1 ? "item" : "items"} saved
                </p>
                <button
                  onClick={clearWishlist}
                  className="text-red-400 text-sm font-medium hover:text-red-500 hover:underline"
                >
                  Clear all
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {wishlist.map((item) => {
                  const isRestaurant = item.entityType === "restaurant";
                  const href = isRestaurant ? `/restaurants/${item.slug}` : `/hotels/${item.slug}`;

                  return (
                    <div key={`${item.entityType}-${item.id}`} className="card overflow-hidden group">
                      <Link href={href} className="block">
                        <div className="relative aspect-[4/3] overflow-hidden">
                          {item.image && (
                            <Image
                              src={item.image}
                              alt={item.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                          )}
                          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm text-primary text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
                            {isRestaurant ? <FiCoffee className="text-secondary" /> : <FiHome className="text-secondary" />}
                            {isRestaurant ? "Restaurant" : "Hotel"}
                          </span>
                          {item.rating > 0 && (
                            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg flex items-center gap-1 text-sm font-semibold text-primary shadow-sm">
                              <FiStar className="text-accent fill-accent" />
                              {item.rating}
                            </div>
                          )}
                        </div>
                      </Link>
                      <div className="p-5">
                        <p className="text-secondary text-xs font-medium uppercase tracking-wide">
                          {item.destinationName}
                        </p>
                        <Link href={href}>
                          <h3 className="font-display font-semibold text-lg text-primary mt-1.5 line-clamp-1 hover:text-secondary transition-colors">
                            {item.name}
                          </h3>
                        </Link>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                          <p className="font-display font-bold text-primary">
                            {item.price ? (
                              <>
                                {formatCurrency(item.price)}
                                <span className="text-xs font-normal text-gray-400">
                                  {isRestaurant ? " for two" : " /night"}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-400 text-sm font-normal">Price unavailable</span>
                            )}
                          </p>
                          <button
                            onClick={() => removeFromWishlist(item.id, item.entityType)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                            aria-label="Remove from wishlist"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}