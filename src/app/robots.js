// src/app/robots.js
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://localkokani.vercel.app";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",           // admin panel — never public
          "/owner/",           // owner dashboard, login, signup — never public
          "/api/",             // all API routes
          "/search",           // dynamic query-string pages, already noindex at page level too
          "/wishlist",         // personal/session content, already noindex at page level too
          "/partner-with-us/register", // old redirect stub, superseded by /owner/signup
          "/partner-with-us/success",  // transactional confirmation page, not content
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}