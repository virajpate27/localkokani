// src/app/error.js
"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FiAlertTriangle, FiRefreshCw, FiHome } from "react-icons/fi";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    // Log to your error tracking service here (e.g. Sentry) once set up
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-50 flex items-center justify-center mb-6">
          <FiAlertTriangle className="text-red-400 text-4xl" />
        </div>
        <h1 className="font-display font-bold text-2xl text-primary dark:text-white">
          Something went wrong
        </h1>
        <p className="dark:text-gray-500 mt-3">
          We hit an unexpected error. Please try again, or head back to the
          homepage.
        </p>
        <div className="flex flex-wrap justify-center gap-3 mt-8">
          <button
            onClick={reset}
            className="btn-primary flex items-center gap-2"
          >
            <FiRefreshCw /> Try Again
          </button>
          <Link
            href="/"
            className="bg-white dark:bg-gray-900 border dark:border-gray-800 text-primary dark:text-white font-medium px-6 py-3 rounded-xl hover:bg-gray-50 dark:bg-gray-950 transition-colors flex items-center gap-2"
          >
            <FiHome /> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}