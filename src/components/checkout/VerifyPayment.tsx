"use client";

import { useCallback, useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";
import { useMutation } from "@apollo/client/react";
import { Check, PackageCheck } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  INVOICE_CREATE,
  INVOICES_CHECK,
  PAYMENT_TRANSACTIONS_ADD,
  type InvoiceCreateData,
  type InvoiceCreateVariables,
  type InvoicesCheckData,
  type InvoicesCheckVariables,
  type PaymentTransactionsAddData,
  type PaymentTransactionsAddVariables,
} from "@/graphql/ecommerce/mutations/payment";
import { useAuth } from "@/lib/auth/AuthContext";
import { usePayments } from "@/lib/hooks/usePayments";
import { activeOrderAtom, placedOrdersAtom } from "@/store/order.store";
import { PAYMENT_CONTENT_TYPE } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";

type Status = "idle" | "pending" | "paid" | "error";

/** QR from a transaction/invoice payload: raw base64, data URI or URL. */
function pickQr(...sources: Array<Record<string, unknown> | undefined>) {
  for (const s of sources) {
    const qr = s?.qrData ?? s?.qrImage;
    if (typeof qr === "string" && qr) {
      return qr.startsWith("data:") || qr.startsWith("http") ? qr : `data:image/png;base64,${qr}`;
    }
  }
  return "";
}

export function VerifyPayment() {
  const t = useTranslations("verify");
  const { user } = useAuth();
  const [order, setOrder] = useAtom(activeOrderAtom);
  const setPlaced = useSetAtom(placedOrdersAtom);
  const { payments, loading: paymentsLoading } = usePayments();
  const [paymentId, setPaymentId] = useState("");
  const [invoiceId, setInvoiceId] = useState("");
  const [qr, setQr] = useState("");
  const [status, setStatus] = useState<Status>(order?.paid ? "paid" : "idle");
  const [notPaidYet, setNotPaidYet] = useState(false);

  const [createInvoice, { loading: creating }] = useMutation<InvoiceCreateData, InvoiceCreateVariables>(INVOICE_CREATE);
  const [addTransaction] = useMutation<PaymentTransactionsAddData, PaymentTransactionsAddVariables>(PAYMENT_TRANSACTIONS_ADD);
  const [checkInvoice, { loading: checking }] = useMutation<InvoicesCheckData, InvoicesCheckVariables>(INVOICES_CHECK);

  const wanted = paymentId || order?.paymentId || "";
  const selected = payments.some((p) => p._id === wanted) ? wanted : payments[0]?._id ?? "";
  const number = order?.number ?? order?._id.slice(-6).toUpperCase() ?? "";

  const markPaid = useCallback(() => {
    setStatus("paid");
    if (!order) return;
    const paid = { ...order, paid: true, status: "paid" as const };
    setOrder(paid);
    setPlaced((list) => list.map((o) => (o._id === paid._id ? paid : o)));
  }, [order, setOrder, setPlaced]);

  const check = useCallback(
    async (manual: boolean) => {
      if (!invoiceId) return;
      try {
        const { data } = await checkInvoice({ variables: { id: invoiceId } });
        if (data?.invoicesCheck) markPaid();
        else if (manual) setNotPaidYet(true);
      } catch {
        if (manual) setNotPaidYet(true);
      }
    },
    [invoiceId, checkInvoice, markPaid],
  );

  // Poll every 5 s while an invoice is open; stops once paid.
  useEffect(() => {
    if (!invoiceId || status !== "pending") return;
    const id = setInterval(() => check(false), 5000);
    return () => clearInterval(id);
  }, [invoiceId, status, check]);

  async function pay() {
    if (!order || !selected) return;
    const payment = payments.find((p) => p._id === selected);
    setNotPaidYet(false);
    try {
      const customerId = user?.erxesCustomerId;
      const { data } = await createInvoice({
        variables: {
          input: {
            amount: order.total,
            phone: order.phone,
            email: order.email || undefined,
            description: t("invoiceDescription", { number }),
            contentType: PAYMENT_CONTENT_TYPE,
            contentTypeId: order._id,
            customerId,
            customerType: customerId ? "customer" : "visitor",
            paymentIds: [selected],
          },
        },
      });
      const invoice = data?.invoiceCreate;
      if (!invoice?._id) throw new Error("no invoice");
      setInvoiceId(invoice._id);

      const { data: tx } = await addTransaction({
        variables: {
          input: {
            invoiceId: invoice._id,
            paymentId: selected,
            paymentKind: payment?.kind,
            amount: order.total,
          },
        },
      });
      const transaction = tx?.paymentTransactionsAdd;
      // Some providers answer with a hosted payment page instead of a QR.
      const redirect =
        (transaction?.response as Record<string, unknown> | undefined)?.redirectUrl ??
        (invoice.data as Record<string, unknown> | undefined)?.redirectUrl;
      if (typeof redirect === "string" && redirect) {
        window.location.href = redirect;
        return;
      }
      setQr(
        pickQr(
          transaction?.response,
          transaction?.details,
          invoice.transactions?.[0]?.response,
          invoice.transactions?.[0]?.details,
        ),
      );
      setStatus("pending");
    } catch {
      setStatus("error");
    }
  }

  const card = "flex flex-col items-start gap-4 rounded-2xl border border-line bg-white p-6 sm:p-8";

  if (!order) {
    return (
      <div className="container-x max-w-[760px] py-12">
        <div className={card}>
          <h1 className="m-0 text-[28px] font-extrabold">{t("noOrderTitle")}</h1>
          <p className="m-0 text-muted">{t("noOrderLead")}</p>
          <Link href="/products" className="btn-primary">
            {t("toShop")}
          </Link>
        </div>
      </div>
    );
  }

  const noMethods = !paymentsLoading && payments.length === 0;

  if (status === "paid" || noMethods) {
    const paid = status === "paid";
    return (
      <div className="container-x max-w-[760px] py-12">
        <div className={card}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent text-white">
            {paid ? <Check size={32} strokeWidth={3} aria-hidden="true" /> : <PackageCheck size={30} aria-hidden="true" />}
          </div>
          <h1 className="m-0 text-[30px] font-extrabold">{paid ? t("paidTitle") : t("receivedTitle")}</h1>
          <p className="m-0 leading-relaxed text-muted">
            {t.rich(paid ? "paidLead" : "receivedLead", {
              number,
              b: (chunks) => <b className="text-navy">{chunks}</b>,
            })}
          </p>
          {!paid && <p className="m-0 rounded-xl bg-surface px-4 py-3 text-sm text-muted">{t("noMethods")}</p>}
          <div className="flex flex-wrap gap-3">
            <Link href="/orders" className="btn-primary">
              {t("track")}
            </Link>
            <Link href="/products" className="btn-ghost">
              {t("continue")}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-x max-w-[760px] py-12">
      <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="text-[13px] font-semibold text-muted">{t("orderNo")}</div>
            <div className="text-2xl font-extrabold">{number}</div>
          </div>
          <div className="text-right">
            <div className="text-[13px] font-semibold text-muted">{t("total")}</div>
            <div className="text-2xl font-extrabold text-accent">{formatPrice(order.total)}</div>
          </div>
        </div>
        <h1 className="m-0 text-[28px] font-extrabold">{t("title")}</h1>
        <p className="m-0 leading-relaxed text-muted">{t("lead")}</p>

        {!invoiceId && (
          <div>
            <div className="mb-2 text-[13px] font-bold text-muted">{t("method")}</div>
            {paymentsLoading ? (
              <p className="m-0 text-sm text-muted">{t("loading")}</p>
            ) : (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-2.5" role="radiogroup" aria-label={t("method")}>
                {payments.map((p) => (
                  <button
                    key={p._id}
                    type="button"
                    role="radio"
                    aria-checked={selected === p._id}
                    onClick={() => setPaymentId(p._id)}
                    className={cn(
                      "min-h-[52px] rounded-xl px-[18px] py-3 text-left font-bold",
                      selected === p._id ? "border-2 border-navy bg-surface" : "border border-line bg-white",
                    )}
                  >
                    {p.name ?? p.kind}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {qr && (
          <div className="flex flex-col items-center gap-2 self-stretch rounded-xl border border-line p-5">
            <p className="m-0 text-sm text-muted">{t("scanQr")}</p>
            {/* eslint-disable-next-line @next/next/no-img-element -- QR is a data URI or provider URL */}
            <img src={qr} alt={t("qrAlt")} className="h-[220px] w-[220px] rounded-lg border border-line" />
          </div>
        )}
        {status === "pending" && !qr && <p className="m-0 text-sm text-muted">{t("pendingNoQr")}</p>}
        {status === "pending" && (
          <p className="m-0 text-sm text-muted" aria-live="polite">
            {t("waiting")}
          </p>
        )}
        {notPaidYet && (
          <p className="m-0 rounded-xl bg-accent-tint px-4 py-3 text-sm font-semibold text-accent-deep">{t("notPaidYet")}</p>
        )}
        {status === "error" && (
          <p role="alert" className="m-0 rounded-xl bg-accent-tint px-4 py-3 text-sm font-semibold text-accent-deep">
            {t("error")}
          </p>
        )}

        <div className="flex flex-wrap gap-3">
          {!invoiceId ? (
            <button type="button" onClick={pay} disabled={!selected || creating} className="btn-accent">
              {creating ? t("creating") : t("pay", { amount: formatPrice(order.total) })}
            </button>
          ) : (
            <button type="button" onClick={() => check(true)} disabled={checking} className="btn-primary">
              {t("checkStatus")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
