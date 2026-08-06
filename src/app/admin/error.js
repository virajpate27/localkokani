// src/app/admin/error.js
"use client";

import { useEffect } from "react";
import { FiAlertTriangle, FiRefreshCw } from "react-icons/fi";

export default function AdminError({ error, reset }) {
  useEffect(() => {
    console.error("Admin panel error:", error);
  }, [error]);

  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <FiAlertTriangle className="text-4xl text-red-400 mx-auto mb-4" />
        <h2 className="font-display font-semibold text-xl text-primary dark:text-white">
          Admin panel error
        </h2>
        <p className="dark:text-gray-500 mt-2 text-sm">
          Something went wrong loading this section.
        </p>
        <button
          onClick={reset}
          className="btn-primary flex items-center gap-2 mx-auto mt-6"
        >
          <FiRefreshCw /> Try Again
        </button>
      </div>
    </div>
  );
}