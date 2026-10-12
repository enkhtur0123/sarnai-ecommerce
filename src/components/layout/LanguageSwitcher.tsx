"use client";

import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter, routing } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function switchTo(next: string) {
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { locale: next });
  }

  return (
    <div role="group" aria-label={t("language")} className={cn("flex items-center gap-1", className)}>
      {routing.locales.map((l, i) => (
        <span key={l} className="flex items-center gap-1">
          {i > 0 && <span aria-hidden="true" className="opacity-50">·</span>}
          <button
            type="button"
            onClick={() => switchTo(l)}
            aria-pressed={l === locale}
            className={cn("uppercase", l === locale ? "font-bold opacity-100" : "opacity-60 hover:opacity-100")}
          >
            {l}
          </button>
        </span>
      ))}
    </div>
  );
}
