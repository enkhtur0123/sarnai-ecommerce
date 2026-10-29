import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { OwnCollection } from "@/components/own/OwnCollection";

/** Public Sarnai Originals collection — linked from the header, footer and homepage. */
export async function generateMetadata({ params }: PageProps<"/[locale]/own">): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "own" });
  return { title: t("title"), description: t("lead") };
}

export default async function OwnPage({ params }: PageProps<"/[locale]/own">) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <OwnCollection />;
}
