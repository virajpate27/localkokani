// src/utils/helpers.js

export function generateHotelSchema(hotel) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Hotel",
    "@id": `https://localkokani.vercel.app/hotels/${hotel.slug}`,
    name: hotel.name,
    description: hotel.description || "",
    address: {
      "@type": "PostalAddress",
      streetAddress: hotel.address || "",
      addressLocality: hotel.destinationName || "",
      addressCountry: "IN",
    },
    priceRange: hotel.priceRange || "$$",
  };

  if (hotel.images?.length > 0) {
    schema.image = hotel.images.map((img) => img.url);
  }

  if (hotel.location?.lat && hotel.location?.lng) {
    schema.geo = {
      "@type": "GeoCoordinates",
      latitude: hotel.location.lat,
      longitude: hotel.location.lng,
    };
  }

  if (hotel.rating > 0) {
    schema.starRating = {
      "@type": "Rating",
      ratingValue: hotel.rating,
    };
  }

  if (hotel.reviewCount > 0 && hotel.rating > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: hotel.rating,
      reviewCount: hotel.reviewCount,
      bestRating: 5,
      worstRating: 1,
    };
  }

  if (hotel.amenities?.length > 0) {
    schema.amenityFeature = hotel.amenities.map((a) => ({
      "@type": "LocationFeatureSpecification",
      name: a,
      value: true,
    }));
  }

  return schema;
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

export function generateDestinationCollectionSchema(destination, hotels) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Hotels in ${destination.name}`,
    description: destination.description,
    url: `https://localkokani.vercel.app/destinations/${destination.slug}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: hotels.length,
      itemListElement: hotels.slice(0, 20).map((hotel, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: `https://localkokani.vercel.app/hotels/${hotel.slug}`,
        name: hotel.name,
      })),
    },
  };
}

export function generateOrganizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "StayFinder",
    url: "https://yourdomain.com",
    logo: "https://yourdomain.com/logo.png",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      telephone: `+${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER}`,
      areaServed: "IN",
    },
  };
}