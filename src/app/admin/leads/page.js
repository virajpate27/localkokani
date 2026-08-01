// src/app/admin/leads/page.js
"use client";

import { useState, useEffect, useMemo } from "react";
import {
  FiLoader,
  FiSearch,
  FiDownload,
  FiMessageSquare,
  FiTrash2,
  FiHome,
  FiCoffee,
} from "react-icons/fi";

import toast from "react-hot-toast";
import {
  getAllLeads,
  updateLeadStatus,
  deleteLead,
} from "@/lib/services/leadService";
import { exportToCSV } from "@/utils/csvExport";
import LeadDetailModal from "@/components/admin/LeadDetailModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "contacted", label: "Contacted" },
  { value: "closed", label: "Closed" },
];

const statusStyles = {
  new: "bg-secondary/10 text-secondary",
  contacted: "bg-accent/10 text-accent",
  closed: "bg-gray-100 text-gray-500",
};

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminLeadsPage() {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLead, setSelectedLead] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadLeads = async () => {
    setIsLoading(true);
    try {
      const data = await getAllLeads();
      setLeads(data);
    } catch (error) {
      console.error("Load leads error:", error);
      toast.error("Failed to load enquiries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, []);

  const handleStatusChange = async (leadId, newStatus) => {
    try {
      await updateLeadStatus(leadId, newStatus);
      setLeads((prev) =>
        prev.map((lead) =>
          lead.id === leadId ? { ...lead, status: newStatus } : lead,
        ),
      );
      setSelectedLead((prev) =>
        prev?.id === leadId ? { ...prev, status: newStatus } : prev,
      );
      toast.success("Status updated");
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteLead(deleteTarget.id);
      setLeads((prev) => prev.filter((l) => l.id !== deleteTarget.id));
      toast.success("Enquiry deleted");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete enquiry");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredLeads = useMemo(() => {
    let result = leads;

    if (statusFilter !== "all") {
      result = result.filter((lead) => lead.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(q) ||
          lead.phone?.includes(q) ||
          lead.entityName?.toLowerCase().includes(q) ||
          lead.email?.toLowerCase().includes(q),
      );
    }

    return result;
  }, [leads, statusFilter, searchQuery]);

  const handleExport = () => {
    if (filteredLeads.length === 0) {
      toast.error("No leads to export");
      return;
    }

    const exportData = filteredLeads.map((lead) => ({
      Name: lead.name,
      Phone: lead.phone,
      Email: lead.email || "",
      Type: lead.entityType,
      "Hotel/Restaurant": lead.entityName,
      "Check-in": lead.checkIn || "",
      "Check-out": lead.checkOut || "",
      "Reservation Date": lead.date || "",
      "Reservation Time": lead.time || "",
      Guests: lead.guests,
      Message: lead.message || "",
      Status: lead.status,
      "Submitted On": formatDate(lead.createdAt),
    }));

    exportToCSV(
      exportData,
      `enquiries-${new Date().toISOString().split("T")[0]}.csv`,
    );
    toast.success("CSV exported");
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2 overflow-x-auto">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStatusFilter(filter.value)}
              className={`shrink-0 text-sm font-medium px-4 py-2 rounded-lg transition-colors ${
                statusFilter === filter.value
                  ? "bg-primary text-white"
                  : "bg-white text-gray-500 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {filter.label}
              {filter.value !== "all" && (
                <span className="ml-1.5 opacity-70">
                  ({leads.filter((l) => l.status === filter.value).length})
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search name, phone, hotel..."
              className="pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none w-56"
            />
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-white border border-gray-200 text-gray-600 hover:border-secondary hover:text-secondary px-4 py-2.5 rounded-lg text-sm font-medium transition-colors shrink-0"
          >
            <FiDownload /> Export CSV
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-2xl text-primary" />
        </div>
      ) : filteredLeads.length === 0 ? (
        <div className="card p-12 text-center">
          <FiMessageSquare className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">
            {leads.length === 0
              ? "No enquiries yet"
              : "No enquiries match your filters"}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Guest</th>
                  <th className="px-5 py-3.5 font-medium">Hotel/Restaurant</th>
                  <th className="px-5 py-3.5 font-medium">Dates</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium">Received</th>
                  <th className="px-5 py-3.5 font-medium text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-primary">{lead.name}</p>
                      <p className="text-gray-400 text-xs">{lead.phone}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        {lead.entityType === "restaurant" ? (
                          <FiCoffee className="text-secondary shrink-0" />
                        ) : (
                          <FiHome className="text-secondary shrink-0" />
                        )}
                        <span className="text-gray-600">{lead.entityName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {lead.entityType === "hotel"
                        ? lead.checkIn
                          ? `${lead.checkIn} → ${lead.checkOut}`
                          : "—"
                        : lead.date
                          ? `${lead.date} ${lead.time}`
                          : "—"}
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${statusStyles[lead.status] || statusStyles.new}`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {formatDate(lead.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(lead);
                          }}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                          aria-label="Delete"
                        >
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onStatusChange={handleStatusChange}
        />
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Enquiry?"
        message={`Delete the enquiry from "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
