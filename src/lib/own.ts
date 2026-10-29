import type { CustomFieldData, Product } from "@/graphql/ecommerce/queries/product";
import { OWN_FIELD_ID, OWN_FIELD_VALUE, OWN_TAG_ID } from "@/lib/constants";

const NO = new Set(["", "false", "0", "no", "үгүй"]);

/** Value of one product property, whether erxes sends a list or a map. */
function fieldValue(data: Product["customFieldsData"], fieldId: string): unknown {
  if (!data) return undefined;
  if (Array.isArray(data)) {
    const item = (data as CustomFieldData[]).find((d) => d?.field === fieldId);
    return item ? (item.value ?? item.stringValue) : undefined;
  }
  return data[fieldId];
}

function matches(value: unknown): boolean {
  const values = (Array.isArray(value) ? value : [value]).map((v) => String(v ?? "").trim().toLowerCase());
  if (OWN_FIELD_VALUE) return values.includes(OWN_FIELD_VALUE);
  return values.some((v) => !NO.has(v));
}

/** True when the product carries the own-products tag or property. */
export function isOwnProduct(p: Pick<Product, "tagIds" | "customFieldsData">): boolean {
  if (OWN_TAG_ID && p.tagIds?.includes(OWN_TAG_ID)) return true;
  if (OWN_FIELD_ID && matches(fieldValue(p.customFieldsData, OWN_FIELD_ID))) return true;
  return false;
}
