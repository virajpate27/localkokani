// src/app/opengraph-image.js
// Static OG image for the homepage and any page without a specific one
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const alt = "StayFinder - Book Hotels & Explore Destinations";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #1e3b6c 0%, #3193a6 100%)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
          <div
            style={{
              width: "70px",
              height: "70px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
            }}
          >
            📍
          </div>
          <span style={{ color: "white", fontSize: "56px", fontWeight: 800 }}>
            StayFinder
          </span>
        </div>
        <p style={{ fontSize: "30px", color: "rgba(255,255,255,0.85)" }}>
          Find Your Perfect Stay, Anywhere You Go
        </p>
      </div>
    ),
    { ...size }
  );
}