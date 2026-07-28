// src/app/destinations/[slug]/loading.js
import { Skeleton, HotelGridSkeleton } from "@/components/ui/Skeleton";

export default function DestinationDetailLoading() {
  return (
    <div>
      <Skeleton className="h-[45vh] w-full rounded-none" />
      <div className="container-custom py-12">
        <Skeleton className="h-6 w-48 mb-4" />
        <Skeleton className="h-20 w-full mb-10" />
        <HotelGridSkeleton count={3} />
      </div>
    </div>
  );
}