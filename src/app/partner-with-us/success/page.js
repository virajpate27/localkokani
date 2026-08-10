// src/app/partner-with-us/success/page.js
import Link from "next/link";
import { FiCheckCircle } from "react-icons/fi";

export const metadata = { title: "Application Submitted | StayFinder", robots: { index: false } };

export default async function PartnerSuccessPage({ searchParams }) {
  const { ref } = await searchParams;

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-accent/10 flex items-center justify-center mb-6">
          <FiCheckCircle className="text-accent-dark text-4xl" />
        </div>
        <h1 className="font-display font-bold text-2xl text-primary">Application Submitted!</h1>
        <p className="text-gray-500 mt-3">
          Your property has been successfully submitted and is currently under review.
          Our team will reach out via WhatsApp or email within 2-3 business days.
        </p>
        {ref && (
          <p className="text-gray-400 text-sm mt-4">
            Reference ID: <span className="font-mono font-medium text-primary">{ref}</span>
          </p>
        )}
        <Link href="/owner/dashboard" className="btn-primary inline-block mt-8">Back to Dashboard</Link>
      </div>
    </div>
  );
}