import { getLocale, getTranslations } from "next-intl/server";
import { SectionHeader } from "@/components/common/SectionHeader";
import { PostCard } from "@/components/blog/PostCard";
import { cmsFileUrl, getCmsPosts } from "@/lib/cms";
import { toPostCard } from "@/lib/blog";

export async function BlogSection() {
  const [t, locale] = await Promise.all([getTranslations("blog"), getLocale()]);
  const posts = (await getCmsPosts(locale, 3)).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="container-x flex flex-col gap-7 pt-16 lg:pt-20">
      <SectionHeader title={t("title")} link={{ href: "/blog", label: t("all") }} />
      <div className="grid gap-10 sm:gap-6 md:grid-cols-3">
        {posts.map((p, i) => (
          <PostCard key={p._id} post={toPostCard(p, i, cmsFileUrl)} locale={locale} />
        ))}
      </div>
    </section>
  );
}
