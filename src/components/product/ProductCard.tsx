"use client";

import { Heart, ShoppingCart, Star } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { textFor, type CatalogProduct } from "@/types/catalog";

/** Sarnai product card: white tile, "-15%" badge, red price, star score, cart button. */
export function ProductCard({
  product,
  className,
  href: hrefProp,
}: {
  product: CatalogProduct;
  className?: string;
  /** Detail link; defaults to the main shop's /products/[id]. */
  href?: string;
}) {
  const t = useTranslations("product");
  const locale = useLocale();
  const { add } = useCart();
  const wishlist = useWishlist();
  const name = textFor(product.name, locale);
  const off = discountPercent(product.unitPrice, product.oldPrice);
  const saved = wishlist.has(product._id);
  const href = hrefProp ?? `/products/${product._id}`;

  return (
    <article
      className={cn(
        "group flex min-w-0 flex-col overflow-hidden rounded-xl border border-line bg-white transition-shadow hover:shadow-[0_8px_24px_rgba(31,41,55,0.08)]",
        className,
      )}
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <Link href={href} aria-label={name} className="absolute inset-3">
          <Image
            src={product.imageUrl}
            alt={name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 240px"
            className="rounded-lg object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        </Link>
        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 flex items-start justify-between">
          {off > 0 ? (
            <span className="rounded-md bg-accent px-1.5 py-0.5 text-[11px] font-bold text-white">-{off}%</span>
          ) : product.isNew ? (
            <span className="rounded-md bg-navy px-1.5 py-0.5 text-[11px] font-bold text-white">{t("new")}</span>
          ) : (
            <span />
          )}
          <button
            type="button"
            onClick={() => wishlist.toggle(product)}
            aria-pressed={saved}
            aria-label={saved ? t("wishlistRemove") : t("wishlistAdd")}
            className={cn(
              "pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white text-navy shadow-sm transition hover:text-accent",
              saved ? "opacity-100" : "opacity-100 lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100",
            )}
          >
            <Heart size={15} className={saved ? "fill-accent text-accent" : ""} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 px-3 pb-3">
        <Link href={href} className="line-clamp-2 min-h-[2.5em] text-[13px] leading-[1.25] text-navy hover:text-accent">
          {name}
        </Link>
        <div className="mt-auto flex items-end justify-between gap-2">
          <div className="flex min-w-0 flex-col gap-1">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-[15px] font-bold text-accent">{formatPrice(product.unitPrice)}</span>
              {off > 0 && (
                <span className="text-[11px] text-secondary line-through">{formatPrice(product.oldPrice!)}</span>
              )}
            </div>
            {product.rating ? (
              <span
                className="flex items-center gap-1 text-[11px] text-muted"
                role="img"
                aria-label={t("rating", { rating: product.rating })}
              >
                <Star size={12} className="fill-star text-star" aria-hidden="true" />
                {product.rating.toFixed(1)}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => add(product)}
            aria-label={t("addShort", { name })}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-accent transition-colors hover:bg-accent hover:text-white"
          >
            <ShoppingCart size={17} aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-line bg-white p-3" aria-hidden="true">
      <div className="aspect-square animate-pulse rounded-lg bg-surface" />
      <div className="h-3 w-3/4 animate-pulse rounded bg-surface" />
      <div className="h-4 w-1/2 animate-pulse rounded bg-surface" />
    </div>
  );
}
