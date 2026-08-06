// src/app/search/loading.js
import { HotelGridSkeleton } from "@/components/ui/Skeleton";

export default function SearchLoading() {
  return (
    <div>
      <div className="bg-hero-gradient py-12">
        <div className="container-custom">
          <div className="h-9 w-72 bg-white dark:bg-gray-900/20 rounded-lg mx-auto animate-pulse" />
          <div className="h-14 max-w-2xl mx-auto bg-white dark:bg-gray-900/90 rounded-2xl mt-6 animate-pulse" />
        </div>
      </div>
      <div className="container-custom py-12">
        <HotelGridSkeleton count={6} />
      </div>
    </div>
  );
}