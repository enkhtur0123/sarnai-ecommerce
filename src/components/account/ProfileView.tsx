"use client";

import { useLocale, useTranslations } from "next-intl";
import RequireAuth from "@/lib/auth/RequireAuth";
import { useAuth } from "@/lib/auth/AuthContext";
import { AccountLayout } from "@/components/account/AccountNav";
import { formatDate } from "@/lib/utils";

function Profile() {
  const t = useTranslations("account");
  const locale = useLocale();
  const { user } = useAuth();
  if (!user) return null;
  const name = [user.firstName, user.lastName].filter(Boolean).join(" ");

  const rows = [
    { label: t("name"), value: name },
    { label: t("email"), value: user.email },
    { label: t("phone"), value: user.phone },
    { label: t("memberSince"), value: formatDate(user.createdAt, locale) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="m-0 text-[28px] font-extrabold tracking-[-0.5px]">
        {t("greeting", { name: user.firstName || user.email || user.phone || "" })}
      </h1>
      <dl className="m-0 grid gap-0 rounded-2xl border border-line bg-white">
        {rows.map((r) => (
          <div key={r.label} className="flex flex-wrap items-center justify-between gap-2 border-b border-line px-6 py-4 last:border-0">
            <dt className="text-sm text-muted">{r.label}</dt>
            <dd className="m-0 text-[15px] font-semibold text-navy">{r.value || t("notSet")}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ProfileView() {
  return (
    <RequireAuth>
      <AccountLayout>
        <Profile />
      </AccountLayout>
    </RequireAuth>
  );
}
