"use client";

import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { useCatalog } from "@/lib/hooks/useCatalog";

const SHOWN = 12;

/** "Recommended for You": regular-price items first, then the rest. */
export function Recommended() {
  const t = useTranslations("home");
  const { products, loading } = useCatalog();
  const list = [...products.filter((p) => !p.flash), ...products.filter((p) => p.flash)].slice(0, SHOWN);

  if (!loading && list.length === 0) return null;

  return (
    <section className="container-x flex flex-col gap-4 pt-8 lg:pt-10">
      <SectionHeader title={t("recommendedTitle")} link={{ href: "/products", label: t("viewAll") }} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
        {loading
          ? Array.from({ length: 6 }, (_, i) => <ProductCardSkeleton key={i} />)
          : list.map((p) => <ProductCard key={p._id} product={p} />)}
      </div>
    </section>
  );
}
