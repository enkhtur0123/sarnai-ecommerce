"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import type { CatalogProduct } from "@/types/catalog";

/** Horizontally scrolling row of product cards (4 visible on desktop). */
export function useRail() {
  const ref = useRef<HTMLDivElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.9, behavior: "smooth" });
  };
  return { ref, scroll };
}

export function RailButtons({ scroll }: { scroll: (dir: 1 | -1) => void }) {
  const t = useTranslations("flash");
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => scroll(-1)}
        aria-label={t("prev")}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-white text-navy hover:border-navy"
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <button
        type="button"
        onClick={() => scroll(1)}
        aria-label={t("next")}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-navy bg-navy text-white hover:bg-ink"
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}

export function ProductRail({
  products,
  loading,
  railRef,
}: {
  products: CatalogProduct[];
  loading?: boolean;
  railRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={railRef}
      className="scrollbar-none -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 sm:gap-6"
    >
      {loading
        ? [0, 1, 2, 3].map((i) => (
            <div key={i} className="w-[70%] shrink-0 snap-start sm:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)]">
              <ProductCardSkeleton />
            </div>
          ))
        : products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              className="w-[70%] shrink-0 snap-start sm:w-[calc((100%-48px)/3)] lg:w-[calc((100%-72px)/4)]"
            />
          ))}
    </div>
  );
}
