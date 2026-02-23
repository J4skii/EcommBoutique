# Monica's Bow Boutique Architecture

## Overview
This project is an ecommerce store built with Next.js 15 (App Router), Supabase (Postgres + Auth + Storage), Drizzle ORM, and PayFast integration.

## Architecture
- **Framework**: Next.js 15 App Router
- **Database**: Supabase Postgres
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth (Middleware protection for `/admin`)
- **Payment**: PayFast
- **UI**: Shadcn UI + Tailwind CSS

## Directory Structure
- `app/`: Next.js App Router
  - `admin/`: Admin dashboard (protected)
  - `api/`: API routes (webhooks)
  - `cart/`: Cart page
  - `checkout/`: Checkout page
  - `products/`: Product catalog
  - `actions/`: Server Actions
- `lib/`: Utilities
  - `db/`: Database schema and client
  - `commerce.ts`: Data fetching logic
  - `cart.ts`: Cart logic
  - `payfast.ts`: Payment integration
- `components/`: UI components

## Setup
1. Copy `.env.example` to `.env` and fill in credentials.
2. Run migration: `npm run db:push` (if using drizzle-kit with supabase).
3. Start dev server: `npm run dev`.

## Key Files
- `lib/db/schema.ts`: Database schema definition.
- `app/actions/checkout.ts`: Checkout logic and order creation.
- `app/api/payment/notify/route.ts`: PayFast webhook handler.
