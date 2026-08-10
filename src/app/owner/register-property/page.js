// src/app/owner/register-property/page.js
"use client";

import OwnerProtectedRoute from "@/components/owner/OwnerProtectedRoute";
import PartnerRegistrationForm from "@/components/partner/PartnerRegistrationForm";

export default function RegisterPropertyPage() {
  return (
    <OwnerProtectedRoute>
      <div className="bg-gray-50 py-12 min-h-screen">
        <div className="container-custom">
          <PartnerRegistrationForm />
        </div>
      </div>
    </OwnerProtectedRoute>
  );
}