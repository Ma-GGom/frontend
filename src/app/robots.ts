import type { MetadataRoute } from "next";

const SITE_URL = "https://maggom.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/settings", "/admin"],
      },
      {
        userAgent: "Yeti",
        allow: "/",
        disallow: ["/settings", "/admin"],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/settings", "/admin"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
