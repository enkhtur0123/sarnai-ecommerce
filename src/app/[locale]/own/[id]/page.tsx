import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ProductDetail } from "@/components/product/ProductDetail";
import { SAMPLE_OWN_PRODUCTS } from "@/lib/catalog";
import { textFor } from "@/types/catalog";

export async function generateMetadata({ params }: PageProps<"/[locale]/own/[id]">): Promise<Metadata> {
  const { locale, id } = await params;
  const sample = SAMPLE_OWN_PRODUCTS.find((p) => p._id === id);
  return {
    ...(sample && { title: textFor(sample.name, locale), description: textFor(sample.description, locale) }),
  };
}

/** An own product, shown inside the public /own collection. */
export default async function OwnProductPage({ params }: PageProps<"/[locale]/own/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <ProductDetail id={decodeURIComponent(id)} own />;
}
