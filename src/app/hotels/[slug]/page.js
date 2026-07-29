// src/app/hotels/[slug]/page.js
import { notFound } from "next/navigation";
import { FiMapPin, FiStar, FiCheck } from "react-icons/fi";
import { getHotelBySlug, getAllHotels } from "@/lib/services/hotelService";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import HotelGallery from "@/components/hotels/HotelGallery";
import AmenitiesGrid from "@/components/hotels/AmenitiesGrid";
import RoomTypesList from "@/components/hotels/RoomTypesList";
import BookingSidebar from "@/components/hotels/BookingSidebar";
import JsonLd from "@/components/ui/JsonLd";
import { generateHotelSchema } from "@/utils/helpers";
import MobileStickyBar from "@/components/hotels/MobileStickyBar";
import { getApprovedReviewsForHotel } from "@/lib/services/reviewService";
import ReviewsList from "@/components/hotels/ReviewsList";
import ReviewForm from "@/components/hotels/ReviewForm";

export const revalidate = 1800;

export async function generateStaticParams() {
  const hotels = await getAllHotels();
  return hotels.map((hotel) => ({ slug: hotel.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);

  if (!hotel) {
    return { title: "Hotel Not Found | StayFinder" };
  }

  const title = `${hotel.name} | ${hotel.destinationName} | StayFinder`;
  const description =
    hotel.description?.slice(0, 155) ||
    `Book ${hotel.name} in ${hotel.destinationName}. Verified stay, best price guarantee.`;

  return {
    title,
    description,
    alternates: { canonical: `/hotels/${hotel.slug}` },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function HotelDetailPage({ params }) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);

  if (!hotel) {
    notFound();
  }

   const reviews = await getApprovedReviewsForHotel(hotel.id);
  const hotelSchema = generateHotelSchema(hotel);

  return (
    <>
      <JsonLd data={hotelSchema} />

      <div className="bg-white">
        <Breadcrumbs
          items={[
            { name: "Hotels", url: "/hotels" },
            { name: hotel.name, url: `/hotels/${hotel.slug}` },
          ]}
        />
      </div>

      <div className="container-custom py-8 pb-24 lg:pb-8">
        {/* Header */}
        <div className="mb-6">
          <p className="flex items-center gap-1.5 text-secondary font-medium text-sm uppercase tracking-wide">
            <FiMapPin /> {hotel.destinationName}
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <h1 className="font-display font-extrabold text-3xl md:text-4xl text-primary">
              {hotel.name}
            </h1>
            <div className="flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg">
              <FiStar className="text-accent fill-accent text-sm" />
              <span className="font-semibold text-primary text-sm">
                {hotel.rating}
              </span>
              <span className="text-gray-400 text-xs">
                ({hotel.reviewCount} reviews)
              </span>
            </div>
          </div>
          <p className="text-gray-500 mt-1">{hotel.address}</p>
        </div>

        {/* Gallery */}
        <HotelGallery images={hotel.images} hotelName={hotel.name} />

        {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10 mt-10">
        <div className="space-y-10 order-2 lg:order-1">
          {/* ...description, amenities, room types, map sections stay the same */}

          {/* NEW: Reviews section */}
          <div>
            <h2 className="font-display font-bold text-2xl text-primary mb-4">
              Guest Reviews {reviews.length > 0 && `(${reviews.length})`}
            </h2>
            <div className="space-y-6">
              <ReviewsList reviews={reviews} />
              <ReviewForm hotel={hotel} />
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <BookingSidebar hotel={hotel} />
        </div>
      </div>

      </div>

       <MobileStickyBar hotel={hotel} />
    </>
  );
}