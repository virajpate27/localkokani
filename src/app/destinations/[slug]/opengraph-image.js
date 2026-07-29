// src/app/destinations/[slug]/opengraph-image.js
import { ImageResponse } from "next/og";
import { getDestinationBySlug } from "@/lib/services/destinationService";

export const runtime = "nodejs";
export const alt = "Destination on StayFinder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const destination = await getDestinationBySlug(slug);

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          background: "linear-gradient(135deg, #1e3b6c 0%, #3193a6 100%)",
          padding: "60px",
          position: "relative",
        }}
      >
        {destination?.image?.url && (
          <img
            src={destination.image.url}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.4,
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", position: "relative", zIndex: 10 }}>
          <span style={{ color: "white", fontSize: "26px", fontWeight: 700, marginBottom: "16px" }}>
            📍 StayFinder
          </span>
          <h1 style={{ fontSize: "60px", fontWeight: 800, color: "white", margin: 0 }}>
            {destination?.name || "Explore Destinations"}
          </h1>
          <p style={{ fontSize: "28px", color: "rgba(255,255,255,0.85)", marginTop: "16px" }}>
            {destination?.hotelCount || 0} hotels available
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}