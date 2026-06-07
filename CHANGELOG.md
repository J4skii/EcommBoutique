# Changelog

All notable changes to Paitons Boutique are documented here.

---

## [1.1.0] — 2026-06-08

### Production Hardening & Feature Completion

This release completes all critical flows, removes the discount system, hardens the build config, adds proper SEO, and fixes all known production blockers.

---

### 🔴 Critical Fixes

#### Suspense boundaries on `useSearchParams` pages
Next.js 15 requires any component calling `useSearchParams()` to be wrapped in `<Suspense>`. Missing boundaries caused a build-breaking error.

**Files changed:**
- `app/payment/success/page.tsx` — inner component renamed to `PaymentSuccessContent`, Suspense wrapper added
- `app/auth/verify-email/page.tsx` — same pattern
- `app/auth/reset-password/page.tsx` — same pattern
- `app/search/page.tsx` — rewritten as server component; logic moved to `app/search/_search-content.tsx`
- `app/products/page.tsx` — rewritten as server component; logic moved to `app/products/_products-content.tsx`
- `app/products/[id]/page.tsx` — rewritten as server component with `generateMetadata`; logic moved to `app/products/[id]/_product-detail-client.tsx`

#### Stock never decremented on purchase
Orders were created but product `stock_quantity` was never reduced, allowing unlimited overselling.

**File changed:** `app/api/checkout/route.ts`
- Added pre-validation loop: checks `is_active` and `stock_quantity` for every item before creating the order — returns 400 if any item is unavailable or overselling would occur
- Added post-creation decrement loop with optimistic lock (`.gte("stock_quantity", item.quantity)` filter prevents negative stock without a full DB transaction)

#### `next.config.mjs` suppressing build errors
Config had `typescript.ignoreBuildErrors: true`, `eslint.ignoreDuringBuilds: true`, and `images.unoptimized: true` — hiding real errors and disabling image optimisation.

**File changed:** `next.config.mjs`
- Removed all three flags
- Added proper Supabase Storage `remotePatterns` so `next/image` works with Supabase-hosted images

---

### 🟡 Quality & Industry Standard Fixes

#### Per-page SEO metadata

**Files changed:**
- `app/search/page.tsx` — exports `metadata` with search-specific title/description
- `app/products/page.tsx` — exports `metadata` for the collection page
- `app/products/[id]/page.tsx` — exports `generateMetadata` that fetches product name/description/image from Supabase server-side for accurate Open Graph tags on each product

#### Rate limiting on auth endpoints

New file: `lib/rate-limit.ts` — in-memory sliding window rate limiter (Map-based, per-process).

**Files changed:**
- `app/api/auth/login/route.ts` — 10 attempts per IP per 15 minutes
- `app/api/auth/signup/route.ts` — 5 attempts per IP per hour
- `app/api/auth/forgot-password/route.ts` — 3 attempts per IP per hour

Returns `429 Too Many Requests` with `Retry-After` header when limit is exceeded.

#### Email verification on signup

New file: `app/api/auth/verify-email/route.ts`
- GET: verifies HMAC token, marks `email_verified = true` on customer record
- POST: resends verification email

**Files changed:**
- `app/auth/verify-email/page.tsx` — new page, handles both success and error states
- `app/api/auth/signup/route.ts` — sends verification email after account creation

#### Forgot password / reset password flow

New files:
- `lib/tokens.ts` — HMAC-SHA256 stateless tokens; payload includes expiry + password hash fingerprint for single-use enforcement
- `app/api/auth/forgot-password/route.ts` — sends reset link via email; always returns 200 (prevents account enumeration)
- `app/api/auth/reset-password/route.ts` — validates token, checks password fingerprint hasn't changed (single-use), updates password hash, invalidates all sessions
- `app/auth/forgot-password/page.tsx` — email form with success confirmation
- `app/auth/reset-password/page.tsx` — password form with strength indicator and show/hide toggle

---

### Discount system removed entirely

All discount code logic has been removed from every layer.

**Files changed:**
- `app/api/checkout/route.ts` — `discount_code` param removed; `discount_amount` hardcoded to `0`
- `app/api/orders/route.ts` — `discount_code` param, `discount_codes` DB query, and calculation logic removed
- `app/cart/page.tsx` — discount state, `applyDiscount()` function, discount UI section, and unused `Input` import all removed
- `lib/email.ts` — discount row removed from order confirmation email template

---

### Cart item removal now persists to DB

`removeItem` in the cart page was only filtering local state — items reappeared on refresh.

**File changed:** `app/cart/page.tsx`
- `removeItem` now calls `DELETE /api/cart` before updating local state

---

### Contact form returns real errors

The contact API was silently swallowing email failures and always returning 200.

**File changed:** `app/api/contact/route.ts`
- Owner notification email is now awaited directly (no try/catch) — if it fails, the API returns a proper 500 so the user sees an error
- Auto-reply to sender is fire-and-forget (`.catch()` logs the error but doesn't fail the request — best effort)
- `appUrl` now uses a single `const` from `process.env.NEXT_PUBLIC_APP_URL`

---

### New files added

| File | Purpose |
|---|---|
| `lib/rate-limit.ts` | Sliding window rate limiter |
| `lib/tokens.ts` | HMAC-SHA256 stateless tokens |
| `app/api/auth/verify-email/route.ts` | Email verification endpoint |
| `app/api/auth/forgot-password/route.ts` | Password reset request endpoint |
| `app/api/auth/reset-password/route.ts` | Password reset completion endpoint |
| `app/api/admin/logout/route.ts` | Admin logout (clears httpOnly cookie) |
| `app/api/contact/route.ts` | Contact form email endpoint |
| `app/api/products/[id]/route.ts` | Single product GET/PATCH/DELETE |
| `app/api/products/[id]/images/route.ts` | Product image management |
| `app/api/products/[id]/variants/route.ts` | Product variant management |
| `app/api/staff/route.ts` | Staff management (RBAC) |
| `app/auth/forgot-password/page.tsx` | Forgot password page |
| `app/auth/reset-password/page.tsx` | Reset password page |
| `app/auth/verify-email/page.tsx` | Email verification page |
| `app/products/[id]/page.tsx` | Product detail server wrapper |
| `app/products/[id]/_product-detail-client.tsx` | Product detail client component |
| `app/products/_products-content.tsx` | Products listing client component |
| `app/search/_search-content.tsx` | Search results client component |
| `lib/auth.ts` | Auth helpers |
| `lib/rbac.ts` | Role-based access control |
| `lib/supabase-storage.ts` | Supabase Storage helpers |
| `scripts/03-add-staff-rbac.sql` | Staff + RBAC DB migration |
| `scripts/04-add-product-variants.sql` | Product variants DB migration |

---

## [1.0.0] — 2026-02-25

### Initial Complete Implementation

Full e-commerce build covering:

- Product catalog with categories, search, filtering, sorting
- Shopping cart (add, update quantity, remove, clear)
- Checkout with PayFast integration (SHA-256 signed form, IPN webhook)
- Customer auth — register with phone/email, login, localStorage session
- Admin dashboard — product CRUD, order management, httpOnly cookie sessions
- Wishlist
- Order history
- Email notifications via Resend — order confirmation, welcome email
- All static pages — shipping, returns, privacy, terms, about, contact, custom orders
- SEO foundation — `app/layout.tsx` default metadata, sitemap, robots
- PayFast IPN (`/api/payment/notify`) — IP whitelist, signature validation, amount validation, order status update
- `lib/email.ts` — lazy Resend initialisation (inside functions) to prevent build-time crashes
- `lib/payfast.ts` — graceful dev fallback when credentials are absent
