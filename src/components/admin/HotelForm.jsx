// src/components/admin/HotelForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiSave, FiLoader } from "react-icons/fi";
import MultiImageUploader from "./MultiImageUploader";
import TagInput from "./TagInput";
import RoomTypesEditor from "./RoomTypesEditor";
import { createHotel, updateHotel } from "@/lib/services/hotelService";
import { incrementHotelCount, getAllDestinations } from "@/lib/services/destinationService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { triggerRevalidation } from "@/utils/revalidate";
import { slugify, isValidGoogleMapsEmbedUrl } from "@/utils/helpers";

export default function HotelForm({ initialData = null }) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [destinations, setDestinations] = useState([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(true);

  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    destinationId: initialData?.destinationId || "",
    description: initialData?.description || "",
    address: initialData?.address || "",
    price: initialData?.price || "",
    priceRange: initialData?.priceRange || "$$",
    rating: initialData?.rating || "",
    mapEmbedUrl: initialData?.mapEmbedUrl || "",
    lat: initialData?.location?.lat || "",
    lng: initialData?.location?.lng || "",
    featured: initialData?.featured ?? false,
    status: initialData?.status || "active",
    verified: initialData?.verified ?? false,
    sponsored: initialData?.sponsored ?? false,
  });
  const [images, setImages] = useState(initialData?.images || []);
  const [originalImages] = useState(initialData?.images || []);
  const [amenities, setAmenities] = useState(initialData?.amenities || []);
  const [roomTypes, setRoomTypes] = useState(initialData?.roomTypes || []);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadDestinations() {
      try {
        const data = await getAllDestinations();
        setDestinations(data);
      } catch (error) {
        console.error("Load destinations error:", error);
        toast.error("Failed to load destinations list");
      } finally {
        setIsLoadingDestinations(false);
      }
    }
    loadDestinations();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Hotel name is required";
    if (!formData.destinationId) newErrors.destinationId = "Please select a destination";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.price || Number(formData.price) <= 0) newErrors.price = "Enter a valid starting price";
    if (images.length === 0) newErrors.images = "Please upload at least one photo";
    if (formData.rating && (Number(formData.rating) < 0 || Number(formData.rating) > 5)) {
      newErrors.rating = "Rating must be between 0 and 5";
    }
    if (formData.mapEmbedUrl && !isValidGoogleMapsEmbedUrl(formData.mapEmbedUrl)) {
      newErrors.mapEmbedUrl = "Please paste a valid Google Maps embed URL (starts with https://www.google.com/maps/embed)";
    }
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

    const cleanedRoomTypes = roomTypes
      .filter((r) => r.name.trim() && r.price)
      .map((r) => ({
        name: r.name.trim(),
        price: Number(r.price),
        capacity: Number(r.capacity) || 2,
      }));

    const payload = {
      name: formData.name.trim(),
      slug: slugify(formData.name.trim()),
      destinationId: formData.destinationId,
      destinationName: selectedDestination?.name || "",
      destinationSlug: selectedDestination?.slug || "",
      description: formData.description.trim(),
      address: formData.address.trim(),
      price: Number(formData.price),
      priceRange: formData.priceRange,
      rating: formData.rating ? Number(formData.rating) : 0,
      images,
      amenities,
      roomTypes: cleanedRoomTypes,
      featured: formData.featured,
      status: formData.status,
      searchKeywords: [
        formData.name.toLowerCase(),
        selectedDestination?.slug || "",
        selectedDestination?.name?.toLowerCase() || "",
        ...amenities.map((a) => a.toLowerCase()),
      ],
      mapEmbedUrl: formData.mapEmbedUrl.trim() || null,
      verified: formData.verified,
      sponsored: formData.sponsored,
      location:
        formData.lat && formData.lng
          ? { lat: Number(formData.lat), lng: Number(formData.lng) }
          : null,
    };

    // Collect every public path that needs fresh data after this save,
    // including old slug/destination paths in case of a rename or move.
    const pathsToRevalidate = new Set([
      "/hotels",
      "/",
      `/hotels/${payload.slug}`,
      `/destinations/${payload.destinationSlug}`,
    ]);

    try {
      if (isEditMode) {
        if (initialData.slug !== payload.slug) {
          pathsToRevalidate.add(`/hotels/${initialData.slug}`);
        }
        if (initialData.destinationSlug !== payload.destinationSlug) {
          if (initialData.destinationSlug) {
            pathsToRevalidate.add(`/destinations/${initialData.destinationSlug}`);
          }
        }

        await updateHotel(initialData.id, payload);

        // If destination changed, adjust hotelCount on both old and new destination
        if (initialData.destinationId !== formData.destinationId) {
          await incrementHotelCount(initialData.destinationId, -1);
          await incrementHotelCount(formData.destinationId, 1);
        }

        // Clean up any images that were removed during editing
        const removedImages = originalImages.filter(
          (orig) => !images.some((img) => img.publicId === orig.publicId)
        );
        for (const img of removedImages) {
          if (img.publicId) await deleteFromCloudinary(img.publicId);
        }

        await triggerRevalidation(Array.from(pathsToRevalidate));

        toast.success("Hotel updated");
      } else {
        await createHotel(payload);
        await incrementHotelCount(formData.destinationId, 1);

        await triggerRevalidation(Array.from(pathsToRevalidate));

        toast.success("Hotel created");
      }

      router.push("/admin/hotels");
      router.refresh();
    } catch (error) {
      console.error("Save hotel error:", error);
      toast.error("Failed to save hotel. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = async () => {
    // Clean up any newly-uploaded (unsaved) images so nothing is orphaned in Cloudinary
    const newlyUploaded = images.filter(
      (img) => !originalImages.some((orig) => orig.publicId === img.publicId)
    );
    for (const img of newlyUploaded) {
      if (img.publicId) await deleteFromCloudinary(img.publicId);
    }
    router.push("/admin/hotels");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Photos */}
      <div className="card p-6">
        <MultiImageUploader value={images} onChange={setImages} folder="hotels" />
        {errors.images && <p className="text-red-500 text-xs mt-2">{errors.images}</p>}
      </div>

      {/* Basic Info */}
      <div className="card p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Hotel Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. The Leela Goa"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.name ? "border-red-300" : "border-gray-200 focus:border-secondary"
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
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors bg-white ${errors.destinationId ? "border-red-300" : "border-gray-200 focus:border-secondary"
                }`}
            >
              <option value="">
                {isLoadingDestinations ? "Loading..." : "Select a destination"}
              </option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>
                  {dest.name}
                </option>
              ))}
            </select>
            {errors.destinationId && (
              <p className="text-red-500 text-xs mt-1">{errors.destinationId}</p>
            )}
            {destinations.length === 0 && !isLoadingDestinations && (
              <p className="text-accent-dark text-xs mt-1">
                No destinations found — add one first.
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={4}
            placeholder="Describe the hotel's highlights, atmosphere, and unique features..."
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none ${errors.description ? "border-red-300" : "border-gray-200 focus:border-secondary"
              }`}
          />
          {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Full Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            placeholder="e.g. Cavelossim Beach, South Goa"
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.address ? "border-red-300" : "border-gray-200 focus:border-secondary"
              }`}
          />
          {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
        </div>
      </div>

      {/* Pricing & Rating */}
      <div className="card p-6 space-y-5">
        <h3 className="font-display font-semibold text-primary">Pricing & Rating</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starting Price (₹/night)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="e.g. 4500"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.price ? "border-red-300" : "border-gray-200 focus:border-secondary"
                }`}
            />
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

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
              <option value="$$$$">$$$$ (Luxury)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating (0-5, optional)
            </label>
            <input
              type="number"
              name="rating"
              step="0.1"
              min="0"
              max="5"
              value={formData.rating}
              onChange={handleChange}
              placeholder="e.g. 4.5"
              className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.rating ? "border-red-300" : "border-gray-200 focus:border-secondary"
                }`}
            />
            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
          </div>
        </div>
      </div>

      {/* Amenities */}
      <div className="card p-6">
        <TagInput value={amenities} onChange={setAmenities} />
      </div>

      {/* Room Types */}
      <div className="card p-6">
        <RoomTypesEditor value={roomTypes} onChange={setRoomTypes} />
      </div>

      {/* Location coordinates */}
      <div className="card p-6 space-y-5">
        <div>
          <h3 className="font-display font-semibold text-primary">
            Map Location <span className="text-gray-400 font-normal text-sm">(optional)</span>
          </h3>
          <p className="text-gray-400 text-xs mt-1">
            Recommended: paste a Google Maps embed URL for the most accurate map.
            Lat/Lng below is used only as a fallback if no embed URL is provided.
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Google Maps Embed URL
          </label>
          <textarea
            name="mapEmbedUrl"
            value={formData.mapEmbedUrl}
            onChange={handleChange}
            rows={2}
            placeholder="https://www.google.com/maps/embed?pb=..."
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none font-mono ${errors.mapEmbedUrl ? "border-red-300" : "border-gray-200 focus:border-secondary"
              }`}
          />
          {errors.mapEmbedUrl && <p className="text-red-500 text-xs mt-1">{errors.mapEmbedUrl}</p>}
          <details className="mt-2">
            <summary className="text-secondary text-xs font-medium cursor-pointer hover:underline">
              How do I get this URL?
            </summary>
            <ol className="list-decimal list-inside text-gray-500 text-xs mt-2 space-y-1 pl-1">
              <li>Search for your hotel/business on Google Maps</li>
              <li>Click <strong>Share</strong> → <strong>Embed a map</strong> tab</li>
              <li>Copy just the URL inside <code className="bg-gray-100 px-1 rounded">src="..."</code> from the iframe code shown</li>
              <li>Paste that URL here (not the full iframe tag, just the URL)</li>
            </ol>
          </details>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Latitude <span className="text-gray-400 font-normal">(fallback only)</span>
            </label>
            <input
              type="number"
              step="any"
              name="lat"
              value={formData.lat}
              onChange={handleChange}
              placeholder="e.g. 15.1631"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Longitude <span className="text-gray-400 font-normal">(fallback only)</span>
            </label>
            <input
              type="number"
              step="any"
              name="lng"
              value={formData.lng}
              onChange={handleChange}
              placeholder="e.g. 73.9463"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none"
            />
          </div>
        </div>
      </div>

      {/* Status & Visibility */}
      <div className="card p-6 space-y-4">
        <h3 className="font-display font-semibold text-primary">Visibility</h3>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 accent-secondary rounded"
          />
          <span className="text-sm text-gray-700">Show on homepage (Featured Hotel)</span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            name="verified"
            checked={formData.verified}
            onChange={handleChange}
            className="w-4 h-4 accent-secondary rounded"
          />
          <span className="text-sm text-gray-700 flex items-center gap-2">
            Premium Verified
            <span className="text-xs text-gray-400 font-normal">
              (shows a trust badge — use only for hotels you've personally verified)
            </span>
          </span>
        </label>

        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            name="sponsored"
            checked={formData.sponsored}
            onChange={handleChange}
            className="w-4 h-4 accent-secondary rounded"
          />
          <span className="text-sm text-gray-700 flex items-center gap-2">
            Sponsored Listing
            <span className="text-xs text-gray-400 font-normal">
              (featured in the "Recommended" section on its destination page)
            </span>
          </span>
        </label>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full sm:w-64 px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none bg-white"
          >
            <option value="active">Active (visible to public)</option>
            <option value="draft">Draft (hidden from public)</option>
            <option value="archived">Archived (hidden from public)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-60"
        >
          {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
          {isSaving ? "Saving..." : isEditMode ? "Update Hotel" : "Create Hotel"}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="text-gray-500 font-medium text-sm hover:text-primary"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}