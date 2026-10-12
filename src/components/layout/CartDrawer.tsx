"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";
import { ShoppingCart, Trash2, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { QtyStepper } from "@/components/product/QtyStepper";
import { FreeShippingMeter } from "@/components/cart/FreeShippingMeter";
import { useCart } from "@/lib/hooks/useCart";
import { cartOpenAtom } from "@/store/cart.store";
import { formatPrice } from "@/lib/utils";
import { textFor } from "@/types/catalog";

export function CartDrawer() {
  const t = useTranslations("cart");
  const locale = useLocale();
  const pathname = usePathname();
  const [open, setOpen] = useAtom(cartOpenAtom);
  const { items, count, total, setQty, remove } = useCart();

  useEffect(() => setOpen(false), [pathname, setOpen]);

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", esc);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", esc);
      document.body.style.overflow = "";
    };
  }, [open, setOpen]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        aria-label={t("continue")}
        onClick={() => setOpen(false)}
        className="absolute inset-0 bg-navy/40"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("title")}
        className="absolute right-0 top-0 flex h-full w-full max-w-[420px] flex-col bg-white shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingCart size={20} aria-hidden="true" />
            <h2 className="m-0 text-lg font-extrabold">{t("title")}</h2>
            <span className="text-sm text-muted">({t("items", { count })})</span>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label={t("continue")}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-surface"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-surface text-muted">
              <ShoppingCart size={26} aria-hidden="true" />
            </div>
            <p className="m-0 text-base font-bold">{t("empty")}</p>
            <p className="m-0 text-sm text-muted">{t("emptyLead")}</p>
            <Link href="/products" className="btn-primary mt-2">
              {t("continue")}
            </Link>
          </div>
        ) : (
          <>
            <div className="px-6 pt-4">
              <FreeShippingMeter subtotal={total} />
            </div>
            <ul className="m-0 flex flex-1 list-none flex-col gap-4 overflow-y-auto px-6 py-4">
              {items.map((item) => {
                const name = textFor(item.name, locale);
                return (
                  <li key={item.productId} className="flex gap-3.5 border-b border-line pb-4 last:border-0">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-surface">
                      <Image src={item.imageUrl} alt={name} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/products/${item.productId}`} className="line-clamp-2 text-sm font-semibold hover:text-accent">
                          {name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => remove(item.productId)}
                          aria-label={`${t("remove")}: ${name}`}
                          className="shrink-0 text-muted hover:text-accent"
                        >
                          <Trash2 size={16} aria-hidden="true" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-accent">{formatPrice(item.unitPrice)}</span>
                      <QtyStepper size="sm" value={item.count} onChange={(n) => setQty(item.productId, n)} />
                    </div>
                  </li>
                );
              })}
            </ul>
            <footer className="flex flex-col gap-3 border-t border-line px-6 py-5">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted">{t("subtotal")}</span>
                <span className="text-lg font-extrabold">{formatPrice(total)}</span>
              </div>
              <Link href="/checkout" className="btn-accent w-full">
                {t("checkout")}
              </Link>
              <Link href="/cart" className="btn-ghost w-full">
                {t("viewCart")}
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
