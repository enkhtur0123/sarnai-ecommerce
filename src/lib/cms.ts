import "server-only";
import { cache } from "react";
import type { DocumentNode } from "graphql";
import { getServerApolloClient } from "@/lib/apollo/server-client";
import { CP_MENUS, type CpMenusData } from "@/graphql/cms/queries/menu";
import { CP_PAGES, type CpPagesData, type Page } from "@/graphql/cms/queries/page";
import {
  CP_POST,
  CP_POSTS,
  type CpPostData,
  type CpPostsData,
  type Post,
} from "@/graphql/cms/queries/post";

/**
 * erxes CMS access for server components. Content (pages, posts, menus) is
 * edited in erxes admin and revalidated every 60 s — no redeploy needed.
 * A failed or empty CMS read returns null/[] so callers can show their
 * built-in fallback instead of breaking the page.
 */
const REVALIDATE_SECONDS = 60;

export const cmsEnabled = Boolean(
  (process.env.ERXES_ENDPOINT ?? process.env.NEXT_PUBLIC_ERXES_ENDPOINT) &&
    process.env.NEXT_PUBLIC_ERXES_CP_TOKEN,
);

async function cmsQuery<TData>(
  query: DocumentNode,
  variables: Record<string, unknown>,
): Promise<TData | null> {
  if (!cmsEnabled) return null;
  try {
    const client = getServerApolloClient();
    const { data } = await client.query<TData>({
      query,
      variables: { ...variables, clientPortalId: process.env.NEXT_PUBLIC_ERXES_CP_TOKEN },
      context: { fetchOptions: { next: { revalidate: REVALIDATE_SECONDS } } },
    });
    return (data as TData) ?? null;
  } catch {
    return null;
  }
}

/** Absolute URL for an erxes file key or URL. */
export function cmsFileUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  const endpoint = process.env.ERXES_ENDPOINT ?? process.env.NEXT_PUBLIC_ERXES_ENDPOINT ?? "";
  return `${endpoint.replace(/\/gateway\/graphql$/, "")}/read-file?key=${encodeURIComponent(url)}`;
}

const getPages = cache(async (locale: string): Promise<Page[]> => {
  const data = await cmsQuery<CpPagesData>(CP_PAGES, { language: locale });
  return data?.cpPages ?? [];
});

/** A CMS page by slug (erxes has no single-page query, so filter cpPages). */
export const getCmsPage = cache(async (slug: string, locale: string) => {
  const pages = await getPages(locale);
  return pages.find((p) => p.slug === slug && (!p.status || p.status === "published")) ?? null;
});

export const getCmsPosts = cache(async (locale: string, limit = 20): Promise<Post[]> => {
  const data = await cmsQuery<CpPostsData>(CP_POSTS, {
    language: locale,
    status: "published",
    sortField: "publishedDate",
    sortDirection: "desc",
    limit,
  });
  // Repeated seeding can leave duplicate rows — slug is the page key, keep the first.
  const seen = new Set<string>();
  return (data?.cpPosts ?? []).filter((p) => {
    const key = p.slug ?? p._id;
    if (seen.has(key)) return false;
    seen.add(key);
    return !p.type || p.type === "post";
  });
});

export const getCmsPost = cache(async (slug: string, locale: string) => {
  const data = await cmsQuery<CpPostData>(CP_POST, { slug, language: locale });
  const post = data?.cpPost ?? null;
  return post && (!post.status || post.status === "published") ? post : null;
});

export type NavItem = { id: string; label: string; href: string };

/** Header / footer navigation from erxes menus; [] when the CMS has none. */
export const getCmsMenu = cache(
  async (kind: "header" | "footer", locale: string): Promise<NavItem[]> => {
    const data = await cmsQuery<CpMenusData>(CP_MENUS, { language: locale, kind });
    const seen = new Set<string>();
    return (data?.cpMenus ?? [])
      .filter((m) => !m.parentId && m.label && m.url)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .filter((m) => {
        if (seen.has(m.url!)) return false;
        seen.add(m.url!);
        return true;
      })
      .map((m) => ({ id: m._id, label: m.label!, href: m.url! }));
  },
);
