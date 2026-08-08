// src/app/partner-with-us/page.js
import Link from "next/link";
import { FiCheckCircle, FiArrowRight } from "react-icons/fi";

export const metadata = {
  title: "Partner With Us | StayFinder",
  description: "List your hotel or restaurant on StayFinder and reach more guests.",
};

export default function PartnerLandingPage() {
  return (
    <section className="bg-hero-gradient py-24">
      <div className="container-custom max-w-2xl text-center">
        <h1 className="font-display font-extrabold text-4xl text-white">
          Grow Your Property With StayFinder
        </h1>
        <p className="text-white/80 mt-4">
          Join our platform and connect with travelers looking for their next stay or meal.
        </p>
        <div className="bg-white rounded-2xl p-6 mt-10 text-left">
          {["Free basic listing to get started", "Direct WhatsApp enquiries — no middleman", "Featured & Sponsored placement on Premium"].map((item) => (
            <p key={item} className="flex items-center gap-2.5 text-gray-600 text-sm py-2">
              <FiCheckCircle className="text-accent-dark shrink-0" /> {item}
            </p>
          ))}
        </div>
        <Link href="/partner-with-us/register" className="btn-accent inline-flex items-center gap-2 mt-8">
          Register Your Property <FiArrowRight />
        </Link>
      </div>
    </section>
  );
}