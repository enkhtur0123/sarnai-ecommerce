"use client";

import { useAtomValue } from "jotai";
import { useQuery } from "@apollo/client/react";
import { ChevronRight, Package } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AccountLayout } from "@/components/account/AccountNav";
import { FULL_ORDERS, type FullOrdersData, type FullOrdersVariables } from "@/graphql/ecommerce/queries/order";
import { useAuth } from "@/lib/auth/AuthContext";
import { placedOrdersAtom } from "@/store/order.store";
import { DEMO_ORDERS, isDemoUser } from "@/lib/auth/demoCustomer";
import { HAS_POS } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";

export function useStatusLabel() {
  const t = useTranslations("orders");
  return (status?: string, paid?: boolean) => {
    if (status && t.has(`statuses.${status}`)) return t(`statuses.${status}`);
    return paid ? t("paid") : t("unpaid");
  };
}

type Row = {
  id: string;
  number: string;
  date?: string;
  total: number;
  count: number;
  status: string;
  paid: boolean;
};

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
            <span className="rounded-full bg-surface px-3 py-1 text-xs font-bold text-navy">{o.status}</span>
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
  const statusLabel = useStatusLabel();
  const { user } = useAuth();
  const local = useAtomValue(placedOrdersAtom);
  const customerId = user?.erxesCustomerId;

  const { data, loading } = useQuery<FullOrdersData, FullOrdersVariables>(FULL_ORDERS, {
    variables: { customerId, perPage: 50, sortField: "createdAt", sortDirection: -1 },
    skip: !customerId || !HAS_POS,
    fetchPolicy: "cache-and-network",
  });

  const demoRows: Row[] = isDemoUser(user)
    ? DEMO_ORDERS.map((o) => ({
        id: o._id,
        number: o.number ?? o._id,
        date: o.createdAt,
        total: o.total,
        count: o.items.reduce((s, i) => s + i.count, 0),
        status: o.paid ? t("paid") : t("unpaid"),
        paid: o.paid,
      }))
    : [];
  const remote: Row[] = demoRows.concat((data?.cpFullOrders ?? []).map((o) => ({
    id: o._id,
    number: o.number ?? o._id.slice(-6).toUpperCase(),
    date: o.createdAt,
    total: o.totalAmount ?? 0,
    count: o.items?.length ?? 0,
    status: statusLabel(o.status, Boolean(o.paidDate)),
    paid: Boolean(o.paidDate),
  })));
  const remoteIds = new Set(remote.map((r) => r.id));
  const mine: Row[] = local
    .filter((o) => !remoteIds.has(o._id))
    .map((o) => ({
      id: o._id,
      number: o.number ?? o._id.slice(-6).toUpperCase(),
      date: o.createdAt,
      total: o.total,
      count: o.items.reduce((s, i) => s + i.count, 0),
      status: o.paid ? t("paid") : t("unpaid"),
      paid: o.paid,
    }));

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
