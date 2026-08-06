// src/components/hotels/MobileStickyBar.jsx
"use client";

import { FaWhatsapp } from "react-icons/fa";
import { formatCurrency } from "@/utils/helpers";

export default function MobileStickyBar({ hotel }) {
  const scrollToForm = () => {
    document.getElementById("enquiry-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-900 border-t dark:border-gray-800 shadow-2xl px-4 py-3 flex items-center justify-between">
      <div>
        <p className="dark:dark:text-gray-500 text-xs">Starting from</p>
        <p className="font-display font-bold text-lg text-primary dark:text-white">
          {formatCurrency(hotel.price)}
          <span className="text-xs font-normal dark:dark:text-gray-500"> /night</span>
        </p>
      </div>
      <button
        onClick={scrollToForm}
        className="bg-accent text-white font-medium px-5 py-3 rounded-xl flex items-center gap-2"
      >
        <FaWhatsapp /> Enquire Now
      </button>
    </div>
  );
}