import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sarnai-ecommerce.mn";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/*/checkout", "/*/verify", "/*/orders", "/*/login", "/*/register", "/*/profile", "/*/cart"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
