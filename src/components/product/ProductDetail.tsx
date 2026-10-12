"use client";

import { useState } from "react";
import { Heart, RotateCcw, ShieldCheck, ShoppingCart, Truck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { PageLoader } from "@/components/common/Loader";
import { ProductCard } from "@/components/product/ProductCard";
import { QtyStepper } from "@/components/product/QtyStepper";
import { Rating } from "@/components/product/Rating";
import { useCart } from "@/lib/hooks/useCart";
import { useCatalog } from "@/lib/hooks/useCatalog";
import { useProduct } from "@/lib/hooks/useProduct";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { cn, discountPercent, formatPrice } from "@/lib/utils";
import { textFor } from "@/types/catalog";

export function ProductDetail({ id }: { id: string }) {
  const t = useTranslations("product");
  const tCommon = useTranslations("common");
  const tNav = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const { product, loading } = useProduct(id);
  const { products } = useCatalog();
  const { add } = useCart();
  const wishlist = useWishlist();
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  if (loading) return <PageLoader />;

  if (!product) {
    return (
      <div className="container-x flex flex-col items-start gap-4 py-16">
        <h1 className="m-0 text-[28px] font-extrabold">{t("notFound")}</h1>
        <p className="m-0 text-muted">{t("notFoundLead")}</p>
        <Link href="/products" className="btn-primary">
          {t("backToShop")}
        </Link>
      </div>
    );
  }

  const name = textFor(product.name, locale);
  const off = discountPercent(product.unitPrice, product.oldPrice);
  const images = product.images?.length ? product.images : [product.imageUrl ?? ""];
  const saved = wishlist.has(product._id);
  const related = products
    .filter((p) => p._id !== product._id && p.categoryId === product.categoryId)
    .concat(products.filter((p) => p._id !== product._id && p.categoryId !== product.categoryId))
    .slice(0, 4);

  return (
    <div className="container-x flex flex-col gap-16 py-8 lg:py-10">
      <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-2 text-[13px] text-muted">
        <Link href="/" className="hover:text-navy">
          {tCommon("home")}
        </Link>
        <span aria-hidden="true">/</span>
        <Link href="/products" className="hover:text-navy">
          {tNav("shop")}
        </Link>
        {product.categoryName && (
          <>
            <span aria-hidden="true">/</span>
            <Link href={`/products?category=${product.categoryId}`} className="hover:text-navy">
              {textFor(product.categoryName, locale)}
            </Link>
          </>
        )}
      </nav>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div className="flex flex-col gap-4">
          <div className="relative aspect-square overflow-hidden rounded-[20px] bg-surface">
            <Image src={images[active]} alt={name} fill priority sizes="(max-width: 1024px) 100vw, 620px" className="object-cover" />
            {off > 0 && (
              <span className="absolute left-5 top-5 rounded-2xl bg-accent px-3 py-1.5 text-[13px] font-bold text-white">
                {t("off", { percent: off })}
              </span>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3">
              {images.map((src, i) => (
                <button
                  key={src + i}
                  type="button"
                  onClick={() => setActive(i)}
                  aria-label={`${name} ${i + 1}`}
                  className={cn(
                    "relative h-20 w-20 overflow-hidden rounded-xl bg-surface",
                    i === active ? "ring-2 ring-navy" : "opacity-70 hover:opacity-100",
                  )}
                >
                  <Image src={src} alt="" fill sizes="80px" className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3">
            {product.categoryName && (
              <span className="text-xs font-semibold uppercase tracking-[1px] text-muted">
                {textFor(product.categoryName, locale)}
              </span>
            )}
            <h1 className="m-0 text-[28px] font-extrabold leading-tight tracking-[-0.5px] sm:text-[34px]">{name}</h1>
            {product.rating ? (
              <Rating value={product.rating} size={16} label={t("rating", { rating: product.rating })} />
            ) : null}
          </div>
          <div className="flex items-baseline gap-3">
            <span className="text-[30px] font-extrabold text-accent">{formatPrice(product.unitPrice)}</span>
            {off > 0 && <span className="text-lg text-muted line-through">{formatPrice(product.oldPrice!)}</span>}
          </div>
          <p className="m-0 text-[15px] leading-[1.7] text-muted">
            {textFor(product.description, locale) || t("noDescription")}
          </p>

          <div className="flex flex-col items-start gap-2">
            <span className="text-[13px] font-semibold text-navy">{t("quantity")}</span>
            <QtyStepper value={qty} onChange={setQty} />
          </div>

          <div className="flex flex-wrap gap-3">
            <button type="button" onClick={() => add(product, qty)} className="btn-primary flex-1 sm:flex-none">
              <ShoppingCart size={18} aria-hidden="true" />
              {t("addToCart")}
            </button>
            <button
              type="button"
              onClick={() => {
                add(product, qty, false);
                router.push("/checkout");
              }}
              className="btn-accent flex-1 sm:flex-none"
            >
              {t("buyNow")}
            </button>
            <button
              type="button"
              onClick={() => wishlist.toggle(product)}
              aria-pressed={saved}
              aria-label={saved ? t("wishlistRemove") : t("wishlistAdd")}
              className="flex h-12 w-12 items-center justify-center rounded-lg border border-line bg-white text-navy hover:border-navy"
            >
              <Heart size={20} className={saved ? "fill-accent text-accent" : ""} aria-hidden="true" />
            </button>
          </div>

          <ul className="m-0 grid list-none gap-3 rounded-2xl border border-line bg-white p-5 sm:grid-cols-3">
            {[
              { icon: Truck, label: t("perks1") },
              { icon: RotateCcw, label: t("perks2") },
              { icon: ShieldCheck, label: t("perks3") },
            ].map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2.5 text-[13px] font-semibold text-navy">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface">
                  <Icon size={16} aria-hidden="true" />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="flex flex-col gap-7">
          <h2 className="m-0 text-[22px] font-extrabold tracking-[-0.5px] sm:text-[28px]">{t("related")}</h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
