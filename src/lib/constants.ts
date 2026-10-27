export const ERXES_ENDPOINT = process.env.NEXT_PUBLIC_ERXES_ENDPOINT ?? "";
export const CP_ID = process.env.NEXT_PUBLIC_CP_ID ?? "";
export const CMS_ID = process.env.NEXT_PUBLIC_CMS_ID ?? "";
export const POS_TOKEN = process.env.NEXT_PUBLIC_POS_TOKEN ?? "";
/** Products, categories and orders need an erxes POS; without one the sample catalog is shown. */
export const HAS_POS = POS_TOKEN.length > 0;

/**
 * Code of the erxes POS product category that holds the store's own products.
 * Products in it (and its sub-categories) are shown only in the hidden /own
 * section, which is reached through the printed QR / barcode link.
 */
export const OWN_CATEGORY_CODE = (process.env.NEXT_PUBLIC_OWN_CATEGORY_CODE ?? "OWN").trim().toLowerCase();

export const BRAND = "sarnai";
export const HOTLINE = "+976 7700 0199";
export const SUPPORT_EMAIL = "support@sarnai-ecommerce.mn";

/** Orders at or above this subtotal ship for free (matches the top-bar promo copy). */
export const FREE_SHIPPING_FROM = 200000;
export const DELIVERY_FEE = 7000;

export const PAYMENT_CONTENT_TYPE = "pos:orders";

export const PER_PAGE = 24;

/** Canonical 7-stage order lifecycle (+ cancelled as terminal exception). */
export const ORDER_STATUS = {
  PENDING_PAYMENT: "pending_payment",
  PAID: "paid",
  PROCESSING: "processing",
  READY_FOR_SHIPMENT: "ready_for_shipment",
  OUT_FOR_DELIVERY: "out_for_delivery",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type OrderStatusKey =
  (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

/** Linear fulfillment flow — index used for progress steppers. */
export const ORDER_STATUS_FLOW: OrderStatusKey[] = [
  ORDER_STATUS.PENDING_PAYMENT,
  ORDER_STATUS.PAID,
  ORDER_STATUS.PROCESSING,
  ORDER_STATUS.READY_FOR_SHIPMENT,
  ORDER_STATUS.OUT_FOR_DELIVERY,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.COMPLETED,
];

/** Social profile URLs shown in the top bar and footer — replace with the store's own pages. */
export const SOCIAL_LINKS = {
  facebook: "https://www.facebook.com/",
  twitter: "https://x.com/",
  instagram: "https://www.instagram.com/",
  youtube: "https://www.youtube.com/",
} as const;
