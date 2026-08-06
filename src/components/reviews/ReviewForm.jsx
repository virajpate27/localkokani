// src/components/reviews/ReviewForm.jsx
// (moved from src/components/hotels/ to a shared location since it's now used by both)
"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { FiUser, FiSend, FiCheckCircle } from "react-icons/fi";
import StarRatingInput from "@/components/ui/StarRatingInput";
import { createReview } from "@/lib/services/reviewService";

export default function ReviewForm({ entityType, entity }) {
  const [guestName, setGuestName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!guestName.trim()) newErrors.guestName = "Please enter your name";
    if (rating === 0) newErrors.rating = "Please select a rating";
    if (!comment.trim()) newErrors.comment = "Please share your experience";
    else if (comment.trim().length < 10) newErrors.comment = "Please write a bit more (min 10 characters)";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await createReview({
        entityType,               // "hotel" | "restaurant"
        entityId: entity.id,
        entitySlug: entity.slug,
        entityName: entity.name,
        guestName: guestName.trim(),
        rating,
        comment: comment.trim(),
      });
      setSubmitted(true);
      setGuestName("");
      setRating(0);
      setComment("");
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error("Failed to submit review. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-accent/5 border border-accent/20 rounded-xl p-6 text-center">
        <FiCheckCircle className="text-accent text-3xl mx-auto mb-3" />
        <p className="font-medium text-primary dark:text-white">Thank you for your review!</p>
        <p className="dark:text-gray-500 text-sm mt-1">
          It will appear here once our team reviews it.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-secondary text-sm font-medium mt-4 hover:underline"
        >
          Write another review
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-950 rounded-xl p-6 space-y-4">
      <h3 className="font-display font-semibold text-primary dark:text-white">
        Share Your Experience
      </h3>

      <div>
        <label className="block text-sm font-medium dark:text-gray-300 mb-2">Your Rating</label>
        <StarRatingInput value={rating} onChange={setRating} />
        {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating}</p>}
      </div>

      <div>
        <label htmlFor="review-guest-name" className="sr-only">Your name</label>
        <div className="relative">
          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:dark:text-gray-500" />
          <input
            id="review-guest-name"
            type="text"
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Your name"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors bg-white dark:bg-gray-900 ${
              errors.guestName ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
            }`}
          />
        </div>
        {errors.guestName && <p className="text-red-500 text-xs mt-1">{errors.guestName}</p>}
      </div>

      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Tell other travelers about your experience..."
          className={`w-full px-4 py-3 rounded-xl border text-sm outline-none transition-colors resize-none bg-white dark:bg-gray-900 ${
            errors.comment ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
          }`}
        />
        {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary flex items-center gap-2 disabled:opacity-60"
      >
        <FiSend className="text-sm" />
        {isSubmitting ? "Submitting..." : "Submit Review"}
      </button>
      <p className="dark:dark:text-gray-500 text-xs">
        Reviews are moderated and typically appear within 24 hours.
      </p>
    </form>
  );
}