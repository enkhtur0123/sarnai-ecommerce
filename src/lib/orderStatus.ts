import { ORDER_STATUS, type OrderStatusKey } from "@/lib/constants";

export type { OrderStatusKey };
export { ORDER_STATUS };

/**
 * Normalize any legacy / backend order status into the canonical
 * 7-stage lifecycle (+ cancelled).
 *
 * Legacy erxes POS values seen in the wild:
 * new, pending, doing, reDoing, done, complete,
 * paid, cancelled, returned — plus free-form variants.
 */
export function normalizeOrderStatus(
  status?: string | null,
  paid?: boolean,
): OrderStatusKey {
  const raw = (status ?? "").trim().toLowerCase().replace(/[\s-]+/g, "_");

  switch (raw) {
    case "cancelled":
    case "canceled":
    case "cancel":
      return ORDER_STATUS.CANCELLED;
    case "paid":
      return ORDER_STATUS.PAID;
    case "processing":
    case "doing":
    case "redoing":
    case "re_doing":
    case "preparing":
    case "confirmed":
    case "confirm":
      return ORDER_STATUS.PROCESSING;
    case "ready_for_shipment":
    case "ready":
    case "done":
    case "packed":
      return ORDER_STATUS.READY_FOR_SHIPMENT;
    case "out_for_delivery":
    case "delivering":
    case "shipped":
    case "shipping":
    case "on_the_way":
      return ORDER_STATUS.OUT_FOR_DELIVERY;
    case "delivered":
    case "received":
      return ORDER_STATUS.DELIVERED;
    case "completed":
    case "complete":
    case "done_completed":
    case "returned":
    case "return":
    case "closed":
    case "finished":
      // `returned` is a post-completion state — surfaced as completed.
      return ORDER_STATUS.COMPLETED;
    case "pending_payment":
    case "awaiting_payment":
    case "unpaid":
    case "new":
    case "pending":
    case "":
      return paid ? ORDER_STATUS.PAID : ORDER_STATUS.PENDING_PAYMENT;
    default:
      return paid ? ORDER_STATUS.PAID : ORDER_STATUS.PENDING_PAYMENT;
  }
}

/** Badge colors per canonical status (Tailwind classes). */
export const ORDER_STATUS_BADGE: Record<OrderStatusKey, string> = {
  [ORDER_STATUS.PENDING_PAYMENT]: "bg-amber-100 text-amber-800",
  [ORDER_STATUS.PAID]: "bg-green-100 text-green-800",
  [ORDER_STATUS.PROCESSING]: "bg-blue-100 text-blue-800",
  [ORDER_STATUS.READY_FOR_SHIPMENT]: "bg-purple-100 text-purple-800",
  [ORDER_STATUS.OUT_FOR_DELIVERY]: "bg-indigo-100 text-indigo-800",
  [ORDER_STATUS.DELIVERED]: "bg-emerald-100 text-emerald-800",
  [ORDER_STATUS.COMPLETED]: "bg-navy bg-slate-800 text-white",
  [ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-700",
};

/** Position in the linear flow, -1 for cancelled (off-flow). */
export function orderStatusStep(status: OrderStatusKey): number {
  if (status === ORDER_STATUS.CANCELLED) return -1;
  const flow: string[] = [
    ORDER_STATUS.PENDING_PAYMENT,
    ORDER_STATUS.PAID,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.READY_FOR_SHIPMENT,
    ORDER_STATUS.OUT_FOR_DELIVERY,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.COMPLETED,
  ];
  return flow.indexOf(status);
}
