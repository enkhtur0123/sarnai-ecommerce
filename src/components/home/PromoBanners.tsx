import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";

export async function PromoBanners() {
  const t = await getTranslations("promo");
  return (
    <section className="container-x grid gap-6 pt-16 lg:grid-cols-[760fr_496fr] lg:pt-20">
      <Link
        href="/products?category=speakers"
        className="group grid min-h-[280px] overflow-hidden rounded-[20px] bg-navy sm:grid-cols-2"
      >
        <div className="flex flex-col justify-center gap-3.5 px-8 py-10 sm:pl-12 sm:pr-4">
          <span className="text-xs font-bold tracking-[1.5px] text-white/70">{t("darkEyebrow")}</span>
          <span className="text-[26px] font-extrabold leading-[1.15] tracking-[-0.8px] text-white sm:text-[32px]">
            {t("darkTitle")}
          </span>
          <span className="flex items-center gap-2 pt-2 text-sm font-bold text-white">
            {t("darkCta")}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
        <div className="relative hidden min-h-[280px] sm:block">
          <Image src="/images/banner-dark.jpg" alt="" fill sizes="380px" className="object-cover" />
        </div>
      </Link>
      <Link
        href="/products?category=bags"
        className="group grid min-h-[280px] grid-cols-2 overflow-hidden rounded-[20px] bg-accent-tint"
      >
        <div className="flex flex-col justify-center gap-3.5 py-10 pl-8 pr-2 sm:pl-12">
          <span className="text-xs font-bold tracking-[1.5px] text-accent">{t("lightEyebrow")}</span>
          <span className="text-[24px] font-extrabold leading-[1.15] tracking-[-0.8px] text-navy sm:text-[32px]">
            {t("lightTitle")}
          </span>
          <span className="flex items-center gap-2 pt-2 text-sm font-bold text-navy">
            {t("lightCta")}
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </span>
        </div>
        <div className="relative min-h-[280px]">
          <Image src="/images/banner-light.jpg" alt="" fill sizes="248px" className="object-cover" />
        </div>
      </Link>
    </section>
  );
}
