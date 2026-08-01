// src/components/admin/LeadDetailModal.jsx
"use client";

import {
  FiX, FiPhone, FiMail, FiCalendar, FiClock, FiUsers,
  FiMessageSquare, FiHome, FiCoffee,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import Link from "next/link";

const statusOptions = [
  { value: "new", label: "New", color: "bg-secondary/10 text-secondary" },
  { value: "contacted", label: "Contacted", color: "bg-accent/10 text-accent-dark" },
  { value: "closed", label: "Closed", color: "bg-gray-100 text-gray-500" },
];

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function LeadDetailModal({ lead, onClose, onStatusChange }) {
  if (!lead) return null;

  const isRestaurant = lead.entityType === "restaurant";
  const whatsappNumber = lead.phone?.replace(/\D/g, "");
  const whatsappMessage = encodeURIComponent(
    isRestaurant
      ? `Hi ${lead.name}, thanks for your reservation request at ${lead.entityName}! Confirming your table now.`
      : `Hi ${lead.name}, thanks for your enquiry about ${lead.entityName}! How can we help?`
  );

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-bold text-xl text-primary">
            {isRestaurant ? "Reservation Details" : "Enquiry Details"}
          </h3>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
            aria-label="Close"
          >
            <FiX />
          </button>
        </div>

        {/* Status selector */}
        <div className="flex gap-2 mb-6">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => onStatusChange(lead.id, opt.value)}
              className={`flex-1 text-sm font-medium py-2 rounded-lg transition-all ${
                lead.status === opt.value
                  ? opt.color + " ring-2 ring-offset-1 ring-current"
                  : "bg-gray-50 text-gray-400 hover:bg-gray-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {/* Entity (hotel or restaurant) */}
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-4">
            <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              {isRestaurant ? (
                <FiCoffee className="text-primary" />
              ) : (
                <FiHome className="text-primary" />
              )}
            </div>
            <div>
              <p className="text-gray-400 text-xs">
                {isRestaurant ? "Restaurant" : "Hotel"}
              </p>
              <p className="font-medium text-primary">{lead.entityName}</p>
            </div>
          </div>

          {/* Contact info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="flex items-center gap-2.5">
              <FiPhone className="text-secondary shrink-0" />
              <div className="min-w-0">
                <p className="text-gray-400 text-xs">Phone</p>
                <p className="font-medium text-primary text-sm truncate">{lead.phone}</p>
              </div>
            </div>
            {lead.email && (
              <div className="flex items-center gap-2.5">
                <FiMail className="text-secondary shrink-0" />
                <div className="min-w-0">
                  <p className="text-gray-400 text-xs">Email</p>
                  <p className="font-medium text-primary text-sm truncate">{lead.email}</p>
                </div>
              </div>
            )}
          </div>

          {/* Dates — different fields for hotel (check-in/out) vs restaurant (date/time) */}
          {isRestaurant ? (
            (lead.date || lead.time) && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5">
                  <FiCalendar className="text-secondary shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Date</p>
                    <p className="font-medium text-primary text-sm">{lead.date || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <FiClock className="text-secondary shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Time</p>
                    <p className="font-medium text-primary text-sm">{lead.time || "—"}</p>
                  </div>
                </div>
              </div>
            )
          ) : (
            (lead.checkIn || lead.checkOut) && (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2.5">
                  <FiCalendar className="text-secondary shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Check-in</p>
                    <p className="font-medium text-primary text-sm">{lead.checkIn || "—"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <FiCalendar className="text-secondary shrink-0" />
                  <div>
                    <p className="text-gray-400 text-xs">Check-out</p>
                    <p className="font-medium text-primary text-sm">{lead.checkOut || "—"}</p>
                  </div>
                </div>
              </div>
            )
          )}

          {/* Guests */}
          <div className="flex items-center gap-2.5">
            <FiUsers className="text-secondary shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">Guests</p>
              <p className="font-medium text-primary text-sm">{lead.guests}</p>
            </div>
          </div>

          {/* Message (only present on hotel enquiries) */}
          {lead.message && (
            <div className="flex items-start gap-2.5">
              <FiMessageSquare className="text-secondary shrink-0 mt-0.5" />
              <div>
                <p className="text-gray-400 text-xs">Message</p>
                <p className="text-gray-700 text-sm">{lead.message}</p>
              </div>
            </div>
          )}

          <p className="text-gray-400 text-xs pt-3 border-t border-gray-100">
            Submitted on {formatDate(lead.createdAt)}
          </p>
        </div>

        {whatsappNumber && (
          <Link
            href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-accent w-full flex items-center justify-center gap-2 mt-6"
          >
            <FaWhatsapp className="text-lg" /> Reply on WhatsApp
          </Link>
        )}
      </div>
    </div>
  );
}