// src/components/hotels/BookingSidebar.jsx
import { FiStar, FiMapPin } from "react-icons/fi";
import { formatCurrency } from "@/utils/helpers";
import HotelEnquiryForm from "./HotelEnquiryForm";
import AvailabilityBadge from "@/components/ui/AvailabilityBadge";


export default function BookingSidebar({ hotel }) {
  const isSoldOut = hotel.availabilityStatus === "soldout";

  return (
    <div id="enquiry-form" className="card p-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-gray-400 text-xs">Starting from</p>
          <p className="font-display font-bold text-3xl text-primary">
            {formatCurrency(hotel.price)}
            <span className="text-sm font-normal text-gray-400"> /night</span>
          </p>
        </div>
        <div className="flex items-center gap-1 bg-primary/10 px-2.5 py-1.5 rounded-lg">
          <FiStar className="text-accent fill-accent" />
          <span className="font-semibold text-primary text-sm">{hotel.rating}</span>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-gray-500 text-sm mb-4">
        <FiMapPin className="text-secondary" /> {hotel.address}
      </p>

      {isSoldOut ? (
        <div className="text-center py-6">
          <AvailabilityBadge status="soldout" message={hotel.availabilityMessage} size="lg" />
          <p className="text-gray-500 text-sm mt-4">
            This hotel is currently unavailable. Check back later, or explore similar hotels in {hotel.destinationName}.
          </p>
        </div>
      ) : (
        <>
          {hotel.availabilityStatus === "limited" && (
            <div className="mb-4">
              <AvailabilityBadge status="limited" message={hotel.availabilityMessage} size="lg" />
            </div>
          )}
          <HotelEnquiryForm hotel={hotel} />
        </>
      )}
    </div>
  );
}