"use client";

import { Suspense, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Bell, Heart, Search, ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { Logo } from "@/components/layout/Logo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { useAuth } from "@/lib/auth/AuthContext";
import { cartCountAtom, cartOpenAtom } from "@/store/cart.store";
import { wishCountAtom } from "@/store/wishlist.store";
import { cn } from "@/lib/utils";

function CountBadge({ value, className }: { value: number; className?: string }) {
  if (value <= 0) return null;
  return (
    <span
      className={cn(
        "absolute flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white ring-2 ring-white",
        className,
      )}
    >
      {value > 99 ? "99+" : value}
    </span>
  );
}

export function SearchBar({ className }: { className?: string }) {
  const t = useTranslations("header");
  const router = useRouter();
  const [q, setQ] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    router.push(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products");
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn(
        "flex h-11 items-center gap-3 rounded-[10px] border border-line bg-surface px-4 transition-colors focus-within:border-accent focus-within:bg-white",
        className,
      )}
    >
      <button type="submit" aria-label={t("search")} className="text-secondary hover:text-navy">
        <Search size={18} aria-hidden="true" />
      </button>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("search")}
        className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-secondary"
      />
    </form>
  );
}

/** Sarnai header: logo · search · account · cart (desktop); logo · bell · cart + search row (mobile). */
export function MainHeader() {
  const t = useTranslations("header");
  const { user } = useAuth();
  const cartCount = useAtomValue(cartCountAtom);
  const wishCount = useAtomValue(wishCountAtom);
  const openCart = useSetAtom(cartOpenAtom);

  return (
    <div className="border-b border-line bg-white">
      <div className="container-x flex h-16 items-center gap-6 lg:h-[76px] lg:gap-10">
        <Logo />
        <SearchBar className="hidden max-w-[560px] flex-1 md:flex" />
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <Suspense fallback={null}>
            <LanguageSwitcher className="mr-2 hidden text-[13px] font-semibold text-navy sm:flex" />
          </Suspense>
          <Link
            href={user ? "/profile" : "/login"}
            className="hidden items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-navy hover:bg-surface md:flex"
          >
            <User size={20} aria-hidden="true" />
            {t("account")}
          </Link>
          <Link
            href="/wishlist"
            aria-label={t("wishlist")}
            className="relative hidden h-10 w-10 items-center justify-center rounded-lg text-navy hover:bg-surface md:flex"
          >
            <Heart size={20} aria-hidden="true" />
            <CountBadge value={wishCount} className="-right-0.5 -top-0.5" />
          </Link>
          <Link
            href="/orders"
            aria-label={t("notifications")}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-navy hover:bg-surface md:hidden"
          >
            <Bell size={20} aria-hidden="true" />
          </Link>
          <button
            type="button"
            onClick={() => openCart(true)}
            className="relative flex h-10 items-center gap-2 rounded-lg px-2.5 text-sm font-medium text-navy hover:bg-surface md:px-3"
          >
            <span className="relative">
              <ShoppingCart size={20} aria-hidden="true" />
              <CountBadge value={cartCount} className="-right-2.5 -top-2.5" />
            </span>
            <span className="hidden md:inline">{t("cart")}</span>
            <span className="sr-only md:hidden">{t("cart")}</span>
          </button>
        </div>
      </div>
      <div className="container-x pb-3 md:hidden">
        <SearchBar />
      </div>
    </div>
  );
}
