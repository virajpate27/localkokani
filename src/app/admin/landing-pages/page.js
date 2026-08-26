// src/app/admin/landing-pages/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiFileText, FiExternalLink } from "react-icons/fi";
import toast from "react-hot-toast";
import { getAllLandingPagesAdmin, deleteLandingPage } from "@/lib/services/landingPageService";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function AdminLandingPagesPage() {
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    getAllLandingPagesAdmin().then(setPages).finally(() => setIsLoading(false));
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteLandingPage(deleteTarget.id);
      setPages((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      toast.success("Page deleted");
    } catch {
      toast.error("Failed to delete");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{pages.length} SEO landing pages</p>
        <Link href="/admin/landing-pages/new" className="btn-primary flex items-center gap-2"><FiPlus /> New Page</Link>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><FiLoader className="animate-spin text-2xl text-primary" /></div>
      ) : pages.length === 0 ? (
        <div className="card p-12 text-center">
          <FiFileText className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No landing pages yet</p>
          <Link href="/admin/landing-pages/new" className="btn-primary inline-flex items-center gap-2"><FiPlus /> Create Your First Page</Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 text-left">
              <tr>
                <th className="px-5 py-3.5 font-medium">Page</th>
                <th className="px-5 py-3.5 font-medium">URL</th>
                <th className="px-5 py-3.5 font-medium">Status</th>
                <th className="px-5 py-3.5 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3.5 font-medium text-primary">{page.h1}</td>
                  <td className="px-5 py-3.5 text-gray-500">/{page.slug}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${page.published ? "bg-accent/10 text-accent-dark" : "bg-gray-100 text-gray-500"}`}>
                      {page.published ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      {page.published && (
                        <a href={`/${page.slug}`} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-secondary/10 hover:text-secondary">
                          <FiExternalLink className="text-sm" />
                        </a>
                      )}
                      <Link href={`/admin/landing-pages/${page.id}/edit`} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-secondary/10 hover:text-secondary">
                        <FiEdit2 className="text-sm" />
                      </Link>
                      <button onClick={() => setDeleteTarget(page)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500">
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ConfirmDialog isOpen={!!deleteTarget} title="Delete Landing Page?" message={`Delete "${deleteTarget?.h1}"? This cannot be undone.`} confirmLabel="Delete" isDangerous isLoading={isDeleting} onConfirm={handleDeleteConfirm} onCancel={() => setDeleteTarget(null)} />
    </div>
  );
}