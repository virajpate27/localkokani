// src/app/restaurants/[slug]/page.js
import { notFound } from "next/navigation";
import { FiMapPin, FiStar, FiClock } from "react-icons/fi";
import { FaRupeeSign } from "react-icons/fa";
import {
  getRestaurantBySlug,
  getAllRestaurants,
} from "@/lib/services/restaurantService";
import HotelGallery from "@/components/hotels/HotelGallery"; // reused — generic image gallery
import AmenitiesGrid from "@/components/hotels/AmenitiesGrid"; // reused for cuisine tags display
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import ReservationForm from "@/components/restaurants/ReservationForm";
import JsonLd from "@/components/ui/JsonLd";
import { formatCurrency } from "@/utils/helpers";
import { getApprovedReviewsForEntity } from "@/lib/services/reviewService";
import ReviewsList from "@/components/reviews/ReviewsList";
import ReviewForm from "@/components/reviews/ReviewForm";
import WishlistButton from "@/components/ui/WishlistButton";
import CuisineGrid from "@/components/restaurants/CuisineGrid";
import { isValidGoogleMapsEmbedUrl } from "@/utils/helpers";
import VerifiedBadge from "@/components/ui/VerifiedBadge";
import CustomBadge from "@/components/ui/CustomBadge";
export const revalidate = 1800;

export async function generateStaticParams() {
  const restaurants = await getAllRestaurants();
  return restaurants.map((r) => ({ slug: r.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) return { title: "Restaurant Not Found | StayFinder" };

  const title = `${restaurant.name} | ${restaurant.destinationName} | StayFinder`;
  const description =
    restaurant.description?.slice(0, 155) ||
    `Reserve a table at ${restaurant.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/restaurants/${restaurant.slug}` },
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function RestaurantDetailPage({ params }) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) notFound();

  const reviews = await getApprovedReviewsForEntity(
    "restaurant",
    restaurant.id,
  );

  const restaurantSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description || "",
    address: {
      "@type": "PostalAddress",
      streetAddress: restaurant.address || "",
      addressLocality: restaurant.destinationName || "",
      addressCountry: "IN",
    },
    servesCuisine: restaurant.cuisine || [],
    priceRange: restaurant.priceRange || "$$",
    image: restaurant.images?.[0]?.url,
    ...(restaurant.rating > 0 && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: restaurant.rating,
        reviewCount: restaurant.reviewCount || 1,
        bestRating: 5,
        worstRating: 1,
      },
    }),
  };
  return (
    <>
      <JsonLd data={restaurantSchema} />

      <div className="bg-white">
        <Breadcrumbs
          items={[
            { name: "Restaurants", url: "/restaurants" },
            { name: restaurant.name, url: `/restaurants/${restaurant.slug}` },
          ]}
        />
      </div>

      <div className="container-custom py-8 pb-24 lg:pb-8">
        <div className="mb-6">
          <p className="flex items-center gap-1.5 text-secondary font-medium text-sm uppercase tracking-wide">
            <FiMapPin /> {restaurant.destinationName}
          </p>
          <div className="flex flex-wrap items-center justify-between gap-3 mt-2">
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <h1 className="font-display font-extrabold text-3xl md:text-4xl text-primary">
                {restaurant.name}
              </h1>
              {restaurant.verified && <VerifiedBadge />}
              <CustomBadge
                text={restaurant.customBadgeText}
                color={restaurant.customBadgeColor}
                position="inline"
              />
              {restaurant.rating > 0 && (
                <div className="flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg">
                  <FiStar className="text-accent fill-accent text-sm" />
                  <span className="font-semibold text-primary text-sm">
                    {restaurant.rating}
                  </span>
                </div>
              )}
            </div>
            <WishlistButton
              item={restaurant}
              entityType="restaurant"
              size="text-xl"
              className="!bg-gray-100 shadow-none"
            />
          </div>
          <p className="text-gray-500 mt-1">{restaurant.address}</p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3">
            <p className="flex items-center gap-1.5 text-gray-600 text-sm font-medium">
              {restaurant.costForTwo
                ? `${formatCurrency(restaurant.costForTwo)} for two (Approx.)`
                : restaurant.priceRange}
            </p>
            {restaurant.openingHours && (
              <p className="flex items-center gap-1.5 text-gray-500 text-sm">
                <FiClock className="text-secondary" /> {restaurant.openingHours}
              </p>
            )}
          </div>
        </div>

        <HotelGallery images={restaurant.images} hotelName={restaurant.name} />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 mt-10">
          <div className="space-y-10 order-2 lg:order-1">
            <div>
              <h2 className="font-display font-bold text-2xl text-primary mb-4">
                About
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                {restaurant.description}
              </p>
            </div>

            {restaurant.cuisine?.length > 0 && (
              <div>
                <h2 className="font-display font-bold text-2xl text-primary mb-4">
                  Cuisine
                </h2>
                <CuisineGrid cuisine={restaurant.cuisine} />
              </div>
            )}

            {(restaurant.mapEmbedUrl ||
              (restaurant.location?.lat && restaurant.location?.lng)) && (
              <div>
                <h2 className="font-display font-bold text-2xl text-primary mb-4">
                  Location
                </h2>
                <div className="rounded-2xl overflow-hidden aspect-[16/9] border border-gray-100">
                  <iframe
                    title={`Map location of ${restaurant.name}`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={
                      restaurant.mapEmbedUrl &&
                      isValidGoogleMapsEmbedUrl(restaurant.mapEmbedUrl)
                        ? restaurant.mapEmbedUrl
                        : `https://www.google.com/maps?q=${restaurant.location.lat},${restaurant.location.lng}&z=15&output=embed`
                    }
                  />
                </div>
              </div>
            )}

            {/* NEW: Reviews section */}
            <div>
              <h2 className="font-display font-bold text-2xl text-primary mb-4">
                Guest Reviews {reviews.length > 0 && `(${reviews.length})`}
              </h2>
              <div className="space-y-6">
                <ReviewsList reviews={reviews} />
                <ReviewForm entityType="restaurant" entity={restaurant} />
              </div>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <div className="card p-6 lg:sticky lg:top-24">
              <h3 className="font-display font-semibold text-primary mb-4">
                Reserve a Table
              </h3>
              <ReservationForm restaurant={restaurant} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
