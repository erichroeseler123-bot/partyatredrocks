import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/guide/",
        "/venues/",
        "/book-shuttle",
        "/private-suburban",
        "/shuttles/",
        "/book",
        "/week",
      ],
      disallow: [
        "/api/",
        "/_next/",
        "/static/",
        "/shows/",       // ✅ block show detail pages
        "/admin/",
        "/_parked/",
        "/community",
        "/community/",
        "/week/search",
      ],
    },
    sitemap: "https://partyatredrocks.com/sitemap.xml",
  };
}
