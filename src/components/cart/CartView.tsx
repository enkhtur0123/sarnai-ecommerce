"use client";

import { ShoppingCart, Trash2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { QtyStepper } from "@/components/product/QtyStepper";
import { FreeShippingMeter } from "@/components/cart/FreeShippingMeter";
import { useCart } from "@/lib/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { textFor } from "@/types/catalog";

export function CartView() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const { items, count, total, setQty, remove } = useCart();

  if (items.length === 0) {
    return (
      <div className="container-x py-16">
        <div className="mx-auto flex max-w-[480px] flex-col items-center gap-4 rounded-2xl border border-line bg-white px-6 py-14 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-muted">
            <ShoppingCart size={26} aria-hidden="true" />
          </div>
          <h1 className="m-0 text-2xl font-extrabold">{t("empty")}</h1>
          <p className="m-0 text-muted">{t("emptyLead")}</p>
          <Link href="/products" className="btn-primary mt-2">
            {t("continue")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x flex flex-col gap-8 py-10">
      <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.5px] sm:text-[34px]">
        {t("title")} <span className="text-lg font-semibold text-muted">({t("items", { count })})</span>
      </h1>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="m-0 flex list-none flex-col rounded-2xl border border-line bg-white p-0">
          {items.map((item) => {
            const name = textFor(item.name, locale);
            return (
              <li key={item.productId} className="flex gap-4 border-b border-line p-5 last:border-0 sm:items-center">
                <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-surface">
                  <Image src={item.imageUrl} alt={name} fill sizes="96px" className="object-cover" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 flex-col gap-1">
                    <Link href={`/products/${item.productId}`} className="text-[15px] font-semibold hover:text-accent">
                      {name}
                    </Link>
                    <span className="text-sm font-bold text-accent">{formatPrice(item.unitPrice)}</span>
                  </div>
                  <div className="flex items-center gap-5">
                    <QtyStepper size="sm" value={item.count} onChange={(n) => setQty(item.productId, n)} />
                    <span className="w-28 text-right text-base font-extrabold">
                      {formatPrice(item.unitPrice * item.count)}
                    </span>
                    <button
                      type="button"
                      onClick={() => remove(item.productId)}
                      aria-label={`${t("remove")}: ${name}`}
                      className="text-muted hover:text-accent"
                    >
                      <Trash2 size={18} aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <aside className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6 lg:sticky lg:top-6">
          <FreeShippingMeter subtotal={total} />
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{t("subtotal")}</span>
            <span className="font-bold">{formatPrice(total)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted">{t("shipping")}</span>
            <span className="font-semibold text-muted">{t("shippingCalc")}</span>
          </div>
          <div className="flex items-center justify-between border-t border-line pt-4">
            <span className="font-bold">{t("total")}</span>
            <span className="text-xl font-extrabold">{formatPrice(total)}</span>
          </div>
          <Link href="/checkout" className="btn-accent w-full">
            {t("checkout")}
          </Link>
          <Link href="/products" className="text-center text-sm font-bold text-navy hover:text-accent">
            {t("continue")}
          </Link>
        </aside>
      </div>
    </div>
  );
}
