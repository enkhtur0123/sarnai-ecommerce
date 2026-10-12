"use client";

import { useAtom } from "jotai";
import { useMutation } from "@apollo/client/react";
import { CP_WISHLIST_ADD, CP_WISHLIST_REMOVE } from "@/graphql/ecommerce/mutations/wishlist";
import { useAuth } from "@/lib/auth/AuthContext";
import { wishItemsAtom } from "@/store/wishlist.store";
import type { CatalogProduct } from "@/types/catalog";

/** erxes wishlist record ids by product, for removing what this session added. */
const remoteIds = new Map<string, string>();

/**
 * Wishlist kept locally (guests, sample items) and mirrored to erxes
 * (`cpWishlistAdd/Remove`) for signed-in customers with real POS products.
 */
export function useWishlist() {
  const [items, setItems] = useAtom(wishItemsAtom);
  const { user } = useAuth();
  const [addRemote] = useMutation<{ cpWishlistAdd?: { _id: string } }>(CP_WISHLIST_ADD);
  const [removeRemote] = useMutation(CP_WISHLIST_REMOVE);
  const customerId = user?.erxesCustomerId;

  const has = (productId: string) => items.some((i) => i.productId === productId);

  function remove(productId: string) {
    setItems((list) => list.filter((i) => i.productId !== productId));
    const remoteId = remoteIds.get(productId);
    if (remoteId) {
      remoteIds.delete(productId);
      removeRemote({ variables: { _id: remoteId } }).catch(() => {});
    }
  }

  async function toggle(product: CatalogProduct) {
    if (has(product._id)) {
      remove(product._id);
      return;
    }
    setItems((list) => [
      ...list,
      {
        productId: product._id,
        name: product.name,
        unitPrice: product.unitPrice,
        oldPrice: product.oldPrice,
        imageUrl: product.imageUrl,
        categoryName: product.categoryName,
        sample: product.sample,
      },
    ]);
    if (customerId && !product.sample) {
      try {
        const { data } = await addRemote({ variables: { productId: product._id, customerId } });
        if (data?.cpWishlistAdd?._id) remoteIds.set(product._id, data.cpWishlistAdd._id);
      } catch {
        // The local copy still works; erxes sync is best-effort.
      }
    }
  }

  return { items, has, toggle, remove };
}
