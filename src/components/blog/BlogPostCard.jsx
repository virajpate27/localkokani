// src/components/blog/BlogPostCard.jsx
import Link from "next/link";
import Image from "next/image";
import { FiClock, FiTag } from "react-icons/fi";
import { getOptimizedUrl } from "@/lib/cloudinary";

function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogPostCard({ post, priority = false }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group card overflow-hidden flex flex-col hover:-translate-y-1"
    >
      <div className="relative aspect-[16/10] overflow-hidden">
        {post.coverImage?.url && (
          <Image
            src={getOptimizedUrl(post.coverImage.url, { width: 600 })}
            alt={post.title}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        {post.category && (
          <span className="absolute top-3 left-3 bg-white dark:bg-gray-900/95 backdrop-blur-sm text-primary dark:text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
            <FiTag className="text-secondary" /> {post.category}
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display font-semibold text-lg text-primary dark:text-white line-clamp-2 group-hover:text-secondary transition-colors">
          {post.title}
        </h3>
        <p className="dark:text-gray-500 text-sm mt-2 line-clamp-2 flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-3 mt-4 pt-4 border-t dark:border-gray-800 dark:text-gray-500 text-xs">
          <span>{formatDate(post.publishedAt)}</span>
          {post.readTimeMinutes && (
            <span className="flex items-center gap-1">
              <FiClock /> {post.readTimeMinutes} min read
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}