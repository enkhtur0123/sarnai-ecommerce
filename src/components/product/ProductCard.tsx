"use client";

import { Heart, Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { Rating } from "@/components/product/Rating";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { textFor, type CatalogProduct } from "@/types/catalog";

/** "Product Card" component from ecommerce.pen. */
export function ProductCard({ product, className }: { product: CatalogProduct; className?: string }) {
  const t = useTranslations("product");
  const locale = useLocale();
  const { add } = useCart();
  const wishlist = useWishlist();
  const name = textFor(product.name, locale);
  const off = discountPercent(product.unitPrice, product.oldPrice);
  const saved = wishlist.has(product._id);
  const href = `/products/${product._id}`;

  return (
    <article className={cn("group flex min-w-0 flex-col gap-3.5", className)}>
      <div className="relative aspect-[302/300] overflow-hidden rounded-xl bg-surface">
        <Link href={href} aria-label={name} className="absolute inset-0">
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 302px"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-3.5 top-3.5 flex items-start justify-between">
          {off > 0 ? (
            <span className="rounded-2xl bg-accent px-2.5 py-[5px] text-xs font-bold text-white">
              {t("off", { percent: off })}
            </span>
          ) : product.isNew ? (
            <span className="rounded-2xl bg-navy px-2.5 py-[5px] text-xs font-bold text-white">{t("new")}</span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => wishlist.toggle(product)}
            aria-pressed={saved}
            aria-label={saved ? t("wishlistRemove") : t("wishlistAdd")}
            className="pointer-events-auto flex h-[34px] w-[34px] items-center justify-center rounded-full bg-white text-navy shadow-sm transition-colors hover:text-accent"
          >
            <Heart size={16} className={saved ? "fill-accent text-accent" : ""} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex items-end justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1.5">
          {product.categoryName && (
            <span className="truncate text-[11px] font-semibold uppercase tracking-[1px] text-muted">
              {textFor(product.categoryName, locale)}
            </span>
          )}
          <Link href={href} className="line-clamp-2 text-[15px] font-medium leading-snug text-navy hover:text-accent">
            {name}
          </Link>
          {product.rating ? <Rating value={product.rating} label={t("rating", { rating: product.rating })} /> : null}
          <div className="flex flex-wrap items-baseline gap-x-2">
            <span className="text-base font-bold text-accent">{formatPrice(product.unitPrice)}</span>
            {off > 0 && (
              <span className="text-[13px] text-muted line-through">{formatPrice(product.oldPrice!)}</span>
            )}
          </div>
        </div>
        <button
          type="button"
          onClick={() => add(product)}
          aria-label={t("addShort", { name })}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-navy text-navy transition-colors hover:bg-navy hover:text-white"
        >
          <Plus size={18} aria-hidden="true" />
        </button>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-3.5" aria-hidden="true">
      <div className="aspect-[302/300] animate-pulse rounded-xl bg-surface" />
      <div className="h-3 w-1/3 animate-pulse rounded bg-surface" />
      <div className="h-4 w-3/4 animate-pulse rounded bg-surface" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-surface" />
    </div>
  );
}
