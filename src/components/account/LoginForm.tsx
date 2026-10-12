"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { AuthCard, FormError, credentialVars, readTokens, safeNext } from "@/components/account/AuthCard";
import {
  CLIENT_PORTAL_USER_LOGIN_WITH_CREDENTIALS,
  type ClientPortalUserLoginWithCredentialsData,
  type ClientPortalUserLoginWithCredentialsVariables,
} from "@/graphql/auth/mutations/loginWithCredentials";
import { useAuth } from "@/lib/auth/AuthContext";

export function LoginForm() {
  const t = useTranslations("login");
  const tRegister = useTranslations("register");
  const router = useRouter();
  const params = useSearchParams();
  const { user, login } = useAuth();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const next = safeNext(params.get("next"));
  const notice = params.get("registered");

  const [loginMutation, { loading }] = useMutation<
    ClientPortalUserLoginWithCredentialsData,
    ClientPortalUserLoginWithCredentialsVariables
  >(CLIENT_PORTAL_USER_LOGIN_WITH_CREDENTIALS);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    try {
      const { data } = await loginMutation({ variables: credentialVars(identifier, password) });
      const { token, refreshToken } = readTokens(data?.clientPortalUserLoginWithCredentials);
      if (!token) throw new Error("no token");
      login(token, refreshToken); // saves to sessionStorage, then refetches the user
    } catch {
      setError(true);
    }
  }

  return (
    <AuthCard title={t("title")} lead={t("lead")}>
      {notice && (
        <p className="m-0 rounded-xl bg-surface px-4 py-3 text-sm font-semibold text-navy" role="status">
          {tRegister(notice === "verify" ? "verifyNotice" : "success")}
        </p>
      )}
      <form onSubmit={submit} className="flex flex-col gap-4">
        <label className="label">
          {t("identifier")}
          <input
            className="field"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            autoComplete="username"
            required
          />
        </label>
        <label className="label">
          <span className="flex items-center justify-between">
            {t("password")}
            <Link href="/forgot-password" className="text-[13px] font-semibold text-accent">
              {t("forgot")}
            </Link>
          </span>
          <input
            className="field"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && <FormError>{t("errors.failed")}</FormError>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? t("submitting") : t("submit")}
        </button>
      </form>
      <p className="m-0 text-center text-sm text-muted">
        {t("noAccount")}{" "}
        <Link href={`/register?next=${encodeURIComponent(next)}`} className="font-bold text-navy hover:text-accent">
          {t("register")}
        </Link>
      </p>
    </AuthCard>
  );
}
