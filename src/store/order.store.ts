import { atom } from "jotai";
import { atomWithStorage, createJSONStorage } from "jotai/utils";
import type { PlacedOrder } from "@/types/order";

// Does not import from cart.store (see agents/ecommerce/conventions.md §5).

const sessionJSON = createJSONStorage<PlacedOrder | null>(() => sessionStorage);

/** The order waiting for payment on /verify. */
export const activeOrderAtom = atomWithStorage<PlacedOrder | null>(
  "se-active-order",
  null,
  sessionJSON,
);

/** Orders placed from this browser — guests track their orders with these. */
export const placedOrdersAtom = atomWithStorage<PlacedOrder[]>("se-orders", []);

export const orderTotalAtom = atom((get) => {
  const order = get(activeOrderAtom);
  return order ? order.total + order.deliveryFee : 0;
});
