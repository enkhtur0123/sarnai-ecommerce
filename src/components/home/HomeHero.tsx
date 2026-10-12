"use client";

import {
  BookOpen,
  Car,
  Dumbbell,
  Gamepad2,
  HeartPulse,
  House,
  type LucideIcon,
  Menu,
  MoreHorizontal,
  RotateCcw,
  Shirt,
  ShieldCheck,
  ShoppingBasket,
  Smartphone,
  Sparkles,
  Truck,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { useCatalog } from "@/lib/hooks/useCatalog";
import { textFor } from "@/types/catalog";

/** Line icons cycled through the sidebar's category rows, as in the design. */
const ROW_ICONS: LucideIcon[] = [
  Smartphone,
  House,
  Shirt,
  Sparkles,
  Dumbbell,
  Gamepad2,
  ShoppingBasket,
  HeartPulse,
  Car,
  BookOpen,
];
const SIDEBAR_ROWS = 10;

function CategorySidebar() {
  const t = useTranslations("home");
  const locale = useLocale();
  const { categories } = useCatalog();

  return (
    <aside className="hidden overflow-hidden rounded-xl border border-line bg-white lg:flex lg:flex-col">
      <Link
        href="/products"
        className="flex h-10 items-center gap-2.5 bg-accent px-4 text-[13px] font-semibold text-white hover:bg-accent-deep"
      >
        <Menu size={16} aria-hidden="true" />
        {t("allCategories")}
      </Link>
      <ul className="m-0 flex list-none flex-col py-1.5">
        {categories.slice(0, SIDEBAR_ROWS).map((c, i) => {
          const Icon = ROW_ICONS[i % ROW_ICONS.length];
          return (
            <li key={c._id}>
              <Link
                href={`/products?category=${c._id}`}
                className="flex items-center gap-3 px-4 py-[9px] text-[13px] text-navy hover:bg-accent-tint hover:text-accent"
              >
                <Icon size={16} strokeWidth={1.8} className="shrink-0 text-muted" aria-hidden="true" />
                <span className="truncate">{textFor(c.name, locale)}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <Link
            href="/products"
            className="flex items-center gap-3 px-4 py-[9px] text-[13px] text-navy hover:bg-accent-tint hover:text-accent"
          >
            <MoreHorizontal size={16} className="shrink-0 text-muted" aria-hidden="true" />
            {t("more")}
          </Link>
        </li>
      </ul>
    </aside>
  );
}

function Banner() {
  const t = useTranslations("home");
  return (
    <div className="relative flex min-h-[200px] overflow-hidden rounded-xl bg-gradient-to-br from-[#f0394a] via-accent to-[#b5101f] sm:min-h-[300px]">
      <div aria-hidden="true" className="absolute -right-16 -top-20 h-72 w-72 rounded-full bg-white/10" />
      <div aria-hidden="true" className="absolute -bottom-24 right-40 h-60 w-60 rounded-full bg-white/5" />
      <div className="relative z-10 flex max-w-[60%] flex-col justify-center gap-3 px-5 py-8 sm:max-w-[50%] sm:gap-4 sm:px-8 lg:px-10">
        <h1 className="m-0 text-2xl font-extrabold leading-[1.12] tracking-[-0.5px] text-white sm:text-[34px]">
          {t("heroTitle1")}
          <br />
          {t("heroTitle2")}
        </h1>
        <p className="m-0 hidden text-sm text-white/85 sm:block">{t("heroLead")}</p>
        <Link
          href="/products"
          className="mt-1 inline-flex h-9 w-fit items-center rounded-lg bg-white px-5 text-[13px] font-semibold text-accent shadow-sm transition-transform hover:-translate-y-0.5 sm:h-10"
        >
          {t("shopNow")}
        </Link>
      </div>
      <div className="absolute inset-y-0 right-0 w-[48%] sm:w-[50%]">
        <Image
          src="/images/hero.jpg"
          alt=""
          fill
          priority
          sizes="(max-width: 1024px) 50vw, 340px"
          className="object-cover [mask-image:linear-gradient(to_right,transparent,black_35%)]"
        />
      </div>
      <div aria-hidden="true" className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 gap-1.5">
        <span className="h-1.5 w-4 rounded-full bg-white" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/50" />
      </div>
    </div>
  );
}

function ServiceCards() {
  const t = useTranslations("home");
  const items = [
    { icon: Truck, title: t("freeDelivery"), sub: t("freeDeliverySub") },
    { icon: ShieldCheck, title: t("securePayment"), sub: t("securePaymentSub") },
    { icon: RotateCcw, title: t("easyReturns"), sub: t("easyReturnsSub") },
  ];
  return (
    <ul className="m-0 hidden list-none flex-col gap-3 p-0 lg:flex">
      {items.map(({ icon: Icon, title, sub }) => (
        <li key={title} className="flex flex-1 items-center gap-3.5 rounded-xl border border-line bg-white px-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent-tint text-accent">
            <Icon size={20} aria-hidden="true" />
          </span>
          <span className="flex flex-col gap-0.5">
            <span className="text-[13px] font-semibold text-navy">{title}</span>
            <span className="text-xs text-muted">{sub}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Top of the Sarnai homepage: category sidebar · red promo banner · service cards. */
export function HomeHero() {
  return (
    <section className="container-x grid gap-4 pt-4 lg:grid-cols-[230px_minmax(0,1fr)_250px] lg:pt-6">
      <CategorySidebar />
      <Banner />
      <ServiceCards />
    </section>
  );
}
