"use client";

import { useAtomValue, useSetAtom } from "jotai";
import { useQuery } from "@apollo/client/react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { PageLoader } from "@/components/common/Loader";
import { AccountLayout } from "@/components/account/AccountNav";
import { useStatusLabel } from "@/components/account/OrdersView";
import {
  CP_ORDER_DETAIL,
  type CpOrderDetailData,
  type CpOrderDetailVariables,
} from "@/graphql/ecommerce/queries/order";
import { useAuth } from "@/lib/auth/AuthContext";
import { activeOrderAtom, placedOrdersAtom } from "@/store/order.store";
import { HAS_POS } from "@/lib/constants";
import { formatDate, formatPrice } from "@/lib/utils";
import { textFor } from "@/types/catalog";

type Line = { key: string; name: string; count: number; unitPrice: number; imageUrl?: string };

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
  const { user, loading: userLoading } = useAuth();
  const local = useAtomValue(placedOrdersAtom).find((o) => o._id === orderId);
  const setActive = useSetAtom(activeOrderAtom);
  const customerId = user?.erxesCustomerId ?? "";

  const { data, loading } = useQuery<CpOrderDetailData, CpOrderDetailVariables>(CP_ORDER_DETAIL, {
    variables: { id: orderId, customerId },
    skip: !customerId || !HAS_POS,
    fetchPolicy: "cache-and-network",
  });
  const remote = data?.cpOrderDetail;

  if ((loading || userLoading) && !remote && !local) return <PageLoader />;

  let header: { number: string; date?: string; status: string; total: number; fee: number; address?: string } | null =
    null;
  let lines: Line[] = [];

  if (remote) {
    const info = (remote.deliveryInfo ?? {}) as Record<string, unknown>;
    header = {
      number: remote.number ?? remote._id.slice(-6).toUpperCase(),
      date: remote.createdAt,
      status: statusLabel(remote.status, Boolean(remote.paidDate)),
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
    header = {
      number: local.number ?? local._id.slice(-6).toUpperCase(),
      date: local.createdAt,
      status: local.paid ? t("paid") : t("unpaid"),
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
              <span className="rounded-full bg-surface px-4 py-1.5 text-sm font-bold">{header.status}</span>
            </div>

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

            {local && !local.paid && !remote?.paidDate && (
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
