import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getCmsPosts } from "@/lib/cms";

export const revalidate = 3600;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sarnai-ecommerce.mn";
const STATIC_PATHS = ["", "/products", "/own", "/about", "/contact", "/faq", "/blog", "/membership"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const path of STATIC_PATHS) entries.push({ url: `${SITE_URL}/${locale}${path}` });
    const posts = await getCmsPosts(locale, 100);
    for (const post of posts) {
      entries.push({
        url: `${SITE_URL}/${locale}/blog/${post.slug ?? post._id}`,
        lastModified: post.updatedAt ?? post.publishedDate,
      });
    }
  }
  return entries;
}
