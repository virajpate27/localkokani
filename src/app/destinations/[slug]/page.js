// src/app/destinations/[slug]/page.js
import Image from "next/image";
import { notFound } from "next/navigation";
import { FiMapPin, FiHome, FiStar } from "react-icons/fi";
import { getDestinationBySlug, getAllDestinations } from "@/lib/services/destinationService";
import { getHotelsByDestination } from "@/lib/services/hotelService";
import HotelCard from "@/components/hotels/HotelCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";
import JsonLd from "@/components/ui/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  const destinations = await getAllDestinations();
  return destinations.map((dest) => ({ slug: dest.slug }));
}



export default async function DestinationDetailPage({ params }) {
  const { slug } = await params; 
  const destination = await getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  

  return (
    <>
     
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


      

  
    </>
  );
}