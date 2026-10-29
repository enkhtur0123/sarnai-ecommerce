"use client";

import { Heart, LogOut, Package, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { useAuth } from "@/lib/auth/AuthContext";
import { cn } from "@/lib/utils";

/** Account sidebar shared by profile, orders and wishlist. */
export function AccountNav() {
  const t = useTranslations("account");
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();

  const items = [
    { href: "/profile", label: t("title"), icon: User },
    { href: "/orders", label: t("orders"), icon: Package },
    { href: "/wishlist", label: t("wishlist"), icon: Heart },
  ];

  return (
    <nav aria-label={t("title")} className="flex flex-col gap-1 self-start rounded-2xl border border-line bg-white p-3">
      {items.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold",
            pathname.startsWith(href) ? "bg-surface text-accent" : "text-navy hover:bg-surface",
          )}
        >
          <Icon size={18} aria-hidden="true" />
          {label}
        </Link>
      ))}
      {user && (
        <button
          type="button"
          onClick={async () => {
            await logout();
            router.replace("/");
          }}
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-muted hover:bg-surface hover:text-navy"
        >
          <LogOut size={18} aria-hidden="true" />
          {t("logout")}
        </button>
      )}
    </nav>
  );
}

export function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="container-x grid items-start gap-8 py-10 lg:grid-cols-[260px_1fr]">
      <AccountNav />
      <div className="min-w-0">{children}</div>
    </div>
  );
}
