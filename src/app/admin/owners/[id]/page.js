// src/app/admin/owners/[id]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  FiLoader,
  FiMail,
  FiPhone,
  FiCalendar,
  FiHome,
  FiCoffee,
  FiArrowLeft,
  FiExternalLink,
} from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { getOwnerById } from "@/lib/services/ownerService";
import { getApplicationsByOwner } from "@/lib/services/partnerService";
import { getHotelsByOwner } from "@/lib/services/hotelService";
import { getRestaurantsByOwner } from "@/lib/services/restaurantService";
import Image from "next/image";

const statusStyles = {
  pending: "bg-secondary/10 text-secondary",
  approved: "bg-accent/10 text-accent-dark",
  rejected: "bg-red-50 text-red-500",
};

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOwnerDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [owner, setOwner] = useState(null);
  const [applications, setApplications] = useState([]);
  const [managedHotels, setManagedHotels] = useState([]); // ⬅️ ADD
  const [managedRestaurants, setManagedRestaurants] = useState([]); // ⬅️ ADD
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const [ownerData, appsData, hotelsData, restaurantsData] =
          await Promise.all([
            getOwnerById(id),
            getApplicationsByOwner(id),
            getHotelsByOwner(id), // ⬅️ ADD
            getRestaurantsByOwner(id), // ⬅️ ADD
          ]);
        if (!ownerData) {
          setNotFoundState(true);
        } else {
          setOwner(ownerData);
          setApplications(appsData);
          setManagedHotels(hotelsData); // ⬅️ ADD
          setManagedRestaurants(restaurantsData); // ⬅️ ADD
        }
      } catch {
        setNotFoundState(true);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <FiLoader className="animate-spin text-2xl text-primary" />
      </div>
    );
  }

  if (notFoundState) {
    return (
      <div className="card p-10 text-center">
        <p className="text-gray-400 mb-4">Owner not found.</p>
        <button
          onClick={() => router.push("/admin/owners")}
          className="text-secondary font-medium hover:underline"
        >
          Back to Owners
        </button>
      </div>
    );
  }

  const whatsappNumber = owner.whatsapp?.replace(/\D/g, "");
  const totalManagedListings = managedHotels.length + managedRestaurants.length;

  return (
    <div className="max-w-4xl space-y-6">
      <Link
        href="/admin/owners"
        className="flex items-center gap-2 text-gray-500 text-sm font-medium hover:text-primary w-fit"
      >
        <FiArrowLeft /> Back to Owners
      </Link>



      {/* Owner Profile Card */}
      <div className="card p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display font-bold text-2xl text-primary">
              {owner.fullName}
            </h1>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-1.5">
              <FiCalendar /> Joined {formatDate(owner.createdAt)}
            </p>
          </div>
          {whatsappNumber && (
            <Link
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-accent flex items-center gap-2"
            >
              <FaWhatsapp /> Message on WhatsApp
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2.5">
            <FiMail className="text-secondary shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">Email</p>
              <p className="font-medium text-primary text-sm">{owner.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <FiPhone className="text-secondary shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">Mobile</p>
              <p className="font-medium text-primary text-sm">{owner.mobile}</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <FaWhatsapp className="text-secondary shrink-0" />
            <div>
              <p className="text-gray-400 text-xs">WhatsApp</p>
              <p className="font-medium text-primary text-sm">
                {owner.whatsapp}
              </p>
            </div>
          </div>
        </div>
      </div>

       {/* NEW: Managed Listings Section */}
      <div>
        <h2 className="font-display font-semibold text-lg text-primary mb-4">
          Managed Listings ({totalManagedListings})
        </h2>

        {totalManagedListings === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-gray-400">No live listings are currently assigned to this owner.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {managedHotels.map((hotel) => (
              <Link
                key={hotel.id}
                href={`/admin/hotels/${hotel.id}/edit`}
                className="card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  {hotel.images?.[0]?.url && (
                    <Image src={hotel.images[0].url} alt={hotel.name} fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-secondary text-xs font-medium uppercase">
                    <FiHome className="text-[10px]" /> Hotel
                  </p>
                  <p className="font-medium text-primary text-sm truncate">{hotel.name}</p>
                  <p className="text-gray-400 text-xs">{hotel.destinationName}</p>
                </div>
              </Link>
            ))}
            {managedRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/admin/restaurants/${restaurant.id}/edit`}
                className="card p-4 flex items-center gap-3 hover:-translate-y-0.5 transition-transform"
              >
                <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                  {restaurant.images?.[0]?.url && (
                    <Image src={restaurant.images[0].url} alt={restaurant.name} fill sizes="56px" className="object-cover" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 text-secondary text-xs font-medium uppercase">
                    <FiCoffee className="text-[10px]" /> Restaurant
                  </p>
                  <p className="font-medium text-primary text-sm truncate">{restaurant.name}</p>
                  <p className="text-gray-400 text-xs">{restaurant.destinationName}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Applications List */}
      <div>
        <h2 className="font-display font-semibold text-lg text-primary mb-4">
         Properties Submitted ({applications.length})
        </h2>

        {applications.length === 0 ? (
          <div className="card p-10 text-center">
            <p className="text-gray-400">
              This owner hasn't submitted any properties yet.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <Link
                key={app.id}
                href={`/admin/partner-applications/${app.id}`}
                className="card p-5 flex items-center justify-between gap-4 hover:-translate-y-0.5 transition-transform block"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    {app.property?.type === "hotel" ? (
                      <FiHome className="text-primary" />
                    ) : (
                      <FiCoffee className="text-primary" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-primary truncate">
                      {app.property?.name}
                    </p>
                    <p className="text-gray-400 text-xs">
                      {app.registrationId} · {app.plan} plan · Submitted{" "}
                      {formatDate(app.submittedAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span
                    className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${statusStyles[app.status]}`}
                  >
                    {app.status}
                  </span>
                  <FiExternalLink className="text-gray-300" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
