"use client";

import { ChevronRight, Package } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AccountLayout } from "@/components/account/AccountNav";
import { useMemberOrders, type MemberOrderRow } from "@/lib/hooks/useMemberOrders";
import { ORDER_STATUS, type OrderStatusKey } from "@/lib/constants";
import { ORDER_STATUS_BADGE, normalizeOrderStatus } from "@/lib/orderStatus";
import { formatDate, formatPrice, cn } from "@/lib/utils";

export function useStatusKey() {
  return (status?: string, paid?: boolean): OrderStatusKey =>
    normalizeOrderStatus(status, paid);
}

export function useStatusLabel() {
  const t = useTranslations("orders");
  return (status?: string, paid?: boolean) => {
    const key = normalizeOrderStatus(status, paid);
    if (t.has(`statuses.${key}`)) return t(`statuses.${key}`);
    // Back-compat: very old stored raw values.
    if (status && t.has(`statuses.${status}`)) return t(`statuses.${status}`);
    return paid ? t("paid") : t("unpaid");
  };
}

export function useStatusDescription() {
  const t = useTranslations("orders");
  return (statusKey: OrderStatusKey) => {
    const fullKey = `statusDescriptions.${statusKey}`;
    if (t.has(fullKey)) return t(fullKey);
    return "";
  };
}

export function OrderStatusBadge({
  statusKey,
  className,
}: {
  statusKey: OrderStatusKey;
  className?: string;
}) {
  const t = useTranslations("orders");
  const label = t.has(`statuses.${statusKey}`)
    ? t(`statuses.${statusKey}`)
    : statusKey;
  return (
    <span
      className={cn(
        "rounded-full px-3 py-1 text-xs font-bold",
        ORDER_STATUS_BADGE[statusKey],
        className,
      )}
    >
      {label}
    </span>
  );
}

type Row = MemberOrderRow;

function OrderRows({ rows, payable }: { rows: Row[]; payable?: boolean }) {
  const t = useTranslations("orders");
  const locale = useLocale();
  return (
    <ul className="m-0 flex list-none flex-col rounded-2xl border border-line bg-white p-0">
      {rows.map((o) => (
        <li key={o.id} className="border-b border-line last:border-0">
          <Link href={`/orders/${o.id}`} className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-page">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-surface text-navy">
              <Package size={18} aria-hidden="true" />
            </span>
            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="text-[15px] font-bold text-navy">
                {t("number")} #{o.number}
              </span>
              <span className="text-[13px] text-muted">
                {formatDate(o.date, locale)} · {t("items", { count: o.count })}
              </span>
            </span>
            <OrderStatusBadge statusKey={o.statusKey} />
            <span className="w-28 text-right text-[15px] font-extrabold">{formatPrice(o.total)}</span>
            {payable && !o.paid ? (
              <span className="text-xs font-bold text-accent">{t("pay")}</span>
            ) : (
              <ChevronRight size={18} className="text-muted" aria-hidden="true" />
            )}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function OrdersView() {
  const t = useTranslations("orders");
  const tLogin = useTranslations("login");
  const { user, accountRows: remote, localRows: mine, loading } = useMemberOrders();

  // Keep ORDER_STATUS import referenced for discoverability of the canonical lifecycle.
  void ORDER_STATUS;

  return (
    <AccountLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1.5">
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.5px]">{t("title")}</h1>
          <p className="m-0 text-[15px] text-muted">{t("lead")}</p>
        </div>

        {!user && (
          <p className="m-0 rounded-xl bg-surface px-4 py-3 text-sm text-navy">
            {t("signInHint")}{" "}
            <Link href="/login?next=/orders" className="font-bold text-accent">
              {tLogin("submit")}
            </Link>
          </p>
        )}

        {user && remote.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-lg font-extrabold">{t("accountTitle")}</h2>
            <OrderRows rows={remote} />
          </section>
        )}

        {mine.length > 0 && (
          <section className="flex flex-col gap-3">
            <h2 className="m-0 text-lg font-extrabold">{t("localTitle")}</h2>
            <OrderRows rows={mine} payable />
          </section>
        )}

        {!loading && remote.length === 0 && mine.length === 0 && (
          <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-14 text-center text-muted">
            {t("empty")}
          </div>
        )}
      </div>
    </AccountLayout>
  );
}
