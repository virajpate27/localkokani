// src/components/owner/OwnerProtectedRoute.jsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOwnerAuth } from "@/context/OwnerAuthContext";
import { FiLoader } from "react-icons/fi";

export default function OwnerProtectedRoute({ children }) {
  const { owner, loading } = useOwnerAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !owner) {
      router.replace("/owner/login");
    }
  }, [loading, owner, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <FiLoader className="animate-spin text-3xl text-primary" />
      </div>
    );
  }

  if (!owner) return null;

  return children;
}