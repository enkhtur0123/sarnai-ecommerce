"use client";

import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { cartCountAtom, cartItemsAtom, cartOpenAtom, cartTotalAtom } from "@/store/cart.store";
import type { CatalogProduct } from "@/types/catalog";

export function useCart() {
  const [items, setItems] = useAtom(cartItemsAtom);
  const count = useAtomValue(cartCountAtom);
  const total = useAtomValue(cartTotalAtom);
  const setOpen = useSetAtom(cartOpenAtom);

  function add(product: CatalogProduct, qty = 1, openDrawer = true) {
    setItems((list) => {
      const existing = list.find((i) => i.productId === product._id);
      if (existing) {
        return list.map((i) =>
          i.productId === product._id ? { ...i, count: i.count + qty } : i,
        );
      }
      return [
        ...list,
        {
          productId: product._id,
          name: product.name,
          unitPrice: product.unitPrice,
          count: qty,
          imageUrl: product.imageUrl,
          sample: product.sample,
        },
      ];
    });
    if (openDrawer) setOpen(true);
  }

  function setQty(productId: string, count: number) {
    setItems((list) =>
      list.map((i) => (i.productId === productId ? { ...i, count: Math.max(1, count) } : i)),
    );
  }

  function remove(productId: string) {
    setItems((list) => list.filter((i) => i.productId !== productId));
  }

  function clear() {
    setItems([]);
  }

  return { items, count, total, add, setQty, remove, clear, setOpen };
}
