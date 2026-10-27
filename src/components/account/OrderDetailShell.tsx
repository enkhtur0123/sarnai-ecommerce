"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useQuery } from "@apollo/client/react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { PageLoader } from "@/components/common/Loader";
import { AccountLayout } from "@/components/account/AccountNav";
import {
  OrderStatusBadge,
  useStatusDescription,
  useStatusLabel,
} from "@/components/account/OrdersView";
import {
  CP_ORDER_DETAIL,
  type CpOrderDetailData,
  type CpOrderDetailVariables,
} from "@/graphql/ecommerce/queries/order";
import { useAuth } from "@/lib/auth/AuthContext";
import { activeOrderAtom, placedOrdersAtom } from "@/store/order.store";
import { DEMO_ORDERS, isDemoUser } from "@/lib/auth/demoCustomer";
import { HAS_POS, ORDER_STATUS_FLOW, type OrderStatusKey } from "@/lib/constants";
import { normalizeOrderStatus, orderStatusStep } from "@/lib/orderStatus";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import { textFor } from "@/types/catalog";

type Line = { key: string; name: string; count: number; unitPrice: number; imageUrl?: string };

function OrderProgress({ statusKey }: { statusKey: OrderStatusKey }) {
  const t = useTranslations("orders");
  const step = orderStatusStep(statusKey);
  if (step < 0) return null;
  return (
    <ol className="m-0 grid list-none grid-cols-7 gap-1 p-0" aria-label="Order progress">
      {ORDER_STATUS_FLOW.map((key, i) => (
        <li key={key} className="flex min-w-0 flex-col items-center gap-1.5">
          <span
            className={cn(
              "h-2 w-full rounded-full",
              i <= step ? "bg-navy" : "bg-line",
            )}
            aria-hidden="true"
          />
          <span
            className={cn(
              "hidden text-center text-[10px] font-semibold leading-tight sm:block",
              i <= step ? "text-navy" : "text-muted",
            )}
          >
            {t.has(`statuses.${key}`) ? t(`statuses.${key}`) : key}
          </span>
        </li>
      ))}
    </ol>
  );
}

/**
 * Order detail, fetched at runtime: `cpOrderDetail` for the signed-in
 * customer, otherwise the copy of an order placed from this browser.
 */
export function OrderDetailShell({ orderId }: { orderId: string }) {
  const t = useTranslations("orders");
  const tCart = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();
  const statusLabel = useStatusLabel();
  const statusDescription = useStatusDescription();
  const { user, loading: userLoading } = useAuth();
  const placed = useAtomValue(placedOrdersAtom);
  const setActive = useSetAtom(activeOrderAtom);
  const customerId = user?.erxesCustomerId ?? "";
  const demo = isDemoUser(user) ? DEMO_ORDERS.find((o) => o._id === orderId) : undefined;
  const local = demo ?? placed.find((o) => o._id === orderId);

  const { data, loading } = useQuery<CpOrderDetailData, CpOrderDetailVariables>(CP_ORDER_DETAIL, {
    variables: { id: orderId, customerId },
    skip: !customerId || !HAS_POS,
    fetchPolicy: "cache-and-network",
  });
  const remote = data?.cpOrderDetail;

  if ((loading || userLoading) && !remote && !local) return <PageLoader />;

  let header: {
    number: string;
    date?: string;
    statusKey: OrderStatusKey;
    status: string;
    description: string;
    total: number;
    fee: number;
    address?: string;
  } | null = null;
  let lines: Line[] = [];

  if (remote) {
    const info = (remote.deliveryInfo ?? {}) as Record<string, unknown>;
    const paid = Boolean(remote.paidDate);
    const statusKey = normalizeOrderStatus(remote.status, paid);
    header = {
      number: remote.number ?? remote._id.slice(-6).toUpperCase(),
      date: remote.createdAt,
      statusKey,
      status: statusLabel(remote.status, paid),
      description: statusDescription(statusKey),
      total: remote.totalAmount ?? 0,
      fee: typeof info.deliveryFee === "number" ? info.deliveryFee : 0,
      address: typeof info.address === "string" ? info.address : undefined,
    };
    lines = (remote.items ?? []).map((i) => ({
      key: i._id,
      name: i.productName ?? "",
      count: i.count ?? 0,
      unitPrice: i.unitPrice ?? 0,
      imageUrl: i.productImgUrl,
    }));
  } else if (local) {
    const statusKey = normalizeOrderStatus(local.status, local.paid);
    header = {
      number: local.number ?? local._id.slice(-6).toUpperCase(),
      date: local.createdAt,
      statusKey,
      status: statusLabel(local.status, local.paid),
      description: statusDescription(statusKey),
      total: local.total,
      fee: local.deliveryFee,
      address: local.address,
    };
    lines = local.items.map((i, idx) => ({
      key: String(idx),
      name: textFor(i.name, locale),
      count: i.count,
      unitPrice: i.unitPrice,
      imageUrl: i.imageUrl,
    }));
  }

  return (
    <AccountLayout>
      <div className="flex flex-col gap-6">
        <Link href="/orders" className="text-sm font-bold text-navy hover:text-accent">
          {t("back")}
        </Link>
        {!header ? (
          <p className="m-0 rounded-2xl border border-line bg-white px-6 py-10 text-muted">{t("notFound")}</p>
        ) : (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.5px]">
                  {t("number")} #{header.number}
                </h1>
                <span className="text-sm text-muted">{formatDate(header.date, locale)}</span>
              </div>
              <OrderStatusBadge statusKey={header.statusKey} className="px-4 py-1.5 text-sm" />
            </div>

            {header.description && (
              <p className="m-0 rounded-xl bg-surface px-4 py-3 text-sm text-navy">{header.description}</p>
            )}

            <OrderProgress statusKey={header.statusKey} />

            <ul className="m-0 flex list-none flex-col rounded-2xl border border-line bg-white p-0">
              {lines.map((l) => (
                <li key={l.key} className="flex items-center gap-4 border-b border-line px-5 py-4 last:border-0">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                    <Image src={l.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                  </div>
                  <span className="flex-1 text-sm font-semibold">
                    {l.name} <span className="text-muted">× {l.count}</span>
                  </span>
                  <span className="text-sm font-bold">{formatPrice(l.unitPrice * l.count)}</span>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-2 rounded-2xl border border-line bg-white p-5 text-sm">
              {header.address && (
                <div className="flex justify-between gap-4">
                  <span className="text-muted">{t("address")}</span>
                  <span className="text-right font-semibold">{header.address}</span>
                </div>
              )}
              {header.fee > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted">{t("deliveryFee")}</span>
                  <span className="font-semibold">{formatPrice(header.fee)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-line pt-3 text-base">
                <span className="font-bold">{tCart("total")}</span>
                <span className="font-extrabold">{formatPrice(header.total)}</span>
              </div>
            </div>

            {local && !demo && !local.paid && !remote?.paidDate && (
              <button
                type="button"
                onClick={() => {
                  setActive(local);
                  router.push("/verify");
                }}
                className="btn-accent self-start"
              >
                {t("pay")}
              </button>
            )}
          </>
        )}
      </div>
    </AccountLayout>
  );
}
