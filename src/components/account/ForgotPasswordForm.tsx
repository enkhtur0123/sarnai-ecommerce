"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { AuthCard } from "@/components/account/AuthCard";
import { CLIENT_PORTAL_USER_FORGOT_PASSWORD } from "@/graphql/auth/mutations/password";

export function ForgotPasswordForm() {
  const t = useTranslations("forgot");
  const [identifier, setIdentifier] = useState("");
  const [sent, setSent] = useState(false);
  const [forgot, { loading }] = useMutation(CLIENT_PORTAL_USER_FORGOT_PASSWORD);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    try {
      await forgot({ variables: { identifier: identifier.trim() } });
    } catch {
      // Same message either way — don't reveal whether an account exists.
    }
    setSent(true);
  }

  return (
    <AuthCard title={t("title")} lead={t("lead")}>
      {sent ? (
        <p className="m-0 rounded-xl bg-surface px-4 py-3 text-sm font-semibold text-navy" role="status">
          {t("sent")}
        </p>
      ) : (
        <form onSubmit={submit} className="flex flex-col gap-4">
          <label className="label">
            {t("identifier")}
            <input className="field" value={identifier} onChange={(e) => setIdentifier(e.target.value)} autoComplete="username" required />
          </label>
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? t("submitting") : t("submit")}
          </button>
        </form>
      )}
      <Link href="/login" className="text-sm font-bold text-navy hover:text-accent">
        {t("back")}
      </Link>
    </AuthCard>
  );
}
