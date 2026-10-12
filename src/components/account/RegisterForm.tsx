"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation } from "@apollo/client/react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { AuthCard, FormError, readTokens, safeNext } from "@/components/account/AuthCard";
import {
  CLIENT_PORTAL_USER_REGISTER,
  type ClientPortalUserRegisterData,
  type ClientPortalUserRegisterVariables,
} from "@/graphql/auth/mutations/register";
import {
  CLIENT_PORTAL_USER_LOGIN_WITH_CREDENTIALS,
  type ClientPortalUserLoginWithCredentialsData,
  type ClientPortalUserLoginWithCredentialsVariables,
} from "@/graphql/auth/mutations/loginWithCredentials";
import { useAuth } from "@/lib/auth/AuthContext";

export function RegisterForm() {
  const t = useTranslations("register");
  const router = useRouter();
  const params = useSearchParams();
  const { user, login } = useAuth();
  const next = safeNext(params.get("next"));
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: params.get("email") ?? "",
    phone: "",
    password: "",
  });
  const [error, setError] = useState(false);

  const [register, { loading: registering }] = useMutation<
    ClientPortalUserRegisterData,
    ClientPortalUserRegisterVariables
  >(CLIENT_PORTAL_USER_REGISTER);
  const [loginMutation, { loading: loggingIn }] = useMutation<
    ClientPortalUserLoginWithCredentialsData,
    ClientPortalUserLoginWithCredentialsVariables
  >(CLIENT_PORTAL_USER_LOGIN_WITH_CREDENTIALS);

  useEffect(() => {
    if (user) router.replace(next);
  }, [user, next, router]);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(false);
    const email = form.email.trim();
    try {
      await register({
        variables: {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: email || undefined,
          phone: form.phone.trim() || undefined,
          password: form.password,
          userType: "customer",
        },
      });
    } catch {
      setError(true);
      return;
    }
    // Sign straight in; portals that require verification refuse this until verified.
    try {
      const { data } = await loginMutation({
        variables: email ? { email, password: form.password } : { phone: form.phone.trim(), password: form.password },
      });
      const { token, refreshToken } = readTokens(data?.clientPortalUserLoginWithCredentials);
      if (!token) throw new Error("no token");
      login(token, refreshToken);
    } catch {
      router.replace(`/login?registered=verify&next=${encodeURIComponent(next)}`);
    }
  }

  const busy = registering || loggingIn;

  return (
    <AuthCard title={t("title")} lead={t("lead")}>
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="label">
            {t("firstName")}
            <input className="field" value={form.firstName} onChange={set("firstName")} autoComplete="given-name" required />
          </label>
          <label className="label">
            {t("lastName")}
            <input className="field" value={form.lastName} onChange={set("lastName")} autoComplete="family-name" />
          </label>
        </div>
        <label className="label">
          {t("email")}
          <input className="field" type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
        </label>
        <label className="label">
          {t("phone")}
          <input className="field" type="tel" inputMode="tel" value={form.phone} onChange={set("phone")} autoComplete="tel" />
        </label>
        <label className="label">
          {t("password")}
          <input
            className="field"
            type="password"
            value={form.password}
            onChange={set("password")}
            autoComplete="new-password"
            minLength={8}
            required
          />
          <span className="text-xs font-normal text-muted">{t("passwordHint")}</span>
        </label>
        {error && <FormError>{t("errors.failed")}</FormError>}
        <button type="submit" disabled={busy} className="btn-primary w-full">
          {busy ? t("submitting") : t("submit")}
        </button>
      </form>
      <p className="m-0 text-center text-sm text-muted">
        {t("haveAccount")}{" "}
        <Link href={`/login?next=${encodeURIComponent(next)}`} className="font-bold text-navy hover:text-accent">
          {t("login")}
        </Link>
      </p>
    </AuthCard>
  );
}
