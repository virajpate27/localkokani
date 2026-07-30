// src/app/admin/blog/[id]/edit/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { FiLoader } from "react-icons/fi";
import BlogPostForm from "@/components/admin/BlogPostForm";
import { getPostById } from "@/lib/services/blogService";

export default function EditBlogPostPage() {
  const { id } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFoundState, setNotFoundState] = useState(false);

  useEffect(() => {
    getPostById(id)
      .then((data) => (data ? setPost(data) : setNotFoundState(true)))
      .catch(() => setNotFoundState(true))
      .finally(() => setIsLoading(false));
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <FiLoader className="animate-spin text-2xl text-primary" />
      </div>
    );
  }

  if (notFoundState) {
    return (
      <div className="card p-10 text-center">
        <p className="text-gray-400 mb-4">Post not found.</p>
        <button onClick={() => router.push("/admin/blog")} className="text-secondary font-medium hover:underline">
          Back to Blog
        </button>
      </div>
    );
  }

  return (
    <div>
      <p className="text-gray-400 text-sm mb-6">
        Editing <span className="font-medium text-primary">{post.title}</span>
      </p>
      <BlogPostForm initialData={post} />
    </div>
  );
}