// src/app/owner/dashboard/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus, FiLoader, FiLogOut, FiHome, FiCoffee } from "react-icons/fi";
import toast from "react-hot-toast";
import OwnerProtectedRoute from "@/components/owner/OwnerProtectedRoute";
import { useOwnerAuth } from "@/context/OwnerAuthContext";
import { getApplicationsByOwner } from "@/lib/services/partnerService";
import { useRouter } from "next/navigation";
import { getHotelsByOwner } from "@/lib/services/hotelService";
import { getRestaurantsByOwner } from "@/lib/services/restaurantService";

const statusStyles = {
  pending: "bg-secondary/10 text-secondary",
  approved: "bg-accent/10 text-accent-dark",
  rejected: "bg-red-50 text-red-500",
};

function DashboardContent() {
  const { ownerProfile, logout } = useOwnerAuth();
  const router = useRouter();
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [managedHotels, setManagedHotels] = useState([]);
  const [managedRestaurants, setManagedRestaurants] = useState([]);
  const { owner } = useOwnerAuth();

  useEffect(() => {
    if (owner) {
      getApplicationsByOwner(owner.uid)
        .then(setApplications)
        .finally(() => setIsLoading(false));
      getHotelsByOwner(owner.uid).then(setManagedHotels);
      getRestaurantsByOwner(owner.uid).then(setManagedRestaurants);
    }
  }, [owner]);

  const handleLogout = async () => {
    await logout();
    router.push("/owner/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-xl text-primary">
            Partner Dashboard
          </h1>
          <p className="text-gray-400 text-sm">
            Welcome, {ownerProfile?.fullName}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:text-primary"
        >
          <FiLogOut /> Log Out
        </button>
      </div>

      <div className="container-custom py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-500 text-sm">
            {applications.length} propert
            {applications.length === 1 ? "y" : "ies"} submitted
          </p>
          <Link
            href="/owner/register-property"
            className="btn-primary flex items-center gap-2"
          >
            <FiPlus /> Register New Property
          </Link>
        </div>

        {(managedHotels.length > 0 || managedRestaurants.length > 0) && (
          <div className="mb-8">
            <h2 className="font-display font-semibold text-lg text-primary mb-4">
              Your Live Listings (
              {managedHotels.length + managedRestaurants.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {managedHotels.map((hotel) => (
                <a
                  key={hotel.id}
                  href={`/hotels/${hotel.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FiHome className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary text-sm">
                      {hotel.name}
                    </p>
                    <p className="text-gray-400 text-xs">View live listing →</p>
                  </div>
                </a>
              ))}
              {managedRestaurants.map((restaurant) => (
                <a
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
                >
                  <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <FiCoffee className="text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-primary text-sm">
                      {restaurant.name}
                    </p>
                    <p className="text-gray-400 text-xs">View live listing →</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <FiLoader className="animate-spin text-2xl text-primary" />
          </div>
        ) : applications.length === 0 ? (
          <div className="card p-12 text-center">
            <FiHome className="text-4xl text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">
              You haven't registered any properties yet
            </p>
            <Link
              href="/owner/register-property"
              className="btn-primary inline-flex items-center gap-2"
            >
              <FiPlus /> Register Your First Property
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {applications.map((app) => (
              <div key={app.id} className="card p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center gap-1.5 text-secondary text-xs font-medium uppercase">
                    {app.property?.type === "hotel" ? <FiHome /> : <FiCoffee />}
                    {app.property?.type}
                  </span>
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${statusStyles[app.status]}`}
                  >
                    {app.status}
                  </span>
                </div>
                <p className="font-display font-semibold text-primary">
                  {app.property?.name}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Ref: {app.registrationId}
                </p>
                {app.status === "approved" && app.partnerId && (
                  <p className="text-accent-dark text-xs font-medium mt-2">
                    Partner ID: {app.partnerId}
                  </p>
                )}
                {app.status === "rejected" && app.reviewNotes && (
                  <p className="text-red-500 text-xs mt-2">
                    Reason: {app.reviewNotes}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function OwnerDashboardPage() {
  return (
    <OwnerProtectedRoute>
      <DashboardContent />
    </OwnerProtectedRoute>
  );
}
