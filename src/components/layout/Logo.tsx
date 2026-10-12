import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

/** Sarnai wordmark: red bag mark + red bold name. */
export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label={BRAND} className={cn("flex shrink-0 items-center gap-2", className)}>
      <span
        className={cn(
          "flex h-8 w-8 items-center justify-center rounded-lg",
          inverted ? "bg-white text-accent" : "bg-accent text-white",
        )}
      >
        <ShoppingBag size={18} strokeWidth={2.4} aria-hidden="true" />
      </span>
      <span
        className={cn(
          "text-[22px] font-extrabold leading-none tracking-[-0.5px] sm:text-2xl",
          inverted ? "text-white" : "text-accent",
        )}
      >
        {BRAND}
      </span>
    </Link>
  );
}
