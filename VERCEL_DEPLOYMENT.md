# Vercel Deployment Guide for Monica's Bow Boutique

## Prerequisites
- [Vercel account](https://vercel.com) (sign up with GitHub)
- [GitHub repository](https://github.com) with your project pushed

## Step 1: Prepare Your Production Environment

### Update `.env.production` with your real credentials:

1. **PayFast Production** - Get from https://www.payfast.co.za:
   - `PAYFAST_MERCHANT_ID` - Your production merchant ID
   - `PAYFAST_MERCHANT_KEY` - Your production merchant key  
   - `PAYFAST_PASSPHRASE` - Your production passphrase

2. **Stripe Production** - Get from https://dashboard.stripe.com:
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Live publishable key (pk_live_...)
   - `STRIPE_SECRET_KEY` - Live secret key (sk_live_...)
   - `STRIPE_WEBHOOK_SECRET` - Live webhook secret

3. **Site URL**:
   - `NEXT_PUBLIC_SITE_URL` - Your domain (e.g., https://monicasbowboutique.co.za)

4. **Supabase** - Already configured, same as dev

## Step 2: Deploy to Vercel

### Option A: Deploy from GitHub (Recommended)

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. In "Environment Variables", add each variable from `.env.production`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://wvrmboairexupuozcwup.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_HqHByKvnYtEIBeB-SG4p1Q_k_1tG53X
   PAYFAST_MERCHANT_ID=your_production_merchant_id
   PAYFAST_MERCHANT_KEY=your_production_merchant_key
   PAYFAST_PASSPHRASE=your_production_passphrase
   NEXT_PUBLIC_SITE_URL=https://your-domain.co.za
   NEXT_PUBLIC_SITE_NAME=Monica's Bow Boutique
   ```
5. Click "Deploy"

### Option B: Deploy with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

Follow the prompts to add environment variables.

## Step 3: Configure PayFast for Production

1. Log into PayFast merchant dashboard: https://www.payfast.co.za
2. Go to "Settings" → "Integration Settings"
3. Set your production settings:
   - **Merchant ID**: Your production ID
   - **Return URL**: `https://your-domain/payment/success`
   - **Cancel URL**: `https://your-domain/payment/cancel`
   - **Notify URL**: `https://your-domain/api/payment/notify`

## Step 4: Verify Deployment

1. Visit your deployed site
2. Test checkout flow:
   - Add item to cart
   - Go to checkout
   - Select "PayFast" payment
   - Complete payment
3. Check that:
   - Site loads correctly
   - Products display
   - Checkout works
   - Payment processes

## Step 5: Custom Domain (Optional)

If you have a custom domain:

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your domain (e.g., monicasbowboutique.co.za)
3. Update DNS records as instructed by Vercel

## Troubleshooting

### Payment Issues
- Ensure PayFast merchant account is approved for production
- Verify all PayFast credentials match your production account
- Check PayFast dashboard for transaction logs

### Environment Variables Not Loading
- Restart deployment after adding new environment variables
- Check Vercel project settings → Environment Variables

### Build Errors
- Ensure `NEXT_PUBLIC_` prefix is used for client-side variables
- Check build logs in Vercel dashboard

## Support

- Vercel Docs: https://vercel.com/docs
- PayFast Docs: https://www.payfast.co.za/documentation
