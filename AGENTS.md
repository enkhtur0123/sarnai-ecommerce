<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# erxes Web Starter — What's already here

Read this before generating any code. If a file is listed here, **import from it — never recreate it**.

## Apollo client
| File | Export | Use for |
| ---- | ------ | ------- |
| `src/lib/apollo/client.ts` | `getApolloClient()` | Client-side Apollo instance |
| `src/lib/apollo/server-client.ts` | `getServerApolloClient()` | Server components — reads auth token from cookie |
| `src/lib/apollo/provider.tsx` | `ApolloClientProvider` | Wrap root layout |
| `src/lib/apollo/links.ts` | `link` | Auth link + HTTP link (reads token from localStorage) |

## Auth
| File | Export | Use for |
| ---- | ------ | ------- |
| `src/lib/auth/AuthContext.tsx` | `AuthProvider`, `useAuth()` | User session — `user`, `loading`, `login(token)`, `logout()`, `refetch` |
| `src/lib/auth/RequireAuth.tsx` | `RequireAuth` (default) | Wrap any page that requires login — redirects to `/login?next=...` |

Add `<AuthProvider>` inside `<ApolloClientProvider>` in `app/[locale]/layout.tsx` for ecommerce / tour / hotel sites.

## Payment hook
| File | Export | Use for |
| ---- | ------ | ------- |
| `src/lib/hooks/useInvoice.ts` | `useInvoice()` | Create invoice, subscribe to real-time status, verify after redirect |

```tsx
const { create, check, status, invoiceId, creating } = useInvoice({
  onPaid: (id) => router.push(`/booking/verify?invoiceId=${id}`),
  onFailed: () => setError("Payment failed"),
});
// On booking submit:
const invoice = await create({ amount, contentType, contentTypeId, paymentIds, redirectUri });
// On verify page (after payment redirect):
await check(invoiceId);
```

## Common components
| Import path | Use for |
| ----------- | ------- |
| `@/components/common/Image` | **All images** — handles erxes file URLs (`/read-file?key=…`) and fallback. Never use `<img>` or `next/image` directly. |
| `@/components/common/Loader` | Loading states |
| `@/components/common/EmptyState` | Empty list states |
| `@/components/common/Pagination` | Paginated lists |

## i18n
- `src/i18n/routing.ts` — update `locales` and `defaultLocale` from site config. Do not recreate.
- `app/[locale]/layout.tsx` — already wraps in `NextIntlClientProvider` + `ApolloClientProvider`. Update it, don't replace it.

## GraphQL — all operations are pre-written

Import from these — do not redeclare types or operations that already exist here.

| Folder | What's inside |
| ------ | ------------- |
| `src/graphql/auth/` | `CLIENT_PORTAL_CURRENT_USER`, all login / register / logout / password / verify mutations, `CPUser` type |
| `src/graphql/cms/` | Pages, posts, categories, menus, tags, custom post types |
| `src/graphql/ecommerce/` | Products, orders, payment (`INVOICE_CREATE`, `INVOICES_CHECK`, `INVOICE_UPDATED`, `TRANSACTION_UPDATED`), wishlist, reviews |
| `src/graphql/hotel/` | `CP_PMS_ROOMS`, `CP_PMS_CHECK_ROOMS`, `CP_DEALS`, `CP_DEALS_ADD`, `CP_DEALS_EDIT` |
| `src/graphql/tour/` | `CP_BMS_TOURS`, `CP_BMS_TOUR_DETAIL`, `CP_BM_TOURS_GROUP`, categories, itinerary, `CP_BMS_ORDER_ADD/EDIT/REMOVE` |

Hotel and tour payment operations are in `src/graphql/ecommerce/mutations/payment.ts` and `src/graphql/ecommerce/queries/payment.ts`.

---

## What the agent must do

- Update `src/i18n/routing.ts` with correct locales
- Update `src/app/[locale]/layout.tsx` — add `AuthProvider`, update `generateStaticParams`, set metadata
- Generate `messages/<locale>.json` for each language
- Write section components in `src/components/`
- Write pages in `src/app/[locale]/`

## What the agent must NOT do

- Do not recreate any file listed above
- Do not rewrite Apollo setup, auth logic, or payment flow
- Do not use `<img>` or `next/image` — always use `@/components/common/Image`
- Do not redeclare GraphQL operations or types already in `src/graphql/`
