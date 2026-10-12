import { getLocale, getTranslations } from "next-intl/server";
import { TopBar } from "@/components/layout/TopBar";
import { MainHeader } from "@/components/layout/MainHeader";
import { NavBar, type NavLink } from "@/components/layout/NavBar";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { getCmsMenu } from "@/lib/cms";

/** Header navigation: erxes CMS "header" menu, or the design's default links. */
async function headerLinks(): Promise<NavLink[]> {
  const locale = await getLocale();
  const cms = await getCmsMenu("header", locale);
  if (cms.length >= 2) return cms;
  const t = await getTranslations("nav");
  return [
    { id: "home", label: t("home"), href: "/" },
    { id: "shop", label: t("shop"), href: "/products" },
    { id: "flash", label: t("flash"), href: "/products?filter=flash" },
    { id: "new", label: t("newArrivals"), href: "/products?filter=new" },
    { id: "blog", label: t("blog"), href: "/blog" },
    { id: "about", label: t("about"), href: "/about" },
    { id: "track", label: t("track"), href: "/orders" },
  ];
}

export async function SiteHeader() {
  const links = await headerLinks();
  return (
    <header>
      <TopBar />
      <MainHeader />
      <NavBar links={links} />
      <CartDrawer />
    </header>
  );
}
