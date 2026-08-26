// src/components/landing/InternalLinksSection.jsx
import Link from "next/link";
import { FiArrowRight } from "react-icons/fi";

export default function InternalLinksSection({ links = [] }) {
  if (!links.length) return null;
  return (
    <section className="py-14 bg-gray-50">
      <div className="container-custom">
        <h2 className="font-display font-semibold text-lg text-primary mb-5">Explore More</h2>
        <div className="flex flex-wrap gap-3">
          {links.map((link) => (
            <Link
              key={link.url}
              href={link.url}
              className="flex items-center gap-1.5 bg-white border border-gray-200 hover:border-secondary hover:text-secondary text-gray-600 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              {link.label} <FiArrowRight className="text-xs" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}