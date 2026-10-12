import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { WishItem } from "@/types/order";

/** Local wishlist (works for guests and sample items); synced to erxes for signed-in users. */
export const wishItemsAtom = atomWithStorage<WishItem[]>("se-wishlist", []);

export const wishCountAtom = atom((get) => get(wishItemsAtom).length);
