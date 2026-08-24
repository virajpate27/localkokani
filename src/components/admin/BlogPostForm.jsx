// src/components/admin/BlogPostForm.jsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FiSave, FiLoader, FiEye } from "react-icons/fi";
import ImageUploader from "./ImageUploader";
import MarkdownContent from "@/components/blog/MarkdownContent";
import { createPost, updatePost } from "@/lib/services/blogService";
import { getAllDestinations } from "@/lib/services/destinationService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import { slugify } from "@/utils/helpers";
import { triggerRevalidation } from "@/utils/revalidate";


const CATEGORIES = ["Travel Guide", "Tips & Tricks", "Food & Culture", "Adventure", "Budget Travel"];

export default function BlogPostForm({ initialData = null }) {
  const router = useRouter();
  const isEditMode = !!initialData;

  const [destinations, setDestinations] = useState([]);
  const [formData, setFormData] = useState({
    title: initialData?.title || "",
    excerpt: initialData?.excerpt || "",
    content: initialData?.content || "",
    category: initialData?.category || CATEGORIES[0],
    destinationId: initialData?.destinationId || "",
    published: initialData?.published ?? false,
    metaTitle: initialData?.seo?.metaTitle || "",
    metaDescription: initialData?.seo?.metaDescription || "",
  });
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || null);
  const [originalImage] = useState(initialData?.coverImage || null);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    getAllDestinations().then(setDestinations).catch(() => {});
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.excerpt.trim()) newErrors.excerpt = "Excerpt is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";
    if (!coverImage) newErrors.coverImage = "Please upload a cover image";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const calculateReadTime = (text) => {
    const wordsPerMinute = 200;
    const wordCount = text.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
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
      title: formData.title.trim(),
      slug: slugify(formData.title.trim()),
      excerpt: formData.excerpt.trim(),
      content: formData.content.trim(),
      category: formData.category,
      coverImage,
      destinationId: formData.destinationId || null,
      destinationSlug: selectedDestination?.slug || null,
      destinationName: selectedDestination?.name || null,
      readTimeMinutes: calculateReadTime(formData.content),
      published: formData.published,
      seo: {
        metaTitle: formData.metaTitle.trim(),
        metaDescription: formData.metaDescription.trim(),
      },
    };

   try {
  const pathsToRevalidate = new Set(["/blog", `/blog/${payload.slug}`]);

  if (isEditMode) {
    if (initialData.slug !== payload.slug) {
      pathsToRevalidate.add(`/blog/${initialData.slug}`);
    }
    // If the linked destination changed, revalidate both old and new destination pages too,
    // since blog posts can appear in a destination's related content (if you add that later)
    if (initialData.destinationSlug !== payload.destinationSlug) {
      if (initialData.destinationSlug) pathsToRevalidate.add(`/destinations/${initialData.destinationSlug}`);
      if (payload.destinationSlug) pathsToRevalidate.add(`/destinations/${payload.destinationSlug}`);
    }

    await updatePost(initialData.id, payload, initialData.published);
    if (originalImage?.publicId && originalImage.publicId !== coverImage?.publicId) {
      await deleteFromCloudinary(originalImage.publicId);
    }
    toast.success("Post updated");
  } else {
    await createPost(payload);
    toast.success("Post created");
  }

  await triggerRevalidation(Array.from(pathsToRevalidate));

  router.push("/admin/blog");
  router.refresh();
} catch (error) {
  console.error("Save post error:", error);
  toast.error("Failed to save post. Please try again.");
} finally {
  setIsSaving(false);
}
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      <div className="card p-6 space-y-5">
        <ImageUploader
          value={coverImage}
          onChange={setCoverImage}
          folder="blog"
          label="Cover Image"
        />
        {errors.coverImage && <p className="text-red-500 text-xs">{errors.coverImage}</p>}

        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Best Time to Visit Goa: A Season-by-Season Guide"
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
              errors.title ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
            }`}
          />
          {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-2">
            Excerpt <span className="dark:text-gray-500 font-normal">(shown in listings)</span>
          </label>
          <textarea
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            rows={2}
            placeholder="A short, compelling summary of this article..."
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none ${
              errors.excerpt ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
            }`}
          />
          {errors.excerpt && <p className="text-red-500 text-xs mt-1">{errors.excerpt}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-2">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 focus:border-secondary text-sm outline-none bg-white dark:bg-gray-900"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium dark:text-gray-300 mb-2">
              Related Destination <span className="dark:text-gray-500 font-normal">(optional)</span>
            </label>
            <select
              name="destinationId"
              value={formData.destinationId}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 focus:border-secondary text-sm outline-none bg-white dark:bg-gray-900"
            >
              <option value="">None</option>
              {destinations.map((dest) => (
                <option key={dest.id} value={dest.id}>{dest.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Content Editor */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium dark:text-gray-300">
            Content <span className="dark:text-gray-500 font-normal">(Markdown supported)</span>
          </label>
          <button
            type="button"
            onClick={() => setShowPreview((prev) => !prev)}
            className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:underline"
          >
            <FiEye /> {showPreview ? "Hide Preview" : "Show Preview"}
          </button>
        </div>

        <div className={`grid ${showPreview ? "grid-cols-1 lg:grid-cols-2 gap-5" : "grid-cols-1"}`}>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows={20}
            placeholder={`## Introduction\n\nStart writing your article here using Markdown...\n\n- Use lists\n- **Bold text**\n- [Links](https://example.com)`}
            className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none font-mono ${
              errors.content ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
            }`}
          />
          {showPreview && (
            <div className="border dark:border-gray-800 rounded-xl p-5 overflow-y-auto max-h-[600px] bg-gray-50 dark:bg-gray-950">
              <MarkdownContent content={formData.content || "*Nothing to preview yet*"} />
            </div>
          )}
        </div>
        {errors.content && <p className="text-red-500 text-xs mt-1">{errors.content}</p>}
      </div>

      {/* SEO */}
      <div className="card p-6 space-y-5">
        <h3 className="font-display font-semibold text-primary dark:text-white">
          SEO Settings <span className="dark:text-gray-500 font-normal text-sm">(optional)</span>
        </h3>
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-2">Meta Title</label>
          <input
            type="text"
            name="metaTitle"
            value={formData.metaTitle}
            onChange={handleChange}
            placeholder={formData.title ? `${formData.title} | StayFinder Blog` : ""}
            className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 focus:border-secondary text-sm outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-gray-300 mb-2">Meta Description</label>
          <textarea
            name="metaDescription"
            value={formData.metaDescription}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 rounded-xl border dark:border-gray-800 focus:border-secondary text-sm outline-none resize-none"
          />
        </div>
      </div>

      {/* Publish toggle */}
      <div className="card p-6">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            name="published"
            checked={formData.published}
            onChange={handleChange}
            className="w-4 h-4 accent-secondary rounded"
          />
          <span className="text-sm dark:text-gray-300">
            Publish immediately (uncheck to save as draft)
          </span>
        </label>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="btn-primary flex items-center gap-2 disabled:opacity-60"
        >
          {isSaving ? <FiLoader className="animate-spin" /> : <FiSave />}
          {isSaving ? "Saving..." : isEditMode ? "Update Post" : "Create Post"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="dark:text-gray-500 font-medium text-sm hover:text-primary dark:text-white"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}