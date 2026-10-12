import { setRequestLocale } from "next-intl/server";
import { HomeHero } from "@/components/home/HomeHero";
import { CategoryCircles } from "@/components/home/CategoryCircles";
import { TodaysDeals } from "@/components/home/TodaysDeals";
import { Recommended } from "@/components/home/Recommended";
import { FeatureStrip } from "@/components/home/FeatureStrip";

export const revalidate = 60;

/** Homepage — section order from the Sarnai "Homepage (Desktop)" board. */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HomeHero />
      <CategoryCircles />
      <TodaysDeals />
      <Recommended />
      <FeatureStrip />
    </>
  );
}
