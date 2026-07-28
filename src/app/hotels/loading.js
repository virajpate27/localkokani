// src/app/hotels/loading.js
import { HotelGridSkeleton } from "@/components/ui/Skeleton";

export default function HotelsLoading() {
  return (
    <div className="container-custom py-12">
      <div className="animate-pulse h-10 w-64 bg-gray-200 rounded-lg mb-8" />
      <HotelGridSkeleton count={6} />
    </div>
  );
}