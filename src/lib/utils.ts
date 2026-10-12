import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isValidUrl(url: string | undefined | null): url is string {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function formatPrice(amount: number): string {
  return `${Math.round(amount).toLocaleString("en-US")}₮`;
}

/** Whole-percent discount between an old and a current price, or 0. */
export function discountPercent(price: number, oldPrice?: number): number {
  if (!oldPrice || oldPrice <= price) return 0;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function formatDate(value: string | undefined, locale: string) {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString(locale === "en" ? "en-US" : "mn-MN", {
    year: "numeric",
    month: "short",
    day: "2-digit",
  });
}

/** Absolute URL for an erxes file key or URL. */
export function erxesFileUrl(url?: string | null): string {
  if (!url) return "";
  if (url.startsWith("http") || url.startsWith("/")) return url;
  const endpoint = process.env.NEXT_PUBLIC_ERXES_ENDPOINT ?? "";
  return `${endpoint.replace(/\/gateway\/graphql$/, "")}/read-file?key=${encodeURIComponent(url)}`;
}
