// src/app/destinations/[slug]/page.js
import Image from "next/image";
import { notFound } from "next/navigation";
import { FiMapPin, FiHome } from "react-icons/fi";
import { getDestinationBySlug, getAllDestinations } from "@/lib/services/destinationService";
import { getHotelsByDestination } from "@/lib/services/hotelService";
import { getRestaurantsByDestination } from "@/lib/services/restaurantService";
import HotelsLoadMoreGrid from "@/components/hotels/HotelsLoadMoreGrid";
import RestaurantsLoadMoreGrid from "@/components/restaurants/RestaurantsLoadMoreGrid";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import JsonLd from "@/components/ui/JsonLd";
import { generateDestinationCollectionSchema } from "@/utils/helpers";

export const revalidate = 3600;

export async function generateStaticParams() {
  const destinations = await getAllDestinations();
  return destinations.map((dest) => ({ slug: dest.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    return { title: "Destination Not Found | StayFinder" };
  }

  return {
    title: destination.seo?.metaTitle || `Best Hotels in ${destination.name} | StayFinder`,
    description:
      destination.seo?.metaDescription ||
      `Explore ${destination.hotelCount || "top"} handpicked hotels in ${destination.name}. ${destination.description?.slice(0, 100)}`,
    alternates: { canonical: `/destinations/${destination.slug}` },
    openGraph: {
      title: `Best Hotels in ${destination.name} | StayFinder`,
      description: destination.description,
      images: destination.image?.url ? [destination.image.url] : [],
    },
  };
}

export default async function DestinationDetailPage({ params }) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const hotels = await getHotelsByDestination(destination.id);
  const restaurants = await getRestaurantsByDestination(destination.id);

  const destinationSchema = generateDestinationCollectionSchema(destination, hotels);

  return (
    <>
      <JsonLd data={destinationSchema} />

      <div className="bg-white">
        <Breadcrumbs
          items={[
            { name: "Destinations", url: "/destinations" },
            { name: destination.name, url: `/destinations/${destination.slug}` },
          ]}
        />
      </div>

      <section className="relative h-[45vh] min-h-[350px] overflow-hidden">
        <Image
          src={destination.image?.url || "/placeholder-destination.jpg"}
          alt={`${destination.name}, ${destination.country}`}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 pb-10">
          <div className="container-custom">
            <p className="flex items-center gap-1.5 text-white/80 text-sm font-medium mb-2">
              <FiMapPin /> {destination.country}
            </p>
            <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white">
              {destination.name}
            </h1>
            <p className="flex items-center gap-1.5 text-white/90 text-sm font-medium mt-3">
              <FiHome className="text-accent" />
              {hotels.length} {hotels.length === 1 ? "hotel" : "hotels"} available
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container-custom max-w-3xl">
          <h2 className="font-display font-bold text-2xl text-primary mb-4">
            About {destination.name}
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {destination.description}
          </p>
        </div>
      </section>

      {/* Hotels List */}
      <section className="py-16 bg-gray-50 min-h-[40vh]">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <h2 className="section-title">Hotels in {destination.name}</h2>
            <span className="text-gray-400 text-sm">Sorted by price (low to high)</span>
          </div>

          <HotelsLoadMoreGrid hotels={hotels} destinationName={destination.name} />
        </div>
      </section>

      {/* Restaurants List */}
      {restaurants.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-10">
              <h2 className="section-title">Restaurants in {destination.name}</h2>
              <span className="text-gray-400 text-sm">Sorted by rating (highest first)</span>
            </div>

            <RestaurantsLoadMoreGrid restaurants={restaurants} />
          </div>
        </section>
      )}
    </>
  );
}