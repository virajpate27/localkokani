// src/utils/revalidate.js
// Update to support an optional tags parameter:

export async function triggerRevalidation(paths, tags = ["search-index"]) {
  try {
    await fetch("/api/revalidate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ paths, tags }),
    });
  } catch (error) {
    console.error("Failed to trigger revalidation:", error);
  }
}