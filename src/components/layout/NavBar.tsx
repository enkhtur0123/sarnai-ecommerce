"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown, Headphones, Menu } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useCatalog } from "@/lib/hooks/useCatalog";
import { HOTLINE } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { textFor } from "@/types/catalog";

export type NavLink = { id: string; label: string; href: string };

function isActive(pathname: string, href: string) {
  const path = href.split(/[?#]/)[0] || "/";
  if (href.includes("?")) return false;
  return path === "/" ? pathname === "/" : pathname === path || pathname.startsWith(`${path}/`);
}

function CategoriesMenu() {
  const t = useTranslations("header");
  const locale = useLocale();
  const { categories } = useCatalog();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("mousedown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex h-10 w-[240px] items-center gap-2.5 rounded-lg bg-accent px-4 text-[13px] font-semibold text-white hover:bg-accent-deep"
      >
        <Menu size={18} aria-hidden="true" />
        <span className="flex-1 text-left">{t("allCategories")}</span>
        <ChevronDown size={16} className={cn("transition-transform", open && "rotate-180")} aria-hidden="true" />
      </button>
      {open && (
        <ul className="absolute left-0 top-[calc(100%+8px)] z-40 m-0 w-[240px] list-none rounded-xl border border-line bg-white p-2 shadow-[0_16px_40px_rgba(31,41,55,0.12)]">
          {categories.map((c) => (
            <li key={c._id}>
              <Link
                href={`/products?category=${c._id}`}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-navy hover:bg-surface"
              >
                {textFor(c.name, locale)}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function NavBar({ links }: { links: NavLink[] }) {
  const t = useTranslations("header");
  const pathname = usePathname();
  // The homepage carries its own category sidebar, as in the design.
  if (pathname === "/") return null;

  return (
    <nav aria-label={t("menu")} className="hidden border-b border-line bg-white lg:block">
      <div className="container-x flex h-14 items-center justify-between gap-6">
        <CategoriesMenu />
        <ul className="m-0 flex list-none items-center gap-7 p-0 xl:gap-9">
          {links.map((l) => (
            <li key={l.id}>
              <Link
                href={l.href}
                className={cn(
                  "whitespace-nowrap text-sm transition-colors hover:text-accent",
                  isActive(pathname, l.href) ? "font-bold text-accent" : "font-medium text-navy",
                )}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <a href={`tel:${HOTLINE.replace(/\s/g, "")}`} className="flex items-center gap-2 whitespace-nowrap text-sm font-bold text-navy">
          <Headphones size={18} aria-hidden="true" />
          {HOTLINE}
        </a>
      </div>
    </nav>
  );
}
