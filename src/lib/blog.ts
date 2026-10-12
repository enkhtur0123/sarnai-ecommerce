import type { Post } from "@/graphql/cms/queries/post";
import type { PostCardData } from "@/components/blog/PostCard";
import { stripHtml } from "@/lib/utils";

/** Cover images from the design, used for posts without a CMS thumbnail. */
export const BLOG_IMAGES = ["/images/blog-1.jpg", "/images/blog-2.jpg", "/images/blog-3.jpg"];

/** The seeded starter posts keep the cover they had in the design. */
const COVER_BY_SLUG: Record<string, string> = {
  "choose-headphones": "/images/blog-1.jpg",
  "multi-room-speakers": "/images/blog-2.jpg",
  "everyday-carry-kit": "/images/blog-3.jpg",
};

export function fallbackCover(slug: string, index: number) {
  return COVER_BY_SLUG[slug] ?? BLOG_IMAGES[index % BLOG_IMAGES.length];
}

export function toPostCard(post: Post, index: number, fileUrl: (u?: string | null) => string): PostCardData {
  const slug = post.slug ?? post._id;
  return {
    slug,
    title: post.title ?? "",
    excerpt: post.excerpt || (post.content ? stripHtml(post.content).slice(0, 160) : undefined),
    image: fileUrl(post.thumbnail?.url) || fallbackCover(slug, index),
    category: post.categories?.[0]?.name ?? post.tags?.[0]?.name,
    date: post.publishedDate ?? post.createdAt,
  };
}
