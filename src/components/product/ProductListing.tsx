"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { useCatalog } from "@/lib/hooks/useCatalog";
import { cn } from "@/lib/utils";
import { textFor } from "@/types/catalog";

type Sort = "featured" | "priceAsc" | "priceDesc" | "name";

export function ProductListing() {
  const t = useTranslations("products");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { categories, products, loading, isSample } = useCatalog();

  const q = params.get("q") ?? "";
  const filter = params.get("filter") ?? "";
  const sort = (params.get("sort") as Sort) || "featured";
  const categoryParam = params.get("category") ?? "";
  // Ignore links to categories that don't exist in this catalog.
  const category = categories.some((c) => c._id === categoryParam) ? categoryParam : "";

  function setParam(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const list = useMemo(() => {
    const needle = q.toLowerCase();
    const out = products.filter((p) => {
      if (category && p.categoryId !== category) return false;
      if (filter === "flash" && !(p.flash || p.oldPrice)) return false;
      if (filter === "new" && !p.isNew) return false;
      if (needle) {
        const hay = `${textFor(p.name, "mn")} ${textFor(p.name, "en")} ${textFor(p.categoryName, locale)}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
    if (sort === "priceAsc") out.sort((a, b) => a.unitPrice - b.unitPrice);
    if (sort === "priceDesc") out.sort((a, b) => b.unitPrice - a.unitPrice);
    if (sort === "name") out.sort((a, b) => textFor(a.name, locale).localeCompare(textFor(b.name, locale)));
    return out;
  }, [products, category, filter, q, sort, locale]);

  const activeCategory = categories.find((c) => c._id === category);
  const heading = q
    ? t("searchResults", { q })
    : activeCategory
      ? textFor(activeCategory.name, locale)
      : filter === "flash"
        ? t("filterFlash")
        : filter === "new"
          ? t("filterNew")
          : t("title");

  const chip = (active: boolean) =>
    cn(
      "whitespace-nowrap rounded-[20px] px-4 py-2 text-[13px] font-semibold transition-colors",
      active ? "bg-navy text-white" : "border border-line bg-white text-navy hover:border-navy",
    );

  return (
    <div className="container-x flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-2">
        <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.5px] sm:text-[34px]">{heading}</h1>
        <p className="m-0 text-[15px] text-muted">{t("lead")}</p>
        {isSample && (
          <p className="m-0 mt-2 w-fit rounded-lg bg-accent-tint px-3.5 py-2 text-[13px] font-semibold text-accent-deep">
            {tCommon("sampleNotice")}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4">
          <button type="button" onClick={() => setParam("category", "")} className={chip(!category)}>
            {t("all")}
          </button>
          {categories.map((c) => (
            <button key={c._id} type="button" onClick={() => setParam("category", c._id)} className={chip(category === c._id)}>
              {textFor(c.name, locale)}
            </button>
          ))}
        </div>
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          <button type="button" onClick={() => setParam("filter", filter === "flash" ? "" : "flash")} className={chip(filter === "flash")}>
            {t("filterFlash")}
          </button>
          <button type="button" onClick={() => setParam("filter", filter === "new" ? "" : "new")} className={chip(filter === "new")}>
            {t("filterNew")}
          </button>
          <label className="flex items-center gap-2 text-[13px] font-semibold text-muted">
            {t("sort")}
            <select
              value={sort}
              onChange={(e) => setParam("sort", e.target.value === "featured" ? "" : e.target.value)}
              className="h-9 rounded-lg border border-line bg-white px-3 text-[13px] font-semibold text-navy outline-none"
            >
              <option value="featured">{t("sortFeatured")}</option>
              <option value="priceAsc">{t("sortPriceAsc")}</option>
              <option value="priceDesc">{t("sortPriceDesc")}</option>
              <option value="name">{t("sortName")}</option>
            </select>
          </label>
        </div>
      </div>

      {!loading && (
        <p className="m-0 -mt-2 text-sm text-muted" aria-live="polite">
          {t("count", { count: list.length })}
        </p>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line bg-white px-6 py-16 text-center">
          <p className="m-0 text-base font-semibold">{t("empty")}</p>
          <button type="button" onClick={() => router.replace(pathname)} className="btn-ghost">
            {t("clear")}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
