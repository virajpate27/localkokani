// src/app/global-error.js
"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1e3b6c" }}>
            Something went seriously wrong
          </h1>
          <p style={{ color: "#6b7280", marginTop: "0.75rem" }}>
            Please refresh the page. If this keeps happening, contact support.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              background: "#1e3b6c",
              color: "white",
              padding: "0.75rem 1.5rem",
              borderRadius: "0.75rem",
              border: "none",
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Try Again
          </button>
        </div>
      </body>
    </html>
  );
}