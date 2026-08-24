// src/app/blog/[slug]/page.js
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FiClock, FiCalendar, FiMapPin, FiArrowRight } from "react-icons/fi";
import {
  getPublishedPostBySlug,
  getAllPublishedPosts,
  getRelatedPosts,
} from "@/lib/services/blogService";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import MarkdownContent from "@/components/blog/MarkdownContent";
import BlogPostCard from "@/components/blog/BlogPostCard";
import JsonLd from "@/components/ui/JsonLd";

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await getAllPublishedPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

function formatDate(isoString) {
  if (!isoString) return "";
  return new Date(isoString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return { title: "Article Not Found | StayFinder" };
  }

  const title = post.seo?.metaTitle || `${post.title} | StayFinder Blog`;
  const description = post.seo?.metaDescription || post.excerpt;

  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.publishedAt,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function BlogPostPage({ params }) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.destinationSlug, post.id, 3);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage?.url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Organization", name: "StayFinder" },
    publisher: { "@type": "Organization", name: "StayFinder" },
  };

  return (
    <>
      <JsonLd data={articleSchema} />

      <div className="bg-white dark:bg-gray-900">
        <Breadcrumbs
          items={[
            { name: "Blog", url: "/blog" },
            { name: post.title, url: `/blog/${post.slug}` },
          ]}
        />
      </div>

      <article className="py-10">
        <div className="container-custom max-w-5xl">
          {post.category && (
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wide mb-3">
              {post.category}
            </span>
          )}
          <h1 className="font-display font-extrabold text-3xl md:text-4xl text-primary dark:text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 dark:text-gray-500 text-sm mt-4">
            <span className="flex items-center gap-1.5">
              <FiCalendar /> {formatDate(post.publishedAt)}
            </span>
            {post.readTimeMinutes && (
              <span className="flex items-center gap-1.5">
                <FiClock /> {post.readTimeMinutes} min read
              </span>
            )}
            {post.destinationSlug && (
              <Link
                href={`/destinations/${post.destinationSlug}`}
                className="flex items-center gap-1.5 text-secondary font-medium hover:underline"
              >
                <FiMapPin /> {post.destinationName}
              </Link>
            )}
          </div>

          {post.coverImage?.url && (
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mt-8">
              <Image
                src={post.coverImage.url}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
          )}

          <div className="mt-10">
            <MarkdownContent content={post.content} />
          </div>

          {/* Contextual CTA back to destination/hotels — key SEO-to-conversion funnel */}
          {post.destinationSlug && (
            <div className="mt-12 bg-hero-gradient rounded-2xl p-8 text-center">
              <h3 className="font-display font-bold text-2xl text-white">
                Ready to Visit {post.destinationName}?
              </h3>
              <p className="text-white/80 mt-2">
                Browse our handpicked hotels and start planning your trip.
              </p>
              <Link
                href={`/destinations/${post.destinationSlug}`}
                className="btn-accent inline-flex items-center gap-2 mt-5"
              >
                View Hotels in {post.destinationName} <FiArrowRight />
              </Link>
            </div>
          )}
        </div>
      </article>

      {relatedPosts.length > 0 && (
        <section className="py-16 bg-gray-50 dark:bg-gray-950">
          <div className="container-custom">
            <h2 className="section-title mb-8">More Guides You'll Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedPosts.map((related) => (
                <BlogPostCard key={related.id} post={related} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
} 