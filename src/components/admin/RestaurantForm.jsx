// src/components/admin/RestaurantForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiSave, FiLoader } from "react-icons/fi";
import MultiImageUploader from "./MultiImageUploader";
import TagInput from "./TagInput";
import {
  createRestaurant,
  updateRestaurant,
} from "@/lib/services/restaurantService";
import { getAllDestinations } from "@/lib/services/destinationService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { slugify } from "@/utils/helpers";
import { triggerRevalidation } from "@/utils/revalidate";

export default function RestaurantForm({ initialData = null }) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [destinations, setDestinations] = useState([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    destinationId: initialData?.destinationId || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    priceRange: initialData?.priceRange || "$$",
    rating: initialData?.rating || "",
    openingHours: initialData?.openingHours || "",
    lat: initialData?.location?.lat || "",
    lng: initialData?.location?.lng || "",
    featured: initialData?.featured ?? false,
    status: initialData?.status || "active",
  });
  const [images, setImages] = useState(initialData?.images || []);
  const [originalImages] = useState(initialData?.images || []);
  const [cuisine, setCuisine] = useState(initialData?.cuisine || []);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getAllDestinations()
      .then(setDestinations)
      .catch(() => toast.error("Failed to load destinations list"))
      .finally(() => setIsLoadingDestinations(false));
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Restaurant name is required";
    if (!formData.destinationId) newErrors.destinationId = "Please select a destination";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (images.length === 0) newErrors.images = "Please upload at least one photo";
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
    const selectedDestination = destinations.find((d) => d.id === formData.destinationId);

    const payload = {
      name: formData.name.trim(),
      slug: slugify(formData.name.trim()),
      destinationId: formData.destinationId,
      destinationName: selectedDestination?.name || "",
      destinationSlug: selectedDestination?.slug || "",
      description: formData.description.trim(),
      address: formData.address.trim(),
      priceRange: formData.priceRange,
      rating: formData.rating ? Number(formData.rating) : 0,
      openingHours: formData.openingHours.trim(),
      images,
      cuisine,
      featured: formData.featured,
      status: formData.status,
      searchKeywords: [
        formData.name.toLowerCase(),
        selectedDestination?.slug || "",
        selectedDestination?.name?.toLowerCase() || "",
        ...cuisine.map((c) => c.toLowerCase()),
      ],
      location:
        formData.lat && formData.lng
          ? { lat: Number(formData.lat), lng: Number(formData.lng) }
          : null,
    };

    const pathsToRevalidate = new Set([
      "/restaurants",
      `/restaurants/${payload.slug}`,
    ]);

    try {
      if (isEditMode) {
        if (initialData.slug !== payload.slug) {
          pathsToRevalidate.add(`/restaurants/${initialData.slug}`);
        }

        await updateRestaurant(initialData.id, payload);

        const removedImages = originalImages.filter(
          (orig) => !images.some((img) => img.publicId === orig.publicId)
        );
        for (const img of removedImages) {
          if (img.publicId) await deleteFromCloudinary(img.publicId);
        }

        await triggerRevalidation(Array.from(pathsToRevalidate));
        toast.success("Restaurant updated");
      } else {
        await createRestaurant(payload);
        await triggerRevalidation(Array.from(pathsToRevalidate));
        toast.success("Restaurant created");
      }

      router.push("/admin/restaurants");
      router.refresh();
    } catch (error) {
      console.error("Save restaurant error:", error);
      toast.error("Failed to save restaurant. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    const newlyUploaded = images.filter(
      (img) => !originalImages.some((orig) => orig.publicId === img.publicId)
    );
    for (const img of newlyUploaded) {
      if (img.publicId) await deleteFromCloudinary(img.publicId);
    }
    router.push("/admin/restaurants");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="card p-6">
        <MultiImageUploader value={images} onChange={setImages} folder="restaurants" />
        {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images}</p>}
      </div>

      <div className="card p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Restaurant Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Fisherman's Wharf"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
                errors.name ? "border-red-300" : "border-gray-200 focus:border-secondary"
              }`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
            <select
              name="destinationId"
              value={formData.destinationId}
              onChange={handleChange}
              disabled={isLoadingDestinations}
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white ${
                errors.destinationId ? "border-red-300" : "border-gray-200 focus:border-secondary"
              }`}
            >
              <option value="">{isLoadingDestinations ? "Loading..." : "Select a destination"}</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>{dest.name}</option>
              ))}
            </select>
            {errors.destinationId && <p className="text-red-500 text-xs mt-1">{errors.destinationId}</p>}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none ${
              errors.description ? "border-red-300" : "border-gray-200 focus:border-secondary"
            }`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${
              errors.address ? "border-red-300" : "border-gray-200 focus:border-secondary"
            }`}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Price Range</label>
            <select
              name="priceRange"
              value={formData.priceRange}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none bg-white"
            >
              <option value="$">$ (Budget)</option>
              <option value="$$">$$ (Mid-range)</option>
              <option value="$$$">$$$ (Premium)</option>
              <option value="$$$$">$$$$ (Fine Dining)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating (optional)</label>
            <input
              type="number"
              name="rating"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              placeholder="e.g. 4.5"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Opening Hours</label>
            <input
              type="text"
              name="openingHours"
              value={formData.openingHours}
              onChange={handleChange}
              placeholder="e.g. 12PM - 11PM"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none"
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <TagInput value={cuisine} onChange={setCuisine} label="Cuisine Types" />
      </div>

      <div className="card p-6 space-y-5">
        <h3 className="font-display font-semibold text-primary">
          Map Location <span className="text-gray-400 font-normal text-sm">(optional)</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <input
            type="number"
            step="any"
            name="lat"
            value={formData.lat}
            onChange={handleChange}
            placeholder="Latitude"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none"
          />
          <input
            type="number"
            step="any"
            name="lng"
            value={formData.lng}
            onChange={handleChange}
            placeholder="Longitude"
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none"
          />
        </div>
      </div>

      <div className="card p-6 space-y-4">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 accent-secondary rounded"
          />
          <span className="text-sm text-gray-700">Show on homepage (Featured Restaurant)</span>
        </label>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full sm:w-64 px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none bg-white"
          >
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
          {isSaving ? "Saving..." : isEditMode ? "Update Restaurant" : "Create Restaurant"}
        </button>
        <button type="button" onClick={handleCancel} className="text-gray-500 font-medium text-sm hover:text-primary">
          Cancel
        </button>
      </div>
    </form>
  );
}