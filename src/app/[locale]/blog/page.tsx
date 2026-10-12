import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { PostCard } from "@/components/blog/PostCard";
import { cmsFileUrl, getCmsPosts } from "@/lib/cms";
import { toPostCard } from "@/lib/blog";

export const revalidate = 60;

export async function generateMetadata({ params }: PageProps<"/[locale]/blog">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  return { title: t("pageTitle"), description: t("pageLead") };
}

export default async function BlogPage({ params }: PageProps<"/[locale]/blog">) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [t, posts] = await Promise.all([getTranslations("blog"), getCmsPosts(locale, 30)]);

  return (
    <div className="container-x flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.5px] sm:text-[34px]">{t("pageTitle")}</h1>
        <p className="m-0 text-[15px] text-muted">{t("pageLead")}</p>
      </div>
      {posts.length === 0 ? (
        <p className="m-0 rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-muted">
          {t("empty")}
        </p>
      ) : (
        <div className="grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <PostCard key={p._id} post={toPostCard(p, i, cmsFileUrl)} locale={locale} />
          ))}
        </div>
      )}
    </div>
  );
}
