"use client";

import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { SectionHeader } from "@/components/common/SectionHeader";
import { useCatalog } from "@/lib/hooks/useCatalog";
import { cn } from "@/lib/utils";
import { textFor, type CatalogCategory } from "@/types/catalog";

/** Design imagery used when an erxes category has no picture of its own. */
const TILE_IMAGES = [
  "/images/cat-headphones.jpg",
  "/images/cat-speakers.jpg",
  "/images/cat-turntables.jpg",
  "/images/cat-earphones.jpg",
  "/images/cat-accessories.jpg",
];

function Tile({
  category,
  image,
  count,
  big = false,
}: {
  category: CatalogCategory;
  image: string;
  count: number;
  big?: boolean;
}) {
  const t = useTranslations("categories");
  const locale = useLocale();
  const name = textFor(category.name, locale);
  return (
    <Link
      href={`/products?category=${category._id}`}
      className={cn(
        "group relative flex overflow-hidden rounded-2xl bg-surface",
        big ? "min-h-[320px] lg:min-h-[540px]" : "min-h-[200px] lg:min-h-[258px]",
      )}
    >
      <Image
        src={category.imageUrl || image}
        alt=""
        fill
        sizes={big ? "(max-width: 1024px) 100vw, 628px" : "(max-width: 1024px) 50vw, 302px"}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#1e2533]/85 via-[#1e2533]/35 to-transparent"
      />
      <div className={cn("relative mt-auto flex w-full items-end justify-between gap-3", big ? "p-8" : "p-5 sm:p-[22px]")}>
        <div className="flex flex-col gap-1 text-white">
          <span className={cn("font-medium text-white/85", big ? "text-sm" : "text-[13px]")}>
            {t("count", { count })}
          </span>
          <span className={cn("font-bold leading-tight", big ? "text-[28px] sm:text-[34px]" : "text-lg sm:text-[22px]")}>
            {name}
          </span>
        </div>
        <span
          className={cn(
            "flex shrink-0 items-center justify-center rounded-full bg-white text-navy transition-transform group-hover:rotate-45",
            big ? "h-12 w-12" : "h-[38px] w-[38px]",
          )}
        >
          <ArrowUpRight size={big ? 18 : 16} aria-hidden="true" />
        </span>
      </div>
    </Link>
  );
}

export function CategoryBento() {
  const t = useTranslations("categories");
  const { categories, products } = useCatalog();
  const countFor = (id: string) => products.filter((p) => p.categoryId === id).length;
  const tiles = categories.slice(0, 5);
  if (tiles.length === 0) return null;
  const [first, ...rest] = tiles;

  return (
    <section className="container-x flex flex-col gap-7 pt-16 lg:pt-20">
      <SectionHeader
        title={t("title")}
        lead={t("lead")}
        link={{ href: "/products", label: t("viewAll") }}
      />
      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <Tile category={first} image={TILE_IMAGES[0]} count={countFor(first._id)} big />
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {rest.map((c, i) => (
            <Tile key={c._id} category={c} image={TILE_IMAGES[i + 1]} count={countFor(c._id)} />
          ))}
        </div>
      </div>
    </section>
  );
}
