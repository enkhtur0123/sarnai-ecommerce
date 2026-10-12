import { setRequestLocale } from "next-intl/server";
import { Hero } from "@/components/home/Hero";
import { FlashDeals } from "@/components/home/FlashDeals";
import { CategoryBento } from "@/components/home/CategoryBento";
import { JustForYou } from "@/components/home/JustForYou";
import { PromoBanners } from "@/components/home/PromoBanners";
import { TopCategoriesNewArrivals } from "@/components/home/TopCategoriesNewArrivals";
import { BlogSection } from "@/components/home/BlogSection";
import { ServicesBar } from "@/components/home/ServicesBar";
import { Newsletter } from "@/components/home/Newsletter";

export const revalidate = 60;

/** Homepage — section order from ecommerce.pen "Bazaar Market – Home". */
export default async function HomePage({ params }: PageProps<"/[locale]">) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <FlashDeals />
      <CategoryBento />
      <JustForYou />
      <PromoBanners />
      <TopCategoriesNewArrivals />
      <BlogSection />
      <ServicesBar />
      <Newsletter />
    </>
  );
}
