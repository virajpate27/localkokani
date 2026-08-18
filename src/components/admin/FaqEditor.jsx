// src/components/admin/FaqEditor.jsx
"use client";

import { FiPlus, FiTrash2, FiHelpCircle } from "react-icons/fi";

export default function FaqEditor({ value = [], onChange }) {
  const addFaq = () => {
    onChange([...value, { question: "", answer: "" }]);
  };

  const updateFaq = (index, field, fieldValue) => {
    const updated = [...value];
    updated[index] = { ...updated[index], [field]: fieldValue };
    onChange(updated);
  };

  const removeFaq = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const moveFaq = (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= value.length) return;
    const updated = [...value];
    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];
    onChange(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 flex items-center gap-1.5">
            <FiHelpCircle className="text-secondary" /> Frequently Asked Questions
          </label>
          <p className="text-gray-400 text-xs mt-0.5">Optional — helps answer common guest questions and improves SEO</p>
        </div>
        <button
          type="button"
          onClick={addFaq}
          className="flex items-center gap-1.5 text-secondary text-sm font-medium hover:underline shrink-0"
        >
          <FiPlus /> Add Question
        </button>
      </div>

      {value.length === 0 ? (
        <p className="text-gray-400 text-sm border border-dashed border-gray-200 rounded-xl p-5 text-center">
          No FAQs added yet
        </p>
      ) : (
        <div className="space-y-3">
          {value.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-400 uppercase">Question {index + 1}</span>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveFaq(index, -1)}
                    disabled={index === 0}
                    className="text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed text-xs px-1.5"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFaq(index, 1)}
                    disabled={index === value.length - 1}
                    className="text-gray-400 hover:text-primary disabled:opacity-30 disabled:cursor-not-allowed text-xs px-1.5"
                    title="Move down"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFaq(index)}
                    className="text-gray-400 hover:text-red-500 ml-1"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
              <input
                type="text"
                value={faq.question}
                onChange={(e) => updateFaq(index, "question", e.target.value)}
                placeholder="e.g. Is breakfast included?"
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none"
              />
              <textarea
                value={faq.answer}
                onChange={(e) => updateFaq(index, "answer", e.target.value)}
                placeholder="e.g. Yes, complimentary breakfast is included for all bookings."
                rows={2}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none resize-none"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}