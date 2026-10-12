import { BadgeCheck, Headset, ShieldCheck, Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";

export async function ServicesBar() {
  const t = await getTranslations("services");
  const items = [
    { icon: Truck, title: t("delivery"), sub: t("deliverySub") },
    { icon: ShieldCheck, title: t("payment"), sub: t("paymentSub") },
    { icon: BadgeCheck, title: t("confidence"), sub: t("confidenceSub") },
    { icon: Headset, title: t("support"), sub: t("supportSub") },
  ];
  return (
    <section className="container-x pt-16 lg:pt-20">
      <ul className="m-0 grid list-none gap-6 rounded-2xl border border-line bg-white p-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 lg:px-2 lg:py-8">
        {items.map(({ icon: Icon, title, sub }, i) => (
          <li
            key={title}
            className={`flex items-center gap-4 lg:px-7 ${i > 0 ? "lg:border-l lg:border-line" : ""}`}
          >
            <span className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-surface text-navy">
              <Icon size={22} aria-hidden="true" />
            </span>
            <span className="flex flex-col gap-1">
              <span className="text-base font-bold text-navy">{title}</span>
              <span className="text-[13px] text-muted">{sub}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
