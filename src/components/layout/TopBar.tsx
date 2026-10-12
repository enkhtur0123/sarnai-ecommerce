import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { SocialIcon } from "@/components/common/SocialIcon";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { SOCIAL_LINKS } from "@/lib/constants";

export async function TopBar() {
  const t = await getTranslations("topbar");
  return (
    <div className="bg-navy text-white">
      <div className="container-x flex h-10 items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <span className="rounded bg-accent px-2 py-[3px] text-[11px] font-bold leading-none">{t("hot")}</span>
          <span className="truncate text-[13px] text-white/85">{t("promo")}</span>
        </div>
        <div className="flex shrink-0 items-center gap-5 text-[13px] font-semibold">
          <Suspense fallback={<span className="uppercase">mn · en</span>}>
            <LanguageSwitcher />
          </Suspense>
          <div className="hidden items-center gap-4 sm:flex">
            {(["twitter", "facebook", "instagram"] as const).map((name) => (
              <a key={name} href={SOCIAL_LINKS[name]} target="_blank" rel="noreferrer" aria-label={name} className="opacity-90 hover:opacity-100">
                <SocialIcon name={name} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
