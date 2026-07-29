// src/app/hotels/[slug]/opengraph-image.js
import { ImageResponse } from "next/og";
import { getHotelBySlug } from "@/lib/services/hotelService";

export const runtime = "nodejs";
export const alt = "Hotel on StayFinder";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);

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
        {hotel?.images?.[0]?.url && (
          <img
            src={hotel.images[0].url}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.35,
            }}
          />
        )}
        <div style={{ display: "flex", flexDirection: "column", position: "relative", zIndex: 10 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <div
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "10px",
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "22px",
              }}
            >
              📍
            </div>
            <span style={{ color: "white", fontSize: "28px", fontWeight: 700 }}>
              StayFinder
            </span>
          </div>
          <h1
            style={{
              fontSize: "56px",
              fontWeight: 800,
              color: "white",
              margin: 0,
              lineHeight: 1.1,
              maxWidth: "900px",
            }}
          >
            {hotel?.name || "Discover Great Stays"}
          </h1>
          <p style={{ fontSize: "28px", color: "rgba(255,255,255,0.85)", marginTop: "16px" }}>
            {hotel?.destinationName ? `📍 ${hotel.destinationName}` : ""}
            {hotel?.rating ? `   ⭐ ${hotel.rating}` : ""}
          </p>
        </div>
      </div>
    ),
    { ...size }
  );
}