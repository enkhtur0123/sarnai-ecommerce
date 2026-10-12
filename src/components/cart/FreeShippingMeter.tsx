"use client";

import { Truck } from "lucide-react";
import { useTranslations } from "next-intl";
import { FREE_SHIPPING_FROM } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

export function FreeShippingMeter({ subtotal }: { subtotal: number }) {
  const t = useTranslations("cart");
  const left = Math.max(0, FREE_SHIPPING_FROM - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_FROM) * 100);
  return (
    <div className="flex flex-col gap-2 rounded-xl bg-surface px-4 py-3">
      <p className="m-0 flex items-center gap-2 text-[13px] font-semibold text-navy">
        <Truck size={16} aria-hidden="true" />
        {left > 0 ? t("freeShippingLeft", { amount: formatPrice(left) }) : t("freeShippingDone")}
      </p>
      <div className="h-1.5 overflow-hidden rounded-full bg-line">
        <div className="h-full rounded-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
