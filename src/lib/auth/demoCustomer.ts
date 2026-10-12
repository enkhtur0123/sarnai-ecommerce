import type { CPUser } from "@/graphql/auth/queries/currentUser";
import type { PlacedOrder } from "@/types/order";

/** Demo login is on unless NEXT_PUBLIC_DEMO_MODE=false. */
export const DEMO_ENABLED = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

export const DEMO_TOKEN = "demo-customer-token";

/**
 * Fixed mock customer for showing the account area without an erxes account.
 * It has no erxesCustomerId, so orders and wishlist never reach erxes as this user.
 */
export const DEMO_CUSTOMER: CPUser = {
  _id: "demo-customer",
  firstName: "Сарнай",
  lastName: "Туршилт",
  phone: "99119911",
  email: "demo@sarnai-ecommerce.mn",
  isVerified: true,
  isPhoneVerified: true,
  isEmailVerified: true,
  createdAt: "2026-01-15T00:00:00.000Z",
};

export function isDemoUser(user: CPUser | null | undefined) {
  return user?._id === DEMO_CUSTOMER._id;
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

/** Sample orders so the demo customer's order page is not empty. */
export const DEMO_ORDERS: PlacedOrder[] = [
  {
    _id: "demo-order-1",
    number: "SE-2026-0101",
    createdAt: daysAgo(3),
    total: 1368000,
    deliveryFee: 0,
    deliveryType: "delivery",
    phone: DEMO_CUSTOMER.phone!,
    email: DEMO_CUSTOMER.email!,
    address: "Сүхбаатар дүүрэг, 1-р хороо, 17-р байр",
    items: [
      { name: { mn: "Утасгүй чихэвч Over-Ear", en: "Wireless Over-Ear Headphones" }, count: 1, unitPrice: 849000, imageUrl: "/images/product-1.jpg" },
      { name: { mn: "True Wireless чихэвч", en: "True Wireless Earbuds" }, count: 1, unitPrice: 519000, imageUrl: "/images/product-2.jpg" },
    ],
    paid: true,
  },
  {
    _id: "demo-order-2",
    number: "SE-2026-0102",
    createdAt: daysAgo(0),
    total: 149000,
    deliveryFee: 7000,
    deliveryType: "delivery",
    phone: DEMO_CUSTOMER.phone!,
    email: DEMO_CUSTOMER.email!,
    address: "Сүхбаатар дүүрэг, 1-р хороо, 17-р байр",
    items: [
      { name: { mn: "Анхилуун үнэрт диффузор", en: "Aroma Diffuser" }, count: 1, unitPrice: 149000, imageUrl: "/images/product-11.jpg" },
    ],
    paid: false,
  },
];
