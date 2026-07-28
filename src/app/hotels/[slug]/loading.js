// src/app/hotels/[slug]/loading.js
import { Skeleton } from "@/components/ui/Skeleton";

export default function HotelDetailLoading() {
  return (
    <div className="container-custom py-8">
      <Skeleton className="h-4 w-48 mb-6" />
      <Skeleton className="h-10 w-2/3 mb-8" />
      <Skeleton className="aspect-[16/9] w-full mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-10">
        <div className="space-y-6">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    </div>
  );
}