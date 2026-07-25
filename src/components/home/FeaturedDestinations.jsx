// src/components/home/FeaturedDestinations.jsx
import Image from "next/image";
import Link from "next/link";
import { FiArrowRight, FiHome } from "react-icons/fi";
import { placeholderDestinations } from "@/utils/placeholderData";

export default function FeaturedDestinations() {
  const destinations = placeholderDestinations; // Day 7: replace with Firestore fetch

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-secondary font-semibold text-sm uppercase tracking-wider">
              Explore
            </span>
            <h2 className="section-title mt-2">Top Destinations</h2>
          </div>
          <Link
            href="/destinations"
            className="hidden sm:flex items-center gap-2 text-primary font-medium hover:text-secondary transition-colors"
          >
            View all <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {destinations.map((dest) => (
            <Link
              key={dest.id}
              href={`/destinations/${dest.slug}`}
              className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-card hover:shadow-card-hover transition-all duration-300"
            >
              <Image
                src={dest.image}
                alt={`Hotels in ${dest.name}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                <h3 className="font-display font-semibold text-lg">
                  {dest.name}
                </h3>
                <p className="flex items-center gap-1.5 text-white/80 text-sm mt-1">
                  <FiHome className="text-accent" />
                  {dest.hotelCount} hotels
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="sm:hidden mt-6 text-center">
          <Link href="/destinations" className="btn-primary inline-flex items-center gap-2">
            View all destinations <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}