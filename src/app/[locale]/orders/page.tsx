import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OrdersView } from "@/components/account/OrdersView";

export async function generateMetadata({ params }: PageProps<"/[locale]/orders">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "orders" });
  return { title: t("title"), robots: { index: false } };
}

export default async function Page({ params }: PageProps<"/[locale]/orders">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OrdersView />;
}
