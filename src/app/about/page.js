// src/app/about/page.js
import Image from "next/image";
import { FiMapPin, FiHeart, FiUsers, FiTrendingUp } from "react-icons/fi";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

export const metadata = {
  title: "About Us | Local Kokani",
  description: "Learn about Local Kokani's mission to connect travelers with handpicked hotels and restaurants across India.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "50+", label: "Destinations" },
  { value: "300+", label: "Hotels Listed" },
  { value: "10K+", label: "Happy Travelers" },
];

const values = [
  {
    icon: FiHeart,
    title: "Handpicked, Not Automated",
    description: "Every hotel and restaurant on Local Kokani is personally reviewed before it goes live — no bulk listings, no unchecked data.",
  },
  {
    icon: FiUsers,
    title: "Real People, Real Help",
    description: "We connect you directly with property owners over WhatsApp, so you get honest answers, not automated chatbots.",
  },
  {
    icon: FiTrendingUp,
    title: "Growing With Local Partners",
    description: "We work closely with hotel and restaurant owners across India to help them reach more travelers, fairly and transparently.",
  },
];

export default function AboutPage() {
  return (
    <>
      <div className="bg-white">
        <Breadcrumbs items={[{ name: "About Us", url: "/about" }]} />
      </div>

      <section className="bg-hero-gradient py-16">
        <div className="container-custom text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-4">
            <FiMapPin className="text-accent text-2xl" />
          </div>
          <h1 className="font-display font-extrabold text-2xl md:text-3xl text-white">
            About Local Kokani
          </h1>
          <p className="text-white/80 mt-4 max-w-xl mx-auto">
            We're on a mission to make finding your next stay — and your next meal — simple, honest, and human.
          </p>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container-custom max-w-3xl">
          <h2 className="font-display font-bold text-2xl text-primary mb-4">Our Story</h2>
          <div className="space-y-4 text-gray-600 leading-relaxed">
            <p>
              Local Kokani started with a simple frustration: booking a hotel or finding a good local
              restaurant while traveling in India often meant sifting through outdated listings, fake
              reviews, or paying inflated prices through faceless platforms.
            </p>
            <p>
              We set out to build something different — a platform where every listing is real, every
              price is transparent, and every enquiry gets a real human response. No hidden fees, no
              automated runarounds. Just a direct line between travelers and the people who run the
              places they're visiting.
            </p>
            <p>
              Today, Local Kokani helps travelers discover handpicked hotels and restaurants across India's
              most-loved destinations, while giving property owners — many of them small, independent
              businesses — a fair, straightforward way to reach more guests.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center mb-16">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-display font-extrabold text-4xl text-primary">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((value) => (
              <div key={value.title} className="card p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <value.icon className="text-primary text-xl" />
                </div>
                <h3 className="font-display font-semibold text-lg text-primary">{value.title}</h3>
                <p className="text-gray-500 text-sm mt-2 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-hero-gradient">
        <div className="container-custom text-center">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-white">
            Have a hotel or restaurant to list?
          </h2>
          <p className="text-white/80 mt-3 max-w-lg mx-auto">
            Join Local Kokani as a partner and reach thousands of travelers looking for their next stay.
          </p>
          <a href="/partner-with-us" className="btn-accent inline-flex items-center gap-2 mt-6">
            Become a Partner
          </a>
        </div>
      </section>
    </>
  );
}