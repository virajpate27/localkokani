// src/components/restaurants/ReservationForm.jsx
"use client";

import { useState } from "react";
import { FiUser, FiPhone, FiCalendar, FiClock, FiUsers } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import { createLead } from "@/lib/services/leadService";

const initialFormState = { name: "", phone: "", date: "", time: "", guests: 2 };

export default function ReservationForm({ restaurant }) {
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
 const whatsappNumber = restaurant.whatsappNumber || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Please enter your name";
    const phoneDigits = formData.phone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10) newErrors.phone = "Enter a valid phone number";
    if (!formData.date) newErrors.date = "Please select a date";
    if (!formData.time) newErrors.time = "Please select a time";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Opens WhatsApp directly on the user's click — no intermediate await,
  // so it can't get popup-blocked (same fix as the hotel enquiry form, Day 13).
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix the highlighted fields");
      return;
    }

    const lines = [
      `Hi! I'd like to reserve a table at *${restaurant.name}* (${restaurant.destinationName}).`,
      ``,
      `👤 Name: ${formData.name.trim()}`,
      `📞 Phone: ${formData.phone.trim()}`,
      `📅 Date: ${formData.date}`,
      `🕐 Time: ${formData.time}`,
      `👥 Guests: ${formData.guests}`,
    ];
    const message = encodeURIComponent(lines.join("\n"));
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

    // Open WhatsApp FIRST (synchronous click, same popup-safe pattern as Day 13)
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    toast.success("Opening WhatsApp to confirm your reservation...");

    // Save the lead in the background — don't block the WhatsApp redirect on this
    createLead({
      entityType: "restaurant",
      entityId: restaurant.id,
      entitySlug: restaurant.slug,
      entityName: restaurant.name,
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      date: formData.date,
      time: formData.time,
      guests: Number(formData.guests),
      source: "restaurant_page",
    }).catch((error) => {
      console.error("Reservation lead save error:", error);
      // Non-critical — WhatsApp message already sent regardless
    });

    setFormData(initialFormState);
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <div className="relative">
          <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:dark:text-gray-500" />
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-secondary text-sm outline-none ${errors.name ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
              }`}
          />
        </div>
        {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
      </div>

      <div>
        <div className="relative">
          <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:dark:text-gray-500" />
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-secondary text-sm outline-none ${errors.phone ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
              }`}
          />
        </div>
        {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <input
            type="date"
            name="date"
            value={formData.date}
            min={today}
            onChange={handleChange}
            className={`w-full pl-3 pr-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-secondary text-sm outline-none ${errors.date ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
              }`}
          />
        </div>
        <div>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            className={`w-full pl-3 pr-2 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-secondary text-sm outline-none ${errors.time ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
              }`}
          />
        </div>
      </div>
      {errors.date && <p className="text-red-500 text-xs -mt-2">{errors.date}</p>}
      {errors.time && <p className="text-red-500 text-xs -mt-2">{errors.time}</p>}

      <div>
        <div className="relative">
          <FiUsers className="absolute left-3.5 top-1/2 -translate-y-1/2 dark:dark:text-gray-500" />
          <input
            type="number"
            name="guests"
            min={1}
            max={20}
            value={formData.guests}
            onChange={handleChange}
            className={`w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white focus:border-secondary text-sm outline-none ${errors.guests ? "border-red-300" : "dark:border-gray-800 focus:border-secondary"
              }`}
          />
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2"
      >
        <FaWhatsapp className="text-lg" /> Reserve on WhatsApp
      </button>
    </form>
  );
}