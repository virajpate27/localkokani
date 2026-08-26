// src/components/landing/WhyBookSection.jsx
import { FiCheckCircle } from "react-icons/fi";

export default function WhyBookSection({ heading, description, points = [] }) {
  if (!points.length) return null;
  return (
    <section className="py-16 bg-gray-50">
      <div className="container-custom">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="section-title">{heading}</h2>
          {description && <p className="text-gray-500 mt-3">{description}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {points.map((point) => (
            <div key={point.title} className="card p-6">
              <FiCheckCircle className="text-accent-dark text-2xl mb-3" />
              <h3 className="font-display font-semibold text-primary">{point.title}</h3>
              <p className="text-gray-500 text-sm mt-2 leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}