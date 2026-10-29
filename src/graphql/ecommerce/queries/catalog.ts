import { gql } from "@apollo/client";
import type { Product } from "./product";

/** poscProducts with the fields the storefront cards need (description + category). */
export const STORE_PRODUCTS = gql`
  query storeProducts($categoryId: String, $searchValue: String, $perPage: Int, $page: Int) {
    poscProducts(categoryId: $categoryId, searchValue: $searchValue, perPage: $perPage, page: $page) {
      _id
      name
      description
      unitPrice
      createdAt
      tagIds
      customFieldsData
      attachment {
        url
      }
      category {
        _id
        name
      }
    }
  }
`;

export type StoreProductsVariables = {
  categoryId?: string;
  searchValue?: string;
  perPage?: number;
  page?: number;
};

export type StoreProductsData = {
  poscProducts: Product[];
};
