export const ERXES_ENDPOINT = process.env.NEXT_PUBLIC_ERXES_ENDPOINT ?? "";
export const CP_ID = process.env.NEXT_PUBLIC_CP_ID ?? "";
export const CMS_ID = process.env.NEXT_PUBLIC_CMS_ID ?? "";
export const POS_TOKEN = process.env.NEXT_PUBLIC_POS_TOKEN ?? "";
/** Products, categories and orders need an erxes POS; without one the sample catalog is shown. */
export const HAS_POS = POS_TOKEN.length > 0;

export const BRAND = "sarnai";
export const HOTLINE = "+976 7700 0199";
export const SUPPORT_EMAIL = "support@sarnai-ecommerce.mn";

/** Orders at or above this subtotal ship for free (matches the top-bar promo copy). */
export const FREE_SHIPPING_FROM = 200000;
export const DELIVERY_FEE = 7000;

export const PAYMENT_CONTENT_TYPE = "pos:orders";

export const PER_PAGE = 24;

/** Social profile URLs shown in the top bar and footer — replace with the store's own pages. */
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/",
  twitter: "https://x.com/",
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
} as const;
