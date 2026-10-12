"use client";

import { LayoutGrid } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { useCatalog } from "@/lib/hooks/useCatalog";
import { textFor } from "@/types/catalog";

const SHOWN = 7;

/** Round category shortcuts with a trailing "More" tile. */
export function CategoryCircles() {
  const t = useTranslations("home");
  const locale = useLocale();
  const { categories, products } = useCatalog();
  if (categories.length === 0) return null;

  const imageFor = (id: string, own?: string) => own || products.find((p) => p.categoryId === id)?.imageUrl;

  return (
    <section className="container-x pt-5 lg:pt-6">
      <ul className="m-0 grid list-none grid-cols-4 gap-x-2 gap-y-4 p-0 sm:grid-cols-8">
        {categories.slice(0, SHOWN).map((c) => {
          const name = textFor(c.name, locale);
          return (
            <li key={c._id}>
              <Link href={`/products?category=${c._id}`} className="group flex flex-col items-center gap-2 text-center">
                <span className="relative h-14 w-14 overflow-hidden rounded-full bg-white ring-1 ring-line transition group-hover:ring-2 group-hover:ring-accent sm:h-[72px] sm:w-[72px]">
                  <Image src={imageFor(c._id, c.imageUrl)} alt="" fill sizes="72px" className="object-cover" />
                </span>
                <span className="line-clamp-1 text-[11px] font-medium text-navy group-hover:text-accent sm:text-xs">
                  {name}
                </span>
              </Link>
            </li>
          );
        })}
        <li>
          <Link href="/products" className="group flex flex-col items-center gap-2 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-muted ring-1 ring-line transition group-hover:text-accent group-hover:ring-2 group-hover:ring-accent sm:h-[72px] sm:w-[72px]">
              <LayoutGrid size={22} aria-hidden="true" />
            </span>
            <span className="text-[11px] font-medium text-navy group-hover:text-accent sm:text-xs">{t("more")}</span>
          </Link>
        </li>
      </ul>
    </section>
  );
}
