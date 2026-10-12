"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ProductCard, ProductCardSkeleton } from "@/components/product/ProductCard";
import { useCatalog } from "@/lib/hooks/useCatalog";

const SHOWN = 4;

/** "Today's Deals": four discounted products beside a promo card. */
export function TodaysDeals() {
  const t = useTranslations("home");
  const { products, loading } = useCatalog();
  const flash = products.filter((p) => p.flash);
  const deals = (flash.length > 0 ? flash : products.filter((p) => p.oldPrice)).slice(0, SHOWN);

  if (!loading && deals.length === 0) return null;

  return (
    <section id="deals" className="container-x flex flex-col gap-4 pt-8 lg:pt-10">
      <SectionHeader title={t("dealsTitle")} link={{ href: "/products?filter=flash", label: t("viewAll") }} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5 lg:gap-4">
        {loading
          ? Array.from({ length: SHOWN }, (_, i) => <ProductCardSkeleton key={i} />)
          : deals.map((p) => <ProductCard key={p._id} product={p} />)}
        <Link
          href="/products?filter=new"
          className="group relative col-span-2 flex min-h-[200px] flex-col overflow-hidden rounded-xl bg-hero p-5 sm:col-span-3 lg:col-span-1"
        >
          <span className="relative z-10 max-w-[70%] text-[15px] font-bold leading-snug text-navy lg:max-w-none">
            {t("promoTitle")}
          </span>
          <span className="relative z-10 mt-1.5 max-w-[60%] text-xs text-muted lg:max-w-none">{t("promoLead")}</span>
          <span className="relative z-10 mt-3 inline-flex h-8 w-fit items-center rounded-md bg-accent px-3.5 text-xs font-semibold text-white group-hover:bg-accent-deep">
            {t("promoCta")}
          </span>
          <span className="absolute bottom-0 right-0 h-[60%] w-[55%] lg:h-[48%] lg:w-[80%]">
            <Image
              src="/images/banner-light.jpg"
              alt=""
              fill
              sizes="(max-width: 1024px) 50vw, 200px"
              className="rounded-tl-[40px] object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </span>
        </Link>
      </div>
    </section>
  );
}
