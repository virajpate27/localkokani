// src/components/admin/QuickActions.jsx
import Link from "next/link";
import { FiPlus, FiMapPin, FiHome } from "react-icons/fi";

export default function QuickActions() {
  return (
    <div className="card p-6">
      <h3 className="font-display font-semibold text-primary mb-4">
        Quick Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-3">
        <Link
          href="/admin/destinations/new"
          className="flex items-center gap-3 border border-gray-100 rounded-xl p-4 hover:border-secondary hover:bg-secondary/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
            <FiMapPin className="text-secondary" />
          </div>
          <div>
            <p className="font-medium text-primary text-sm">Add Destination</p>
            <p className="text-gray-400 text-xs">Create a new destination</p>
          </div>
        </Link>

        <Link
          href="/admin/hotels/new"
          className="flex items-center gap-3 border border-gray-100 rounded-xl p-4 hover:border-accent hover:bg-accent/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
            <FiHome className="text-accent" />
          </div>
          <div>
            <p className="font-medium text-primary text-sm">Add Hotel</p>
            <p className="text-gray-400 text-xs">List a new hotel</p>
          </div>
        </Link>
        <Link
          href="/admin/restaurants/new"
          className="flex items-center gap-3 border border-gray-100 rounded-xl p-4 hover:border-primary hover:bg-primary/5 transition-colors"
        >
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
            <FiCoffee className="text-primary" />
          </div>
          <div>
            <p className="font-medium text-primary text-sm">Add Restaurant</p>
            <p className="text-gray-400 text-xs">List a new restaurant</p>
          </div>
        </Link>
      </div>
    </div>
  );
}