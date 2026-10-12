import { ArrowRight, Zap } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";
import { formatPrice } from "@/lib/utils";

/** Price shown on the hero's floating tag. */
const TAG_PRICE = 849000;

export async function Hero() {
  const t = await getTranslations("hero");
  return (
    <section className="container-x pt-6 lg:pt-8">
      <div className="grid overflow-hidden rounded-[20px] bg-hero lg:grid-cols-[536fr_744fr]">
        <div className="flex flex-col justify-center gap-5 px-6 py-10 sm:px-10 lg:py-16 lg:pl-[72px] lg:pr-6">
          <div className="flex items-center gap-2">
            <span aria-hidden="true" className="h-0.5 w-7 bg-accent" />
            <span className="text-[13px] font-bold tracking-[1.5px] text-accent">{t("eyebrow")}</span>
          </div>
          <h1 className="m-0 max-w-[440px] text-[36px] font-extrabold leading-[1.08] tracking-[-1.5px] text-navy sm:text-[46px] xl:text-[54px]">
            {t("title")}
          </h1>
          <p className="m-0 max-w-[420px] text-[17px] leading-[1.55] text-muted">{t("lead")}</p>
          <div className="flex flex-wrap items-center gap-4 pt-3">
            <Link href="/products" className="btn-primary">
              {t("shopNow")}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link href="/products?filter=new" className="px-2 py-[15px] text-sm font-bold text-navy hover:text-accent">
              {t("viewCollection")}
            </Link>
          </div>
        </div>
        <div className="relative min-h-[300px] sm:min-h-[400px] lg:min-h-[480px]">
          <Image
            src="/images/hero.jpg"
            alt=""
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 744px"
            className="object-cover"
          />
          <Link
            href="/products?filter=flash"
            className="absolute bottom-6 right-6 flex items-center gap-3 rounded-[14px] bg-white px-[18px] py-3.5 shadow-[0_12px_32px_rgba(43,52,69,0.16)] transition-transform hover:-translate-y-0.5 sm:bottom-8 sm:right-8"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-accent-tint text-accent">
              <Zap size={18} aria-hidden="true" />
            </span>
            <span className="flex flex-col gap-0.5">
              <span className="text-[13px] font-semibold text-navy">{t("tagTitle")}</span>
              <span className="text-base font-extrabold text-accent">
                {t("tagFrom", { price: formatPrice(TAG_PRICE) })}
              </span>
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
