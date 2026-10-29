"use client";

import {
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Heart,
  Package,
  ShoppingBag,
  Sparkles,
  Wallet,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import RequireAuth from "@/lib/auth/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";
import { AccountLayout } from "@/components/account/AccountNav";
import { OrderStatusBadge } from "@/components/account/OrdersView";
import { useMemberOrders } from "@/lib/hooks/useMemberOrders";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { useCatalog } from "@/lib/hooks/useCatalog";
import { isDemoUser } from "@/lib/auth/demoCustomer";
import { formatDate, formatPrice } from "@/lib/utils";
import { textFor } from "@/types/catalog";

function MemberDashboard() {
  const t = useTranslations("account");
  const locale = useLocale();
  const { user } = useAuth();
  const { accountRows, localRows } = useMemberOrders();
  const { items } = useWishlist();
  const { products } = useCatalog();

  if (!user) return null;

  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");
  const allOrders = [...accountRows, ...localRows];
  const totalSpent = allOrders.reduce((sum, order) => sum + order.total, 0);
  const recentOrders = allOrders.slice(0, 3);
  const savedPreview = items.slice(0, 3);
  const recommended = products.slice(0, 3);

  const stats = [
    {
      icon: ShoppingBag,
      label: t("stats.orders"),
      value: String(allOrders.length),
      href: "/orders",
    },
    {
      icon: Wallet,
      label: t("stats.spent"),
      value: formatPrice(totalSpent),
      href: "/orders",
    },
    {
      icon: Heart,
      label: t("stats.saved"),
      value: String(items.length),
      href: "/wishlist",
    },
    {
      icon: BadgeCheck,
      label: t("stats.since"),
      value: formatDate(user.createdAt, locale),
      href: "/profile#profile-info",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Welcome */}
      <section className="flex flex-col gap-4 rounded-2xl bg-navy p-6 text-white sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl font-extrabold uppercase">
              {(name || user.email || user.phone || "S").slice(0, 1)}
            </span>
            <div className="flex flex-col gap-1">
              <h1 className="m-0 text-[24px] font-extrabold leading-tight tracking-[-0.5px] sm:text-[30px]">
                {t("greeting", { name: user.firstName || user.email || user.phone || "" })}
              </h1>
              <p className="m-0 text-sm text-white/65">
                {t("memberSince")}: {formatDate(user.createdAt, locale)}
              </p>
            </div>
          </div>
          {isDemoUser(user) && (
            <span className="rounded-full bg-accent px-3 py-1 text-[11px] font-extrabold uppercase tracking-[0.6px]">
              {t("demoBadge")}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/products"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-accent px-4 text-sm font-bold text-white transition-opacity hover:opacity-90"
          >
            <ShoppingBag size={16} aria-hidden="true" />
            {t("shop")}
          </Link>
          <Link
            href="/membership"
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-white/25 px-4 text-sm font-bold text-white transition-colors hover:border-white/60"
          >
            <Sparkles size={16} aria-hidden="true" />
            {t("memberCta")}
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section>
        <ul className="m-0 grid list-none grid-cols-2 gap-3 p-0 lg:grid-cols-4">
          {stats.map(({ icon: Icon, label, value, href }) => (
            <li key={label}>
              <Link
                href={href}
                className="flex h-full flex-col gap-2 rounded-2xl border border-line bg-white p-5 transition-colors hover:border-navy"
              >
                <Icon size={20} className="text-accent" aria-hidden="true" />
                <span className="text-[18px] font-extrabold leading-tight text-navy">{value}</span>
                <span className="text-[12px] font-semibold uppercase tracking-[0.4px] text-muted">
                  {label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* Orders + profile */}
      <section className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="m-0 text-lg font-extrabold">{t("recentOrders")}</h2>
            <Link href="/orders" className="flex items-center gap-1 text-sm font-bold text-accent">
              {t("viewAll")}
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>

          {recentOrders.length > 0 ? (
            <ul className="m-0 flex list-none flex-col rounded-2xl border border-line bg-white p-0">
              {recentOrders.map((order) => (
                <li key={order.id} className="border-b border-line last:border-0">
                  <Link
                    href={`/orders/${order.id}`}
                    className="flex flex-wrap items-center gap-4 px-5 py-4 hover:bg-page"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface text-navy">
                      <Package size={17} aria-hidden="true" />
                    </span>
                    <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                      <span className="text-[15px] font-bold text-navy">
                        #{order.number}
                      </span>
                      <span className="text-[13px] text-muted">
                        {formatDate(order.date, locale)} · {t("itemCount", { count: order.count })}
                      </span>
                    </span>
                    <OrderStatusBadge statusKey={order.statusKey} />
                    <span className="w-28 text-right text-[15px] font-extrabold">
                      {formatPrice(order.total)}
                    </span>
                    <ChevronRight size={18} className="text-muted" aria-hidden="true" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="rounded-2xl border border-dashed border-line bg-white px-6 py-10 text-center">
              <p className="m-0 font-bold">{t("noOrders")}</p>
              <Link href="/products" className="btn-primary mt-4 inline-flex">
                {t("shop")}
              </Link>
            </div>
          )}
        </div>

        <div id="profile-info" className="flex flex-col gap-3 scroll-mt-24">
          <h2 className="m-0 text-lg font-extrabold">{t("profile")}</h2>
          <dl className="m-0 flex flex-col rounded-2xl border border-line bg-white p-0">
            {[
              { label: t("name"), value: name },
              { label: t("email"), value: user.email },
              { label: t("phone"), value: user.phone },
              { label: t("memberSince"), value: formatDate(user.createdAt, locale) },
            ].map((row) => (
              <div
                key={row.label}
                className="flex flex-col gap-0.5 border-b border-line px-5 py-3.5 last:border-0"
              >
                <dt className="text-[12px] font-semibold uppercase tracking-[0.3px] text-muted">
                  {row.label}
                </dt>
                <dd className="m-0 break-words text-[14.5px] font-semibold text-navy">
                  {row.value || t("notSet")}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* Products */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="m-0 text-lg font-extrabold">
            {savedPreview.length > 0 ? t("savedProducts") : t("recommended")}
          </h2>
          <Link
            href={savedPreview.length > 0 ? "/wishlist" : "/products"}
            className="flex items-center gap-1 text-sm font-bold text-accent"
          >
            {t("viewAll")}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>

        <ul className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {savedPreview.length > 0
            ? savedPreview.map((item) => {
                const productName = textFor(item.name, locale);
                return (
                  <li key={item.productId}>
                    <Link
                      href={`/products/${item.productId}`}
                      className="flex h-full items-center gap-3 rounded-2xl border border-line bg-white p-3 transition-colors hover:border-navy"
                    >
                      <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                        <Image
                          src={item.imageUrl}
                          alt={productName}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </span>
                      <span className="flex min-w-0 flex-col gap-1">
                        <span className="line-clamp-2 text-[14px] font-semibold text-navy">
                          {productName}
                        </span>
                        <span className="text-sm font-extrabold text-accent">
                          {formatPrice(item.unitPrice)}
                        </span>
                      </span>
                    </Link>
                  </li>
                );
              })
            : recommended.map((product) => {
                const productName = textFor(product.name, locale);
                return (
                <li key={product._id}>
                  <Link
                    href={`/products/${product._id}`}
                    className="flex h-full items-center gap-3 rounded-2xl border border-line bg-white p-3 transition-colors hover:border-navy"
                  >
                    <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-surface">
                      <Image
                        src={product.imageUrl}
                        alt={productName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="line-clamp-2 text-[14px] font-semibold text-navy">
                        {productName}
                      </span>
                      <span className="text-sm font-extrabold text-accent">
                        {formatPrice(product.unitPrice)}
                      </span>
                    </span>
                  </Link>
                </li>
                );
              })}
        </ul>
      </section>
    </div>
  );
}

export function ProfileView() {
  return (
    <RequireAuth>
      <AccountLayout>
        <MemberDashboard />
      </AccountLayout>
    </RequireAuth>
  );
}
