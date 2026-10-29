"use client";

import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { useCatalog } from "@/lib/hooks/useCatalog";

const SHOWN = 6;

/** "Sarnai Originals": the store's own products, also listed under /own. */
export function OwnProducts() {
  const t = useTranslations("home");
  const { ownProducts, loading } = useCatalog();
  const list = ownProducts.slice(0, SHOWN);

  if (!loading && list.length === 0) return null;

  return (
    <section className="container-x flex flex-col gap-4 pt-8 lg:pt-10">
      <SectionHeader
        title={t("ownTitle")}
        lead={t("ownLead")}
        link={{ href: "/own", label: t("viewAll") }}
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 lg:gap-4">
        {loading
          ? Array.from({ length: 4 }, (_, i) => <ProductCardSkeleton key={i} />)
          : list.map((p) => <ProductCard key={p._id} product={p} href={`/own/${p._id}`} />)}
      </div>
    </section>
  );
}
