// src/components/home/CtaBanner.jsx
import Link from 'next/link';
import { FaWhatsapp } from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';

export default function CtaBanner() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent(
    "Hi! I'd like help finding a hotel for my trip."
  );

  return (
    <section className="py-16">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-4xl bg-hero-gradient px-8 py-16 text-center">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="font-display font-bold text-3xl md:text-4xl text-white">
              Can't Decide? Let's Talk.
            </h2>
            <p className="text-white/80 mt-4">
              Message us on WhatsApp and our team will help you find the perfect
              stay within minutes — no forms, no waiting.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mt-8">
              <Link
                href={`https://wa.me/${whatsappNumber}?text=${message}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-accent flex items-center gap-2"
              >
                <FaWhatsapp className="text-lg" /> Chat with Us
              </Link>
              <Link
                href="/destinations"
                className="bg-white dark:bg-gray-900 text-primary dark:text-white font-medium px-6 py-3 rounded-xl hover:bg-white dark:bg-gray-900/90 transition-colors flex items-center gap-2"
              >
                Browse Destinations <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
