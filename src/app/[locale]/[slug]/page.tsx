import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link, routing } from "@/i18n/routing";
import Image from "@/components/common/Image";
import FaqList, { parseFaqContent } from "@/components/cms/FaqList";
import { cmsFileUrl, getCmsPage } from "@/lib/cms";
import { HOTLINE, SUPPORT_EMAIL } from "@/lib/constants";

/** Info pages whose content is edited in erxes CMS (Pages, by slug). */
const CMS_SLUGS = ["about", "contact", "faq"] as const;
type CmsSlug = (typeof CMS_SLUGS)[number];

const isCmsSlug = (s: string): s is CmsSlug => (CMS_SLUGS as readonly string[]).includes(s);

const HERO_IMAGE: Record<CmsSlug, string> = {
  about: "/images/cat-speakers.jpg",
  contact: "/images/newsletter.jpg",
  faq: "/images/cat-accessories.jpg",
};

export const revalidate = 60;
export const dynamicParams = false;

export function generateStaticParams() {
  return routing.locales.flatMap((locale) => CMS_SLUGS.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: PageProps<"/[locale]/[slug]">): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isCmsSlug(slug)) return {};
  const [page, t] = await Promise.all([getCmsPage(slug, locale), getTranslations({ locale, namespace: "pages" })]);
  return {
    title: page?.name ?? t(`${slug}.title`),
    description: page?.description ?? t(`${slug}.lead`),
  };
}

export default async function CmsPage({ params }: PageProps<"/[locale]/[slug]">) {
  const { locale, slug } = await params;
  if (!isCmsSlug(slug)) notFound();
  setRequestLocale(locale);
  const [page, t, tFooter, tHero] = await Promise.all([
    getCmsPage(slug, locale),
    getTranslations("pages"),
    getTranslations("footer"),
    getTranslations("hero"),
  ]);
  const title = page?.name ?? t(`${slug}.title`);
  const lead = page?.description ?? t(`${slug}.lead`);
  const faqItems = slug === "faq" && page?.content ? parseFaqContent(page.content) : [];
  const image = cmsFileUrl(page?.thumbnail?.url) || HERO_IMAGE[slug];

  return (
    <div className="flex flex-col gap-10 pb-6">
      <section className="container-x pt-6 lg:pt-8">
        <div className="relative overflow-hidden rounded-[20px] bg-navy">
          <Image src={image} alt="" fill priority sizes="1280px" className="object-cover opacity-35" />
          <div className="relative flex flex-col gap-3 px-6 py-14 sm:px-12 lg:px-[72px] lg:py-20">
            <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[13px] font-semibold text-white/70">
              <Link href="/" className="hover:text-white">
                {t("breadcrumb")}
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-white">{title}</span>
            </nav>
            <h1 className="m-0 max-w-[720px] text-[34px] font-extrabold leading-[1.08] tracking-[-1px] text-white sm:text-[46px]">
              {title}
            </h1>
            <p className="m-0 max-w-[620px] text-[17px] leading-[1.55] text-white/80">{lead}</p>
          </div>
        </div>
      </section>

      <section className="container-x grid items-start gap-8 lg:grid-cols-[1fr_360px]">
        <div className="min-w-0 rounded-2xl border border-line bg-white p-6 sm:p-10">
          {faqItems.length > 0 ? (
            <FaqList items={faqItems} />
          ) : page?.content ? (
            // Authored by staff in erxes admin.
            <div className="cms-content" dangerouslySetInnerHTML={{ __html: page.content }} />
          ) : (
            <p className="m-0 rounded-xl bg-surface px-4 py-3 text-muted">{t("pending")}</p>
          )}
        </div>

        <aside className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6">
          <h2 className="m-0 text-lg font-extrabold">{t("contact.title")}</h2>
          {[
            { icon: MapPin, label: t("contact.address"), value: tFooter("address") },
            { icon: Phone, label: t("contact.phone"), value: HOTLINE, href: `tel:${HOTLINE.replace(/\s/g, "")}` },
            { icon: Mail, label: t("contact.email"), value: SUPPORT_EMAIL, href: `mailto:${SUPPORT_EMAIL}` },
            { icon: Clock, label: t("contact.hours"), value: t("contact.hoursValue") },
          ].map(({ icon: Icon, label, value, href }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-navy">
                <Icon size={18} aria-hidden="true" />
              </span>
              <span className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-muted">{label}</span>
                {href ? (
                  <a href={href} className="text-sm font-semibold text-navy hover:text-accent">
                    {value}
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-navy">{value}</span>
                )}
              </span>
            </div>
          ))}
          <Link href="/products" className="btn-primary mt-2">
            {tHero("shopNow")}
          </Link>
        </aside>
      </section>
    </div>
  );
}
