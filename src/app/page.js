// src/app/page.js
import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import FeaturedDestinations from "@/components/home/FeaturedDestinations";
import FeaturedHotels from "@/components/home/FeaturedHotels";
import FeaturedRestaurants from "@/components/home/FeaturedRestaurants";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import CtaBanner from "@/components/home/CtaBanner";


// Dynamically import Testimonials since Swiper's JS isn't needed until scrolled into view
const Testimonials = dynamic(() => import("@/components/home/Testimonials"), {
  loading: () => <div className="h-96 bg-gray-50 dark:bg-gray-950" />, // prevents layout shift while chunk loads
});


export const revalidate = 3600; // regenerate page every 1 hour




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
      <FeaturedRestaurants />
      <WhyChooseUs />
      <Testimonials />
      <CtaBanner />
    </>
  );
}