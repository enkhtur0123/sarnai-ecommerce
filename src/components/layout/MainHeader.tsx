"use client";

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { ChevronDown, Heart, Search, ShoppingCart, User } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { Logo } from "@/components/layout/Logo";
import { useAuth } from "@/lib/auth/AuthContext";
import { useCatalog } from "@/lib/hooks/useCatalog";
import { cartCountAtom, cartOpenAtom } from "@/store/cart.store";
import { wishCountAtom } from "@/store/wishlist.store";
import { cn } from "@/lib/utils";
import { textFor } from "@/types/catalog";

function CountBadge({ value }: { value: number }) {
  if (value <= 0) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold text-white">
      {value > 99 ? "99+" : value}
    </span>
  );
}

const iconBtn =
  "relative flex h-11 w-11 items-center justify-center rounded-full bg-surface text-navy transition-colors hover:bg-line";

export function SearchBar({ className }: { className?: string }) {
  const t = useTranslations("header");
  const locale = useLocale();
  const router = useRouter();
  const { categories } = useCatalog();
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    const query = params.toString();
    router.push(query ? `/products?${query}` : "/products");
  }

  return (
    <form
      role="search"
      onSubmit={submit}
      className={cn(
        "flex h-[46px] items-center gap-3 rounded-[23px] border border-line bg-white py-0 pl-5 pr-1.5 focus-within:border-navy",
        className,
      )}
    >
      <button type="submit" aria-label={t("search")} className="text-muted hover:text-navy">
        <Search size={18} aria-hidden="true" />
      </button>
      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("search")}
        className="min-w-0 flex-1 bg-transparent text-sm text-navy outline-none placeholder:text-muted"
      />
      <label className="relative hidden h-9 shrink-0 items-center rounded-[18px] bg-surface md:flex">
        <span className="sr-only">{t("allCategories")}</span>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="h-full max-w-[170px] cursor-pointer appearance-none truncate rounded-[18px] bg-transparent pl-4 pr-9 text-[13px] font-semibold text-navy outline-none"
        >
          <option value="">{t("allCategories")}</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {textFor(c.name, locale)}
            </option>
          ))}
        </select>
        <ChevronDown size={14} className="pointer-events-none absolute right-3.5 text-navy" aria-hidden="true" />
      </label>
    </form>
  );
}

export function MainHeader() {
  const t = useTranslations("header");
  const { user } = useAuth();
  const cartCount = useAtomValue(cartCountAtom);
  const wishCount = useAtomValue(wishCountAtom);
  const openCart = useSetAtom(cartOpenAtom);

  return (
    <div className="bg-white">
      <div className="container-x flex h-[72px] items-center gap-6 lg:h-[84px] lg:gap-12">
        <Logo />
        <SearchBar className="hidden flex-1 md:flex" />
        <div className="ml-auto flex items-center gap-2 sm:gap-3 md:ml-0">
          <Link href={user ? "/profile" : "/login"} aria-label={t("account")} className={iconBtn}>
            <User size={19} aria-hidden="true" />
          </Link>
          <Link href="/wishlist" aria-label={t("wishlist")} className={iconBtn}>
            <Heart size={19} aria-hidden="true" />
            <CountBadge value={wishCount} />
          </Link>
          <button type="button" onClick={() => openCart(true)} aria-label={t("cart")} className={iconBtn}>
            <ShoppingCart size={19} aria-hidden="true" />
            <CountBadge value={cartCount} />
          </button>
        </div>
      </div>
      <div className="container-x pb-3 md:hidden">
        <SearchBar />
      </div>
    </div>
  );
}
