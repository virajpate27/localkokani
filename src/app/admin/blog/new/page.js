// src/app/admin/blog/new/page.js
import BlogPostForm from "@/components/admin/BlogPostForm";

export default function NewBlogPostPage() {
  return (
    <div>
      <p className="text-gray-400 text-sm mb-6">Write a new travel guide or article.</p>
      <BlogPostForm />
    </div>
  );
}