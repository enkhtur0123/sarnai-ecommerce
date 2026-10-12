import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { CartItem } from "@/types/order";

export const cartItemsAtom = atomWithStorage<CartItem[]>("se-cart", []);

export const cartCountAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.count, 0),
);

export const cartTotalAtom = atom((get) =>
  get(cartItemsAtom).reduce((sum, item) => sum + item.unitPrice * item.count, 0),
);

export const cartOpenAtom = atom(false);
