// src/utils/helpers.js

export function generateHotelSchema(hotel) {
  return {
    "@context": "https://schema.org",
    "@type": "Hotel",
    name: hotel.name,
    description: hotel.description,
    image: hotel.images?.[0]?.url,
    address: {
      "@type": "PostalAddress",
      addressLocality: hotel.destinationName,
      addressCountry: "IN",
    },
    priceRange: hotel.priceRange || "$$",
    starRating: {
      "@type": "Rating",
      ratingValue: hotel.rating || 4,
    },
    amenityFeature: (hotel.amenities || []).map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
    })),
  };
}

export function generateBreadcrumbSchema(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function formatCurrency(amount, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}



export function serializeDoc(doc) {
  const serialized = { ...doc };
  for (const key in serialized) {
    if (serialized[key]?.toDate) {
      serialized[key] = serialized[key].toDate().toISOString();
    }
  }
  return serialized;
}

export function serializeDocs(docs) {
  return docs.map(serializeDoc);
}
