# Paitons Boutique

Production-ready e-commerce website for **Paitons Boutique** — a South African handcrafted faux leather bow shop based in Durban, KZN.

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black?logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?logo=supabase)](https://supabase.com)
[![PayFast](https://img.shields.io/badge/PayFast-ZAR%20Payments-orange)](https://www.payfast.co.za)

---

## Features

- Full product catalog with categories, search, and filtering
- Shopping cart with real-time count updates
- Secure checkout via PayFast (cards, Instant EFT, EFT)
- Customer accounts — registration, login, email verification
- Forgot / reset password (HMAC stateless tokens, no extra DB tables)
- Wishlist
- Order history
- Admin dashboard — product CRUD, order management
- Email notifications — order confirmation, verification, password reset (Resend)
- SEO — per-page metadata, `generateMetadata` on product detail, sitemap, robots
- Rate limiting on all auth endpoints
- Mobile-responsive, fully typed (TypeScript 0 errors)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15.2.4 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS + Shadcn UI + Radix UI |
| Database | Supabase (PostgreSQL) |
| Auth | Custom (httpOnly cookies for admin, localStorage for customers) |
| Payments | PayFast (SHA-256 signed, IPN webhook) |
| Email | Resend |
| Hosting | Vercel |

---

## Project Structure

```
app/
  (pages)/              Customer-facing pages
  admin/                Admin dashboard + login
  api/                  All API routes
    auth/               login, signup, verify-email, forgot-password, reset-password, logout
    cart/               GET, POST, DELETE, PUT
    checkout/           PayFast payment initiation
    payment/notify/     PayFast IPN webhook
    products/           CRUD + images + variants
    orders/             GET, POST
    wishlist/           GET, POST, DELETE
    categories/         GET, POST, PATCH, DELETE
    contact/            POST (sends email via Resend)
    admin/              login, logout
    staff/              CRUD
components/
  header.tsx            Live cart/wishlist counts, auth state, search, mobile menu
  product-card.tsx      Add to cart, wishlist toggle, linked to detail page
  footer.tsx
lib/
  database.ts           Supabase client (anon + admin)
  email.ts              Order confirmation, verification, reset emails
  payfast.ts            PayFast service — signature generation
  rate-limit.ts         In-memory sliding window rate limiter
  tokens.ts             HMAC-SHA256 stateless tokens
  auth.ts               Auth helpers
  rbac.ts               Role-based access control
```

---

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/J4skii/Monica-sBowBoutique.git
cd Monica-sBowBoutique
pnpm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in all values:

```bash
cp .env.example .env.local
```

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `NEXT_PUBLIC_APP_URL` | Yes | Full site URL e.g. `https://paitonsboutique.co.za` |
| `PAYFAST_MERCHANT_ID` | Yes | From PayFast dashboard |
| `PAYFAST_MERCHANT_KEY` | Yes | From PayFast dashboard |
| `PAYFAST_PASSPHRASE` | Yes | Set in PayFast account settings |
| `RESEND_API_KEY` | Yes | From Resend dashboard |

### 3. Database

Run the SQL migration scripts in order against your Supabase project:

```
scripts/01-*.sql
scripts/02-*.sql
scripts/03-add-staff-rbac.sql
scripts/04-add-product-variants.sql
```

### 4. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deployment (Vercel)

1. Push to GitHub
2. Import repo in [Vercel](https://vercel.com)
3. Add all environment variables from the table above
4. Set `NODE_ENV=production` (Vercel does this automatically)
5. Deploy

**PayFast IPN URL** to set in your PayFast dashboard:
```
https://paitonsboutique.co.za/api/payment/notify
```

**Resend** — verify your sender domain (`paitonsboutique.co.za`) in the Resend dashboard before going live.

---

## Admin Access

- URL: `/admin`
- Default admin credentials are set directly in Supabase (`admin_users` table)
- Admin sessions use httpOnly secure cookies — no client-side token exposure

---

## Key Design Decisions

- **No discount codes** — removed entirely from all flows (checkout, cart, email, orders API)
- **Stock management** — pre-validated before order creation, decremented with optimistic lock (`.gte` filter prevents negative stock without a full DB transaction)
- **Stateless password reset** — HMAC-SHA256 tokens encode payload + expiry + password fingerprint (single-use enforcement without a DB table)
- **Lazy Resend init** — `new Resend()` called inside functions, not at module level, to prevent build-time crashes
- **Server/client split for SEO** — pages that use `useSearchParams` are split into a `_content.tsx` client component + a `page.tsx` server component that exports `metadata` / `generateMetadata` and wraps in `<Suspense>`

---

## Documentation

| File | Contents |
|---|---|
| [TECHNICAL_DOCUMENTATION.md](TECHNICAL_DOCUMENTATION.md) | Full technical reference, architecture, API docs |
| [CHANGELOG.md](CHANGELOG.md) | Version history and change log |
| [CLIENT_PRESENTATION_GUIDE.md](CLIENT_PRESENTATION_GUIDE.md) | Non-technical guide for the client |
| [QUICK_START_GUIDE.md](QUICK_START_GUIDE.md) | Quick reference for common tasks |
| [TESTING_GUIDE.md](TESTING_GUIDE.md) | How to test all features |
