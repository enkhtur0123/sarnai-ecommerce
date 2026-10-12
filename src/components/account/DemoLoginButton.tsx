"use client";

import { UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/auth/AuthContext";
import { DEMO_ENABLED, DEMO_TOKEN } from "@/lib/auth/demoCustomer";

/** Signs in as the fixed mock customer — for demos while erxes accounts aren't set up. */
export function DemoLoginButton({ next }: { next: string }) {
  const t = useTranslations("login");
  const router = useRouter();
  const { login } = useAuth();
  if (!DEMO_ENABLED) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3 text-xs font-bold uppercase text-muted">
        <span className="h-px flex-1 bg-line" />
        {t("or")}
        <span className="h-px flex-1 bg-line" />
      </div>
      <button
        type="button"
        onClick={() => {
          login(DEMO_TOKEN);
          router.replace(next);
        }}
        className="flex min-h-12 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-surface text-sm font-bold text-navy transition-colors hover:border-navy"
      >
        <UserRound size={18} aria-hidden="true" />
        {t("demo")}
      </button>
      <p className="m-0 text-center text-xs text-muted">{t("demoHint")}</p>
    </div>
  );
}
