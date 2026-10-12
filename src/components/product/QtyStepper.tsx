"use client";

import { Minus, Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export function QtyStepper({
  value,
  onChange,
  size = "md",
}: {
  value: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) {
  const t = useTranslations("product");
  const box = size === "sm" ? "h-8 w-8" : "h-11 w-11";
  return (
    <div className="inline-flex items-center rounded-lg border border-line bg-white">
      <button
        type="button"
        onClick={() => onChange(Math.max(1, value - 1))}
        disabled={value <= 1}
        aria-label={t("decrease")}
        className={cn(box, "flex items-center justify-center text-navy disabled:text-star-off")}
      >
        <Minus size={size === "sm" ? 14 : 16} aria-hidden="true" />
      </button>
      <span
        className={cn("min-w-8 text-center font-bold text-navy", size === "sm" ? "text-sm" : "text-base")}
        aria-live="polite"
      >
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        aria-label={t("increase")}
        className={cn(box, "flex items-center justify-center text-navy")}
      >
        <Plus size={size === "sm" ? 14 : 16} aria-hidden="true" />
      </button>
    </div>
  );
}
