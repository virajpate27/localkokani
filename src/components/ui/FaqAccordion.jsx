// src/components/ui/FaqAccordion.jsx
"use client";

import { useState } from "react";
import { FiChevronDown } from "react-icons/fi";

export default function FaqAccordion({ faqs = [] }) {
  const [openIndex, setOpenIndex] = useState(null);

  const validFaqs = faqs.filter((f) => f.question?.trim() && f.answer?.trim());
  if (validFaqs.length === 0) return null;

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="space-y-2">
      {validFaqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className="border border-gray-100 rounded-xl overflow-hidden">
            <button
              onClick={() => toggle(index)}
              aria-expanded={isOpen}
              className="w-full flex bg-gray-50 dark:bg-gray-950 items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-medium text-primary dark:text-white text-sm">{faq.question}</span>
              <FiChevronDown
                className={`text-gray-400 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
              />
            </button>
            <div
              className={`grid transition-all bg-gray-50 dark:bg-gray-950  duration-200 ease-in-out ${
                isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="text-gray-600 dark:text-white text-sm px-5 pb-4 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}