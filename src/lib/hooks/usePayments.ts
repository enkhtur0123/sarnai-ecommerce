"use client";

import { useQuery } from "@apollo/client/react";
import { CP_PAYMENTS, type CpPaymentsData } from "@/graphql/ecommerce/queries/payment";

/** Payment methods enabled on the client portal in erxes. */
export function usePayments() {
  const { data, loading, error } = useQuery<CpPaymentsData>(CP_PAYMENTS);
  const payments = (data?.cpPayments ?? []).filter((p) => !p.status || p.status === "active");
  return { payments, loading, error };
}
