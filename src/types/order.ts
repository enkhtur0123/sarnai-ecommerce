import type { Text } from "./catalog";
import type { OrderStatusKey } from "@/lib/constants";

export type CartItem = {
  productId: string;
  name: Text;
  unitPrice: number;
  count: number;
  imageUrl?: string;
  sample?: boolean;
};

export type WishItem = {
  productId: string;
  name: Text;
  unitPrice: number;
  oldPrice?: number;
  imageUrl?: string;
  categoryName?: Text;
  sample?: boolean;
};

export type DeliveryType = "delivery" | "pickup";

/** An order placed from this browser — guests track orders with this copy. */
export type PlacedOrder = {
  _id: string;
  number?: string;
  createdAt: string;
  total: number;
  deliveryFee: number;
  deliveryType: DeliveryType;
  phone: string;
  email: string;
  address?: string;
  items: Array<{ name: Text; count: number; unitPrice: number; imageUrl?: string }>;
  /** Payment method picked at checkout, preselected on /verify. */
  paymentId?: string;
  paid: boolean;
  /** Canonical lifecycle stage. Older stored orders may omit it — infer from `paid`. */
  status?: OrderStatusKey;
};
