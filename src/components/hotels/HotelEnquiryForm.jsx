// src/components/hotels/HotelEnquiryForm.jsx
"use client";

import { useState } from "react";
import { FiUser, FiPhone, FiMail, FiCalendar, FiUsers, FiMessageSquare } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import { createLead } from "@/lib/services/leadService";

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
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear the error for this field as soon as the user starts fixing it
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Please enter your name";
    }

    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!phoneDigits) {
      newErrors.phone = "Please enter your phone number";
    } else if (phoneDigits.length < 10) {
      newErrors.phone = "Enter a valid phone number";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (formData.checkIn && formData.checkOut) {
      if (new Date(formData.checkOut) <= new Date(formData.checkIn)) {
        newErrors.checkOut = "Check-out must be after check-in";
      }
    }

    if (formData.guests < 1) {
      newErrors.guests = "At least 1 guest is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildWhatsAppMessage = () => {
    const lines = [
      `Hi! I'd like to enquire about *${hotel.name}* (${hotel.destinationName}).`,
      ``,
      `👤 Name: ${formData.name}`,
      `📞 Phone: ${formData.phone}`,
    ];
    if (formData.email) lines.push(`📧 Email: ${formData.email}`);
    if (formData.checkIn) lines.push(`📅 Check-in: ${formData.checkIn}`);
    if (formData.checkOut) lines.push(`📅 Check-out: ${formData.checkOut}`);
    lines.push(`👥 Guests: ${formData.guests}`);
    if (formData.message) lines.push(``, `💬 ${formData.message}`);

    return encodeURIComponent(lines.join("\n"));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save the lead to Firestore so the admin can see it in the panel
      await createLead({
        hotelId: hotel.id,
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

      toast.success("Enquiry sent! Opening WhatsApp...");

      // Redirect to WhatsApp with the pre-filled message
      const message = buildWhatsAppMessage();
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

      setTimeout(() => {
        window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      }, 600);

      setFormData(initialFormState);
    } catch (error) {
      console.error("Lead submission error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
              errors.name
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-secondary"
            }`}
          />
        </div>
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name}</p>
        )}
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
            placeholder="Phone Number (WhatsApp)"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
              errors.phone
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-secondary"
            }`}
          />
        </div>
        {errors.phone && (
          <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
        )}
      </div>

      {/* Email (optional) */}
      <div>
        <div className="relative">
          <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email (optional)"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm outline-none transition-colors ${
              errors.email
                ? "border-red-300 focus:border-red-400"
                : "border-gray-200 focus:border-secondary"
            }`}
          />
        </div>
        {errors.email && (
          <p className="text-red-500 text-xs mt-1">{errors.email}</p>
        )}
      </div>

      {/* Check-in / Check-out */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <div className="relative">
            <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="date"
              name="checkIn"
              value={formData.checkIn}
              min={today}
              onChange={handleChange}
              className="w-full pl-10 pr-2 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none transition-colors"
            />
          </div>
        </div>
        <div>
          <div className="relative">
            <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="date"
              name="checkOut"
              value={formData.checkOut}
              min={formData.checkIn || today}
              onChange={handleChange}
              className={`w-full pl-10 pr-2 py-3 rounded-xl border text-sm outline-none transition-colors ${
                errors.checkOut
                  ? "border-red-300 focus:border-red-400"
                  : "border-gray-200 focus:border-secondary"
              }`}
            />
          </div>
        </div>
      </div>
      {errors.checkOut && (
        <p className="text-red-500 text-xs -mt-2">{errors.checkOut}</p>
      )}

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
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:border-secondary text-sm outline-none transition-colors"
          />
        </div>
      </div>

      {/* Message */}
      <div>
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
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <FaWhatsapp className="text-lg" />
        {isSubmitting ? "Sending..." : "Enquire on WhatsApp"}
      </button>

      <p className="text-center text-xs text-gray-400">
        We'll never share your details. Your enquiry goes straight to our team.
      </p>
    </form>
  );
}