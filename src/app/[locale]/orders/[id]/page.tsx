import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OrderDetailShell } from "@/components/account/OrderDetailShell";

export async function generateMetadata({ params }: PageProps<"/[locale]/orders/[id]">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "orders" });
  return { title: t("detailTitle"), robots: { index: false } };
}

/** Thin server page — order detail is per-customer and resolves client-side at runtime. */
export default async function OrderDetailPage({ params }: PageProps<"/[locale]/orders/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <OrderDetailShell orderId={id} />;
}
