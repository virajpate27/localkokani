// src/components/admin/ProtectedRoute.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { FiLoader } from "react-icons/fi";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/admin/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center">
          <FiLoader className="animate-spin text-3xl text-primary dark:text-white mx-auto mb-3" />
          <p className="dark:text-gray-500 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // brief flash before redirect fires
  }

  return children;
}