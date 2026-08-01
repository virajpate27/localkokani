// src/components/hotels/HotelEnquiryForm.jsx
"use client";

import { useState } from "react";
import { FiUser, FiPhone, FiMail, FiCalendar, FiUsers, FiMessageSquare, FiCheckCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import { createLead } from "@/lib/services/leadService";
import EnquiryConfirmModal from "./EnquiryConfirmModal";

const initialFormState = {
  name: "",
  phone: "",
  email: "",
  checkIn: "",
  checkOut: "",
  guests: 2,
  message: "",
};

export default function HotelEnquiryForm({ hotel }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [fallbackUrl, setFallbackUrl] = useState(null);

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name seems too short";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!phoneDigits) {
      newErrors.phone = "Please enter your phone number";
    } else if (phoneDigits.length < 10 || phoneDigits.length > 13) {
      newErrors.phone = "Enter a valid phone number with country code";
    }

    if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }

    if (formData.checkIn) {
      const checkInDate = new Date(formData.checkIn);
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      if (checkInDate < todayDate) {
        newErrors.checkIn = "Check-in date can't be in the past";
      }
    }

    if (formData.checkIn && formData.checkOut) {
      if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        newErrors.checkOut = "Check-out must be after check-in";
      }
    }

    const guestsNum = Number(formData.guests);
    if (!guestsNum || guestsNum < 1) {
      newErrors.guests = "At least 1 guest is required";
    } else if (guestsNum > 20) {
      newErrors.guests = "For groups above 20, please message us directly";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      `Hi! I'd like to enquire about *${hotel.name}* (${hotel.destinationName}).`,
      ``,
      `👤 Name: ${formData.name.trim()}`,
      `📞 Phone: ${formData.phone.trim()}`,
    ];
    if (formData.email.trim()) lines.push(`📧 Email: ${formData.email.trim()}`);
    if (formData.checkIn) lines.push(`📅 Check-in: ${formData.checkIn}`);
    if (formData.checkOut) lines.push(`📅 Check-out: ${formData.checkOut}`);
    lines.push(`👥 Guests: ${formData.guests}`);
    if (formData.message.trim()) lines.push(``, `💬 ${formData.message.trim()}`);

    return encodeURIComponent(lines.join("\n"));
  };

  // Step 1: validate, then open confirmation modal (no async work yet — keeps it fast)
  const handleReviewClick = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }
    setShowModal(true);
  };

  // Step 2: user confirms inside the modal — THIS click is what opens WhatsApp,
  // so it's a direct user gesture and won't get popup-blocked.
  const handleConfirmSend = async () => {
    setIsSending(true);

    const message = buildWhatsAppMessage();
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Open WhatsApp FIRST (synchronously, on the click), before any await —
    // this is the critical fix for popup blockers on Safari/iOS.
    const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    // Save the lead in the background — don't block the WhatsApp redirect on this
    try {
      await createLead({
        entityType: "hotel", // ⬅️ ADD
        entityId: hotel.id,
        entitySlug: hotel.slug, // ⬅️ ADD (wasn't captured before either!)
        entityName: hotel.name,
        hotelId: hotel.id,       // keep legacy fields too, harmless
        hotelName: hotel.name,
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: Number(formData.guests),
        message: formData.message.trim(),
        source: "hotel_page",
      });
    } catch (error) {
      console.error("Lead submission error:", error);
      // Don't block the user's WhatsApp flow over a logging failure —
      // but do let them know their enquiry might not be tracked on our end.
      toast.error("Message sent, but we couldn't save your enquiry details.");
    }

    if (!newWindow || newWindow.closed) {
      // Popup was blocked — show a fallback manual link instead of failing silently
      setFallbackUrl(whatsappUrl);
    } else {
      setShowModal(false);
      setSubmitted(true);
      setFormData(initialFormState);
    }

    setIsSending(false);
  };

  const today = new Date().toISOString().split("T")[0];

  // Success state — shown after WhatsApp opens successfully
  if (submitted) {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-accent/10 flex items-center justify-center mb-4">
          <FiCheckCircle className="text-accent text-3xl" />
        </div>
        <h3 className="font-display font-semibold text-lg text-primary">
          Enquiry Sent!
        </h3>
        <p className="text-gray-500 text-sm mt-2">
          We've opened WhatsApp for you — send the message and our team will
          respond shortly.
        </p>
        <button
          onClick={() => setSubmitted(false)}
          className="text-secondary text-sm font-medium mt-4 hover:underline"
        >
          Send another enquiry
        </button>
      </div>
    );
  }

  return (
    <>
      <form onSubmit={handleReviewClick} className="space-y-4">
        {/* Name */}
        <div>

          <div className="relative">
            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.name ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-secondary"
                }`}
            />
          </div>
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        {/* Phone */}
        <div>
          <div className="relative">
            <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number (with country code)"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.phone ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-secondary"
                }`}
            />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email (optional)"
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.email ? "border-red-300 focus:border-red-400" : "border-gray-200 focus:border-secondary"
                }`}
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              min={today}
              onChange={handleChange}
              className={`w-full pl-3 pr-2 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.checkIn ? "border-red-300" : "border-gray-200 focus:border-secondary"
                }`}
            />
          </div>
          <div>
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              min={formData.checkIn || today}
              onChange={handleChange}
              className={`w-full pl-3 pr-2 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.checkOut ? "border-red-300" : "border-gray-200 focus:border-secondary"
                }`}
            />
          </div>
        </div>
        {errors.checkIn && <p className="text-red-500 text-xs -mt-2">{errors.checkIn}</p>}
        {errors.checkOut && <p className="text-red-500 text-xs -mt-2">{errors.checkOut}</p>}

        {/* Guests */}
        <div>
          <div className="relative">
            <FiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="number"
              name="guests"
              min={1}
              max={20}
              value={formData.guests}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors ${errors.guests ? "border-red-300" : "border-gray-200 focus:border-secondary"
                }`}
            />
          </div>
          {errors.guests && <p className="text-red-500 text-xs mt-1">{errors.guests}</p>}
        </div>

        {/* Message */}
        <div className="relative">
          <FiMessageSquare className="absolute left-3.5 top-3.5 text-gray-400" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Any special requests? (optional)"
            rows={3}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none transition-colors resize-none"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <FaWhatsapp className="text-lg" />
          Review & Send on WhatsApp
        </button>

        <p className="text-center text-xs text-gray-400">
          We'll never share your details. Your enquiry goes straight to our team.
        </p>
      </form>

      <EnquiryConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        formData={formData}
        hotel={hotel}
        onConfirm={handleConfirmSend}
        isSending={isSending}
      />

      {/* Popup-blocked fallback */}
      {fallbackUrl && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 z-[110] bg-white border border-gray-200 shadow-2xl rounded-xl p-4">
          <p className="text-sm text-gray-700 mb-3">
            Your browser blocked the WhatsApp popup. Tap below to continue:
          </p>
          <Link
            href={fallbackUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => {
              setFallbackUrl(null);
              setShowModal(false);
              setSubmitted(true);
              setFormData(initialFormState);
            }}
            className="btn-accent w-full flex items-center justify-center gap-2"
          >
            <FaWhatsapp /> Open WhatsApp
          </Link>
        </div>
      )}
    </>
  );
}