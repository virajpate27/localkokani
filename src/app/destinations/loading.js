// src/app/destinations/loading.js
import { DestinationCardSkeleton } from "@/components/ui/Skeleton";

export default function DestinationsLoading() {
  return (
    <div className="container-custom py-16">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <DestinationCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}