"use client";

import { useAtomValue } from "jotai";
import { useQuery } from "@apollo/client/react";
import {
  FULL_ORDERS,
  type FullOrdersData,
  type FullOrdersVariables,
} from "@/graphql/ecommerce/queries/order";
import { useAuth } from "@/lib/auth/AuthContext";
import { DEMO_ORDERS, isDemoUser } from "@/lib/auth/demoCustomer";
import { HAS_POS, type OrderStatusKey } from "@/lib/constants";
import { normalizeOrderStatus } from "@/lib/orderStatus";
import { placedOrdersAtom } from "@/store/order.store";

export type MemberOrderRow = {
  id: string;
  number: string;
  date?: string;
  total: number;
  count: number;
  statusKey: OrderStatusKey;
  paid: boolean;
};

/**
 * Orders for the signed-in member: sample orders for the demo customer,
 * erxes orders for a real customer, plus orders placed from this browser.
 */
export function useMemberOrders() {
  const { user } = useAuth();
  const local = useAtomValue(placedOrdersAtom);
  const customerId = user?.erxesCustomerId;

  const { data, loading } = useQuery<FullOrdersData, FullOrdersVariables>(FULL_ORDERS, {
    variables: { customerId, perPage: 50, sortField: "createdAt", sortDirection: -1 },
    skip: !customerId || !HAS_POS,
    fetchPolicy: "cache-and-network",
  });

  const accountRows: MemberOrderRow[] = isDemoUser(user)
    ? DEMO_ORDERS.map((o) => ({
        id: o._id,
        number: o.number ?? o._id,
        date: o.createdAt,
        total: o.total,
        count: o.items.reduce((sum, item) => sum + item.count, 0),
        statusKey: normalizeOrderStatus(o.status, o.paid),
        paid: o.paid,
      }))
    : [];

  for (const o of data?.cpFullOrders ?? []) {
    const paid = Boolean(o.paidDate);
    accountRows.push({
      id: o._id,
      number: o.number ?? o._id.slice(-6).toUpperCase(),
      date: o.createdAt,
      total: o.totalAmount ?? 0,
      count: o.items?.length ?? 0,
      statusKey: normalizeOrderStatus(o.status, paid),
      paid,
    });
  }

  const accountIds = new Set(accountRows.map((row) => row.id));
  const localRows: MemberOrderRow[] = local
    .filter((o) => !accountIds.has(o._id))
    .map((o) => ({
      id: o._id,
      number: o.number ?? o._id.slice(-6).toUpperCase(),
      date: o.createdAt,
      total: o.total,
      count: o.items.reduce((sum, item) => sum + item.count, 0),
      statusKey: normalizeOrderStatus(o.status, o.paid),
      paid: o.paid,
    }));

  return { user, accountRows, localRows, loading };
}
