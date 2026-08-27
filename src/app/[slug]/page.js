// src/app/[slug]/page.js
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  getPublishedLandingPageBySlug, getAllPublishedLandingPages, resolveEntities,
} from "@/lib/services/landingPageService";
import { getHotelById } from "@/lib/services/hotelService";
import { getRestaurantById } from "@/lib/services/restaurantService";
import { getDestinationById } from "@/lib/services/destinationService";
import LandingHero from "@/components/landing/LandingHero";
import WhyBookSection from "@/components/landing/WhyBookSection";
import AttractionsSection from "@/components/landing/AttractionsSection";
import InternalLinksSection from "@/components/landing/InternalLinksSection";
import HotelCard from "@/components/hotels/HotelCard";
import RestaurantCard from "@/components/restaurants/RestaurantCard";
import MarkdownContent from "@/components/blog/MarkdownContent";
import FaqAccordion from "@/components/ui/FaqAccordion";
import JsonLd from "@/components/ui/JsonLd";
import { generateFaqSchema } from "@/utils/helpers";
import Testimonials from "@/components/home/Testimonials";

export const revalidate = 3600;

export async function generateStaticParams() {
  const pages = await getAllPublishedLandingPages();
  return pages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = await getPublishedLandingPageBySlug(slug);
  if (!page) return { title: "Page Not Found" };

  const title = page.seo?.metaTitle || page.h1;
  const description = page.seo?.metaDescription || page.subtitle;

  return {
    title,
    description,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title, description, images: page.heroImage?.url ? [page.heroImage.url] : [] },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function LandingPage({ params }) {
  const { slug } = await params;
  const page = await getPublishedLandingPageBySlug(slug);

  if (!page) notFound();

  const [destinations, hotels, restaurants, getawayDestinations] = await Promise.all([
    resolveEntities(page.destinationsSection?.destinationIds, getDestinationById),
    resolveEntities(page.hotelsSection?.hotelIds, getHotelById),
    resolveEntities(page.restaurantsSection?.restaurantIds, getRestaurantById),
    resolveEntities(page.weekendGetawaysSection?.destinationIds, getDestinationById),
  ]);

  const faqSchema = generateFaqSchema(page.faqs);

  return (
    <>
      {faqSchema && <JsonLd data={faqSchema} />}

      <LandingHero
        h1={page.h1}
        subtitle={page.subtitle}
        heroImage={page.heroImage}
        ctaPrimaryText={page.ctaPrimaryText}
        ctaPrimaryLink={page.ctaPrimaryLink}
        ctaSecondaryText={page.ctaSecondaryText}
        ctaSecondaryLink={page.ctaSecondaryLink}
      />

      {/* Popular Destinations */}
      {destinations.length > 0 && (
        <section className="py-16 ">
          <div className="container-custom">
            <div className="mb-10">
              <h2 className="section-title">{page.destinationsSection.heading}</h2>
              {page.destinationsSection.description && (
                <p className="text-gray-500 mt-3 max-w-2xl">{page.destinationsSection.description}</p>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {destinations.map((dest) => (
                <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-card hover:shadow-card-hover transition-all">
                  {dest.image?.url && (
                    <img src={dest.image.url} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-display font-semibold text-lg">{dest.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Hotels */}
      {hotels.length > 0 && (
        <section className="py-14 bg-blue-50 dark:bg-gray-900">
          <div className="container-custom">
            <div className="mb-10">
              <h2 className="section-title">{page.hotelsSection.heading}</h2>
              {page.hotelsSection.description && (
                <p className="text-gray-500 mt-3 max-w-2xl">{page.hotelsSection.description}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {hotels.map((hotel) => <HotelCard key={hotel.id} hotel={hotel} />)}
            </div>
          </div>
        </section>
      )}

      {/* Featured Restaurants */}
      {restaurants.length > 0 && (
        <section className="py-14">
          <div className="container-custom">
            <div className="mb-10">
              <h2 className="section-title">{page.restaurantsSection.heading}</h2>
              {page.restaurantsSection.description && (
                <p className="text-gray-500 mt-3 max-w-2xl">{page.restaurantsSection.description}</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why Book With Us */}
      <WhyBookSection
        heading={page.whyBookSection?.heading}
        description={page.whyBookSection?.description}
        points={page.whyBookSection?.points}
      />

      {/* Explore Region (long-form markdown) */}
      {page.exploreSection?.content && (
        <section className="py-16 bg-white">
          <div className="container-custom max-w-3xl">
            <h2 className="section-title mb-6">{page.exploreSection.heading}</h2>
            <MarkdownContent content={page.exploreSection.content} />
          </div>
        </section>
      )}

      {/* Popular Attractions */}
      <AttractionsSection heading={page.attractionsSection?.heading} attractions={page.attractionsSection?.attractions} />

      {/* Weekend Getaways */}
      {getawayDestinations.length > 0 && (
        <section className="py-14 bg-blue-50 dark:bg-gray-900">
          <div className="container-custom">
            <div className="mb-10">
              <h2 className="section-title">{page.weekendGetawaysSection.heading}</h2>
              {page.weekendGetawaysSection.description && (
                <p className="text-gray-500 mt-3 max-w-2xl">{page.weekendGetawaysSection.description}</p>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
              {getawayDestinations.map((dest) => (
                <Link key={dest.id} href={`/destinations/${dest.slug}`} className="group relative rounded-2xl overflow-hidden aspect-[3/4] shadow-card hover:shadow-card-hover transition-all">
                  {dest.image?.url && (
                    <img src={dest.image.url} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-display font-semibold text-lg">{dest.name}</h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Customer Reviews (reuses homepage Testimonials for now — shows real testimonial content) */}
      {page.reviewsSection?.heading && (
        <section className="">
         
          <Testimonials />
        </section>
      )}

      {/* Hotel Owners CTA */}
      {page.ownerCtaSection?.heading && (
        <section className="py-16 bg-hero-gradient">
          <div className="container-custom text-center">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-white">{page.ownerCtaSection.heading}</h2>
            {page.ownerCtaSection.description && (
              <p className="text-white/80 mt-3 max-w-lg mx-auto">{page.ownerCtaSection.description}</p>
            )}
            <Link href={page.ownerCtaSection.ctaLink || "/partner-with-us"} className="btn-accent inline-flex items-center gap-2 mt-6">
              {page.ownerCtaSection.ctaText || "Become a Partner"}
            </Link>
          </div>
        </section>
      )}

      {/* FAQ */}
      {page.faqs?.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container-custom max-w-3xl">
            <h2 className="section-title mb-8">Frequently Asked Questions</h2>
            <FaqAccordion faqs={page.faqs} />
          </div>
        </section>
      )}

      {/* SEO Content Section */}
      {page.seoContentSection?.content && (
        <section className="py-16 bg-white">
          <div className="container-custom max-w-3xl">
            {page.seoContentSection.heading && <h2 className="section-title mb-6">{page.seoContentSection.heading}</h2>}
            <MarkdownContent content={page.seoContentSection.content} />
          </div>
        </section>
      )}

      {/* Internal Links */}
      <InternalLinksSection links={page.internalLinks} />
    </>
  );
}