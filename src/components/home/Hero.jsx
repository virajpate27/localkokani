// src/components/home/Hero.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";
import SearchAutosuggest from "@/components/search/SearchAutosuggest";
import Image from "next/image";


const DEFAULT_BANNER = "/images/default-hero-banner.jpg";

export default function Hero({ heroImageUrl }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const bannerSrc = heroImageUrl || DEFAULT_BANNER;

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden min-h-[70vh] sm:min-h-[85vh] flex items-center">
      {/* Banner image layer — continuously zooms via animate-zoom-slow */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={bannerSrc}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover animate-zoom-slow"
        />
        {/* Dark overlay, matches your rgba(2,2,2,0.5) gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/50" />
      </div>

      <div className="container-custom relative z-10 py-16 sm:py-24 text-center">
        <span className="inline-block bg-white/10 backdrop-blur-md text-white/90 text-xs font-medium uppercase px-4 py-1.5 rounded-full mb-6 animate-fade-in">
          ✨ Trusted by 10,000+ happy travelers
        </span>

        <h1 className="font-display font-medium text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white leading-tight max-w-4xl mx-auto animate-slide-up">
          Find Your Perfect Stay,
          <br />
          <span className="text-accent italic">Anywhere You Go</span>
        </h1>

        <p className="text-white/80 text-lg mt-6 max-w-xl mx-auto animate-slide-up">
          Handpicked hotels, honest prices, and real people to help you book —
          no hidden fees, ever.
        </p>

        <div className="mt-10 bg-white rounded-2xl  p-2 sm:p-3 max-w-2xl mx-auto animate-slide-up bx-shadow">
          <SearchAutosuggest variant="hero" placeholder="Search destination or hotel name..." />
        </div>

        <div className="flex flex-wrap justify-center gap-8 sm:gap-14 mt-14 animate-fade-in">
          {[
            { label: "Destinations", value: "50+" },
            { label: "Hotels Listed", value: "300+" },
            { label: "Happy Guests", value: "10K+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display font-bold text-3xl text-white">{stat.value}</p>
              <p className="text-white/70 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}