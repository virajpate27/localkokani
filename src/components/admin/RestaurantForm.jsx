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
import { incrementRestaurantCount, getAllDestinations } from "@/lib/services/destinationService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { slugify, isValidGoogleMapsEmbedUrl, isValidWhatsAppNumber } from "@/utils/helpers";
import { triggerRevalidation } from "@/utils/revalidate";
import CustomBadge from "@/components/ui/CustomBadge";
import AvailabilityBadge from "@/components/ui/AvailabilityBadge";

const BADGE_COLOR_OPTIONS = [
    { value: "primary", label: "Primary (Navy)" },
    { value: "secondary", label: "Secondary (Teal)" },
    { value: "accent", label: "Accent (Olive)" },
    { value: "success", label: "Success (Green)" },
    { value: "warning", label: "Warning (Orange)" },
    { value: "danger", label: "Danger (Red)" },
];

const AVAILABILITY_OPTIONS = [
    { value: "available", label: "Available" },
    { value: "limited", label: "Limited Tables" },
    { value: "soldout", label: "Fully Booked" },
];

const CUISINE_SUGGESTIONS = [
    "Seafood", "Goan", "North Indian", "South Indian", "Chinese",
    "Continental", "Italian", "Mexican", "Thai", "Mughlai",
    "Street Food", "Vegan", "Bakery & Desserts", "BBQ & Grill",
];

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
        costForTwo: initialData?.costForTwo || "",
        priceRange: initialData?.priceRange || "$$",
        rating: initialData?.rating || "",
        openingHours: initialData?.openingHours || "",
        mapEmbedUrl: initialData?.mapEmbedUrl || "",
        lat: initialData?.location?.lat || "",
        lng: initialData?.location?.lng || "",
        featured: initialData?.featured ?? false,
        status: initialData?.status || "active",
        verified: initialData?.verified ?? false,
        sponsored: initialData?.sponsored ?? false,
        availabilityStatus: initialData?.availabilityStatus || "available",
        availabilityMessage: initialData?.availabilityMessage || "",
        customBadgeText: initialData?.customBadgeText || "",
        customBadgeColor: initialData?.customBadgeColor || "primary",
        whatsappNumber: initialData?.whatsappNumber || "",
        partnerPlan: initialData?.partnerPlan || "basic",
    });
    const [images, setImages] = useState(initialData?.images || []);
    const [originalImages] = useState(initialData?.images || []);
    const [cuisine, setCuisine] = useState(initialData?.cuisine || []);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const isPremium = formData.partnerPlan === "premium";

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
        if (formData.costForTwo && Number(formData.costForTwo) <= 0) {
            newErrors.costForTwo = "Enter a valid amount";
        }
        if (formData.mapEmbedUrl && !isValidGoogleMapsEmbedUrl(formData.mapEmbedUrl)) {
            newErrors.mapEmbedUrl = "Please paste a valid Google Maps embed URL";
        }
        if (formData.customBadgeText.trim().length > 24) {
            newErrors.customBadgeText = "Keep badge text short (max 24 characters)";
        }
        if (formData.availabilityMessage.trim().length > 40) {
            newErrors.availabilityMessage = "Keep the message short (max 40 characters)";
        }
        if (formData.whatsappNumber && !isValidWhatsAppNumber(formData.whatsappNumber)) {
            newErrors.whatsappNumber = "Enter digits only, with country code (e.g. 919876543210)";
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

        const payload = {
            name: formData.name.trim(),
            slug: slugify(formData.name.trim()),
            destinationId: formData.destinationId,
            destinationName: selectedDestination?.name || "",
            destinationSlug: selectedDestination?.slug || "",
            description: formData.description.trim(),
            address: formData.address.trim(),
            costForTwo: formData.costForTwo ? Number(formData.costForTwo) : null,
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
            mapEmbedUrl: formData.mapEmbedUrl.trim() || null,
            verified: formData.verified,
            sponsored: formData.sponsored,
            customBadgeText: formData.customBadgeText.trim() || null,
            customBadgeColor: formData.customBadgeColor,
            availabilityStatus: formData.availabilityStatus,
            availabilityMessage: formData.availabilityMessage.trim() || null,
            whatsappNumber: formData.whatsappNumber.trim().replace(/\D/g, "") || null,
            location:
                formData.lat && formData.lng
                    ? { lat: Number(formData.lat), lng: Number(formData.lng) }
                    : null,
            partnerPlan: formData.partnerPlan,
        };

        // Collect every public path that needs fresh data after this save,
        // including old slug/destination paths in case of a rename or move.
        const pathsToRevalidate = new Set([
            "/restaurants",
            "/",
            "/destinations",
            `/restaurants/${payload.slug}`,
            `/destinations/${payload.destinationSlug}`,
        ]);

        try {
            if (isEditMode) {
                if (initialData.slug !== payload.slug) {
                    pathsToRevalidate.add(`/restaurants/${initialData.slug}`);
                }
                if (initialData.destinationSlug !== payload.destinationSlug) {
                    if (initialData.destinationSlug) {
                        pathsToRevalidate.add(`/destinations/${initialData.destinationSlug}`);
                    }
                }

                await updateRestaurant(initialData.id, payload);

                // NEW: if destination changed, adjust restaurantCount on both old and new destination
                if (initialData.destinationId !== formData.destinationId) {
                    await incrementRestaurantCount(initialData.destinationId, -1);
                    await incrementRestaurantCount(formData.destinationId, 1);
                }

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
                await incrementRestaurantCount(formData.destinationId, 1); // NEW

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
                        <label className="block text-sm font-medium dark:text-gray-300 mb-2">Restaurant Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. Fisherman's Wharf"
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.name ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
                                }`}
                        />
                        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-2">Destination</label>
                        <select
                            name="destinationId"
                            value={formData.destinationId}
                            onChange={handleChange}
                            disabled={isLoadingDestinations}
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none bg-white dark:bg-gray-900 ${errors.destinationId ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
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
                    <label className="block text-sm font-medium dark:text-gray-300 mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none resize-none ${errors.description ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
                            }`}
                    />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-300 mb-2">Address</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none ${errors.address ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
                            }`}
                    />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Partner Plan</label>
                    <div className="flex gap-3">
                        {["basic", "premium"].map((plan) => (
                            <button
                                key={plan}
                                type="button"
                                onClick={() => setFormData((prev) => ({ ...prev, partnerPlan: plan }))}
                                className={`flex-1 py-2.5 rounded-lg border text-sm font-medium capitalize transition-colors ${formData.partnerPlan === plan ? "bg-primary text-white border-primary" : "border-gray-200 text-gray-600 hover:border-primary"
                                    }`}
                            >
                                {plan}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        WhatsApp Number <span className="text-gray-400 font-normal">(optional — uses site default if blank)</span>
                    </label>
                    <input
                        type="tel"
                        name="whatsappNumber"
                        value={formData.whatsappNumber}
                        onChange={handleChange}
                        placeholder={formData.partnerPlan === "basic" ? "Leave blank — Basic plan uses site default" : "Owner's WhatsApp number (e.g. 919876543210)"}
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.whatsappNumber ? "border-red-300" : "border-gray-200 focus:border-secondary"
                            }`}
                    />
                    {errors.whatsappNumber && <p className="text-red-500 text-xs mt-1">{errors.whatsappNumber}</p>}

                    {/* Business-rule guardrails — warn on mismatches, don't hard-block (admin may have valid reasons) */}
                    {formData.partnerPlan === "basic" && formData.whatsappNumber.trim() && (
                        <p className="text-orange-500 text-xs mt-1.5 flex items-center gap-1">
                            ⚠️ This is a Basic plan listing but has a custom WhatsApp number set — enquiries will bypass your commission tracking. Confirm this is intentional.
                        </p>
                    )}
                    {formData.partnerPlan === "premium" && !formData.whatsappNumber.trim() && (
                        <p className="text-orange-500 text-xs mt-1.5 flex items-center gap-1">
                            ⚠️ This is a Premium plan listing but no custom WhatsApp number is set — enquiries will currently go to your site's default number instead of the owner's.
                        </p>
                    )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                            Avg. Cost for Two (₹)
                        </label>
                        <input
                            type="number"
                            name="costForTwo"
                            value={formData.costForTwo}
                            onChange={handleChange}
                            placeholder="e.g. 1500"
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.costForTwo ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
                                }`}
                        />
                        {errors.costForTwo && <p className="text-red-500 text-xs mt-1">{errors.costForTwo}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-2">Price Range</label>
                        <select
                            name="priceRange"
                            value={formData.priceRange}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 focus:border-secondary text-sm outline-none bg-white dark:bg-gray-900"
                        >
                            <option value="$">$ (Budget)</option>
                            <option value="$$">$$ (Mid-range)</option>
                            <option value="$$$">$$$ (Premium)</option>
                            <option value="$$$$">$$$$ (Fine Dining)</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-2">Rating (optional)</label>
                        <input
                            type="number"
                            name="rating"
                            step="0.1"
                            min="0"
                            max="5"
                            value={formData.rating}
                            onChange={handleChange}
                            placeholder="e.g. 4.5"
                            className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 focus:border-secondary text-sm outline-none"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-2">Opening Hours</label>
                        <input
                            type="text"
                            name="openingHours"
                            value={formData.openingHours}
                            onChange={handleChange}
                            placeholder="e.g. 12PM - 11PM"
                            className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 focus:border-secondary text-sm outline-none"
                        />
                    </div>
                </div>
            </div>

            <div className="card p-6">
                <TagInput
                    value={cuisine}
                    onChange={setCuisine}
                    label="Cuisine Types"
                    suggestions={CUISINE_SUGGESTIONS}
                />
            </div>

            <div className="card p-6 space-y-5">
                <div>
                    <h3 className="font-display font-semibold text-primary dark:text-white">
                        Map Location <span className="dark:dark:text-gray-500 font-normal text-sm">(optional)</span>
                    </h3>
                    <p className="dark:dark:text-gray-500 text-xs mt-1">
                        Recommended: paste a Google Maps embed URL for the most accurate map.
                        Lat/Lng below is used only as a fallback if no embed URL is provided.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                        Google Maps Embed URL
                    </label>
                    <textarea
                        name="mapEmbedUrl"
                        value={formData.mapEmbedUrl}
                        onChange={handleChange}
                        rows={2}
                        placeholder="https://www.google.com/maps/embed?pb=..."
                        className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none font-mono ${errors.mapEmbedUrl ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
                            }`}
                    />
                    {errors.mapEmbedUrl && <p className="text-red-500 text-xs mt-1">{errors.mapEmbedUrl}</p>}
                    <details className="mt-2">
                        <summary className="text-secondary text-xs font-medium cursor-pointer hover:underline">
                            How do I get this URL?
                        </summary>
                        <ol className="list-decimal list-inside dark:text-gray-500 text-xs mt-2 space-y-1 pl-1">
                            <li>Search for your Restaurant/business on Google Maps</li>
                            <li>Click <strong>Share</strong> → <strong>Embed a map</strong> tab</li>
                            <li>Copy just the URL inside <code className="dark:bg-gray-800 px-1 rounded">src="..."</code> from the iframe code shown</li>
                            <li>Paste that URL here (not the full iframe tag, just the URL)</li>
                        </ol>
                    </details>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                            Latitude <span className="dark:dark:text-gray-500 font-normal">(fallback only)</span>
                        </label>
                        <input
                            type="number"
                            step="any"
                            name="lat"
                            value={formData.lat}
                            onChange={handleChange}
                            placeholder="e.g. 15.1631"
                            className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 focus:border-secondary text-sm outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium dark:text-gray-300 mb-2">
                            Longitude <span className="dark:dark:text-gray-500 font-normal">(fallback only)</span>
                        </label>
                        <input
                            type="number"
                            step="any"
                            name="lng"
                            value={formData.lng}
                            onChange={handleChange}
                            placeholder="e.g. 73.9463"
                            className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 focus:border-secondary text-sm outline-none"
                        />
                    </div>
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
                    <span className="text-sm dark:text-gray-300">Show on homepage (Featured Restaurant)</span>
                </label>
                <label className={`flex items-center gap-2.5 ${isPremium ? "cursor-pointer" : "cursor-not-allowed opacity-50"}`}>
                    <input
                        type="checkbox"
                        name="verified"
                        checked={formData.verified}
                        disabled={!isPremium}
                        onChange={handleChange}
                        className="w-4 h-4 accent-secondary rounded"
                    />
                    <span className="text-sm text-gray-700 flex items-center gap-2">
                        Premium Verified
                        <span className="text-xs text-gray-400 font-normal">
                            {isPremium ? "(shows a trust badge)" : "(Premium plan only)"}
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
                    <span className="text-sm dark:text-gray-300 flex items-center gap-2">
                        Sponsored Listing
                        <span className="text-xs dark:dark:text-gray-500 font-normal">
                            (featured in the "Recommended" section on its destination page)
                        </span>
                    </span>
                </label>
                <div>
                    <label className="block text-sm font-medium dark:text-gray-300 mb-2">Status</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        className="w-full sm:w-64 px-4 py-3 rounded-xl border dark:border-gray-800 focus:border-secondary text-sm outline-none bg-white dark:bg-gray-900"
                    >
                        <option value="active">Active (visible to public)</option>
                        <option value="draft">Draft (hidden from public)</option>
                        <option value="archived">Archived (hidden from public)</option>
                    </select>
                </div>
            </div>

            <div className="card p-6 space-y-4">
                <div>
                    <h3 className="font-display font-semibold text-primary">
                        Custom Badge{" "}
                        <span className="text-gray-400 font-normal text-sm">
                            {isPremium ? "(optional)" : "(Premium plan only)"}
                        </span>
                    </h3>
                    <p className="text-gray-400 text-xs mt-1">
                        Shows a small label on the card image and detail page — e.g. "Top Rated", "Most Booked", "Family Friendly".
                    </p>
                </div>

                <div className={`grid grid-cols-1 sm:grid-cols-[1fr_180px] gap-4 ${!isPremium ? "opacity-50 pointer-events-none" : ""}`}>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Badge Text</label>
                        <input
                            type="text"
                            name="customBadgeText"
                            value={formData.customBadgeText}
                            onChange={handleChange}
                            disabled={!isPremium}
                            maxLength={24}
                            placeholder="e.g. Top Rated"
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.customBadgeText ? "border-red-300" : "border-gray-200 focus:border-secondary"
                                }`}
                        />
                        {errors.customBadgeText && <p className="text-red-500 text-xs mt-1">{errors.customBadgeText}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Badge Color</label>
                        <select
                            name="customBadgeColor"
                            value={formData.customBadgeColor}
                            onChange={handleChange}
                            disabled={!isPremium}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none bg-white"
                        >
                            {BADGE_COLOR_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {formData.customBadgeText.trim() && isPremium && (
                    <div>
                        <p className="text-xs text-gray-400 mb-2">Preview:</p>
                        <CustomBadge text={formData.customBadgeText} color={formData.customBadgeColor} position="inline" />
                    </div>
                )}
            </div>

            <div className="card p-6 space-y-4">
                <div>
                    <h3 className="font-display font-semibold text-primary">Availability</h3>
                    <p className="text-gray-400 text-xs mt-1">
                        Manually set this hotel's availability status. Useful for creating urgency or marking a property as temporarily unavailable.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            name="availabilityStatus"
                            value={formData.availabilityStatus}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none bg-white"
                        >
                            {AVAILABILITY_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Custom Message <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                            type="text"
                            name="availabilityMessage"
                            value={formData.availabilityMessage}
                            onChange={handleChange}
                            maxLength={40}
                            placeholder="e.g. Only 2 rooms left!"
                            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.availabilityMessage ? "border-red-300" : "border-gray-200 focus:border-secondary"
                                }`}
                        />
                        {errors.availabilityMessage && <p className="text-red-500 text-xs mt-1">{errors.availabilityMessage}</p>}
                    </div>
                </div>

                {/* Live preview */}
                <div>
                    <p className="text-xs text-gray-400 mb-2">Preview:</p>
                    <AvailabilityBadge
                        status={formData.availabilityStatus}
                        message={formData.availabilityMessage}
                        size="lg"
                    />
                    {formData.availabilityStatus === "available" && !formData.availabilityMessage.trim() && (
                        <p className="text-gray-400 text-xs mt-1">No badge shown (default "Available" state is hidden by design)</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
                    {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
                    {isSaving ? "Saving..." : isEditMode ? "Update Restaurant" : "Create Restaurant"}
                </button>
                <button type="button" onClick={handleCancel} className="dark:text-gray-500 font-medium text-sm hover:text-primary dark:text-white">
                    Cancel
                </button>
            </div>
        </form>
    );
}