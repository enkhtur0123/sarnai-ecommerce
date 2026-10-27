"use client";

import { useQuery } from "@apollo/client/react";
import {
  POSC_PRODUCT_CATEGORIES,
  type PoscProductCategoriesData,
  type PoscProductCategoriesVariables,
} from "@/graphql/ecommerce/queries/product";
import {
  STORE_PRODUCTS,
  type StoreProductsData,
  type StoreProductsVariables,
} from "@/graphql/ecommerce/queries/catalog";
import { HAS_POS, OWN_CATEGORY_CODE } from "@/lib/constants";
import { SAMPLE_CATEGORIES, SAMPLE_OWN_PRODUCTS, SAMPLE_PRODUCTS } from "@/lib/catalog";
import { erxesFileUrl, stripHtml } from "@/lib/utils";
import type { CatalogCategory, CatalogProduct } from "@/types/catalog";

const NEW_COUNT = 3;
const FLASH_COUNT = 4;

/**
 * Catalog from erxes POS. Falls back to the sample catalog when no POS token
 * is configured, the POS cannot be reached, or it has no products yet — and
 * says so via `isSample`.
 *
 * The store's own products (the OWN_CATEGORY_CODE category and its children)
 * are split out into `ownProducts` and kept out of `categories` / `products`,
 * so they only show in the hidden /own section.
 */
export function useCatalog() {
  const categoriesQuery = useQuery<PoscProductCategoriesData, PoscProductCategoriesVariables>(
    POSC_PRODUCT_CATEGORIES,
    {
      variables: { excludeEmpty: true, perPage: 50, sortField: "order", sortDirection: 1 },
      skip: !HAS_POS,
    },
  );
  const productsQuery = useQuery<StoreProductsData, StoreProductsVariables>(STORE_PRODUCTS, {
    variables: { perPage: 200 },
    skip: !HAS_POS,
  });

  const loading = HAS_POS && (categoriesQuery.loading || productsQuery.loading);
  const raw = productsQuery.data?.poscProducts ?? [];
  const failed = Boolean(categoriesQuery.error || productsQuery.error);

  if (!HAS_POS || failed || (!loading && raw.length === 0)) {
    return {
      categories: SAMPLE_CATEGORIES,
      products: SAMPLE_PRODUCTS,
      ownProducts: SAMPLE_OWN_PRODUCTS,
      loading: false,
      isSample: true,
    };
  }

  const rawCategories = categoriesQuery.data?.poscProductCategories ?? [];
  const ownIds = ownCategoryIds(rawCategories);

  const categories: CatalogCategory[] = rawCategories
    .filter((c) => !ownIds.has(c._id))
    .map((c) => ({ _id: c._id, name: c.name ?? "", imageUrl: erxesFileUrl(c.attachment?.url) || undefined }));

  // Newest products get the "New" badge; the first few headline the flash deals.
  const newest = [...raw]
    .sort((a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? ""))
    .slice(0, NEW_COUNT)
    .map((p) => p._id);

  const all: CatalogProduct[] = raw.map((p, i) => ({
    _id: p._id,
    name: p.name ?? "",
    description: p.description ? stripHtml(p.description) : undefined,
    categoryId: p.category?._id,
    categoryName: p.category?.name,
    unitPrice: p.unitPrice ?? 0,
    imageUrl: erxesFileUrl(p.attachment?.url) || undefined,
    isNew: newest.includes(p._id),
    flash: i < FLASH_COUNT,
    own: Boolean(p.category?._id && ownIds.has(p.category._id)),
  }));

  const products = all.filter((p) => !p.own);
  const ownProducts = all.filter((p) => p.own).map((p) => ({ ...p, flash: false }));

  return { categories, products, ownProducts, loading, isSample: false };
}

/** Ids of the own-products category (matched by code) and all of its descendants. */
function ownCategoryIds(list: { _id: string; code?: string; parentId?: string }[]): Set<string> {
  const ids = new Set(
    list.filter((c) => (c.code ?? "").trim().toLowerCase() === OWN_CATEGORY_CODE).map((c) => c._id),
  );
  let grew = ids.size > 0;
  while (grew) {
    grew = false;
    for (const c of list) {
      if (c.parentId && ids.has(c.parentId) && !ids.has(c._id)) {
        ids.add(c._id);
        grew = true;
      }
    }
  }
  return ids;
}
