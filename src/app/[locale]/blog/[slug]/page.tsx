import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { cmsFileUrl, getCmsPost, getCmsPosts } from "@/lib/cms";
import { fallbackCover } from "@/lib/blog";
import { formatDate } from "@/lib/utils";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[locale]/blog/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getCmsPost(slug, locale);
  return post ? { title: post.title, description: post.excerpt } : {};
}

export default async function BlogPostPage({ params }: PageProps<"/[locale]/blog/[slug]">) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const [post, posts, t] = await Promise.all([
    getCmsPost(slug, locale),
    getCmsPosts(locale, 30),
    getTranslations("blog"),
  ]);
  if (!post) notFound();
  // Same cover the post shows on the listing when it has no CMS thumbnail.
  const index = Math.max(0, posts.findIndex((p) => (p.slug ?? p._id) === slug));
  const image = cmsFileUrl(post.thumbnail?.url) || fallbackCover(slug, index);
  const date = post.publishedDate ?? post.createdAt;
  const category = post.categories?.[0]?.name;

  return (
    <article className="container-x flex max-w-[860px] flex-col gap-6 py-10">
      <Link href="/blog" className="text-sm font-bold text-navy hover:text-accent">
        {t("back")}
      </Link>
      <div className="flex items-center gap-2.5">
        {category && (
          <>
            <span className="text-[11px] font-bold uppercase tracking-[1px] text-accent">{category}</span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-muted" />
          </>
        )}
        {date && (
          <time dateTime={date} className="text-[13px] text-muted">
            {formatDate(date, locale)}
          </time>
        )}
      </div>
      <h1 className="m-0 text-[32px] font-extrabold leading-[1.15] tracking-[-0.8px] sm:text-[40px]">{post.title}</h1>
      {post.excerpt && <p className="m-0 text-lg leading-relaxed text-muted">{post.excerpt}</p>}
      <div className="relative aspect-[16/9] overflow-hidden rounded-[18px] bg-surface">
        <Image src={image} alt="" fill priority sizes="860px" className="object-cover" />
      </div>
      {post.content && (
        // Authored by staff in erxes admin.
        <div className="cms-content" dangerouslySetInnerHTML={{ __html: post.content }} />
      )}
    </article>
  );
}
