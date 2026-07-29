// src/components/hotels/ReviewsList.jsx
import { FiStar, FiUser } from "react-icons/fi";

function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ReviewsList({ reviews = [] }) {
  if (reviews.length === 0) {
    return (
      <p className="text-gray-400 text-sm py-6 text-center">
        No reviews yet. Be the first to share your experience!
      </p>
    );
  }

  return (
    <div className="space-y-5">
      {reviews.map((review) => (
        <div key={review.id} className="border-b border-gray-100 pb-5 last:border-0">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <FiUser className="text-primary text-sm" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between flex-wrap gap-1">
                <p className="font-medium text-primary text-sm">{review.guestName}</p>
                <span className="text-gray-400 text-xs">{formatDate(review.createdAt)}</span>
              </div>
              <div className="flex gap-0.5 mt-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <FiStar
                    key={i}
                    className={`text-xs ${
                      i < review.rating ? "text-accent fill-accent" : "text-gray-200"
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600 text-sm mt-2 leading-relaxed">
                {review.comment}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}