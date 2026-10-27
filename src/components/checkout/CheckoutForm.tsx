"use client";

import { useState } from "react";
import { useSetAtom } from "jotai";
import { useMutation } from "@apollo/client/react";
import { Store, Truck } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import Image from "@/components/common/Image";
import {
  CP_ORDERS_ADD,
  type CpOrdersAddData,
  type CpOrdersAddVariables,
} from "@/graphql/ecommerce/mutations/order";
import type { Order } from "@/graphql/ecommerce/queries/order";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCart } from "@/lib/hooks/useCart";
import { usePayments } from "@/lib/hooks/usePayments";
import { activeOrderAtom, placedOrdersAtom } from "@/store/order.store";
import { DELIVERY_FEE, FREE_SHIPPING_FROM, HAS_POS } from "@/lib/constants";
import { cn, formatPrice } from "@/lib/utils";
import { textFor } from "@/types/catalog";
import type { DeliveryType, PlacedOrder } from "@/types/order";

const PHONE = /^[0-9+\s-]{8,}$/;

type Issue = "contact" | "address" | "posMissing" | "submitFailed" | null;

export function CheckoutForm() {
  const t = useTranslations("checkout");
  const tCart = useTranslations("cart");
  const locale = useLocale();
  const router = useRouter();
  const { user } = useAuth();
  const { items, total, clear } = useCart();
  const { payments, loading: paymentsLoading } = usePayments();
  const setActiveOrder = useSetAtom(activeOrderAtom);
  const setPlaced = useSetAtom(placedOrdersAtom);
  const [addOrder, { loading: submitting }] = useMutation<CpOrdersAddData, CpOrdersAddVariables>(CP_ORDERS_ADD);

  // null = untouched, which shows the signed-in customer's details.
  const [firstNameInput, setFirstName] = useState<string | null>(null);
  const [lastNameInput, setLastName] = useState<string | null>(null);
  const [phoneInput, setPhone] = useState<string | null>(null);
  const [emailInput, setEmail] = useState<string | null>(null);
  const firstName = firstNameInput ?? user?.firstName ?? "";
  const lastName = lastNameInput ?? user?.lastName ?? "";
  const phone = phoneInput ?? user?.phone ?? "";
  const email = emailInput ?? user?.email ?? "";
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("delivery");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [paymentId, setPaymentId] = useState("");
  const [issue, setIssue] = useState<Issue>(null);

  const fee = deliveryType === "delivery" && total < FREE_SHIPPING_FROM ? DELIVERY_FEE : 0;
  const grandTotal = total + fee;
  const hasSampleItems = items.some((i) => i.sample);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setIssue(null);
    if (!firstName.trim() || !PHONE.test(phone.trim())) return setIssue("contact");
    if (deliveryType === "delivery" && !address.trim()) return setIssue("address");
    if (!HAS_POS || hasSampleItems) return setIssue("posMissing");

    const description = [notes.trim(), deliveryType === "pickup" ? t("pickup") : ""].filter(Boolean).join("\n");
    const customerId = user?.erxesCustomerId;
    try {
      const { data } = await addOrder({
        variables: {
          items: items.map((i) => ({ productId: i.productId, count: i.count, unitPrice: i.unitPrice })),
          totalAmount: total,
          type: deliveryType === "delivery" ? "delivery" : "take",
          customerId,
          customerType: customerId ? "customer" : undefined,
          description,
          saleStatus: "pending_payment",
          deliveryInfo: {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            phone: phone.trim(),
            address: deliveryType === "delivery" ? address.trim() : t("pickupNote"),
            description,
            deliveryType,
            deliveryFee: fee,
            paymentId: paymentId || undefined,
          },
        },
      });
      const created = data?.cpOrdersAdd as Order | undefined;
      if (!created?._id) throw new Error("no order id");

      const placed: PlacedOrder = {
        _id: created._id,
        number: created.number,
        createdAt: new Date().toISOString(),
        total,
        deliveryFee: fee,
        deliveryType,
        phone: phone.trim(),
        email: email.trim(),
        address: deliveryType === "delivery" ? address.trim() : undefined,
        items: items.map((i) => ({ name: i.name, count: i.count, unitPrice: i.unitPrice, imageUrl: i.imageUrl })),
        paymentId: paymentId || undefined,
        paid: false,
        status: "pending_payment",
      };
      setActiveOrder(placed);
      setPlaced((list) => [placed, ...list.filter((o) => o._id !== placed._id)]);
      clear();
      router.push("/verify");
    } catch {
      setIssue("submitFailed");
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-x py-16">
        <div className="mx-auto flex max-w-[480px] flex-col items-center gap-4 rounded-2xl border border-line bg-white px-6 py-14 text-center">
          <h1 className="m-0 text-2xl font-extrabold">{t("emptyCart")}</h1>
          <Link href="/products" className="btn-primary">
            {tCart("continue")}
          </Link>
        </div>
      </div>
    );
  }

  const option = (active: boolean) =>
    cn(
      "flex flex-1 items-start gap-3 rounded-xl p-4 text-left transition-colors",
      active ? "border-2 border-navy bg-surface" : "border border-line bg-white hover:border-navy",
    );

  return (
    <form onSubmit={submit} noValidate className="container-x grid items-start gap-8 py-10 lg:grid-cols-[1fr_400px]">
      <div className="flex flex-col gap-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.5px] sm:text-[34px]">{t("title")}</h1>
          {!user && (
            <p className="m-0 text-sm text-muted">
              {t("loginHint")}{" "}
              <Link href="/login?next=/checkout" className="font-bold text-navy hover:text-accent">
                {t("login")}
              </Link>
            </p>
          )}
        </div>

        <fieldset className="m-0 flex flex-col gap-4 rounded-2xl border border-line bg-white p-6">
          <legend className="float-left mb-1 text-lg font-extrabold">{t("contact")}</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="label">
              {t("firstName")}
              <input className="field" value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required />
            </label>
            <label className="label">
              {t("lastName")}
              <input className="field" value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" />
            </label>
            <label className="label">
              {t("phone")}
              <input className="field" type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" required />
            </label>
            <label className="label">
              {t("email")}
              <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
            </label>
          </div>
        </fieldset>

        <fieldset className="m-0 flex flex-col gap-4 rounded-2xl border border-line bg-white p-6">
          <legend className="float-left mb-1 text-lg font-extrabold">{t("deliveryTitle")}</legend>
          <div className="flex flex-col gap-3 sm:flex-row" role="radiogroup" aria-label={t("deliveryTitle")}>
            {(
              [
                { key: "delivery", icon: Truck, title: t("delivery"), sub: t("deliverySub") },
                { key: "pickup", icon: Store, title: t("pickup"), sub: t("pickupSub") },
              ] as const
            ).map(({ key, icon: Icon, title, sub }) => (
              <button
                key={key}
                type="button"
                role="radio"
                aria-checked={deliveryType === key}
                onClick={() => setDeliveryType(key)}
                className={option(deliveryType === key)}
              >
                <Icon size={20} className="mt-0.5 shrink-0" aria-hidden="true" />
                <span className="flex flex-col gap-0.5">
                  <span className="text-[15px] font-bold">{title}</span>
                  <span className="text-[13px] text-muted">{sub}</span>
                </span>
              </button>
            ))}
          </div>
          {deliveryType === "delivery" ? (
            <label className="label">
              {t("address")}
              <textarea
                className="field"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder={t("addressPlaceholder")}
                autoComplete="street-address"
                rows={3}
              />
            </label>
          ) : (
            <p className="m-0 rounded-xl bg-surface px-4 py-3 text-sm font-medium text-navy">{t("pickupNote")}</p>
          )}
          <label className="label">
            {t("notes")}
            <textarea className="field" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} />
          </label>
        </fieldset>

        <fieldset className="m-0 flex flex-col gap-4 rounded-2xl border border-line bg-white p-6">
          <legend className="float-left mb-1 text-lg font-extrabold">{t("payment")}</legend>
          {paymentsLoading ? null : payments.length === 0 ? (
            <p className="m-0 rounded-xl bg-surface px-4 py-3 text-sm text-muted">{t("noPayments")}</p>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup" aria-label={t("payment")}>
              {payments.map((p) => (
                <button
                  key={p._id}
                  type="button"
                  role="radio"
                  aria-checked={(paymentId || payments[0]._id) === p._id}
                  onClick={() => setPaymentId(p._id)}
                  className={option((paymentId || payments[0]._id) === p._id)}
                >
                  <span className="text-[15px] font-bold">{p.name ?? p.kind}</span>
                </button>
              ))}
            </div>
          )}
        </fieldset>
      </div>

      <aside className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6 lg:sticky lg:top-6">
        <h2 className="m-0 text-lg font-extrabold">{t("summary")}</h2>
        <ul className="m-0 flex list-none flex-col gap-3 p-0">
          {items.map((i) => {
            const name = textFor(i.name, locale);
            return (
              <li key={i.productId} className="flex items-center gap-3">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-surface">
                  <Image src={i.imageUrl} alt="" fill sizes="56px" className="object-cover" />
                  <span className="absolute right-0.5 top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-navy px-1 text-[10px] font-bold text-white">
                    {i.count}
                  </span>
                </div>
                <span className="line-clamp-2 flex-1 text-sm font-medium">{name}</span>
                <span className="text-sm font-bold">{formatPrice(i.unitPrice * i.count)}</span>
              </li>
            );
          })}
        </ul>
        <div className="flex flex-col gap-2 border-t border-line pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-muted">{tCart("subtotal")}</span>
            <span className="font-semibold">{formatPrice(total)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">{tCart("shipping")}</span>
            <span className="font-semibold">{fee > 0 ? formatPrice(fee) : tCart("free")}</span>
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-line pt-4">
          <span className="font-bold">{tCart("total")}</span>
          <span className="text-xl font-extrabold">{formatPrice(grandTotal)}</span>
        </div>
        {fee > 0 && <p className="m-0 text-xs text-muted">{t("feeNote")}</p>}
        {issue && (
          <p role="alert" className="m-0 rounded-xl bg-accent-tint px-4 py-3 text-sm font-semibold text-accent-deep">
            {t(`errors.${issue}`)}
          </p>
        )}
        <button type="submit" disabled={submitting} className="btn-accent w-full">
          {submitting ? t("placing") : t("place")}
        </button>
      </aside>
    </form>
  );
}
