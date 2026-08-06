// src/components/hotels/EnquiryConfirmModal.jsx
"use client";

import { FiX, FiCheckCircle } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

export default function EnquiryConfirmModal({
  isOpen,
  onClose,
  formData,
  hotel,
  onConfirm,
  isSending,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-gray-900 w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-xl text-primary dark:text-white">
            Confirm Your Enquiry
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full dark:bg-gray-800 flex items-center justify-center dark:text-gray-500 hover:bg-gray-200"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        <div className="bg-gray-50 dark:bg-gray-950 rounded-xl p-4 space-y-2 text-sm mb-6">
          <p className="font-medium text-primary dark:text-white mb-2">{hotel.name}</p>
          <div className="grid grid-cols-2 gap-y-1.5 dark:text-gray-300">
            <span className="dark:dark:text-gray-500">Name</span>
            <span>{formData.name}</span>

            <span className="dark:dark:text-gray-500">Phone</span>
            <span>{formData.phone}</span>

            {formData.email && (
              <>
                <span className="dark:dark:text-gray-500">Email</span>
                <span>{formData.email}</span>
              </>
            )}

            {formData.checkIn && (
              <>
                <span className="dark:dark:text-gray-500">Check-in</span>
                <span>{formData.checkIn}</span>
              </>
            )}

            {formData.checkOut && (
              <>
                <span className="dark:dark:text-gray-500">Check-out</span>
                <span>{formData.checkOut}</span>
              </>
            )}

            <span className="dark:dark:text-gray-500">Guests</span>
            <span>{formData.guests}</span>
          </div>
          {formData.message && (
            <p className="dark:text-gray-500 pt-2 border-t dark:border-gray-800 mt-2">
              "{formData.message}"
            </p>
          )}
        </div>

        <p className="dark:text-gray-500 text-sm mb-6 flex items-start gap-2">
          <FiCheckCircle className="text-accent shrink-0 mt-0.5" />
          Tapping below will open WhatsApp with this message ready to send to
          our team.
        </p>

        <button
          onClick={onConfirm}
          disabled={isSending}
          className="w-full bg-accent hover:bg-accent-dark text-white font-medium py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
        >
          <FaWhatsapp className="text-lg" />
          {isSending ? "Opening WhatsApp..." : "Open WhatsApp & Send"}
        </button>

        <button
          onClick={onClose}
          className="w-full dark:text-gray-500 text-sm font-medium py-3 hover:text-primary dark:text-white"
        >
          Go back and edit
        </button>
      </div>
    </div>
  );
}