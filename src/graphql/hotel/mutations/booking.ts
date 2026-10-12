import { gql } from "@apollo/client";
import type { Deal } from "../queries/booking";

export type DealProductData = {
  productId?: string;
  quantity?: number;
  unitPrice?: number;
  amount?: number;
};

export type DealInput = {
  name?: string;
  stageId?: string;
  startDate?: string;
  closeDate?: string;
  customerIds?: string[];
  productsData?: DealProductData[];
  paymentsData?: unknown;
  description?: string;
  extraData?: Record<string, unknown>;
};

export const CP_DEALS_ADD = gql`
  mutation cpDealsAdd($input: DealInput!) {
    cpDealsAdd(input: $input) {
      _id
      name
    }
  }
`;

export type CpDealsAddVariables = {
  input: DealInput;
};

export type CpDealsAddData = {
  cpDealsAdd: Pick<Deal, "_id" | "name">;
};

export const CP_DEALS_EDIT = gql`
  mutation cpDealsEdit($_id: String!, $input: DealInput!) {
    cpDealsEdit(_id: $_id, input: $input) {
      _id
      stageId
    }
  }
`;

export type CpDealsEditVariables = {
  _id: string;
  input: DealInput;
};

export type CpDealsEditData = {
  cpDealsEdit: Pick<Deal, "_id" | "stageId">;
};
