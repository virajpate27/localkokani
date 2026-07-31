// src/app/destinations/page.js — FINAL VERSION
import Link from "next/link";
import Image from "next/image";
import { FiHome, FiMapPin, FiCoffee } from "react-icons/fi";
import { getAllDestinations } from "@/lib/services/destinationService";
import EmptyState from "@/components/ui/EmptyState";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const revalidate = 3600;

export const metadata = {
  title: "All Destinations | StayFinder",
  description:
    "Browse handpicked destinations across India — from beaches to mountains to heritage cities. Find your perfect hotel in every top location.",
  alternates: { canonical: "/destinations" },
  openGraph: {
    title: "All Destinations | StayFinder",
    description:
      "Browse handpicked destinations across India and find your perfect stay.",
  },
};

export default async function DestinationsPage() {
  const destinations = await getAllDestinations();

  return (
    <>
      <div className="bg-white">
        <Breadcrumbs items={[{ name: "Destinations", url: "/destinations" }]} />
      </div>

      {/* Page Header */}
      <section className="bg-hero-gradient py-16">
        <div className="container-custom text-center">
          <span className="inline-block bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            {destinations.length} Destinations
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white">
            Explore Every Destination
          </h1>
          <p className="text-white/80 mt-4 max-w-xl mx-auto">
            From sun-soaked beaches to snow-capped mountains — find hotels in
            every destination we cover.
          </p>
        </div>
      </section>

      {/* Grid */}
      <section className="py-16 bg-gray-50 min-h-[50vh]">
        <div className="container-custom">
          {destinations.length === 0 ? (
            <EmptyState
              title="No destinations yet"
              description="Check back soon — we're adding new destinations regularly."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((dest) => (
                <Link
                  key={dest.id}
                  href={`/destinations/${dest.slug}`}
                  className="group card overflow-hidden hover:-translate-y-1"
                >
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image
                      src={dest.image?.url}
                      alt={`Hotels in ${dest.name}, ${dest.country}`}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h2 className="font-display font-bold text-2xl">
                        {dest.name}
                      </h2>
                      <p className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
                        <FiMapPin /> {dest.country}
                      </p>
                    </div>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-500 text-sm line-clamp-2">
                      {dest.description}
                    </p>
                  </div>
                  <div className="px-5 pb-5 flex items-center justify-between flex-wrap gap-y-1">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 text-secondary font-medium text-sm">
                        <FiHome /> {dest.hotelCount || 0} hotels
                      </span>
                      {dest.restaurantCount > 0 && (
                        <span className="flex items-center gap-1.5 text-accent-dark font-medium text-sm">
                          <FiCoffee /> {dest.restaurantCount} restaurants
                        </span>
                      )}
                    </div>
                    <span className="text-primary font-medium text-sm group-hover:translate-x-1 transition-transform inline-block">
                      Explore →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
