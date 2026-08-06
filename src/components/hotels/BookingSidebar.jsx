// src/components/hotels/BookingSidebar.jsx
import { FiStar, FiMapPin } from "react-icons/fi";
import { formatCurrency } from "@/utils/helpers";
import HotelEnquiryForm from "./HotelEnquiryForm";

export default function BookingSidebar({ hotel }) {
  return (
    <div id="enquiry-form" className="card p-6 lg:sticky lg:top-24">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="dark:dark:text-gray-500 text-xs">Starting from</p>
          <p className="font-display font-bold text-3xl text-primary dark:text-white">
            {formatCurrency(hotel.price)}
            <span className="text-sm font-normal dark:dark:text-gray-500"> /night</span>
          </p>
        </div>
        <div className="flex items-center gap-1 bg-primary/10 px-2.5 py-1.5 rounded-lg">
          <FiStar className="text-accent fill-accent" />
          <span className="font-semibold text-primary dark:text-white text-sm">
            {hotel.rating}
          </span>
        </div>
      </div>

      <p className="flex items-center gap-1.5 dark:text-gray-500 text-sm mb-6">
        <FiMapPin className="text-secondary" /> {hotel.address}
      </p>

      <HotelEnquiryForm hotel={hotel} />
    </div>
  );
}