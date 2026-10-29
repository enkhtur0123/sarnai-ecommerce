/** Seller (vendor) membership application — shared types and fallback helpers. */

export const MEMBERSHIP_CATEGORIES = [
  "audio",
  "smartHome",
  "accessories",
  "beauty",
  "home",
  "clothing",
  "other",
] as const;

export const MEMBERSHIP_COUNTS = ["a", "b", "c", "d"] as const;

export type MembershipCategory = (typeof MEMBERSHIP_CATEGORIES)[number];
export type MembershipCount = (typeof MEMBERSHIP_COUNTS)[number];

export type MembershipApplication = {
  businessName: string;
  contactName: string;
  phone: string;
  email: string;
  category: MembershipCategory;
  productCount: MembershipCount;
  channels: string;
  description: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Required fields plus format checks shared by the form and the API route. */
export function validateApplication(
  input: Partial<Record<keyof MembershipApplication, unknown>>,
): {
  ok: boolean;
  error?: "required" | "email";
} {
  const required: (keyof MembershipApplication)[] = [
    "businessName",
    "contactName",
    "phone",
    "email",
    "description",
  ];
  for (const key of required) {
    if (!String(input[key] ?? "").trim()) return { ok: false, error: "required" };
  }
  if (!EMAIL_RE.test(String(input.email ?? "").trim())) return { ok: false, error: "email" };
  if (!MEMBERSHIP_CATEGORIES.includes(input.category as MembershipCategory)) {
    return { ok: false, error: "required" };
  }
  if (!MEMBERSHIP_COUNTS.includes(input.productCount as MembershipCount)) {
    return { ok: false, error: "required" };
  }
  return { ok: true };
}

export function isMembershipCategory(value: unknown): value is MembershipCategory {
  return MEMBERSHIP_CATEGORIES.includes(value as MembershipCategory);
}

export function isMembershipCount(value: unknown): value is MembershipCount {
  return MEMBERSHIP_COUNTS.includes(value as MembershipCount);
}

/** Pre-filled email used when the application endpoint is unavailable. */
export function buildApplicationMailto(
  to: string,
  app: MembershipApplication,
  labels: Record<keyof MembershipApplication, string>,
): string {
  const subject = `${labels.businessName}: ${app.businessName}`;
  const lines = (Object.keys(labels) as (keyof MembershipApplication)[]).map(
    (key) => `${labels[key]}: ${app[key]}`,
  );
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
}
