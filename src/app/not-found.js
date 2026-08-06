// src/app/not-found.js
import Link from "next/link";
import { FiMapPin, FiHome } from "react-icons/fi";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 dark:bg-gray-950">
      <div className="text-center px-4">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
          <FiMapPin className="text-primary dark:text-white text-4xl" />
        </div>
        <h1 className="font-display font-extrabold text-6xl text-primary dark:text-white">
          404
        </h1>
        <p className="font-display font-semibold text-xl dark:text-gray-300 mt-4">
          Looks like this page took a wrong turn
        </p>
        <p className="dark:text-gray-500 mt-2 max-w-md mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>
        <Link
          href="/"
          className="btn-primary inline-flex items-center gap-2 mt-8"
        >
          <FiHome /> Back to Homepage
        </Link>
      </div>
    </div>
  );
}