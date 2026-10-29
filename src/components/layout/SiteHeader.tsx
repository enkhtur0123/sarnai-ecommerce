import { getLocale, getTranslations } from "next-intl/server";
import { MainHeader } from "@/components/layout/MainHeader";
import { NavBar, type NavLink } from "@/components/layout/NavBar";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { getCmsMenu } from "@/lib/cms";

/** Header navigation: erxes CMS "header" menu, or the design's default links. */
async function headerLinks(): Promise<NavLink[]> {
  const locale = await getLocale();
  const t = await getTranslations("nav");
  const cms = await getCmsMenu("header", locale);
  const links: NavLink[] =
    cms.length >= 2
      ? cms
      : [
          { id: "home", label: t("home"), href: "/" },
          { id: "shop", label: t("shop"), href: "/products" },
          { id: "flash", label: t("flash"), href: "/products?filter=flash" },
          { id: "new", label: t("newArrivals"), href: "/products?filter=new" },
          { id: "blog", label: t("blog"), href: "/blog" },
          { id: "about", label: t("about"), href: "/about" },
          { id: "membership", label: t("membership"), href: "/membership" },
          { id: "track", label: t("track"), href: "/orders" },
        ];

  // The own collection is always public, even when the CMS menu drives the header.
  if (links.some((link) => link.href.split(/[?#]/)[0] === "/own")) return links;
  const shopIndex = links.findIndex((link) => link.href.split(/[?#]/)[0] === "/products");
  const own: NavLink = { id: "own", label: t("own"), href: "/own" };
  if (shopIndex === -1) return [...links, own];
  return [...links.slice(0, shopIndex + 1), own, ...links.slice(shopIndex + 1)];
}

export async function SiteHeader() {
  const links = await headerLinks();
  return (
    <header className="sticky top-0 z-30 lg:static">
      <MainHeader />
      <NavBar links={links} />
      <CartDrawer />
    </header>
  );
}
