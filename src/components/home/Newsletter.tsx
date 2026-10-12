"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import Image from "@/components/common/Image";

/**
 * Newsletter card. erxes has no public newsletter mutation for client portals,
 * so signing up routes the visitor to registration with the email prefilled.
 */
export function Newsletter() {
  const t = useTranslations("newsletter");
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="container-x pt-16 lg:pt-20">
      <div className="grid overflow-hidden rounded-[20px] bg-hero md:grid-cols-[420px_1fr]">
        <div className="relative hidden min-h-[300px] md:block">
          <Image src="/images/newsletter.jpg" alt="" fill sizes="420px" className="object-cover" />
        </div>
        <div className="flex flex-col justify-center gap-3.5 px-6 py-10 sm:px-12 lg:px-[72px]">
          <span className="text-[13px] font-bold tracking-[1.5px] text-accent">{t("eyebrow")}</span>
          <h2 className="m-0 max-w-[560px] text-[26px] font-extrabold leading-[1.15] tracking-[-0.8px] text-navy sm:text-[32px]">
            {t("title")}
          </h2>
          <p className="m-0 text-[15px] text-muted">{t("lead")}</p>
          {done ? (
            <div className="flex flex-wrap items-center gap-4 pt-2.5">
              <p className="m-0 text-sm font-semibold text-navy" role="status">
                {t("thanks")}
              </p>
              <Link href={`/register?email=${encodeURIComponent(email)}`} className="btn-primary">
                {t("createAccount")}
              </Link>
            </div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setDone(true);
              }}
              className="flex max-w-[560px] flex-col gap-2.5 pt-2.5 sm:flex-row"
            >
              <label className="flex h-[52px] flex-1 items-center gap-2.5 rounded-[10px] bg-white px-[18px]">
                <Mail size={18} className="shrink-0 text-muted" aria-hidden="true" />
                <span className="sr-only">{t("placeholder")}</span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("placeholder")}
                  className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-muted"
                />
              </label>
              <button type="submit" className="btn-primary h-[52px] rounded-[10px]">
                {t("submit")}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
