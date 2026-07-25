// src/app/page.js
import Hero from "@/components/home/Hero";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import FeaturedHotels from "@/components/home/FeaturedHotels";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";
import CtaBanner from "@/components/home/CtaBanner";

export const metadata = {
  title: "StayFinder | Book Hotels & Explore Top Destinations",
  description:
    "Discover handpicked hotels across top destinations. Best prices, verified stays, instant WhatsApp booking assistance.",
};

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedDestinations />
      <FeaturedHotels />
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner />
    </>
  );
}