import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ProductDetail } from "@/components/product/ProductDetail";
import { SAMPLE_PRODUCTS } from "@/lib/catalog";
import { textFor } from "@/types/catalog";

export async function generateMetadata({ params }: PageProps<"/[locale]/products/[id]">): Promise<Metadata> {
  const { locale, id } = await params;
  const sample = SAMPLE_PRODUCTS.find((p) => p._id === id);
  return sample
    ? { title: textFor(sample.name, locale), description: textFor(sample.description, locale) }
    : {};
}

/** Thin server page — the product is fetched client-side from erxes POS (or the sample catalog). */
export default async function ProductPage({ params }: PageProps<"/[locale]/products/[id]">) {
  const { locale, id } = await params;
  setRequestLocale(locale);
  return <ProductDetail id={decodeURIComponent(id)} />;
}
