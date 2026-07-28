// src/app/admin/layout.js
"use client";

import { usePathname } from "next/navigation";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminTopbar from "@/components/admin/AdminTopbar";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  // Login page renders standalone, without the sidebar/topbar shell
  if (isLoginPage) {
    return children;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminTopbar />
          <main className="flex-1 p-6 lg:p-8">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  );
}