// src/components/admin/LandingPageForm.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiSave, FiLoader, FiPlus, FiTrash2 } from "react-icons/fi";
import ImageUploader from "./ImageUploader";
import FaqEditor from "./FaqEditor";
import EntityMultiSelect from "./EntityMultiSelect";
import { createLandingPage, updateLandingPage } from "@/lib/services/landingPageService";
import { getAllDestinations } from "@/lib/services/destinationService";
import { getAllHotels } from "@/lib/services/hotelService";
import { getAllRestaurants } from "@/lib/services/restaurantService";
import { slugify } from "@/utils/helpers";
import { triggerRevalidation } from "@/utils/revalidate";

const inputClass = "w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none";

export default function LandingPageForm({ initialData = null }) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    slug: initialData?.slug || "",
    h1: initialData?.h1 || "",
    subtitle: initialData?.subtitle || "",
    ctaPrimaryText: initialData?.ctaPrimaryText || "Find Hotels",
    ctaPrimaryLink: initialData?.ctaPrimaryLink || "/hotels",
    ctaSecondaryText: initialData?.ctaSecondaryText || "Explore Destinations",
    ctaSecondaryLink: initialData?.ctaSecondaryLink || "/destinations",
    published: initialData?.published ?? false,
    metaTitle: initialData?.seo?.metaTitle || "",
    metaDescription: initialData?.seo?.metaDescription || "",
  });
  const [heroImage, setHeroImage] = useState(initialData?.heroImage || null);

  const [destinationsSection, setDestinationsSection] = useState(initialData?.destinationsSection || { heading: "Popular Destinations", description: "", destinationIds: [] });
  const [hotelsSection, setHotelsSection] = useState(initialData?.hotelsSection || { heading: "Featured Hotels", description: "", hotelIds: [] });
  const [restaurantsSection, setRestaurantsSection] = useState(initialData?.restaurantsSection || { heading: "Featured Restaurants", description: "", restaurantIds: [] });
  const [whyBookSection, setWhyBookSection] = useState(initialData?.whyBookSection || { heading: "Why Book With Us", description: "", points: [] });
  const [exploreSection, setExploreSection] = useState(initialData?.exploreSection || { heading: "", content: "" });
  const [attractionsSection, setAttractionsSection] = useState(initialData?.attractionsSection || { heading: "Popular Attractions", attractions: [] });
  const [weekendGetawaysSection, setWeekendGetawaysSection] = useState(initialData?.weekendGetawaysSection || { heading: "Weekend Getaways", description: "", destinationIds: [] });
  const [reviewsSection, setReviewsSection] = useState(initialData?.reviewsSection || { heading: "Customer Reviews", description: "" });
  const [ownerCtaSection, setOwnerCtaSection] = useState(initialData?.ownerCtaSection || { heading: "", description: "", ctaText: "Become a Partner", ctaLink: "/partner-with-us" });
  const [faqs, setFaqs] = useState(initialData?.faqs || []);
  const [seoContentSection, setSeoContentSection] = useState(initialData?.seoContentSection || { heading: "", content: "" });
  const [internalLinks, setInternalLinks] = useState(initialData?.internalLinks || []);

  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    const e = {};
    if (!formData.h1.trim()) e.h1 = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addInternalLink = () => setInternalLinks([...internalLinks, { label: "", url: "" }]);
  const updateInternalLink = (i, field, val) => {
    const updated = [...internalLinks];
    updated[i] = { ...updated[i], [field]: val };
    setInternalLinks(updated);
  };
  const removeInternalLink = (i) => setInternalLinks(internalLinks.filter((_, idx) => idx !== i));

  const addWhyBookPoint = () => setWhyBookSection((prev) => ({ ...prev, points: [...prev.points, { title: "", description: "" }] }));
  const updateWhyBookPoint = (i, field, val) => {
    const updated = [...whyBookSection.points];
    updated[i] = { ...updated[i], [field]: val };
    setWhyBookSection((prev) => ({ ...prev, points: updated }));
  };
  const removeWhyBookPoint = (i) => setWhyBookSection((prev) => ({ ...prev, points: prev.points.filter((_, idx) => idx !== i) }));

  const addAttraction = () => setAttractionsSection((prev) => ({ ...prev, attractions: [...prev.attractions, { name: "", image: null, description: "" }] }));
  const updateAttraction = (i, field, val) => {
    const updated = [...attractionsSection.attractions];
    updated[i] = { ...updated[i], [field]: val };
    setAttractionsSection((prev) => ({ ...prev, attractions: updated }));
  };
  const removeAttraction = (i) => setAttractionsSection((prev) => ({ ...prev, attractions: prev.attractions.filter((_, idx) => idx !== i) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSaving(true);
    const slug = formData.slug.trim() || slugify(formData.h1);

    const payload = {
      slug,
      h1: formData.h1.trim(),
      subtitle: formData.subtitle.trim(),
      heroImage,
      ctaPrimaryText: formData.ctaPrimaryText.trim(),
      ctaPrimaryLink: formData.ctaPrimaryLink.trim(),
      ctaSecondaryText: formData.ctaSecondaryText.trim(),
      ctaSecondaryLink: formData.ctaSecondaryLink.trim(),
      destinationsSection, hotelsSection, restaurantsSection,
      whyBookSection, exploreSection, attractionsSection,
      weekendGetawaysSection, reviewsSection, ownerCtaSection,
      faqs: faqs.filter((f) => f.question.trim() && f.answer.trim()),
      seoContentSection,
      internalLinks: internalLinks.filter((l) => l.label.trim() && l.url.trim()),
      published: formData.published,
      seo: { metaTitle: formData.metaTitle.trim(), metaDescription: formData.metaDescription.trim() },
    };

    try {
      if (isEditMode) {
        await updateLandingPage(initialData.id, payload);
        if (initialData.slug !== slug) await triggerRevalidation([`/${initialData.slug}`]);
        await triggerRevalidation([`/${slug}`]);
        toast.success("Page updated");
      } else {
        await createLandingPage(payload);
        await triggerRevalidation([`/${slug}`]);
        toast.success("Page created");
      }
      router.push("/admin/landing-pages");
      router.refresh();
    } catch (error) {
      console.error("Save landing page error:", error);
      toast.error("Failed to save page");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {/* Basic Info */}
      <div className="card p-6 space-y-4">
        <h3 className="font-display font-semibold text-primary">Page Basics</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">H1 / Page Title</label>
          <input name="h1" value={formData.h1} onChange={handleChange} placeholder="e.g. Hotels in Konkan – Find the Perfect Stay" className={errors.h1 ? inputClass.replace("border-gray-200", "border-red-300") : inputClass} />
          {errors.h1 && <p className="text-red-500 text-xs mt-1">{errors.h1}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug <span className="text-gray-400 font-normal">(leave blank to auto-generate)</span></label>
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-sm">yourdomain.com/</span>
            <input name="slug" value={formData.slug} onChange={handleChange} placeholder="hotels-in-konkan" className={inputClass} />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
          <textarea name="subtitle" value={formData.subtitle} onChange={handleChange} rows={2} className={inputClass} />
        </div>
        <ImageUploader value={heroImage} onChange={setHeroImage} folder="landing-pages" label="Hero Background Image" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input value={formData.ctaPrimaryText} onChange={(e) => setFormData((p) => ({ ...p, ctaPrimaryText: e.target.value }))} placeholder="Primary CTA text" className={inputClass} />
          <input value={formData.ctaPrimaryLink} onChange={(e) => setFormData((p) => ({ ...p, ctaPrimaryLink: e.target.value }))} placeholder="Primary CTA link" className={inputClass} />
          <input value={formData.ctaSecondaryText} onChange={(e) => setFormData((p) => ({ ...p, ctaSecondaryText: e.target.value }))} placeholder="Secondary CTA text" className={inputClass} />
          <input value={formData.ctaSecondaryLink} onChange={(e) => setFormData((p) => ({ ...p, ctaSecondaryLink: e.target.value }))} placeholder="Secondary CTA link" className={inputClass} />
        </div>
      </div>

      {/* Destinations Section */}
      <div className="card p-6 space-y-4">
        <h3 className="font-display font-semibold text-primary">Popular Destinations Section</h3>
        <input value={destinationsSection.heading} onChange={(e) => setDestinationsSection((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={destinationsSection.description} onChange={(e) => setDestinationsSection((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className={inputClass} />
        <EntityMultiSelect value={destinationsSection.destinationIds} onChange={(ids) => setDestinationsSection((p) => ({ ...p, destinationIds: ids }))} fetchAll={getAllDestinations} label="Select Destinations" placeholder="Search destinations..." />
      </div>

      {/* Hotels Section */}
      <div className="card p-6 space-y-4">
        <h3 className="font-display font-semibold text-primary">Featured Hotels Section</h3>
        <input value={hotelsSection.heading} onChange={(e) => setHotelsSection((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={hotelsSection.description} onChange={(e) => setHotelsSection((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className={inputClass} />
        <EntityMultiSelect value={hotelsSection.hotelIds} onChange={(ids) => setHotelsSection((p) => ({ ...p, hotelIds: ids }))} fetchAll={getAllHotels} label="Select Hotels" placeholder="Search hotels..." />
      </div>

      {/* Restaurants Section */}
      <div className="card p-6 space-y-4">
        <h3 className="font-display font-semibold text-primary">Featured Restaurants Section</h3>
        <input value={restaurantsSection.heading} onChange={(e) => setRestaurantsSection((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={restaurantsSection.description} onChange={(e) => setRestaurantsSection((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className={inputClass} />
        <EntityMultiSelect value={restaurantsSection.restaurantIds} onChange={(ids) => setRestaurantsSection((p) => ({ ...p, restaurantIds: ids }))} fetchAll={getAllRestaurants} label="Select Restaurants" placeholder="Search restaurants..." />
      </div>

      {/* Why Book Points */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-primary">Why Book With Us</h3>
          <button type="button" onClick={addWhyBookPoint} className="text-secondary text-sm font-medium hover:underline flex items-center gap-1"><FiPlus /> Add Point</button>
        </div>
        <input value={whyBookSection.heading} onChange={(e) => setWhyBookSection((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={whyBookSection.description} onChange={(e) => setWhyBookSection((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className={inputClass} />
        {whyBookSection.points.map((point, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
            <div className="flex gap-2">
              <input value={point.title} onChange={(e) => updateWhyBookPoint(i, "title", e.target.value)} placeholder="Point title" className={inputClass} />
              <button type="button" onClick={() => removeWhyBookPoint(i)} className="text-gray-400 hover:text-red-500 shrink-0"><FiTrash2 /></button>
            </div>
            <textarea value={point.description} onChange={(e) => updateWhyBookPoint(i, "description", e.target.value)} placeholder="Point description" rows={2} className={inputClass} />
          </div>
        ))}
      </div>

      {/* Explore Section (Markdown) */}
      <div className="card p-6 space-y-4">
        <h3 className="font-display font-semibold text-primary">Explore Region</h3>
        <input value={exploreSection.heading} onChange={(e) => setExploreSection((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={exploreSection.content} onChange={(e) => setExploreSection((p) => ({ ...p, content: e.target.value }))} placeholder="Markdown content..." rows={6} className={inputClass + " font-mono"} />
      </div>

      {/* Attractions */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-primary">Popular Attractions</h3>
          <button type="button" onClick={addAttraction} className="text-secondary text-sm font-medium hover:underline flex items-center gap-1"><FiPlus /> Add Attraction</button>
        </div>
        <input value={attractionsSection.heading} onChange={(e) => setAttractionsSection((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        {attractionsSection.attractions.map((a, i) => (
          <div key={i} className="border border-gray-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400 uppercase">Attraction {i + 1}</span>
              <button type="button" onClick={() => removeAttraction(i)} className="text-gray-400 hover:text-red-500"><FiTrash2 className="text-sm" /></button>
            </div>
            <input value={a.name} onChange={(e) => updateAttraction(i, "name", e.target.value)} placeholder="Name" className={inputClass} />
            <ImageUploader value={a.image} onChange={(img) => updateAttraction(i, "image", img)} folder="landing-pages" label="" />
            <textarea value={a.description} onChange={(e) => updateAttraction(i, "description", e.target.value)} placeholder="Short description" rows={2} className={inputClass} />
          </div>
        ))}
      </div>

      {/* Weekend Getaways */}
      <div className="card p-6 space-y-4">
        <h3 className="font-display font-semibold text-primary">Weekend Getaways Section</h3>
        <input value={weekendGetawaysSection.heading} onChange={(e) => setWeekendGetawaysSection((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={weekendGetawaysSection.description} onChange={(e) => setWeekendGetawaysSection((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className={inputClass} />
        <EntityMultiSelect value={weekendGetawaysSection.destinationIds} onChange={(ids) => setWeekendGetawaysSection((p) => ({ ...p, destinationIds: ids }))} fetchAll={getAllDestinations} label="Select Destinations" placeholder="Search destinations..." />
      </div>

      {/* Reviews Section */}
      <div className="card p-6 space-y-4">
        <h3 className="font-display font-semibold text-primary">Customer Reviews Section</h3>
        <input value={reviewsSection.heading} onChange={(e) => setReviewsSection((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={reviewsSection.description} onChange={(e) => setReviewsSection((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className={inputClass} />
        <p className="text-gray-400 text-xs">This section reuses your existing site testimonials automatically.</p>
      </div>

      {/* Owner CTA */}
      <div className="card p-6 space-y-4">
        <h3 className="font-display font-semibold text-primary">Hotel Owners CTA</h3>
        <input value={ownerCtaSection.heading} onChange={(e) => setOwnerCtaSection((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading" className={inputClass} />
        <textarea value={ownerCtaSection.description} onChange={(e) => setOwnerCtaSection((p) => ({ ...p, description: e.target.value }))} placeholder="Description" rows={2} className={inputClass} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input value={ownerCtaSection.ctaText} onChange={(e) => setOwnerCtaSection((p) => ({ ...p, ctaText: e.target.value }))} placeholder="CTA button text" className={inputClass} />
          <input value={ownerCtaSection.ctaLink} onChange={(e) => setOwnerCtaSection((p) => ({ ...p, ctaLink: e.target.value }))} placeholder="CTA link" className={inputClass} />
        </div>
      </div>

      {/* FAQs */}
      <div className="card p-6">
        <FaqEditor value={faqs} onChange={setFaqs} />
      </div>

      {/* SEO Content Section */}
      <div className="card p-6 space-y-4">
        <h3 className="font-display font-semibold text-primary">SEO Content Section</h3>
        <input value={seoContentSection.heading} onChange={(e) => setSeoContentSection((p) => ({ ...p, heading: e.target.value }))} placeholder="Heading (optional)" className={inputClass} />
        <textarea value={seoContentSection.content} onChange={(e) => setSeoContentSection((p) => ({ ...p, content: e.target.value }))} placeholder="Long-form SEO content (Markdown)..." rows={8} className={inputClass + " font-mono"} />
      </div>

      {/* Internal Links */}
      <div className="card p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-semibold text-primary">Internal Links</h3>
          <button type="button" onClick={addInternalLink} className="text-secondary text-sm font-medium hover:underline flex items-center gap-1"><FiPlus /> Add Link</button>
        </div>
        {internalLinks.map((link, i) => (
          <div key={i} className="flex gap-2">
            <input value={link.label} onChange={(e) => updateInternalLink(i, "label", e.target.value)} placeholder="Label (e.g. Hotels in Diveagar)" className={inputClass} />
            <input value={link.url} onChange={(e) => updateInternalLink(i, "url", e.target.value)} placeholder="/hotels-in-diveagar" className={inputClass} />
            <button type="button" onClick={() => removeInternalLink(i)} className="text-gray-400 hover:text-red-500 shrink-0"><FiTrash2 /></button>
          </div>
        ))}
      </div>

      {/* SEO Meta + Publish */}
      <div className="card p-6 space-y-4">
        <h3 className="font-display font-semibold text-primary">SEO Meta Tags</h3>
        <input name="metaTitle" value={formData.metaTitle} onChange={handleChange} placeholder="Meta title (optional, defaults to H1)" className={inputClass} />
        <textarea name="metaDescription" value={formData.metaDescription} onChange={handleChange} placeholder="Meta description (optional, defaults to subtitle)" rows={2} className={inputClass} />
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input type="checkbox" name="published" checked={formData.published} onChange={handleChange} className="w-4 h-4 accent-secondary rounded" />
          <span className="text-sm text-gray-700">Publish this page</span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={isSaving} className="btn-primary flex items-center gap-2 disabled:opacity-60">
          {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
          {isSaving ? "Saving..." : isEditMode ? "Update Page" : "Create Page"}
        </button>
        <button type="button" onClick={() => router.push("/admin/landing-pages")} className="text-gray-500 font-medium text-sm hover:text-primary">Cancel</button>
      </div>
    </form>
  );
}