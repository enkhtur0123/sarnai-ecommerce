"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { useCatalog } from "@/lib/hooks/useCatalog";
import { cn } from "@/lib/utils";
import { textFor } from "@/types/catalog";

const SHOWN = 8;
const TAB_COUNT = 3;

export function JustForYou() {
  const t = useTranslations("forYou");
  const locale = useLocale();
  const { categories, products, loading } = useCatalog();
  const [tab, setTab] = useState("");

  // Tabs: "All" plus the categories with the most products.
  const tabs = [...categories]
    .map((c) => ({ ...c, n: products.filter((p) => p.categoryId === c._id).length }))
    .filter((c) => c.n > 0)
    .sort((a, b) => b.n - a.n)
    .slice(0, TAB_COUNT);

  const list = (tab ? products.filter((p) => p.categoryId === tab) : products.filter((p) => !p.flash && !p.isNew))
    .concat(tab ? [] : products.filter((p) => p.flash || p.isNew))
    .slice(0, SHOWN);

  return (
    <section className="container-x flex flex-col gap-7 pt-16 lg:pt-20">
      <SectionHeader
        title={t("title")}
        right={
          <div
            role="tablist"
            aria-label={t("title")}
            className="scrollbar-none flex max-w-full gap-2 overflow-x-auto rounded-3xl border border-line bg-white p-1"
          >
            {[{ _id: "", label: t("all") }, ...tabs.map((c) => ({ _id: c._id, label: textFor(c.name, locale) }))].map(
              (c) => (
                <button
                  key={c._id || "all"}
                  type="button"
                  role="tab"
                  aria-selected={tab === c._id}
                  onClick={() => setTab(c._id)}
                  className={cn(
                    "whitespace-nowrap rounded-[20px] px-[18px] py-[9px] text-[13px] font-semibold transition-colors",
                    tab === c._id ? "bg-navy text-white" : "text-navy hover:bg-surface",
                  )}
                >
                  {c.label}
                </button>
              ),
            )}
          </div>
        }
      />
      <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
        {loading
          ? Array.from({ length: SHOWN }, (_, i) => <ProductCardSkeleton key={i} />)
          : list.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}
