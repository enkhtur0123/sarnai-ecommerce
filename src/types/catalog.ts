export type Localized = { mn: string; en: string };

/** A name/description is either plain text from erxes or a localized sample string. */
export type Text = string | Localized;

export type CatalogCategory = {
  _id: string;
  name: Text;
  imageUrl?: string;
};

export type CatalogProduct = {
  _id: string;
  name: Text;
  description?: Text;
  categoryId?: string;
  categoryName?: Text;
  unitPrice: number;
  /** Pre-discount price, when the product is on sale. */
  oldPrice?: number;
  imageUrl?: string;
  images?: string[];
  rating?: number;
  flash?: boolean;
  isNew?: boolean;
  /** Sample catalog item — shown only until an erxes POS is connected. */
  sample?: boolean;
};

export function textFor(value: Text | undefined, locale: string): string {
  if (!value) return "";
  if (typeof value === "string") return value;
  return locale === "en" ? value.en : value.mn;
}
