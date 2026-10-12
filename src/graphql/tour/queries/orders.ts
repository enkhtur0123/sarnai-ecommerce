import { gql } from "@apollo/client";

export type BmsOrder = {
  _id: string;
  tourId?: string;
  customerId?: string;
  branchId?: string;
  amount?: number;
  numberOfPeople?: number;
  status?: string;
  type?: string;
  note?: string;
};

export const CP_BMS_ORDERS = gql`
  query cpBmsOrders(
    $tourId: String
    $customerId: String
    $branchId: String
    $limit: Int
    $cursor: String
  ) {
    cpBmsOrders(
      tourId: $tourId
      customerId: $customerId
      branchId: $branchId
      limit: $limit
      cursor: $cursor
    ) {
      _id
      tourId
      customerId
      amount
      numberOfPeople
      status
      type
      note
    }
  }
`;

export type CpBmsOrdersVariables = {
  tourId?: string;
  customerId?: string;
  branchId?: string;
  limit?: number;
  cursor?: string;
};

export type CpBmsOrdersData = {
  cpBmsOrders: BmsOrder[];
};
