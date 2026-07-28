// src/app/admin/destinations/new/page.js
import DestinationForm from "@/components/admin/DestinationForm";

export default function NewDestinationPage() {
  return (
    <div>
      <p className="text-gray-400 text-sm mb-6">
        Fill in the details below to add a new destination.
      </p>
      <DestinationForm />
    </div>
  );
}