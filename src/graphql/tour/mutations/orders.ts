import { gql } from "@apollo/client";
import type { BmsOrder } from "../queries/orders";

export type BmsOrderInput = {
  tourId?: string;
  customerId?: string;
  branchId?: string;
  amount?: number;
  numberOfPeople?: number;
  type?: string;
  status?: string;
  note?: string;
  internalNote?: string;
  additionalCustomers?: string[];
  isChild?: boolean;
  parent?: string;
};

export const CP_BMS_ORDER_ADD = gql`
  mutation cpBmsOrderAdd($order: BmsOrderInput) {
    cpBmsOrderAdd(order: $order) {
      _id
      tourId
      amount
      status
    }
  }
`;

export type CpBmsOrderAddVariables = {
  order?: BmsOrderInput;
};

export type CpBmsOrderAddData = {
  cpBmsOrderAdd: Pick<BmsOrder, "_id" | "tourId" | "amount" | "status">;
};

export const CP_BMS_ORDER_EDIT = gql`
  mutation cpBmsOrderEdit($_id: String!, $order: BmsOrderInput) {
    cpBmsOrderEdit(_id: $_id, order: $order) {
      _id
      status
    }
  }
`;

export type CpBmsOrderEditVariables = {
  _id: string;
  order?: BmsOrderInput;
};

export type CpBmsOrderEditData = {
  cpBmsOrderEdit: Pick<BmsOrder, "_id" | "status">;
};

export const CP_BMS_ORDER_REMOVE = gql`
  mutation cpBmsOrderRemove($ids: [String]) {
    cpBmsOrderRemove(ids: $ids)
  }
`;

export type CpBmsOrderRemoveVariables = {
  ids?: string[];
};

export type CpBmsOrderRemoveData = {
  cpBmsOrderRemove: boolean;
};
