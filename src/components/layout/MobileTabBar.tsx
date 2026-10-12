"use client";

import { useAtomValue } from "jotai";
import { ClipboardList, House, LayoutGrid, ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useAuth } from "@/lib/auth/AuthContext";
import { cartCountAtom } from "@/store/cart.store";
import { cn } from "@/lib/utils";

/** Bottom tab bar from the Sarnai mobile screens: Home · Categories · Cart · Orders · Account. */
export function MobileTabBar() {
  const t = useTranslations("tabs");
  const pathname = usePathname();
  const { user } = useAuth();
  const cartCount = useAtomValue(cartCountAtom);

  const tabs = [
    { href: "/", label: t("home"), icon: House, active: pathname === "/" },
    { href: "/products", label: t("categories"), icon: LayoutGrid, active: pathname.startsWith("/products") },
    { href: "/cart", label: t("cart"), icon: ShoppingCart, active: pathname === "/cart", badge: cartCount },
    { href: "/orders", label: t("orders"), icon: ClipboardList, active: pathname.startsWith("/orders") },
    {
      href: user ? "/profile" : "/login",
      label: t("account"),
      icon: User,
      active: ["/profile", "/login", "/register", "/wishlist"].includes(pathname),
    },
  ];

  return (
    <nav
      aria-label={t("label")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white pb-[env(safe-area-inset-bottom,0px)] lg:hidden"
    >
      <ul className="m-0 grid h-16 list-none grid-cols-5 p-0">
        {tabs.map(({ href, label, icon: Icon, active, badge }) => (
          <li key={label}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium",
                active ? "text-accent" : "text-secondary hover:text-navy",
              )}
            >
              <span className="relative">
                <Icon size={21} strokeWidth={active ? 2.4 : 2} aria-hidden="true" />
                {badge ? (
                  <span className="absolute -right-2.5 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-bold text-white ring-2 ring-white">
                    {badge > 99 ? "99+" : badge}
                  </span>
                ) : null}
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
