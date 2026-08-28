// src/components/ui/ServiceUnavailable.jsx
import { FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { SITE_NAME } from "@/lib/siteConfig";

export default function ServiceUnavailable({
  title = "We're experiencing technical difficulties",
  message = "Something went wrong on our end. Please try again in a moment, or reach us directly.",
  showWhatsApp = true,
}) {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const whatsappMessage = encodeURIComponent(
    `Hi! I was trying to browse ${SITE_NAME} but the page didn't load properly. Can you help?`
  );

  return (
    <div className="min-h-[50vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-50 flex items-center justify-center mb-5">
          <FiAlertCircle className="text-orange-400 text-3xl" />
        </div>
        <h2 className="font-display font-semibold text-xl text-primary">{title}</h2>
        <p className="text-gray-500 text-sm mt-2">{message}</p>

        <div className="flex flex-wrap justify-center gap-3 mt-7">
          <button
            onClick={() => window.location.reload()}
            className="btn-primary flex items-center gap-2"
          >
            <FiRefreshCw /> Try Again
          </button>
          {showWhatsApp && whatsappNumber && (
            
             <a href={`https://wa.me/${whatsappNumber}?text=${whatsappMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-accent hover:bg-accent-dark text-white font-medium px-6 py-3 rounded-xl transition-colors flex items-center gap-2"
            >
              <FaWhatsapp /> Contact Us on WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}