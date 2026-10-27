"use client";

import { BadgeCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import EmptyState from "@/components/common/EmptyState";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { useCatalog } from "@/lib/hooks/useCatalog";

/**
 * The store's own products. Not linked from the site menus — visitors arrive
 * through the printed QR / barcode link to /own.
 */
export function OwnCollection() {
  const t = useTranslations("own");
  const { ownProducts, loading } = useCatalog();

  return (
    <div className="flex flex-col gap-8 pb-12">
      <section className="bg-navy text-white">
        <div className="container-x flex flex-col items-start gap-3 py-10 lg:py-14">
          <span className="flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[1px]">
            <BadgeCheck size={14} aria-hidden="true" />
            {t("badge")}
          </span>
          <h1 className="m-0 text-[28px] font-extrabold leading-tight tracking-[-0.5px] sm:text-[38px]">
            {t("title")}
          </h1>
          <p className="m-0 max-w-[560px] text-[15px] leading-[1.7] text-white/75">{t("lead")}</p>
        </div>
      </section>

      <section className="container-x">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
            {Array.from({ length: 4 }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : ownProducts.length === 0 ? (
          <EmptyState title={t("emptyTitle")} description={t("emptyLead")} />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:gap-4">
            {ownProducts.map((p) => (
              <ProductCard key={p._id} product={p} href={`/own/${p._id}`} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
