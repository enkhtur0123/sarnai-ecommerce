"use client";

import { Heart, ShoppingCart, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { AccountLayout } from "@/components/account/AccountNav";
import { useCart } from "@/lib/hooks/useCart";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { formatPrice } from "@/lib/utils";
import { textFor } from "@/types/catalog";

export function WishlistView() {
  const t = useTranslations("wishlist");
  const tCart = useTranslations("cart");
  const locale = useLocale();
  const { items, remove } = useWishlist();
  const { add } = useCart();

  return (
    <AccountLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.5px]">{t("title")}</h1>
          <p className="m-0 text-[15px] text-muted">{t("lead")}</p>
        </div>
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-muted">
              <Heart size={24} aria-hidden="true" />
            </div>
            <p className="m-0 font-bold">{t("empty")}</p>
            <p className="m-0 text-sm text-muted">{t("emptyLead")}</p>
            <Link href="/products" className="btn-primary mt-2">
              {tCart("continue")}
            </Link>
          </div>
        ) : (
          <ul className="m-0 grid list-none gap-6 p-0 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const name = textFor(item.name, locale);
              return (
                <li key={item.productId} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-4">
                  <Link href={`/products/${item.productId}`} className="relative aspect-square overflow-hidden rounded-xl bg-surface">
                    <Image src={item.imageUrl} alt={name} fill sizes="300px" className="object-cover" />
                  </Link>
                  <Link href={`/products/${item.productId}`} className="line-clamp-2 text-[15px] font-semibold hover:text-accent">
                    {name}
                  </Link>
                  <span className="text-base font-bold text-accent">{formatPrice(item.unitPrice)}</span>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        add({
                          _id: item.productId,
                          name: item.name,
                          unitPrice: item.unitPrice,
                          imageUrl: item.imageUrl,
                          sample: item.sample,
                        })
                      }
                      className="btn-primary min-h-10 flex-1 px-4"
                    >
                      <ShoppingCart size={16} aria-hidden="true" />
                      {t("moveToCart")}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      aria-label={`${t("remove")}: ${name}`}
                      className="flex h-10 w-10 items-center justify-center rounded-lg border border-line text-muted hover:border-accent hover:text-accent"
                    >
                      <Trash2 size={16} aria-hidden="true" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </AccountLayout>
  );
}
