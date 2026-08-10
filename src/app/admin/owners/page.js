// src/app/admin/owners/page.js
"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FiLoader, FiUsers, FiSearch, FiMail, FiPhone, FiHome } from "react-icons/fi";
import { getAllOwnersWithStats } from "@/lib/services/ownerService";
import OwnerStatusPills from "@/components/admin/OwnerStatusPills";

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function AdminOwnersPage() {
  const [owners, setOwners] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    getAllOwnersWithStats().then(setOwners).finally(() => setIsLoading(false));
  }, []);

  const filteredOwners = useMemo(() => {
    let result = owners;

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (o) =>
          o.fullName?.toLowerCase().includes(q) ||
          o.email?.toLowerCase().includes(q) ||
          o.mobile?.includes(q) ||
          o.whatsapp?.includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      if (sortBy === "most_properties") return b.applicationCount - a.applicationCount;
      if (sortBy === "name") return (a.fullName || "").localeCompare(b.fullName || "");
      return 0; // "newest" — already sorted by createdAt desc from the service
    });

    return result;
  }, [owners, searchQuery, sortBy]);

  // Summary stats for the top of the page
  const totalOwners = owners.length;
  const ownersWithApprovedListing = owners.filter((o) => o.approvedCount > 0).length;
  const ownersWithPendingOnly = owners.filter((o) => o.pendingCount > 0 && o.approvedCount === 0).length;

  return (
    <div>
      {/* Summary stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card p-5">
          <p className="text-gray-400 text-xs">Total Owners</p>
          <p className="font-display font-bold text-2xl text-primary mt-1">{totalOwners}</p>
        </div>
        <div className="card p-5">
          <p className="text-gray-400 text-xs">With Approved Listings</p>
          <p className="font-display font-bold text-2xl text-accent-dark mt-1">{ownersWithApprovedListing}</p>
        </div>
        <div className="card p-5">
          <p className="text-gray-400 text-xs">Awaiting Review</p>
          <p className="font-display font-bold text-2xl text-secondary mt-1">{ownersWithPendingOnly}</p>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, phone..."
            className="pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none w-full sm:w-72"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none bg-white"
        >
          <option value="newest">Newest First</option>
          <option value="most_properties">Most Properties</option>
          <option value="name">Name (A-Z)</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><FiLoader className="animate-spin text-2xl text-primary" /></div>
      ) : filteredOwners.length === 0 ? (
        <div className="card p-12 text-center">
          <FiUsers className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">
            {owners.length === 0 ? "No owners have registered yet" : "No owners match your search"}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Owner</th>
                  <th className="px-5 py-3.5 font-medium">Contact</th>
                  <th className="px-5 py-3.5 font-medium">Properties</th>
                  <th className="px-5 py-3.5 font-medium">Joined</th>
                  <th className="px-5 py-3.5 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOwners.map((owner) => (
                  <tr key={owner.uid} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-primary">{owner.fullName}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="flex items-center gap-1.5 text-gray-500 text-xs">
                        <FiMail className="shrink-0" /> {owner.email}
                      </p>
                      <p className="flex items-center gap-1.5 text-gray-500 text-xs mt-0.5">
                        <FiPhone className="shrink-0" /> {owner.mobile}
                      </p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2 mb-1">
                        <FiHome className="text-gray-400 text-xs" />
                        <span className="font-medium text-primary text-xs">{owner.applicationCount}</span>
                      </div>
                      <OwnerStatusPills approved={owner.approvedCount} pending={owner.pendingCount} rejected={owner.rejectedCount} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(owner.createdAt)}</td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/admin/owners/${owner.uid}`} className="text-secondary font-medium hover:underline text-sm">
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}