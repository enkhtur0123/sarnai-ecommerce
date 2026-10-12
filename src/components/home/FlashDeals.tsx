"use client";

import { useEffect, useState } from "react";
import { Zap } from "lucide-react";
import { useTranslations } from "next-intl";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ProductRail, RailButtons, useRail } from "@/components/home/ProductRail";
import { useCatalog } from "@/lib/hooks/useCatalog";

/** Time left until local midnight — the daily deals reset. */
function useCountdown() {
  const [left, setLeft] = useState<number | null>(null);
  useEffect(() => {
    const tick = () => {
      const end = new Date();
      end.setHours(24, 0, 0, 0);
      setLeft(Math.max(0, end.getTime() - Date.now()));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);
  if (left === null) return ["--", "--", "--"];
  const s = Math.floor(left / 1000);
  return [Math.floor(s / 3600), Math.floor((s % 3600) / 60), s % 60].map((n) =>
    String(n).padStart(2, "0"),
  );
}

export function FlashDeals() {
  const t = useTranslations("flash");
  const { products, loading } = useCatalog();
  const { ref, scroll } = useRail();
  const units = useCountdown();
  const deals = products.filter((p) => p.flash);

  if (!loading && deals.length === 0) return null;

  return (
    <section id="flash" className="container-x flex flex-col gap-7 pt-12 lg:pt-[72px]">
      <SectionHeader
        title={t("title")}
        icon={<Zap size={26} className="fill-accent text-accent" aria-hidden="true" />}
        right={
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-1.5" role="timer" aria-label={t("endsIn")}>
              <span className="mr-1 text-[13px] font-medium text-muted">{t("endsIn")}</span>
              {units.map((u, i) => (
                <span
                  key={i}
                  className="flex h-[30px] w-[34px] items-center justify-center rounded-md bg-navy text-[13px] font-bold tabular-nums text-white"
                >
                  {u}
                </span>
              ))}
            </div>
            <div className="hidden sm:block">
              <RailButtons scroll={scroll} />
            </div>
          </div>
        }
      />
      <ProductRail products={deals} loading={loading} railRef={ref} />
    </section>
  );
}
