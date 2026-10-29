"use client";

import { useState } from "react";
import { Check, Mail, Send } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  buildApplicationMailto,
  isMembershipCategory,
  isMembershipCount,
  type MembershipApplication,
} from "@/lib/membership";
import { SUPPORT_EMAIL } from "@/lib/constants";

const EMPTY = {
  businessName: "",
  contactName: "",
  phone: "",
  email: "",
  category: "",
  productCount: "",
  channels: "",
  description: "",
};

type FormState = typeof EMPTY;
type ErrorKey = "required" | "email" | "agree" | "failed" | null;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function MembershipForm() {
  const t = useTranslations("membership.form");
  const [form, setForm] = useState<FormState>(EMPTY);
  const [agree, setAgree] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [error, setError] = useState<ErrorKey>(null);
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");

  const set = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setError(null);
  };

  function validate(): boolean {
    if (
      !form.businessName.trim() ||
      !form.contactName.trim() ||
      !form.phone.trim() ||
      !form.email.trim() ||
      !form.description.trim() ||
      !isMembershipCategory(form.category) ||
      !isMembershipCount(form.productCount)
    ) {
      setError("required");
      return false;
    }
    if (!EMAIL_RE.test(form.email.trim())) {
      setError("email");
      return false;
    }
    if (!agree) {
      setError("agree");
      return false;
    }
    return true;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setStatus("sending");
    setError(null);
    try {
      const res = await fetch("/api/membership/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, website: honeypot }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("sent");
    } catch {
      setStatus("idle");
      setError("failed");
    }
  }

  function reset() {
    setForm(EMPTY);
    setAgree(false);
    setStatus("idle");
    setError(null);
  }

  if (status === "sent") {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-white p-8">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-tint text-accent">
          <Check size={28} strokeWidth={2.4} aria-hidden="true" />
        </span>
        <h3 className="m-0 text-[24px] font-extrabold tracking-[-0.4px]">{t("successTitle")}</h3>
        <p className="m-0 max-w-[460px] text-[15px] leading-relaxed text-muted">{t("successLead")}</p>
        <button type="button" onClick={reset} className="btn-ghost mt-2">
          {t("again")}
        </button>
      </div>
    );
  }

  const mailto = () => {
    const application: MembershipApplication = {
      businessName: form.businessName,
      contactName: form.contactName,
      phone: form.phone,
      email: form.email,
      category: isMembershipCategory(form.category) ? form.category : "other",
      productCount: isMembershipCount(form.productCount) ? form.productCount : "a",
      channels: form.channels,
      description: form.description,
    };
    return buildApplicationMailto(SUPPORT_EMAIL, application, {
      businessName: t("businessName"),
      contactName: t("contactName"),
      phone: t("phone"),
      email: t("email"),
      category: t("category"),
      productCount: t("productCount"),
      channels: t("channels"),
      description: t("description"),
    });
  };

  return (
    <form
      id="apply"
      onSubmit={submit}
      noValidate
      className="scroll-mt-24 rounded-2xl border border-line bg-white p-6 sm:p-9"
    >
      <div className="mb-6 flex flex-col gap-1.5">
        <h2 className="m-0 text-[26px] font-extrabold tracking-[-0.5px]">{t("title")}</h2>
        <p className="m-0 text-[15px] text-muted">{t("lead")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="label">
          {t("businessName")} *
          <input className="field" value={form.businessName} onChange={set("businessName")} required />
        </label>
        <label className="label">
          {t("contactName")} *
          <input className="field" value={form.contactName} onChange={set("contactName")} autoComplete="name" required />
        </label>
        <label className="label">
          {t("phone")} *
          <input
            className="field"
            type="tel"
            inputMode="tel"
            value={form.phone}
            onChange={set("phone")}
            autoComplete="tel"
            required
          />
        </label>
        <label className="label">
          {t("email")} *
          <input className="field" type="email" value={form.email} onChange={set("email")} autoComplete="email" required />
        </label>
        <label className="label">
          {t("category")} *
          <select className="field" value={form.category} onChange={set("category")} required>
            <option value="">—</option>
            <option value="audio">{t("categories.audio")}</option>
            <option value="smartHome">{t("categories.smartHome")}</option>
            <option value="accessories">{t("categories.accessories")}</option>
            <option value="beauty">{t("categories.beauty")}</option>
            <option value="home">{t("categories.home")}</option>
            <option value="clothing">{t("categories.clothing")}</option>
            <option value="other">{t("categories.other")}</option>
          </select>
        </label>
        <label className="label">
          {t("productCount")} *
          <select className="field" value={form.productCount} onChange={set("productCount")} required>
            <option value="">—</option>
            <option value="a">{t("counts.a")}</option>
            <option value="b">{t("counts.b")}</option>
            <option value="c">{t("counts.c")}</option>
            <option value="d">{t("counts.d")}</option>
          </select>
        </label>
      </div>

      <label className="label mt-4">
        {t("channels")}
        <input className="field" value={form.channels} onChange={set("channels")} placeholder={t("channelsPlaceholder")} />
      </label>

      <label className="label mt-4">
        {t("description")} *
        <textarea
          className="field"
          rows={5}
          value={form.description}
          onChange={set("description")}
          placeholder={t("descriptionPlaceholder")}
          required
        />
      </label>

      {/* Bot trap — hidden from people, appealing to scripts. */}
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={honeypot}
        onChange={(e) => setHoneypot(e.target.value)}
        className="pointer-events-none absolute h-0 w-0 opacity-0"
      />

      <label className="mt-5 flex cursor-pointer items-start gap-3 text-[13px] leading-relaxed text-navy">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => {
            setAgree(e.target.checked);
            setError(null);
          }}
          className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
        />
        <span>{t("agree")}</span>
      </label>

      {error && (
        <div role="alert" className="mt-4 rounded-xl bg-accent-tint px-4 py-3 text-sm font-semibold text-accent-deep">
          <p className="m-0">{t(`errors.${error}`)}</p>
          {error === "failed" && (
            <a href={mailto()} className="mt-1 inline-flex items-center gap-1.5 underline">
              <Mail size={14} aria-hidden="true" />
              {t("errors.fallback")}
            </a>
          )}
        </div>
      )}

      <button type="submit" disabled={status === "sending"} className="btn-primary mt-6 w-full sm:w-auto">
        <Send size={16} aria-hidden="true" />
        {status === "sending" ? t("submitting") : t("submit")}
      </button>
    </form>
  );
}
