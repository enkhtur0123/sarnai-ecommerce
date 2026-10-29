"use client";

import { useQuery } from "@apollo/client/react";
import {
  POSC_PRODUCT_DETAIL,
  type PoscProductDetailData,
  type PoscProductDetailVariables,
} from "@/graphql/ecommerce/queries/product";
import { HAS_POS } from "@/lib/constants";
import { SAMPLE_OWN_PRODUCTS, SAMPLE_PRODUCTS } from "@/lib/catalog";
import { isOwnProduct } from "@/lib/own";
import { erxesFileUrl, stripHtml } from "@/lib/utils";
import type { CatalogProduct } from "@/types/catalog";

/** One product — a sample item by id, otherwise the erxes POS product detail. */
export function useProduct(id: string) {
  const sample = [...SAMPLE_PRODUCTS, ...SAMPLE_OWN_PRODUCTS].find((p) => p._id === id);
  const { data, loading, error } = useQuery<PoscProductDetailData, PoscProductDetailVariables>(
    POSC_PRODUCT_DETAIL,
    { variables: { _id: id }, skip: Boolean(sample) || !HAS_POS },
  );

  if (sample) return { product: sample, loading: false };
  const p = data?.poscProductDetail;
  if (!p) return { product: null, loading: HAS_POS && loading && !error };

  const images = [p.attachment?.url, ...(p.attachmentMore ?? []).map((a) => a.url)]
    .map((u) => erxesFileUrl(u))
    .filter(Boolean);

  const product: CatalogProduct = {
    _id: p._id,
    name: p.name ?? "",
    description: p.description ? stripHtml(p.description) : undefined,
    categoryId: p.category?._id,
    categoryName: p.category?.name,
    unitPrice: p.unitPrice ?? 0,
    imageUrl: images[0],
    images,
    own: isOwnProduct(p),
  };
  return { product, loading: false };
}
