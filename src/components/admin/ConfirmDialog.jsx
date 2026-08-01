// src/components/admin/ConfirmDialog.jsx
"use client";

import { FiAlertTriangle, FiLoader } from "react-icons/fi";
import { useFocusTrap } from "@/hooks/useFocusTrap";

export default function ConfirmDialog({
  isOpen, title, message, confirmLabel = "Confirm",
  isDangerous = false, isLoading = false, onConfirm, onCancel,
}) {

    const modalRef = useFocusTrap(isOpen);

    
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="bg-white rounded-2xl p-6 max-w-sm w-full animate-slide-up"
      >
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isDangerous ? "bg-red-50 text-red-500" : "bg-primary/10 text-primary"
            }`}>
            <FiAlertTriangle />
          </div>
          <h3 id="confirm-dialog-title" className="font-display font-semibold text-lg text-primary">
            {title}
          </h3>
        </div>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 border border-gray-200 text-gray-600 font-medium py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 font-medium py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60 ${isDangerous
                ? "bg-red-500 hover:bg-red-600 text-white"
                : "bg-primary hover:bg-primary-dark text-white"
              }`}
          >
            {isLoading && <FiLoader className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}