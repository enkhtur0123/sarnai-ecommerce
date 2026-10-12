import { LayoutGrid, ShieldCheck, TicketPercent, Truck } from "lucide-react";
import { getTranslations } from "next-intl/server";

/** Four brand promises on a soft red band, from the Sarnai design board. */
export async function FeatureStrip() {
  const t = await getTranslations("home");
  const items = [
    { icon: LayoutGrid, title: t("wideSelection"), sub: t("wideSelectionSub") },
    { icon: TicketPercent, title: t("greatPrices"), sub: t("greatPricesSub") },
    { icon: Truck, title: t("fastDelivery"), sub: t("fastDeliverySub") },
    { icon: ShieldCheck, title: t("secureShopping"), sub: t("secureShoppingSub") },
  ];
  return (
    <section className="container-x pt-10 lg:pt-12">
      <ul className="m-0 grid list-none grid-cols-2 gap-6 rounded-xl bg-hero p-6 lg:grid-cols-4 lg:gap-0 lg:px-4 lg:py-8">
        {items.map(({ icon: Icon, title, sub }, i) => (
          <li
            key={title}
            className={`flex flex-col gap-2 p-1 lg:px-7 ${i > 0 ? "lg:border-l lg:border-accent/15" : ""}`}
          >
            <Icon size={34} strokeWidth={1.8} className="text-accent" aria-hidden="true" />
            <span className="mt-1 text-[15px] font-bold text-navy sm:text-base">{title}</span>
            <span className="text-[13px] leading-relaxed text-muted">{sub}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
