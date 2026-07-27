// src/app/hotels/page.js
import { getAllHotels } from "@/lib/services/hotelService";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import HotelsFilterGrid from "@/components/hotels/HotelsFilterGrid";

export const revalidate = 50; // 30 min — hotels list changes more often than destinations



export default async function HotelsPage() {


  return (
    <>
      

      <section className="bg-hero-gradient py-14">
        <div className="container-custom text-center">
          <span className="inline-block bg-white/10 backdrop-blur-sm text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-4">
            Hotels
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

    </>
  );
}