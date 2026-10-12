"use client";

import { useState, useEffect } from "react";
import { useMutation, useSubscription } from "@apollo/client/react";
import { useApolloClient } from "@apollo/client/react";
import {
  INVOICE_CREATE,
  INVOICES_CHECK,
  type InvoiceCreateVariables,
  type InvoiceCreateData,
  type InvoicesCheckData,
} from "@/graphql/ecommerce/mutations/payment";
import {
  INVOICE_UPDATED,
  TRANSACTION_UPDATED,
  type InvoiceUpdatedVariables,
} from "@/graphql/ecommerce/queries/payment";

type InvoiceStatus = "idle" | "pending" | "paid" | "failed";

type UseInvoiceOptions = {
  onPaid?: (invoiceId: string) => void;
  onFailed?: () => void;
};

export function useInvoice(options: UseInvoiceOptions = {}) {
  const client = useApolloClient();
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [status, setStatus] = useState<InvoiceStatus>("idle");

  const [createInvoiceMutation, { loading: creating }] = useMutation<
    InvoiceCreateData,
    InvoiceCreateVariables
  >(INVOICE_CREATE);

  // Subscribe once we have an invoiceId
  useSubscription<{ invoiceUpdated: boolean }, InvoiceUpdatedVariables>(
    INVOICE_UPDATED,
    {
      variables: { invoiceId: invoiceId! },
      skip: !invoiceId || status !== "pending",
      onData: () => check(invoiceId!),
    }
  );

  useSubscription<{ transactionUpdated: boolean }, InvoiceUpdatedVariables>(
    TRANSACTION_UPDATED,
    {
      variables: { invoiceId: invoiceId! },
      skip: !invoiceId || status !== "pending",
      onData: () => check(invoiceId!),
    }
  );

  async function create(input: InvoiceCreateVariables["input"]) {
    setStatus("pending");
    const { data } = await createInvoiceMutation({ variables: { input } });
    const id = data?.invoiceCreate?._id;
    if (id) setInvoiceId(id);
    return data?.invoiceCreate ?? null;
  }

  async function check(id: string) {
    const { data } = await client.mutate<InvoicesCheckData>({
      mutation: INVOICES_CHECK,
      variables: { id },
    });
    if (data?.invoicesCheck) {
      setStatus("paid");
      options.onPaid?.(id);
    } else {
      setStatus("failed");
      options.onFailed?.();
    }
    return data?.invoicesCheck ?? false;
  }

  function reset() {
    setInvoiceId(null);
    setStatus("idle");
  }

  return { create, check, reset, invoiceId, status, creating };
}
