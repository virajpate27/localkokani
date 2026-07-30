// src/app/blog/page.js
import { getAllPublishedPosts } from "@/lib/services/blogService";
import BlogPostCard from "@/components/blog/BlogPostCard";
import Breadcrumbs from "@/components/ui/Breadcrumbs";
import EmptyState from "@/components/ui/EmptyState";

export const revalidate = 3600;

export const metadata = {
  title: "Travel Guides & Tips | StayFinder Blog",
  description:
    "Destination guides, travel tips, and inspiration to help you plan your next trip — from best times to visit to hidden local gems.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Travel Guides & Tips | StayFinder Blog",
    description: "Destination guides, travel tips, and inspiration for your next trip.",
  },
};

export default async function BlogListingPage() {
  const posts = await getAllPublishedPosts();

  return (
    <>
      <div className="bg-white">
        <Breadcrumbs items={[{ name: "Blog", url: "/blog" }]} />
      </div>

      <section className="bg-hero-gradient py-14">
        <div className="container-custom text-center">
          <h1 className="font-display font-extrabold text-4xl md:text-5xl text-white">
            Travel Guides & Tips
          </h1>
          <p className="text-white/80 mt-4 max-w-xl mx-auto">
            Everything you need to plan your next trip — destination guides,
            local tips, and travel inspiration.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50 min-h-[50vh]">
        <div className="container-custom">
          {posts.length === 0 ? (
            <EmptyState
              title="No articles yet"
              description="Check back soon for travel guides and tips."
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <BlogPostCard key={post.id} post={post} priority={index < 2} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}