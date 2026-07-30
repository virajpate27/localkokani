// src/app/admin/blog/page.js
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FiPlus, FiEdit2, FiTrash2, FiLoader, FiFileText } from "react-icons/fi";
import toast from "react-hot-toast";
import { getAllPostsAdmin, deletePost } from "@/lib/services/blogService";
import { deleteFromCloudinary } from "@/lib/cloudinary";
import ConfirmDialog from "@/components/admin/ConfirmDialog";

export default function AdminBlogPage() {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const loadPosts = async () => {
    setIsLoading(true);
    try {
      setPosts(await getAllPostsAdmin());
    } catch (error) {
      toast.error("Failed to load posts");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { loadPosts(); }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deletePost(deleteTarget.id);
      if (deleteTarget.coverImage?.publicId) {
        await deleteFromCloudinary(deleteTarget.coverImage.publicId);
      }
      toast.success("Post deleted");
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-400 text-sm">{posts.length} posts total</p>
        <Link href="/admin/blog/new" className="btn-primary flex items-center gap-2">
          <FiPlus /> New Post
        </Link>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <FiLoader className="animate-spin text-2xl text-primary" />
        </div>
      ) : posts.length === 0 ? (
        <div className="card p-12 text-center">
          <FiFileText className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 mb-4">No posts yet</p>
          <Link href="/admin/blog/new" className="btn-primary inline-flex items-center gap-2">
            <FiPlus /> Write Your First Post
          </Link>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500 text-left">
                <tr>
                  <th className="px-5 py-3.5 font-medium">Post</th>
                  <th className="px-5 py-3.5 font-medium">Category</th>
                  <th className="px-5 py-3.5 font-medium">Status</th>
                  <th className="px-5 py-3.5 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0 bg-gray-100">
                          {post.coverImage?.url && (
                            <Image src={post.coverImage.url} alt={post.title} fill sizes="48px" className="object-cover" />
                          )}
                        </div>
                        <span className="font-medium text-primary line-clamp-1">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-600">{post.category}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-lg ${post.published ? "bg-accent/10 text-accent" : "bg-gray-100 text-gray-500"}`}>
                        {post.published ? "Published" : "Draft"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/blog/${post.id}/edit`} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-secondary/10 hover:text-secondary transition-colors">
                          <FiEdit2 className="text-sm" />
                        </Link>
                        <button onClick={() => setDeleteTarget(post)} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors">
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

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Post?"
        message={`Delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmLabel="Delete"
        isDangerous
        isLoading={isDeleting}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}