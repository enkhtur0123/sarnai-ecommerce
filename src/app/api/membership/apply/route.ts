import { NextResponse } from "next/server";
import { validateApplication } from "@/lib/membership";

/**
 * Stores a seller membership application in erxes CMS as a draft post of the
 * `membership-application` type. Applications are reviewed in the CMS admin.
 * The erxes token stays on the server — the browser never receives write access.
 */
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const POST_ADD = `
  mutation CpCmsPostsAdd($input: PostInput!) {
    cpCmsPostsAdd(input: $input) {
      _id
      title
      slug
    }
  }
`;

function str(value: unknown, max = 2000): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "required" }, { status: 400 });
  }

  // Honeypot — real users never fill the hidden "website" field.
  if (str(payload.website)) return NextResponse.json({ ok: true });

  const app = {
    businessName: str(payload.businessName, 120),
    contactName: str(payload.contactName, 120),
    phone: str(payload.phone, 40),
    email: str(payload.email, 160),
    category: str(payload.category, 40),
    productCount: str(payload.productCount, 10),
    channels: str(payload.channels, 500),
    description: str(payload.description, 4000),
  };

  const check = validateApplication(app);
  if (!check.ok) {
    return NextResponse.json({ ok: false, error: check.error }, { status: 400 });
  }

  const endpoint = process.env.ERXES_ENDPOINT ?? process.env.NEXT_PUBLIC_ERXES_ENDPOINT ?? "";
  const token = process.env.ERXES_APP_TOKEN ?? process.env.NEXT_PUBLIC_ERXES_CP_TOKEN ?? "";
  if (!endpoint || !token) {
    return NextResponse.json({ ok: false, error: "not_configured" }, { status: 503 });
  }

  const createdAt = new Date().toISOString();
  const rows: [string, string][] = [
    ["Business", app.businessName],
    ["Contact", app.contactName],
    ["Phone", app.phone],
    ["Email", app.email],
    ["Category", app.category],
    ["Products", app.productCount],
    ["Channels", app.channels || "—"],
    ["Description", app.description],
    ["Submitted", createdAt],
  ];
  const content = `<h2>Seller membership application</h2><ul>${rows
    .map(([label, value]) => `<li><b>${escapeHtml(label)}:</b> ${escapeHtml(value)}</li>`)
    .join("")}</ul>`;

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-app-token": token },
      body: JSON.stringify({
        query: POST_ADD,
        variables: {
          input: {
            title: `[Membership] ${app.businessName}`,
            slug: `membership-${Date.now().toString(36)}`,
            type: "membership-application",
            status: "draft",
            excerpt: `${app.contactName} · ${app.phone} · ${app.email}`,
            content,
            customFieldsData: { ...app, submittedAt: createdAt },
          },
        },
      }),
      cache: "no-store",
    });

    const result = (await response.json()) as {
      data?: { cpCmsPostsAdd?: { _id?: string } };
      errors?: { message?: string }[];
    };

    if (!response.ok || !result.data?.cpCmsPostsAdd?._id) {
      console.error("[membership] erxes rejected the application", result.errors?.[0]?.message);
      return NextResponse.json({ ok: false, error: "failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[membership] application request failed", error instanceof Error ? error.message : "network");
    return NextResponse.json({ ok: false, error: "failed" }, { status: 502 });
  }
}
