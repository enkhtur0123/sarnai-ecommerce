import { ShoppingBag } from "lucide-react";
import { Link } from "@/i18n/routing";
import { BRAND } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Logo({ inverted = false, className }: { inverted?: boolean; className?: string }) {
  return (
    <Link href="/" aria-label={BRAND} className={cn("flex shrink-0 items-center gap-2.5", className)}>
      <span
        className={cn(
          "flex h-[38px] w-[38px] items-center justify-center rounded-[10px]",
          inverted ? "bg-white text-navy" : "bg-navy text-white",
        )}
      >
        <ShoppingBag size={20} strokeWidth={2} aria-hidden="true" />
      </span>
      <span
        className={cn(
          "text-[26px] font-extrabold leading-none tracking-[-0.5px]",
          inverted ? "text-white" : "text-navy",
        )}
      >
        {BRAND}
      </span>
    </Link>
  );
}
