// src/components/hotels/BookingSidebar.jsx
import { FiStar, FiMapPin } from "react-icons/fi";
import { formatCurrency } from "@/utils/helpers";

export default function BookingSidebar({ hotel }) {
  return (
    <div className="card p-6 lg:sticky lg:top-24">
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
          <span className="font-semibold text-primary text-sm">
            {hotel.rating}
          </span>
        </div>
      </div>

      <p className="flex items-center gap-1.5 text-gray-500 text-sm mb-6">
        <FiMapPin className="text-secondary" /> {hotel.address}
      </p>

      {/* 
        Day 12 will replace this section with:
        <HotelEnquiryForm hotel={hotel} /> 
        (form fields + WhatsApp deep link submission)
      */}
      <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center text-gray-400 text-sm">
        Enquiry form coming in the next step
      </div>
    </div>
  );
}