// src/components/layout/Footer.jsx

"use client";


import Link from 'next/link';
import {
  FiMapPin,
  FiMail,
  FiPhone,
  FiInstagram,
  FiFacebook,
} from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { usePathname } from "next/navigation";

export default function Footer() {
  const year = new Date().getFullYear();
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
   const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  
  return (
    <footer className="bg-primary text-white mt-24">
      <div className="container-custom py-16 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FiMapPin className="text-accent text-xl" />
            </div>
           <span className="font-display font-bold text-xl sm:text-2xl text-primary whitespace-nowrap">
  Stay<span className="text-accent-dark">Finder</span>
</span>
          </div>
          <p className="text-white/70 text-sm leading-relaxed">
            Handpicked hotels across top destinations. Verified stays, honest
            prices, and real human help — every step of the way.
          </p>
          <div className="flex gap-3 mt-5">
            <a
              href="#"
              aria-label="Instagram"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
            >
              <FiInstagram />
            </a>
            <a
              href="#"
              aria-label="Facebook"
              className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-accent transition-colors"
            >
              <FiFacebook />
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-display font-semibold text-lg mb-4">Explore</h4>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>
              <Link href="/destinations" className="hover:text-accent">
                Destinations
              </Link>
            </li>
            <li>
              <Link href="/hotels" className="hover:text-accent">
                Hotels
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-accent">
                Search
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-lg mb-4">Company</h4>
          <ul className="space-y-2 text-white/70 text-sm">
            <li>
              <Link href="/about" className="hover:text-accent">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-accent">
                Contact
              </Link>
            </li>
            <li>
              <Link href="/privacy-policy" className="hover:text-accent">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-accent">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold text-lg mb-4">
            Get in Touch
          </h4>
          <ul className="space-y-3 text-white/70 text-sm">
            <li className="flex items-center gap-2">
              <FiMail /> hello@stayfinder.com
            </li>
            <li className="flex items-center gap-2">
              <FiPhone /> +{whatsappNumber}
            </li>
            {whatsappNumber && (
              <li>
                <Link
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg mt-1 hover:bg-accent-dark transition-colors"
                >
                  <FaWhatsapp /> Chat on WhatsApp
                </Link>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5">
        <p className="text-center text-white/60 text-sm">
          © {year} StayFinder. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
