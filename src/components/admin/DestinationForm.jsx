// src/components/admin/DestinationForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiSave, FiLoader } from "react-icons/fi";
import ImageUploader from "./ImageUploader";
import { createDestination, updateDestination } from "@/lib/services/destinationService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { slugify } from "@/utils/helpers";

export default function DestinationForm({ initialData = null }) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    country: initialData?.country || "India",
    description: initialData?.description || "",
    featured: initialData?.featured ?? false,
    metaTitle: initialData?.seo?.metaTitle || "",
    metaDescription: initialData?.seo?.metaDescription || "",
  });
  const [image, setImage] = useState(initialData?.image || null);
  const [originalImage] = useState(initialData?.image || null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Destination name is required";
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!image) newErrors.image = "Please upload a destination image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSaving(true);

    const payload = {
      name: formData.name.trim(),
      slug: slugify(formData.name.trim()),
      country: formData.country.trim(),
      description: formData.description.trim(),
      featured: formData.featured,
      image,
      seo: {
        metaTitle: formData.metaTitle.trim(),
        metaDescription: formData.metaDescription.trim(),
      },
    };

    try {
      if (isEditMode) {
        await updateDestination(initialData.id, payload);

        // If the image was changed/removed, clean up the old one in Cloudinary
        if (originalImage?.publicId && originalImage.publicId !== image?.publicId) {
          await deleteFromCloudinary(originalImage.publicId);
        }

        toast.success("Destination updated");
      } else {
        await createDestination(payload);
        toast.success("Destination created");
      }
      router.push("/admin/destinations");
      router.refresh();
    } catch (error) {
      console.error("Save destination error:", error);
      toast.error("Failed to save destination. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      <div className="card p-6 space-y-5">
        <ImageUploader
          value={image}
          onChange={setImage}
          folder="destinations"
          label="Destination Image"
        />
        {errors.image && <p className="text-red-500 text-xs">{errors.image}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Goa"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                errors.name ? "border-red-300" : "border-gray-200 focus:border-secondary"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Country
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="e.g. India"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                errors.country ? "border-red-300" : "border-gray-200 focus:border-secondary"
              }`}
            />
            {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="A short, appealing description of this destination..."
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none ${
              errors.description ? "border-red-300" : "border-gray-200 focus:border-secondary"
            }`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 accent-secondary rounded"
          />
          <span className="text-sm text-gray-700">
            Show on homepage (Featured Destination)
          </span>
        </label>
      </div>

      {/* SEO Section */}
      <div className="card p-6 space-y-5">
        <h3 className="font-display font-semibold text-primary">
          SEO Settings <span className="text-gray-400 font-normal text-sm">(optional)</span>
        </h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Title
          </label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            placeholder={`Best Hotels in ${formData.name || "..."} | StayFinder`}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none transition-colors"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Description
          </label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            rows={2}
            placeholder="Custom description for search engines (leave blank to auto-generate)"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none transition-colors resize-none"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-60"
        >
          {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
          {isSaving ? "Saving..." : isEditMode ? "Update Destination" : "Create Destination"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/destinations")}
          className="text-gray-500 font-medium text-sm hover:text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}