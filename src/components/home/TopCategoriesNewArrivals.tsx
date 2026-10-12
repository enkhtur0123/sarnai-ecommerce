"use client";

import { ChevronRight, Package, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { useCatalog } from "@/lib/hooks/useCatalog";
import { textFor } from "@/types/catalog";

const AVATAR_COLORS = ["#2B3445", "#D23F57", "#0F9D7A", "#4E7CF6", "#E3A008"];

/** "Shops & New Arrivals" row: the design's Top Shops list, filled with real categories. */
export function TopCategoriesNewArrivals() {
  const t = useTranslations("topCats");
  const tCat = useTranslations("categories");
  const tNew = useTranslations("newArrivals");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const { categories, products, loading } = useCatalog();

  const top = categories
    .map((c) => ({ ...c, n: products.filter((p) => p.categoryId === c._id).length }))
    .filter((c) => c.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, 5);
  const fresh = products.filter((p) => p.isNew).slice(0, 3);
  const arrivals = fresh.length > 0 ? fresh : products.slice(-3);

  return (
    <section className="container-x grid gap-8 pt-16 lg:grid-cols-[280px_1fr] lg:pt-20">
      <aside className="flex flex-col gap-1.5 self-start rounded-2xl border border-line bg-white p-6">
        <h2 className="m-0 text-lg font-extrabold text-navy">{t("title")}</h2>
        <p className="m-0 text-[13px] text-muted">{t("lead")}</p>
        <ul className="m-0 mt-3 flex list-none flex-col p-0">
          {top.map((c, i) => {
            const name = textFor(c.name, locale);
            return (
              <li key={c._id}>
                <Link
                  href={`/products?category=${c._id}`}
                  className="group flex items-center gap-3 border-b border-line py-3"
                >
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[15px] font-extrabold text-white"
                    style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                    aria-hidden="true"
                  >
                    {name.charAt(0).toUpperCase()}
                  </span>
                  <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className="truncate text-sm font-semibold text-navy group-hover:text-accent">{name}</span>
                    <span className="flex items-center gap-1 text-xs text-muted">
                      <Package size={12} aria-hidden="true" />
                      {tCat("count", { count: c.n })}
                    </span>
                  </span>
                  <ChevronRight size={16} className="text-muted" aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
        <Link
          href="/products"
          className="mt-4 flex h-11 items-center justify-center rounded-lg bg-surface text-[13px] font-bold text-navy hover:bg-line"
        >
          {t("viewAll")}
        </Link>
      </aside>

      <div className="flex min-w-0 flex-col gap-7">
        <SectionHeader
          title={tNew("title")}
          icon={<Sparkles size={24} className="text-accent" aria-hidden="true" />}
          link={{ href: "/products?filter=new", label: tCommon("viewAll") }}
        />
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3">
          {loading
            ? [0, 1, 2].map((i) => <ProductCardSkeleton key={i} />)
            : arrivals.map((p) => <ProductCard key={p._id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
