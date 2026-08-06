// src/components/home/Hero.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch, FiMapPin, FiCalendar, FiUsers } from "react-icons/fi";
import SearchAutosuggest from "@/components/search/SearchAutosuggest";

export default function Hero() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="relative overflow-hidden bg-hero-gradient min-h-[85vh] flex items-center">
      <div className="absolute top-20 -right-20 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 -left-20 w-72 h-72 bg-secondary/30 rounded-full blur-3xl" />

      <div className="container-custom relative z-10 py-24 text-center">
        <span className="inline-block bg-white dark:bg-gray-900/10 backdrop-blur-sm text-secondary dark:text-white/90 text-sm font-medium px-4 py-1.5 rounded-full mb-6 animate-fade-in">
          ✨ Trusted by 10,000+ happy travelers
        </span>

        <h1 className="font-display font-extrabold text-3xl xs:text-4xl sm:text-5xl md:text-6xl text-white leading-tight max-w-4xl mx-auto animate-slide-up">
          Find Your Perfect Stay,
          <br />
          <span className="text-accent">Anywhere You Go</span>
        </h1>

        <p className="text-white/80 text-lg mt-6 max-w-xl mx-auto animate-slide-up">
          Handpicked hotels, honest prices, and real people to help you book —
          no hidden fees, ever.
        </p>

        <div className="mt-10 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-2 sm:p-3 max-w-2xl mx-auto animate-slide-up">
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