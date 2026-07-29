// src/utils/revalidate.js
export async function triggerRevalidation(paths) {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths }),
    });
  } catch (error) {
    console.error("Failed to trigger revalidation:", error);
    // Non-critical — page will still update on its normal ISR schedule
  }
}