// src/app/hotels/page.js
import { getAllHotels } from "@/lib/services/hotelService";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import HotelsFilterGrid from "@/components/hotels/HotelsFilterGrid";

export const revalidate = 1800; // 30 min — hotels list changes more often than destinations

export const metadata = {
  title: "All Hotels | StayFinder",
  description:
    "Browse our full collection of handpicked hotels across India. Filter by price, rating, and amenities to find your perfect stay.",
  alternates: { canonical: "/hotels" },
  openGraph: {
    title: "All Hotels | StayFinder",
    description: "Browse handpicked hotels across India's top destinations.",
  },
};

export default async function HotelsPage() {
  const hotels = await getAllHotels();

  return (
    <>
      <div className="bg-white">
        <Breadcrumbs items={[{ name: "Hotels", url: "/hotels" }]} />
      </div>

      <section className="bg-hero-gradient py-14">
        <div className="container-custom text-center">
          <span className="inline-block bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            {hotels.length} Hotels
          </span>
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white">
            Find Your Perfect Hotel
          </h1>
          <p className="text-white/80 mt-4 max-w-xl mx-auto">
            Filter by price, rating, or amenities to discover the stay that's
            right for you.
          </p>
        </div>
      </section>

      <section className="py-12 bg-gray-50 min-h-[60vh]">
        <div className="container-custom">
          <HotelsFilterGrid hotels={hotels} />
        </div>
      </section>
    </>
  );
}