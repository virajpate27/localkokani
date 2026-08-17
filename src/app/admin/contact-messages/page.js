// src/app/admin/contact-messages/page.js
"use client";

import { useState, useEffect, useMemo } from "react";
import { FiLoader, FiSearch, FiMail, FiTrash2, FiMessageSquare } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  getAllContactMessagesAdmin, updateContactMessageStatus, deleteContactMessage,
} from "@/lib/services/contactService";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "new", label: "New" },
  { value: "read", label: "Read" },
  { value: "replied", label: "Replied" },
];

const statusStyles = {
  new: "bg-secondary/10 text-secondary",
  read: "bg-gray-100 text-gray-500",
  replied: "bg-accent/10 text-accent-dark",
};

function formatDate(isoString) {
  if (!isoString) return "—";
  return new Date(isoString).toLocaleString("en-IN", {
    day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminContactMessagesPage() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadMessages = async () => {
    setIsLoading(true);
    try {
      setMessages(await getAllContactMessagesAdmin());
    } catch (error) {
      console.error("Load contact messages error:", error);
      toast.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadMessages(); }, []);

  const handleOpenMessage = async (message) => {
    setSelectedMessage(message);
    // Auto-mark as "read" the first time it's opened, if still "new"
    if (message.status === "new") {
      try {
        await updateContactMessageStatus(message.id, "read");
        setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, status: "read" } : m)));
      } catch (error) {
        console.error("Auto mark-as-read error:", error);
      }
    }
  };

  const handleMarkReplied = async (message) => {
    try {
      await updateContactMessageStatus(message.id, "replied");
      setMessages((prev) => prev.map((m) => (m.id === message.id ? { ...m, status: "replied" } : m)));
      setSelectedMessage((prev) => (prev?.id === message.id ? { ...prev, status: "replied" } : prev));
      toast.success("Marked as replied");
    } catch (error) {
      console.error("Mark replied error:", error);
      toast.error("Failed to update status");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteContactMessage(deleteTarget.id);
      setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      if (selectedMessage?.id === deleteTarget.id) setSelectedMessage(null);
      toast.success("Message deleted");
    } catch (error) {
      console.error("Delete message error:", error);
      toast.error("Failed to delete message");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const filteredMessages = useMemo(() => {
    let result = messages;

    if (statusFilter !== "all") {
      result = result.filter((m) => m.status === statusFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(
        (m) =>
          m.name?.toLowerCase().includes(q) ||
          m.email?.toLowerCase().includes(q) ||
          m.subject?.toLowerCase().includes(q) ||
          m.message?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [messages, statusFilter, searchQuery]);

  const newCount = messages.filter((m) => m.status === "new").length;

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
              {filter.value === "new" && newCount > 0 && (
                <span className="ml-1.5 opacity-70">({newCount})</span>
              )}
            </button>
          ))}
        </div>

        <div className="relative">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search name, email, message..."
            className="pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 focus:border-secondary text-sm outline-none w-full sm:w-64"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-2xl text-primary" />
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="card p-12 text-center">
          <FiMessageSquare className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400">
            {messages.length === 0 ? "No messages yet" : "No messages match your filters"}
          </p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3.5 font-medium">From</th>
                  <th className="px-5 py-3.5 font-medium">Subject</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium">Received</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleOpenMessage(message)}
                  >
                    <td className="px-5 py-3.5">
                      <p className={`font-medium ${message.status === "new" ? "text-primary" : "text-gray-600"}`}>
                        {message.name}
                      </p>
                      <p className="text-gray-400 text-xs">{message.email}</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600 max-w-xs truncate">{message.subject}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg capitalize ${statusStyles[message.status] || statusStyles.new}`}>
                        {message.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">{formatDate(message.createdAt)}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(message);
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

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl p-6 animate-slide-up max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-display font-bold text-xl text-primary">Message Details</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-gray-400 text-xs">From</p>
                <p className="font-medium text-primary">{selectedMessage.name}</p>
                <a href={`mailto:${selectedMessage.email}`} className="text-secondary text-sm hover:underline">
                  {selectedMessage.email}
                </a>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Subject</p>
                <p className="font-medium text-primary text-sm">{selectedMessage.subject}</p>
              </div>

              <div>
                <p className="text-gray-400 text-xs">Message</p>
                <p className="text-gray-700 text-sm whitespace-pre-line mt-1">{selectedMessage.message}</p>
              </div>

              <p className="text-gray-400 text-xs pt-3 border-t border-gray-100">
                Received on {formatDate(selectedMessage.createdAt)}
              </p>
            </div>

            <div className="flex gap-3 mt-6">
              <a
                href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}`}
                className="btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <FiMail /> Reply via Email
              </a>
              {selectedMessage.status !== "replied" && (
                <button
                  onClick={() => handleMarkReplied(selectedMessage)}
                  className="bg-accent/10 text-accent-dark hover:bg-accent hover:text-white px-4 py-3 rounded-xl text-sm font-medium transition-colors"
                >
                  Mark as Replied
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Message?"
        message={`Delete the message from "${deleteTarget?.name}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}