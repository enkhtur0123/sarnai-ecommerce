"use client";

import { ArrowRight, LogIn, UserRound } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/auth/AuthContext";
import { DEMO_ENABLED, DEMO_TOKEN } from "@/lib/auth/demoCustomer";

/** Sign-in / demo entry for members, shown on the seller membership page. */
export function MemberEntryCard() {
  const t = useTranslations("membership.entry");
  const tLogin = useTranslations("login");
  const router = useRouter();
  const { user, login } = useAuth();

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-line bg-white p-6">
      <div className="flex flex-col gap-1.5">
        <h2 className="m-0 text-[19px] font-extrabold">{t("title")}</h2>
        <p className="m-0 text-[14px] leading-relaxed text-muted">{t("lead")}</p>
      </div>

      {user ? (
        <Link
          href="/profile"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-navy px-4 text-sm font-bold text-white"
        >
          {t("dashboard")}
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
      ) : (
        <>
          <Link
            href="/login?next=/profile"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-navy px-4 text-sm font-bold text-white"
          >
            <LogIn size={16} aria-hidden="true" />
            {tLogin("submit")}
          </Link>
          {DEMO_ENABLED && (
            <button
              type="button"
              onClick={() => {
                login(DEMO_TOKEN);
                router.replace("/profile");
              }}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border-2 border-dashed border-line bg-surface px-4 text-sm font-bold text-navy transition-colors hover:border-navy"
            >
              <UserRound size={16} aria-hidden="true" />
              {tLogin("demo")}
            </button>
          )}
          <p className="m-0 text-center text-xs text-muted">{tLogin("demoHint")}</p>
        </>
      )}
    </div>
  );
}
