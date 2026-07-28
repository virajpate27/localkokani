// src/lib/cloudinary.js
export const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Client-side unsigned upload function (used in Admin panel)
export async function uploadToCloudinary(file, folder = "general") {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  formData.append("folder", `hotel-booking-app/${folder}`);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!res.ok) throw new Error("Image upload failed");

  const data = await res.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
  };
}

// Helper to build optimized image URLs on the fly
export function getOptimizedUrl(url, { width = 800, quality = "auto" } = {}) {
  if (!url) return "";
  return url.replace("/upload/", `/upload/f_auto,q_${quality},w_${width}/`);
}


export async function deleteFromCloudinary(publicId) {
  if (!publicId) return;
  try {
    await fetch("/api/cloudinary/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ publicId }),
    });
  } catch (error) {
    console.error("Failed to delete old image:", error);
    // Non-critical — don't throw, just log. A stray orphaned image in
    // Cloudinary isn't worth blocking the admin's save action over.
  }
}