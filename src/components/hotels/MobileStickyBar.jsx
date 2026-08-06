// src/components/hotels/MobileStickyBar.jsx
"use client";

import { FaWhatsapp } from "react-icons/fa";
import { formatCurrency } from "@/utils/helpers";

export default function MobileStickyBar({ hotel }) {
  const isSoldOut = hotel.availabilityStatus === "soldout";

  const scrollToForm = () => {
    document.getElementById("enquiry-form")?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl px-4 py-3 flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-xs">Starting from</p>
        <p className="font-display font-bold text-lg text-primary">
          {formatCurrency(hotel.price)}
          <span className="text-xs font-normal text-gray-400"> /night</span>
        </p>
      </div>
      <button
        onClick={scrollToForm}
        disabled={isSoldOut}
        className={`font-medium px-5 py-3 rounded-xl flex items-center gap-2 ${
          isSoldOut
            ? "bg-gray-200 text-gray-400 cursor-not-allowed"
            : "bg-accent text-white"
        }`}
      >
        {isSoldOut ? "Sold Out" : (
          <>
            <FaWhatsapp /> Enquire Now
          </>
        )}
      </button>
    </div>
  );
}