// src/app/admin/partner-applications/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiLoader, FiUsers, FiTrash2 } from "react-icons/fi";
import { getAllPartnerApplicationsAdmin } from "@/lib/services/partnerService";
import { deletePartnerApplication } from "@/lib/services/partnerService";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const statusStyles = {
  pending: "bg-secondary/10 text-secondary",
  approved: "bg-accent/10 text-accent-dark",
  rejected: "bg-red-50 text-red-500",
};

export default function AdminPartnerApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getAllPartnerApplicationsAdmin()
      .then(setApplications)
      .finally(() => setIsLoading(false));
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deletePartnerApplication(deleteTarget.id);
      setApplications((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      toast.success("Application deleted");
    } catch {
      toast.error("Failed to delete application");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filtered =
    statusFilter === "all"
      ? applications
      : applications.filter((a) => a.status === statusFilter);

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        {["all", "pending", "approved", "rejected"].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`text-sm font-medium px-4 py-2 rounded-lg capitalize transition-colors ${
              statusFilter === s
                ? "bg-primary text-white"
                : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <FiLoader className="animate-spin text-2xl text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <FiUsers className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">No applications found</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3.5 font-medium">Property</th>
                <th className="px-5 py-3.5 font-medium">Owner</th>
                <th className="px-5 py-3.5 font-medium">Type</th>
                <th className="px-5 py-3.5 font-medium">Plan</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium text-primary">
                    {app.property?.name}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {app.owner?.fullName}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 capitalize">
                    {app.property?.type}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600 capitalize">
                    {app.plan}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${statusStyles[app.status]}`}
                    >
                      {app.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/partner-applications/${app.id}`}
                        className="text-secondary font-medium hover:underline"
                      >
                        Review
                      </Link>
                      {app.status !== "approved" && ( // ⬅️ delete only available for pending/rejected, NEVER approved
                        <button
                          onClick={() => setDeleteTarget(app)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          aria-label="Delete application"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog
  isOpen={!!deleteTarget}
  title="Delete Application?"
  message={`Delete the application from "${deleteTarget?.property?.name}"? This cannot be undone.`}
  confirmLabel="Delete"
  isDangerous
  isLoading={isDeleting}
  onConfirm={handleDeleteConfirm}
  onCancel={() => setDeleteTarget(null)}
/>
    </div>
  );
}
