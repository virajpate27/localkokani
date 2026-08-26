// src/components/landing/AttractionsSection.jsx
import Image from "next/image";

export default function AttractionsSection({ heading, attractions = [] }) {
  if (!attractions.length) return null;
  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <h2 className="section-title mb-10">{heading}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {attractions.map((a, i) => (
            <div key={i} className="card overflow-hidden">
              <div className="relative aspect-[4/3]">
                {a.image?.url && <Image src={a.image.url} alt={a.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover" />}
              </div>
              <div className="p-4">
                <h3 className="font-display font-semibold text-primary text-sm">{a.name}</h3>
                {a.description && <p className="text-gray-500 text-xs mt-1.5 line-clamp-2">{a.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}