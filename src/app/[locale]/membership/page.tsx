import type { Metadata } from "next";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  Boxes,
  Check,
  ClipboardList,
  Clock,
  Gift,
  Mail,
  Megaphone,
  PackageCheck,
  Phone,
  ShieldCheck,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Image from "@/components/common/Image";
import { MembershipForm } from "@/components/membership/MembershipForm";
import { Link } from "@/i18n/routing";
import { HOTLINE, SUPPORT_EMAIL } from "@/lib/constants";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "membership.meta" });
  return { title: t("title"), description: t("description") };
}

export default async function MembershipPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [t, tCommon] = await Promise.all([
    getTranslations("membership"),
    getTranslations("common"),
  ]);

  const stats = [
    { label: t("stats.buyers"), value: t("stats.buyersValue") },
    { label: t("stats.commission"), value: t("stats.commissionValue") },
    { label: t("stats.payout"), value: t("stats.payoutValue") },
    { label: t("stats.delivery"), value: t("stats.deliveryValue") },
  ];

  const who = [
    { icon: BadgeCheck, title: t("who.item1Title"), text: t("who.item1Text") },
    { icon: PackageCheck, title: t("who.item2Title"), text: t("who.item2Text") },
    { icon: Boxes, title: t("who.item3Title"), text: t("who.item3Text") },
  ];

  const benefits = [
    { icon: Users, title: t("benefits.item1Title"), text: t("benefits.item1Text") },
    { icon: Truck, title: t("benefits.item2Title"), text: t("benefits.item2Text") },
    { icon: ShieldCheck, title: t("benefits.item3Title"), text: t("benefits.item3Text") },
    { icon: Megaphone, title: t("benefits.item4Title"), text: t("benefits.item4Text") },
  ];

  const steps = [
    { icon: Store, title: t("steps.step1Title"), text: t("steps.step1Text") },
    { icon: ClipboardList, title: t("steps.step2Title"), text: t("steps.step2Text") },
    { icon: BadgeCheck, title: t("steps.step3Title"), text: t("steps.step3Text") },
    { icon: PackageCheck, title: t("steps.step4Title"), text: t("steps.step4Text") },
  ];

  const fees = [
    { icon: Banknote, label: t("fees.rateLabel"), value: t("fees.rateValue"), note: t("fees.rateNote") },
    { icon: Clock, label: t("fees.payoutLabel"), value: t("fees.payoutValue"), note: t("fees.payoutNote") },
    { icon: Gift, label: t("fees.listingLabel"), value: t("fees.listingValue"), note: t("fees.listingNote") },
  ];

  const faq = [1, 2, 3, 4, 5].map((n) => ({ q: t(`faq.q${n}`), a: t(`faq.a${n}`) }));

  return (
    <div className="flex flex-col gap-12 pb-6 lg:gap-16">
      {/* Hero */}
      <section className="container-x pt-6 lg:pt-8">
        <div className="relative overflow-hidden rounded-[20px] bg-navy">
          <Image
            src="/images/banner-dark.jpg"
            alt=""
            fill
            priority
            sizes="1280px"
            className="object-cover opacity-25"
          />
          <div className="relative grid gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-center lg:px-16 lg:py-16">
            <div className="flex flex-col gap-4">
              <nav aria-label="breadcrumb" className="flex items-center gap-2 text-[13px] font-semibold text-white/70">
                <Link href="/" className="hover:text-white">
                  {tCommon("home")}
                </Link>
                <span aria-hidden="true">/</span>
                <span className="text-white">{t("meta.title")}</span>
              </nav>
              <span className="w-fit rounded-full bg-accent px-3.5 py-1.5 text-[11px] font-extrabold tracking-[1px] text-white">
                {t("hero.eyebrow")}
              </span>
              <h1 className="m-0 max-w-[640px] text-[34px] font-extrabold leading-[1.08] tracking-[-1px] text-white sm:text-[46px]">
                {t("hero.title")}
              </h1>
              <p className="m-0 max-w-[600px] text-[16px] leading-[1.6] text-white/75 sm:text-[17px]">
                {t("hero.lead")}
              </p>
              <div className="mt-2 flex flex-wrap gap-3">
                <a href="#apply" className="btn-accent">
                  {t("hero.apply")}
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
                <a
                  href="#how"
                  className="inline-flex min-h-12 items-center justify-center rounded-lg border border-white/25 px-6 text-sm font-bold text-white transition-colors hover:border-white/60"
                >
                  {t("hero.how")}
                </a>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm">
              <h2 className="m-0 text-[15px] font-extrabold text-white">{t("hero.quickTitle")}</h2>
              <ul className="m-0 mt-4 flex list-none flex-col gap-3 p-0">
                {[t("hero.quick1"), t("hero.quick2"), t("hero.quick3")].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm font-medium text-white/90">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-white">
                      <Check size={14} strokeWidth={3} aria-hidden="true" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-x -mt-4">
        <ul className="m-0 grid list-none grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line p-0 lg:grid-cols-4">
          {stats.map(({ label, value }) => (
            <li key={label} className="flex flex-col gap-1 bg-white px-5 py-6 text-center lg:px-6">
              <span className="text-[24px] font-extrabold tracking-[-0.5px] text-accent sm:text-[28px]">{value}</span>
              <span className="text-[12px] font-semibold uppercase tracking-[0.4px] text-muted">{label}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* Who can join */}
      <section className="container-x flex flex-col gap-6">
        <header className="flex max-w-[720px] flex-col gap-2">
          <h2 className="m-0 text-[28px] font-extrabold tracking-[-0.6px] sm:text-[34px]">{t("who.title")}</h2>
          <p className="m-0 text-[15px] leading-relaxed text-muted">{t("who.lead")}</p>
        </header>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {who.map(({ icon: Icon, title, text }) => (
            <article key={title} className="flex flex-col gap-3 rounded-2xl border border-line bg-white p-6">
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-tint text-accent">
                <Icon size={24} strokeWidth={1.9} aria-hidden="true" />
              </span>
              <h3 className="m-0 text-[17px] font-extrabold">{title}</h3>
              <p className="m-0 text-[14px] leading-relaxed text-muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Benefits */}
      <section className="container-x">
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-10">
          <header className="mb-7 flex flex-col gap-2">
            <h2 className="m-0 text-[28px] font-extrabold tracking-[-0.6px] sm:text-[34px]">{t("benefits.title")}</h2>
            <p className="m-0 max-w-[720px] text-[15px] leading-relaxed text-muted">{t("benefits.lead")}</p>
          </header>
          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex flex-col gap-2">
                <Icon size={26} strokeWidth={1.9} className="text-accent" aria-hidden="true" />
                <h3 className="m-0 mt-1 text-[16px] font-extrabold">{title}</h3>
                <p className="m-0 text-[13.5px] leading-relaxed text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="how" className="container-x scroll-mt-24">
        <header className="mb-6 flex max-w-[720px] flex-col gap-2">
          <h2 className="m-0 text-[28px] font-extrabold tracking-[-0.6px] sm:text-[34px]">{t("steps.title")}</h2>
          <p className="m-0 text-[15px] leading-relaxed text-muted">{t("steps.lead")}</p>
        </header>
        <ol className="m-0 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <li key={title} className="relative flex flex-col gap-3 rounded-2xl border border-line bg-white p-6">
              <span className="absolute right-5 top-5 text-[40px] font-extrabold leading-none text-surface">
                {i + 1}
              </span>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-white">
                <Icon size={21} strokeWidth={1.9} aria-hidden="true" />
              </span>
              <h3 className="relative m-0 text-[16px] font-extrabold">{title}</h3>
              <p className="relative m-0 text-[13.5px] leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Fees */}
      <section className="container-x">
        <div className="rounded-2xl bg-navy p-6 sm:p-10">
          <header className="mb-7 flex flex-col gap-2">
            <h2 className="m-0 text-[26px] font-extrabold tracking-[-0.5px] text-white sm:text-[32px]">
              {t("fees.title")}
            </h2>
            <p className="m-0 text-[15px] text-white/65">{t("fees.lead")}</p>
          </header>
          <div className="grid gap-6 sm:grid-cols-3 sm:gap-8">
            {fees.map(({ icon: Icon, label, value, note }) => (
              <div key={label} className="flex flex-col gap-1.5 border-t border-white/10 pt-5 sm:border-l sm:border-t-0 sm:pl-6 sm:pt-0">
                <Icon size={22} strokeWidth={1.9} className="mb-1 text-accent" aria-hidden="true" />
                <span className="text-[12px] font-semibold uppercase tracking-[0.4px] text-white/50">{label}</span>
                <span className="text-[26px] font-extrabold tracking-[-0.5px] text-white">{value}</span>
                <span className="text-[13px] leading-relaxed text-white/55">{note}</span>
              </div>
            ))}
          </div>
          <p className="m-0 mt-7 rounded-xl bg-white/[0.06] px-4 py-3 text-[13px] leading-relaxed text-white/65">
            {t("fees.note")}
          </p>
        </div>
      </section>

      {/* Application + aside */}
      <section className="container-x grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <MembershipForm />
        <aside className="flex flex-col gap-5">
          <div className="rounded-2xl border border-line bg-white p-6">
            <h2 className="m-0 text-[19px] font-extrabold">{t("aside.title")}</h2>
            <p className="m-0 mt-1.5 text-[14px] leading-relaxed text-muted">{t("aside.lead")}</p>
            <div className="mt-5 flex flex-col gap-3">
              <a href={`tel:${HOTLINE.replace(/\s/g, "")}`} className="flex items-center gap-3 text-sm font-semibold text-navy hover:text-accent">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-navy">
                  <Phone size={16} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3px] text-muted">
                    {t("aside.phoneLabel")}
                  </span>
                  {HOTLINE}
                </span>
              </a>
              <a href={`mailto:${SUPPORT_EMAIL}`} className="flex items-center gap-3 text-sm font-semibold text-navy hover:text-accent">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-navy">
                  <Mail size={16} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3px] text-muted">
                    {t("aside.emailLabel")}
                  </span>
                  {SUPPORT_EMAIL}
                </span>
              </a>
              <div className="flex items-center gap-3 text-sm font-semibold text-navy">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-navy">
                  <Clock size={16} aria-hidden="true" />
                </span>
                <span className="flex flex-col">
                  <span className="text-[11px] font-semibold uppercase tracking-[0.3px] text-muted">
                    {t("aside.hoursLabel")}
                  </span>
                  {t("aside.hoursValue")}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-hero p-6">
            <h3 className="m-0 text-[15px] font-extrabold text-navy">{t("aside.checklistTitle")}</h3>
            <ul className="m-0 mt-3.5 flex list-none flex-col gap-2.5 p-0">
              {[t("aside.checklist1"), t("aside.checklist2"), t("aside.checklist3")].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-[13.5px] leading-relaxed text-navy/80">
                  <Check size={16} strokeWidth={2.6} className="mt-0.5 shrink-0 text-accent" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>

      {/* FAQ */}
      <section className="container-x">
        <div className="rounded-2xl border border-line bg-white p-6 sm:p-10">
          <header className="mb-6 flex flex-col gap-2">
            <h2 className="m-0 text-[26px] font-extrabold tracking-[-0.5px] sm:text-[32px]">{t("faq.title")}</h2>
            <p className="m-0 text-[15px] text-muted">{t("faq.lead")}</p>
          </header>
          <div className="flex flex-col gap-3">
            {faq.map((item, i) => (
              <details
                key={item.q}
                open={i === 0}
                className="faq-item group rounded-2xl border border-line bg-white transition-shadow open:border-navy open:shadow-[0_12px_32px_rgba(28,26,26,0.08)]"
              >
                <summary className="flex cursor-pointer list-none items-start gap-3 px-5 py-4">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-[13px] font-extrabold text-white"
                  >
                    Q
                  </span>
                  <span className="flex-1 text-[16px] font-extrabold leading-snug text-navy">{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="mt-1 shrink-0 text-muted transition-transform duration-200 group-open:rotate-180"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden="true">
                      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </summary>
                <div className="px-5 pb-5">
                  <div className="flex items-start gap-3 rounded-xl border-l-4 border-accent bg-surface px-4 py-3.5">
                    <span
                      aria-hidden="true"
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[13px] font-extrabold text-accent ring-1 ring-line"
                    >
                      A
                    </span>
                    <p className="m-0 min-w-0 flex-1 text-[15px] leading-relaxed text-muted">{item.a}</p>
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
