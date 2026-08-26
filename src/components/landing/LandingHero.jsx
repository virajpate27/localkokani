// src/components/landing/LandingHero.jsx
import Image from "next/image";
import Link from "next/link";
import SearchAutosuggest from "@/components/search/SearchAutosuggest";

export default function LandingHero({ h1, subtitle, heroImage, ctaPrimaryText, ctaPrimaryLink, ctaSecondaryText, ctaSecondaryLink }) {
  return (
    <section className="relative overflow-hidden min-h-[70vh] flex items-center">
      <div className="absolute inset-0 -z-10">
        {heroImage?.url && <Image src={heroImage.url} alt={h1} fill priority sizes="100vw" className="object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/60" />
      </div>
      <div className="container-custom relative z-10 py-20 text-center">
        <h1 className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl text-white leading-tight max-w-4xl mx-auto">
          {h1}
        </h1>
        {subtitle && <p className="text-white/85 text-lg mt-5 max-w-2xl mx-auto">{subtitle}</p>}

        <div className="mt-8 bg-white rounded-2xl shadow-2xl p-2 sm:p-3 max-w-2xl mx-auto">
          <SearchAutosuggest variant="hero" placeholder="Search destination or hotel name..." />
        </div>

        <div className="flex flex-wrap justify-center gap-3 mt-8">
          {ctaPrimaryText && (
            <Link href={ctaPrimaryLink || "/hotels"} className="btn-accent">{ctaPrimaryText}</Link>
          )}
          {ctaSecondaryText && (
            <Link href={ctaSecondaryLink || "/destinations"} className="bg-white text-primary font-medium px-6 py-3 rounded-xl hover:bg-white/90 transition-colors">
              {ctaSecondaryText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}