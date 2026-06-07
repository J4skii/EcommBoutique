# Paitons Boutique - Complete Technical Documentation

**Project**: EcommBoutique (Paitons Boutique)  
**Type**: E-commerce Website for Handcrafted Accessories  
**Version**: 1.1.0  
**Date**: June 2026  
**Developer**: [Your Name]  
**Client**: Paitons Boutique

---

## 📑 TABLE OF CONTENTS

1. [Project Overview](#1-project-overview)
2. [Technology Stack](#2-technology-stack)
3. [System Architecture](#3-system-architecture)
4. [Installation & Setup](#4-installation--setup)
5. [Configuration Guide](#5-configuration-guide)
6. [User Management](#6-user-management)
7. [Daily Operations](#7-daily-operations)
8. [Maintenance & Updates](#8-maintenance--updates)
9. [Troubleshooting](#9-troubleshooting)
10. [FAQs](#10-faqs)
11. [Security Checklist](#11-security-checklist)
12. [Backup & Recovery](#12-backup--recovery)
13. [Contact & Support](#13-contact--support)

---

## 1. PROJECT OVERVIEW

### What is This?
Paitons Boutique is a full-featured e-commerce website for selling handcrafted faux leather bows and accessories. Built with modern web technologies for speed, security, and scalability.

### Key Features
- ✅ Customer registration with phone numbers (SA format)
- ✅ Product catalog with categories
- ✅ Shopping cart with real-time updates
- ✅ Secure checkout with PayFast
- ✅ Admin dashboard for inventory management
- ✅ Order tracking and management
- ✅ Mobile-responsive design
- ✅ SEO optimized

### Live URLs
- **Customer Site**: https://paitonsboutique.co.za (production)
- **Admin Panel**: https://paitonsboutique.co.za/admin
- **Development**: http://localhost:3000

---

## 2. TECHNOLOGY STACK

### Frontend (What Customers See)
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React framework | 15.2.4 |
| **React** | UI library | 19.0.0 |
| **TypeScript** | Type safety | 5.0.2 |
| **Tailwind CSS** | Styling | 3.4.17 |
| **Radix UI** | UI components | Latest |
| **Lucide React** | Icons | 0.454.0 |

### Backend (Server & API)
| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js API Routes** | Backend API | 15.2.4 |
| **Supabase** | Database & Auth | Latest |
| **PostgreSQL** | Database | 15+ |
| **Resend** | Email service | 6.0.1 |

### Payment Processing
| Service | Purpose | Region |
|---------|---------|--------|
| **PayFast** | Payment gateway | South Africa |
| **Features** | Cards, EFT, Instant EFT | ZAR only |

### Hosting & Infrastructure
| Service | Purpose | URL |
|---------|---------|-----|
| **Vercel** | Frontend hosting | https://vercel.com |
| **Supabase** | Database hosting | https://supabase.com |
| **GitHub** | Code repository | https://github.com/J4skii/EcommBoutique |

### Development Tools
| Tool | Purpose |
|------|---------|
| **Git** | Version control |
| **pnpm** | Package manager |
| **VS Code** | Code editor |
| **Chrome DevTools** | Debugging |

---

## 3. SYSTEM ARCHITECTURE

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
│  (Customer visits website on phone/computer)                │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                      VERCEL (HOSTING)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              NEXT.JS APPLICATION                      │   │
│  │  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │   │
│  │  │   Pages      │  │   API Routes │  │  Static   │  │   │
│  │  │  (Frontend)  │  │  (Backend)   │  │   Files   │  │   │
│  │  └──────────────┘  └──────────────┘  └───────────┘  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL/API Calls
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    SUPABASE (DATABASE)                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              POSTGRESQL DATABASE                      │   │
│  │  • products         • orders         • customers    │   │
│  │  • categories       • cart_items     • admin_users  │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │ Webhook
                       ▼
┌─────────────────────────────────────────────────────────────┐
│                    PAYFAST (PAYMENTS)                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Payment Processing (South Africa)            │   │
│  │  • Credit Cards  • Instant EFT  • Manual EFT       │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 4. INSTALLATION & SETUP

### Prerequisites
Before starting, ensure you have:
- [ ] Node.js 18+ installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Git installed
- [ ] VS Code (recommended)
- [ ] Supabase account
- [ ] PayFast account
- [ ] Resend account (optional, for emails)

### Step-by-Step Setup

#### Step 1: Clone Repository
```bash
git clone https://github.com/J4skii/EcommBoutique.git
cd EcommBoutique
```

#### Step 2: Install Dependencies
```bash
pnpm install
```

#### Step 3: Create Environment File
Create `.env.local` in project root:

```bash
# Copy template
copy .env.example .env.local

# Edit with your credentials
notepad .env.local
```

#### Step 4: Configure Environment Variables
Fill in these values in `.env.local`:

```env
# ========================================
# SUPABASE CONFIGURATION
# ========================================
# Get from: https://app.supabase.com/project/_/settings/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# ========================================
# PAYFAST CONFIGURATION (South Africa)
# ========================================
# Get from: https://www.payfast.co.za
PAYFAST_MERCHANT_ID=your-merchant-id
PAYFAST_MERCHANT_KEY=your-merchant-key
PAYFAST_PASSPHRASE=your-passphrase

# ========================================
# EMAIL CONFIGURATION (Optional)
# ========================================
# Get from: https://resend.com
RESEND_API_KEY=your-resend-key

# ========================================
# APPLICATION CONFIGURATION
# ========================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
# For production: https://paitonsboutique.co.za
```

#### Step 5: Setup Database
1. Go to https://app.supabase.com
2. Open your project
3. Go to SQL Editor
4. Run: `scripts/setup-database.sql`
5. Verify tables created successfully

#### Step 6: Start Development Server
```bash
pnpm run dev
```

#### Step 7: Verify Installation
Open browser to http://localhost:3000 and check:
- [ ] Homepage loads
- [ ] Products display
- [ ] Can add to cart
- [ ] Admin login works

---

## 5. CONFIGURATION GUIDE

### 5.1 PayFast Configuration

#### Sandbox Mode (Testing)
```env
# Use PayFast sandbox credentials
PAYFAST_MERCHANT_ID=10000100
PAYFAST_MERCHANT_KEY=46f0cd694581a
PAYFAST_PASSPHRASE=YOUR_PASSPHRASE
```

#### Production Mode (Live)
```env
# Use real PayFast credentials
PAYFAST_MERCHANT_ID=your-real-merchant-id
PAYFAST_MERCHANT_KEY=your-real-merchant-key
PAYFAST_PASSPHRASE=your-real-passphrase
```

**Important**: Update URLs in PayFast dashboard:
- Return URL: `https://paitonsboutique.co.za/payment/success`
- Cancel URL: `https://paitonsboutique.co.za/payment/cancel`
- Notify URL: `https://paitonsboutique.co.za/api/payment/notify`

### 5.2 Supabase Configuration

#### Row Level Security (RLS) Policies
Already configured in setup script. Key policies:
- Products: Public read, Admin write
- Categories: Public read active only, Admin full access
- Orders: Customer sees own, Admin sees all

#### Database Triggers
No custom triggers needed - application handles data integrity.

### 5.3 Email Configuration (Optional)

For order confirmations and notifications:
1. Sign up at https://resend.com
2. Verify your domain
3. Add API key to `.env.local`
4. Test email sending

---

## 6. USER MANAGEMENT

### 6.1 Admin Account

#### Default Admin Credentials
```
Email: admin@paitonsboutique.co.za
Password: admin123
```

#### Creating Additional Admins
Run in Supabase SQL Editor:
```sql
INSERT INTO admin_users (email, password_hash, first_name, last_name)
VALUES (
  'newadmin@email.com',
  'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
  'FirstName',
  'LastName'
);
```

**Password Hash Generation**:
```javascript
// SHA-256 hash of "admin123"
const crypto = require('crypto');
const hash = crypto.createHash('sha256').update('admin123').digest('hex');
```

#### Admin Capabilities
- View dashboard statistics
- Add/Edit/Delete products
- Manage categories
- View all orders
- Update order status
- Manage inventory

### 6.2 Customer Accounts

#### Registration Process
1. Customer visits `/auth/signup`
2. Enters:
   - First & Last Name
   - Phone Number (required, SA format)
   - Email (optional)
   - Password
3. Account created immediately
4. Can login with phone OR email

#### Customer Login Methods
- **Phone Number**: 082 123 4567 (auto-converts to 27821234567)
- **Email**: customer@example.com
- **Password**: Same for both methods

#### Phone Number Formatting
- Input: `082 123 4567` or `+27 82 123 4567`
- Stored: `27821234567`
- Displayed: `082 123 4567`

### 6.3 Test Accounts

#### Test Customer
```
Phone: 082 123 4567
Email: test@example.com
Password: test123
Name: Test User
```

#### Test Admin
```
Email: admin@paitonsboutique.co.za
Password: admin123
Name: Paiton Admin
```

---

## 7. DAILY OPERATIONS

### 7.1 Managing Products

#### Adding a New Product
1. Login to admin: `/admin`
2. Click "Add Product" tab
3. Fill in:
   - **Name**: Product name
   - **Price**: Amount in Rands
   - **Stock**: Quantity available
   - **Category**: Select from dropdown
   - **Description**: Product details
   - **Image URL**: Link to product photo
4. Click "Add Product"

#### Editing a Product
1. Go to "Products" tab
2. Find product in list
3. Click edit icon (✏️)
4. Update fields
5. Save changes

#### Managing Stock
- Update stock quantity in product edit form
- Set stock to 0 for "Sold Out"
- System prevents overselling

### 7.2 Managing Categories

#### Creating a Category
1. Go to "Categories" tab
2. Enter category name
3. Add description (optional)
4. Click "Create Category"
5. Auto-generates URL slug

#### Example Categories
- Hair Bows
- Accessories
- Gift Sets
- Wedding Collection
- Custom Orders

#### Editing/Deleting Categories
- **Edit**: Click ✏️ icon, change name
- **Deactivate**: Click ✓ to toggle off (hides from customers)
- **Delete**: Click 🗑️ (only if no products assigned)

### 7.3 Processing Orders

#### Viewing Orders
1. Admin Dashboard → "Orders" tab
2. See list of all orders
3. Filter by status if needed

#### Order Statuses
| Status | Meaning | Action |
|--------|---------|--------|
| **Pending** | Order placed, awaiting payment | Monitor payment |
| **Confirmed** | Payment received | Prepare order |
| **Processing** | Being crafted | Work in progress |
| **Shipped** | Sent to customer | Provide tracking |
| **Delivered** | Customer received | Complete |
| **Cancelled** | Order cancelled | Refund if paid |

#### Updating Order Status
(Currently requires direct database update - feature to be added)
```sql
UPDATE orders SET status = 'shipped' WHERE order_number = 'PAI-123456';
```

### 7.4 Discount Codes

#### Existing Codes
| Code | Discount | Minimum Order |
|------|----------|---------------|
| PAITON20 | 20% off | R100 |
| WELCOME10 | 10% off | None |
| FREESHIP300 | Free shipping | R300 |

#### Creating New Codes
Run in Supabase SQL Editor:
```sql
INSERT INTO discount_codes (code, description, type, value, minimum_order_amount, usage_limit, valid_until, is_active)
VALUES (
  'SUMMER25',
  'Summer Sale 25% off',
  'percentage',
  25.00,
  150.00,
  50,
  NOW() + INTERVAL '2 months',
  true
);
```

---

## 8. MAINTENANCE & UPDATES

### 8.1 Regular Maintenance (Weekly)

#### Check These Items:
- [ ] Review low stock products
- [ ] Check for failed payments
- [ ] Verify email notifications working
- [ ] Review customer feedback
- [ ] Check website loading speed

#### Low Stock Alert
In admin dashboard, "Low Stock" card shows items with < 5 units.

### 8.2 Monthly Maintenance

#### Database Cleanup
```sql
-- Archive old cancelled orders (older than 1 year)
-- Review and optimize product images
-- Check for unused discount codes
```

#### Security Updates
1. Check for npm package updates:
   ```bash
   pnpm outdated
   ```
2. Update packages:
   ```bash
   pnpm update
   ```
3. Test thoroughly after updates

### 8.3 Updating Website Content

#### Changing Text/Content
1. Edit files in `app/` folder
2. Common files:
   - `app/about/page.tsx` - About page
   - `app/contact/page.tsx` - Contact page
   - `components/footer.tsx` - Footer content
3. Save and commit changes

#### Updating Images
1. Upload to Supabase Storage
2. Get public URL
3. Update product in admin

### 8.4 Adding New Features

#### Safe Development Workflow
1. Create new branch: `git checkout -b feature-name`
2. Make changes
3. Test locally
4. Commit: `git commit -m "Add feature"`
5. Push: `git push origin feature-name`
6. Create Pull Request on GitHub
7. Merge after review

---

## 9. TROUBLESHOOTING

### 9.1 Common Issues & Solutions

#### Issue: "npm/pnpm not found"
**Solution**:
```bash
# Install pnpm globally
npm install -g pnpm

# Verify
pnpm --version
```

#### Issue: "Cannot connect to Supabase"
**Symptoms**: Products don't load, login fails
**Solution**:
1. Check `.env.local` has correct credentials
2. Verify Supabase project is active
3. Check internet connection
4. Try: `ping your-project.supabase.co`

#### Issue: "PayFast payment not working"
**Symptoms**: Checkout fails, payment doesn't process
**Solution**:
1. Verify PayFast credentials in `.env.local`
2. Check passphrase matches PayFast dashboard
3. Ensure URLs are correct in PayFast settings
4. Check browser console for errors

#### Issue: "Images not showing"
**Solution**:
1. Check image URL is valid
2. Ensure images uploaded to Supabase Storage
3. Check browser DevTools → Network tab
4. Verify no CORS issues

#### Issue: "Cart not saving items"
**Symptoms**: Add to cart but cart is empty
**Solution**:
1. Check browser localStorage (F12 → Application → Local Storage)
2. Should have `customer_id` set
3. Check Supabase `cart_items` table
4. Verify no ad-blockers blocking API calls

#### Issue: "Admin login not working"
**Symptoms**: Can't access /admin
**Solution**:
1. Check cookies enabled in browser
2. Verify admin user exists in database
3. Try incognito mode
4. Check middleware.ts is correct

### 9.2 Error Messages

#### "Invalid credentials"
- Wrong password or email/phone
- Account doesn't exist
- Caps lock on

#### "Failed to fetch"
- No internet connection
- API server down
- CORS error

#### "Product not found"
- Product ID incorrect
- Product deleted
- Database connection issue

### 9.3 Performance Issues

#### Slow Loading
1. Check image sizes (should be < 500KB)
2. Enable Next.js image optimization
3. Use CDN for static assets
4. Check database query performance

#### High Database Usage
1. Add indexes to frequently queried columns
2. Archive old data
3. Optimize queries
4. Consider database upgrade

---

## 10. FAQs

### General Questions

**Q: What happens if I forget my admin password?**  
A: Run this SQL to reset:
```sql
UPDATE admin_users 
SET password_hash = 'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f'
WHERE email = 'admin@paitonsboutique.co.za';
```
This sets password back to "admin123".

**Q: Can I change the website colors?**  
A: Yes! Edit `tailwind.config.ts` for theme colors. Main colors are defined as:
- Primary (Pink): `pink-500`, `pink-600`
- Secondary (Purple): `purple-600`

**Q: How do I add more payment methods?**  
A: Currently supports PayFast. To add others:
1. Create new payment provider file in `lib/`
2. Add API route in `app/api/payment/`
3. Update checkout form
4. Consider Stripe, Yoco, or PayPal

**Q: Can customers pay on delivery?**  
A: Currently not supported. Only online payments via PayFast. Cash on delivery can be added as a feature.

### Technical Questions

**Q: How is customer data stored?**  
A: All data in PostgreSQL database via Supabase:
- Passwords: SHA-256 hashed (not plaintext)
- Phone numbers: Encrypted at rest
- Payment info: NOT stored (handled by PayFast)

**Q: Is the website mobile-friendly?**  
A: Yes! Fully responsive design works on:
- Desktop computers
- Tablets
- Mobile phones
- All modern browsers

**Q: What happens if server goes down?**  
A: Vercel provides 99.9% uptime. If issues:
1. Check https://status.vercel.com
2. Check https://status.supabase.com
3. Contact support

**Q: Can I export order data?**  
A: Yes, via Supabase dashboard:
1. Go to Table Editor
2. Select "orders" table
3. Click "Export" button
4. Choose format (CSV, JSON)

### Business Questions

**Q: How do I add shipping costs?**  
A: Currently fixed at R50 (free over R300). To modify:
1. Edit `app/api/checkout/route.ts`
2. Find `shipping_cost` calculation
3. Update logic as needed

**Q: Can I sell internationally?**  
A: Currently set up for South Africa only. For international:
1. Add multi-currency support
2. Change payment processor (Stripe supports global)
3. Add shipping rate calculator
4. Update tax handling

**Q: How do I handle returns?**  
A: Process is manual currently:
1. Customer contacts via email/phone
2. You verify order
3. Arrange return
4. Update order status to "refunded"
5. Process refund via PayFast

---

## 11. SECURITY CHECKLIST

### ✅ Essential Security Measures

- [ ] **Environment variables** not committed to Git
- [ ] `.env.local` in `.gitignore`
- [ ] **Admin password** strong and changed from default
- [ ] **Supabase RLS policies** enabled
- [ ] **PayFast passphrase** set and secure
- [ ] **HTTPS** enabled on production
- [ ] **CORS** configured properly
- [ ] **Input validation** on all forms
- [ ] **Rate limiting** on API routes (to be added)
- [ ] **Regular backups** scheduled

### 🔒 Password Requirements

**Admin Passwords**:
- Minimum 8 characters
- Mix of letters, numbers, symbols
- Changed every 90 days

**Customer Passwords**:
- Minimum 6 characters
- Stored as SHA-256 hash

### 🛡️ Security Best Practices

1. **Never share admin credentials**
2. **Use strong, unique passwords**
3. **Enable 2FA on Supabase account**
4. **Enable 2FA on PayFast account**
5. **Monitor login attempts**
6. **Keep software updated**
7. **Regular security audits**

---

## 12. BACKUP & RECOVERY

### 12.1 Database Backups

#### Automatic Backups (Supabase)
- Daily backups included
- 7-day retention on free tier
- Point-in-time recovery available

#### Manual Backup
1. Go to Supabase Dashboard
2. Database → Backups
3. Click "Create Backup"

#### Export Data
```bash
# Using Supabase CLI
supabase db dump -f backup.sql
```

### 12.2 Code Backups

#### GitHub Repository
- All code on GitHub
- Version history maintained
- Can revert to any previous commit

#### Local Backup
```bash
# Create zip of entire project
zip -r backup-ecommboutique.zip EcommBoutique/
```

### 12.3 Recovery Procedures

#### Database Restore
1. Go to Supabase Dashboard
2. Database → Backups
3. Select backup to restore
4. Confirm restoration

#### Complete Site Recovery
1. Clone repository: `git clone https://github.com/J4skii/EcommBoutique.git`
2. Install dependencies: `pnpm install`
3. Setup environment variables
4. Restore database from backup
5. Deploy to Vercel

### 12.4 Disaster Recovery Plan

**Scenario 1: Database Corruption**
1. Stop application (maintenance mode)
2. Restore from latest backup
3. Verify data integrity
4. Restart application
5. Notify customers if needed

**Scenario 2: Complete Data Loss**
1. Use GitHub code repository
2. Restore database from Supabase backups
3. Reconfigure environment variables
4. Redeploy application
5. Test all functionality

**Recovery Time Objective (RTO)**: 2 hours  
**Recovery Point Objective (RPO)**: 24 hours (daily backups)

---

## 13. CONTACT & SUPPORT

### Technical Support

**Developer**: [Your Name]  
**Email**: [your-email@example.com]  
**Phone**: [Your Phone]

### Service Providers

| Service | Support URL | Phone |
|---------|-------------|-------|
| **Vercel** | https://vercel.com/help | - |
| **Supabase** | https://supabase.com/support | - |
| **PayFast** | https://support.payfast.co.za | - |
| **Resend** | https://resend.com/support | - |

### Emergency Contacts

**Critical Issues** (site down, payment failure):
1. Check status pages first
2. Contact developer immediately
3. Post on support channels

### Documentation Resources

- **Next.js Docs**: https://nextjs.org/docs
- **Supabase Docs**: https://supabase.com/docs
- **PayFast Docs**: https://developers.payfast.co.za
- **Tailwind CSS**: https://tailwindcss.com/docs
- **React Docs**: https://react.dev

---

## 📎 APPENDICES

### A. File Structure

```
EcommBoutique/
├── app/                    # Next.js application
│   ├── api/               # API routes
│   │   ├── auth/         # Authentication
│   │   ├── categories/   # Category CRUD
│   │   ├── checkout/     # Order & payment
│   │   └── ...
│   ├── auth/             # Login/signup pages
│   ├── admin/            # Admin dashboard
│   ├── payment/          # Success/cancel pages
│   └── ...               # Other pages
├── components/           # React components
│   ├── ui/              # UI primitives
│   └── ...              # Feature components
├── lib/                  # Utilities
│   ├── database.ts      # Supabase client
│   ├── payfast.ts       # Payment processing
│   └── email.ts         # Email service
├── scripts/             # Database scripts
├── public/              # Static assets
├── .env.local           # Environment variables
├── package.json         # Dependencies
└── README.md            # Basic info
```

### B. API Endpoints Reference

| Endpoint | Method | Purpose | Auth |
|----------|--------|---------|------|
| `/api/auth/login` | POST | Customer login | No |
| `/api/auth/signup` | POST | Customer registration + sends verification email | No |
| `/api/auth/verify-email` | GET | Verify email token | No |
| `/api/auth/verify-email` | POST | Resend verification email | No |
| `/api/auth/forgot-password` | POST | Send reset link (always 200) | No |
| `/api/auth/reset-password` | POST | Set new password via HMAC token | No |
| `/api/categories` | GET | List categories | No |
| `/api/categories` | POST | Create category | Admin |
| `/api/products` | GET | List products (supports `?search=`, `?category=`) | No |
| `/api/products` | POST | Create product | Admin |
| `/api/products/[id]` | GET | Single product with images | No |
| `/api/products/[id]` | PATCH | Update product | Admin |
| `/api/products/[id]` | DELETE | Soft-delete product | Admin |
| `/api/products/[id]/images` | GET/POST | Product image management | Admin |
| `/api/products/[id]/variants` | GET/POST | Product variant management | Admin |
| `/api/cart` | GET | Fetch cart by `customer_id` | Customer |
| `/api/cart` | POST | Add/upsert cart item | Customer |
| `/api/cart` | DELETE | Remove single item | Customer |
| `/api/cart` | PUT | Clear entire cart | Customer |
| `/api/wishlist` | GET | Fetch wishlist | Customer |
| `/api/wishlist` | POST | Add to wishlist | Customer |
| `/api/wishlist` | DELETE | Remove from wishlist | Customer |
| `/api/checkout` | POST | Validate stock, create order, return PayFast form | Customer |
| `/api/orders` | GET | List orders | Admin/Customer |
| `/api/contact` | POST | Send contact email via Resend | No |
| `/api/admin/login` | POST | Admin login (sets httpOnly cookie) | No |
| `/api/admin/logout` | POST | Admin logout (clears cookie) | Admin |
| `/api/payment/notify` | POST | PayFast IPN webhook | PayFast IPs |
| `/api/staff` | GET/POST | Staff management | Admin |
| `/api/staff/[id]` | PATCH/DELETE | Update/remove staff | Admin |

### C. Database Schema

See `scripts/setup-database.sql` for complete schema.

Key tables:
- `customers` - User accounts
- `products` - Inventory
- `categories` - Product categories
- `orders` - Customer orders
- `order_items` - Order line items
- `cart_items` - Shopping cart
- `admin_users` - Admin accounts

### D. Environment Variables Template

See `.env.example` in project root.

---

## 14. V1.1 TECHNICAL NOTES (June 2026)

This section documents the architecture decisions and implementation details added in version 1.1.

### 14.1 Server / Client Component Split (SEO + Suspense)

Next.js 15 requires `useSearchParams()` to be inside a `<Suspense>` boundary, and pages that export `metadata` / `generateMetadata` cannot be client components.

**Pattern used across three pages:**

```
app/products/page.tsx            ← Server component: exports metadata, wraps in <Suspense>
app/products/_products-content.tsx  ← "use client": all state, hooks, API calls

app/search/page.tsx              ← Server component: exports metadata, wraps in <Suspense>
app/search/_search-content.tsx   ← "use client": all state, hooks, API calls

app/products/[id]/page.tsx       ← Server component: generateMetadata fetches product server-side
app/products/[id]/_product-detail-client.tsx  ← "use client": all interactivity
```

`generateMetadata` in the product detail page makes a direct Supabase query (using the anon client with the public key) to get product name, description, and image for real Open Graph tags.

### 14.2 HMAC Stateless Tokens (`lib/tokens.ts`)

Used for email verification and password reset — no extra DB tables needed.

**Token format:** `base64url(payload).hmac_signature`

**Payload fields:**
- `exp` — Unix timestamp expiry
- For password reset: `pwdFingerprint` — first 8 chars of the current bcrypt hash

**Single-use enforcement:** The `pwdFingerprint` in the reset token is compared against the current hash at verification time. Once the password is changed, the fingerprint no longer matches and the token is invalid. No token blacklist table needed.

### 14.3 Rate Limiting (`lib/rate-limit.ts`)

Sliding window implementation using an in-memory `Map`. Suitable for single-instance boutique deployments on Vercel (serverless functions are single-process per region).

**Limits:**
- Login: 10 attempts / IP / 15 minutes
- Signup: 5 attempts / IP / hour
- Forgot password: 3 attempts / IP / hour

Returns `429 Too Many Requests` with `X-RateLimit-Reset` and `Retry-After` headers.

> Note: For multi-region or high-traffic deployments, replace with a Redis-backed solution (e.g. Upstash).

### 14.4 Stock Management (`app/api/checkout/route.ts`)

Two-phase approach without a full DB transaction:

**Phase 1 — Pre-validation (before order creation):**
```
for each item:
  fetch product { name, stock_quantity, is_active }
  if !is_active → return 400 "Product unavailable"
  if stock_quantity < item.quantity → return 400 "Insufficient stock"
```

**Phase 2 — Decrement (after order items inserted):**
```
for each item:
  fetch current stock_quantity
  update stock_quantity = max(0, current - item.quantity)
    WHERE stock_quantity >= item.quantity   ← optimistic lock
```

The `.gte` filter is the optimistic lock — if another request depleted stock between Phase 1 and Phase 2, the update silently no-ops rather than going negative. For a high-concurrency scenario, a Supabase RPC with `BEGIN/COMMIT` would be stronger.

### 14.5 Contact Form Error Handling (`app/api/contact/route.ts`)

**Owner notification** — `await`ed directly. If Resend fails, the error propagates to the outer try/catch and the API returns `500` — the user sees an error message.

**Auto-reply to sender** — fire-and-forget via `.catch()`. If it fails, the error is logged server-side but the user still sees success (they already got the owner's notification; not receiving a copy of their own message is non-critical).

### 14.6 Discount System Removed

Discount codes have been removed from every layer. `discount_amount` is hardcoded to `0` in the checkout and orders APIs and the column is kept in the DB schema for historical order records — it will always be `0` for new orders.

If discounts are needed in a future version, the correct approach would be a proper `discount_codes` table with usage tracking, applied server-side only (never trust client-sent discount amounts).

---

## 📝 DOCUMENT VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.1.0 | Jun 2026 | Auth flows (verify email, forgot/reset password), rate limiting, SEO metadata, Suspense fixes, stock management, discount removal, contact form error handling |
| 1.0.0 | Feb 2026 | Initial complete documentation |

---

**END OF DOCUMENTATION**

For updates and changes, refer to GitHub repository:
https://github.com/J4skii/EcommBoutique

© 2026 Paitons Boutique. All rights reserved.
