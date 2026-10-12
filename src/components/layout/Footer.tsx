import { getLocale, getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Logo } from "@/components/layout/Logo";
import { SocialIcon, type SocialName } from "@/components/common/SocialIcon";
import { getCmsMenu } from "@/lib/cms";
import { HOTLINE, SOCIAL_LINKS, SUPPORT_EMAIL } from "@/lib/constants";

type FooterLink = { id: string; label: string; href: string };

function Column({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      <h3 className="m-0 mb-1 text-base font-bold text-white">{title}</h3>
      {links.map((l) => (
        <Link key={l.id} href={l.href} className="text-sm text-white/60 transition-colors hover:text-white">
          {l.label}
        </Link>
      ))}
    </div>
  );
}

export async function Footer() {
  const [t, tNav, locale] = await Promise.all([
    getTranslations("footer"),
    getTranslations("nav"),
    getLocale(),
  ]);
  const cmsLinks = await getCmsMenu("footer", locale);

  const shop: FooterLink[] = [
    { id: "all", label: t("allProducts"), href: "/products" },
    { id: "flash", label: tNav("flash"), href: "/products?filter=flash" },
    { id: "new", label: tNav("newArrivals"), href: "/products?filter=new" },
    { id: "wish", label: t("wishlist"), href: "/wishlist" },
  ];
  const company: FooterLink[] =
    cmsLinks.length > 0
      ? cmsLinks
      : [
          { id: "about", label: t("aboutUs"), href: "/about" },
          { id: "blog", label: t("blog"), href: "/blog" },
          { id: "faq", label: t("faq"), href: "/faq" },
          { id: "contact", label: t("contact"), href: "/contact" },
        ];
  const care: FooterLink[] = [
    { id: "account", label: t("account"), href: "/profile" },
    { id: "track", label: t("track"), href: "/orders" },
    { id: "cart", label: t("cart"), href: "/cart" },
    { id: "faq", label: t("faq"), href: "/faq" },
  ];

  return (
    <footer className="mt-20 bg-footer text-white">
      <div className="container-x flex flex-col gap-14 pb-8 pt-[72px]">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[340px_repeat(4,minmax(0,1fr))]">
          <div className="flex flex-col gap-[18px]">
            <Logo inverted />
            <p className="m-0 max-w-[340px] text-sm leading-[1.6] text-white/60">{t("about")}</p>
          </div>
          <Column title={t("shop")} links={shop} />
          <Column title={t("company")} links={company} />
          <Column title={t("care")} links={care} />
          <div className="flex flex-col gap-3.5">
            <h3 className="m-0 mb-1 text-base font-bold text-white">{t("contact")}</h3>
            <p className="m-0 text-sm leading-normal text-white/60">{t("address")}</p>
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-sm text-white/60 hover:text-white">
              {SUPPORT_EMAIL}
            </a>
            <a href={`tel:${HOTLINE.replace(/\s/g, "")}`} className="text-sm text-white/60 hover:text-white">
              {HOTLINE}
            </a>
            <div className="flex gap-2 pt-1.5">
              {(Object.keys(SOCIAL_LINKS) as SocialName[]).map((name) => (
                <a
                  key={name}
                  href={SOCIAL_LINKS[name]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.08] text-white transition-colors hover:bg-white/20"
                >
                  <SocialIcon name={name} />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="m-0 text-[13px] text-white/50">{t("rights", { year: new Date().getFullYear() })}</p>
          <ul aria-label={t("payments")} className="m-0 flex list-none flex-wrap gap-2 p-0">
            {["QPay", "SocialPay", "VISA", "Mastercard"].map((m) => (
              <li key={m} className="rounded-md bg-white/[0.08] px-3 py-1.5 text-xs font-bold text-white">
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
