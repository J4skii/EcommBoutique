# Quick Start Guide - Get Your Store Live in 4 Days

## Day 1: Environment Setup & Database

### Step 1: Create Environment File
Create `.env.local` in your project root:

```bash
# Supabase (Get from https://app.supabase.com)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# PayFast (Get from https://payfast.co.za)
PAYFAST_MERCHANT_ID=your-merchant-id
PAYFAST_MERCHANT_KEY=your-merchant-key
PAYFAST_PASSPHRASE=your-passphrase

# Email (Get from https://resend.com)
RESEND_API_KEY=your-resend-key

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 2: Set Up Supabase Tables
Run these SQL commands in Supabase SQL Editor:

```sql
-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

-- Products RLS
CREATE POLICY "Allow public read" ON products FOR SELECT USING (true);
CREATE POLICY "Allow admin all" ON products FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));

-- Orders RLS  
CREATE POLICY "Allow customers read own" ON orders FOR SELECT USING (customer_email = auth.email());
CREATE POLICY "Allow admin all" ON orders FOR ALL USING (auth.uid() IN (SELECT id FROM admin_users));
```

### Step 3: Install Dependencies
```bash
npm install
```

### Step 4: Start Development Server
```bash
npm run dev
```

---

## Day 2: Connect Real Data

### Update Products Page
Replace `app/products/page.tsx` mock data with real API call:

```typescript
// Add at top of file
import { useEffect, useState } from "react"

// Replace mock data with:
const [products, setProducts] = useState([])
const [loading, setLoading] = useState(true)

useEffect(() => {
  fetch("/api/products")
    .then(res => res.json())
    .then(data => {
      setProducts(data.products)
      setLoading(false)
    })
}, [])
```

### Update Product Card
Replace mock add to cart with real API call in `components/product-card.tsx`:

```typescript
const handleAddToCart = async () => {
  setIsAddingToCart(true)
  try {
    const response = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        product_id: product.id,
        quantity: 1,
        selected_color: product.colors?.[0],
        selected_size: product.sizes?.[0],
        customer_id: "temp-customer-id" // Replace with actual customer ID
      })
    })
    if (response.ok) {
      alert("Added to cart!")
    }
  } catch (error) {
    console.error("Failed to add to cart:", error)
  } finally {
    setIsAddingToCart(false)
  }
}
```

### Update Cart Page
Replace mock cart items with real data in `app/cart/page.tsx`:

```typescript
const [cartItems, setCartItems] = useState([])

useEffect(() => {
  const customerId = "temp-customer-id" // Get from auth
  fetch(`/api/cart?customer_id=${customerId}`)
    .then(res => res.json())
    .then(data => setCartItems(data.cartItems || []))
}, [])
```

---

## Day 3: Fix Checkout

### Create Checkout API Route
Create `app/api/checkout/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/database"
import { payfast } from "@/lib/payfast"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { customer_email, items, shipping_address, billing_address } = body

    // Calculate totals
    let subtotal = 0
    for (const item of items) {
      subtotal += item.price * item.quantity
    }
    const shipping_cost = subtotal >= 300 ? 0 : 50
    const total_amount = subtotal + shipping_cost

    // Create order
    const orderNumber = `PAI-${Date.now()}`
    const { data: order, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        customer_email,
        subtotal,
        shipping_cost,
        total_amount,
        shipping_address,
        billing_address,
        status: "pending",
        payment_status: "pending"
      })
      .select()
      .single()

    if (error) throw error

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.name,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }))

    await supabase.from("order_items").insert(orderItems)

    // Create PayFast payment
    const paymentData = payfast.createPaymentData({
      orderId: orderNumber,
      customerName: shipping_address.first_name + " " + shipping_address.last_name,
      customerEmail: customer_email,
      amount: total_amount,
      description: `Order ${orderNumber}`
    })

    return NextResponse.json({
      order,
      paymentUrl: payfast.getPaymentUrl(),
      paymentData
    })

  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 })
  }
}
```

### Update Checkout Page Form
In `app/checkout/page.tsx`, replace the handleSubmit:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()
  setIsProcessing(true)

  try {
    const formData = new FormData(e.target as HTMLFormElement)
    
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customer_email: formData.get("email"),
        items: cartItems,
        shipping_address: {
          first_name: formData.get("firstName"),
          last_name: formData.get("lastName"),
          address: formData.get("address1"),
          city: formData.get("city"),
          province: formData.get("province"),
          postal_code: formData.get("postal")
        },
        billing_address: sameAsShipping ? undefined : {
          // billing address fields
        }
      })
    })

    const data = await response.json()
    
    if (data.paymentUrl && data.paymentData) {
      // Create and submit PayFast form
      const form = document.createElement("form")
      form.method = "POST"
      form.action = data.paymentUrl
      
      Object.entries(data.paymentData).forEach(([key, value]) => {
        const input = document.createElement("input")
        input.type = "hidden"
        input.name = key
        input.value = value as string
        form.appendChild(input)
      })
      
      document.body.appendChild(form)
      form.submit()
    }
  } catch (error) {
    alert("Checkout failed. Please try again.")
  } finally {
    setIsProcessing(false)
  }
}
```

---

## Day 4: Admin & Polish

### Create Admin Login API
Create `app/api/admin/login/route.ts`:

```typescript
import { NextRequest, NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/database"
import crypto from "crypto"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Get admin user
    const { data: admin } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .single()

    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Verify password (you should use bcrypt in production)
    const hashedPassword = crypto.createHash("sha256").update(password).digest("hex")
    
    if (hashedPassword !== admin.password_hash) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex")

    return NextResponse.json({ token })

  } catch (error) {
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
```

### Update Admin Dashboard
Replace mock data in `app/admin/page.tsx`:

```typescript
const [products, setProducts] = useState([])
const [orders, setOrders] = useState([])
const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, revenue: 0 })

useEffect(() => {
  // Fetch real data
  Promise.all([
    fetch("/api/products").then(r => r.json()),
    fetch("/api/orders").then(r => r.json())
  ]).then(([productsData, ordersData]) => {
    setProducts(productsData.products)
    setOrders(ordersData.orders)
    setStats({
      totalProducts: productsData.products.length,
      totalOrders: ordersData.orders.length,
      revenue: ordersData.orders.reduce((sum, o) => sum + o.total_amount, 0)
    })
  })
}, [])
```

---

## Testing Checklist

### Local Testing
- [ ] Products load from database
- [ ] Can add items to cart
- [ ] Cart shows correct items
- [ ] Checkout redirects to PayFast
- [ ] PayFast sandbox payment works
- [ ] Order appears in database
- [ ] Admin login works
- [ ] Admin shows real orders

### Before Going Live
- [ ] Switch PayFast to production
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Test with real payment (small amount)
- [ ] Test on mobile device
- [ ] Check all pages load correctly

---

## Common Issues & Solutions

### Issue: "Cannot connect to Supabase"
**Solution**: Check your `.env.local` values match your Supabase project settings

### Issue: "PayFast signature invalid"
**Solution**: Ensure your passphrase matches exactly in both PayFast dashboard and `.env.local`

### Issue: "Cart items not persisting"
**Solution**: Make sure `customer_id` is being passed correctly. Currently using placeholder.

### Issue: "Images not showing"
**Solution**: Upload images to Supabase Storage and update product `image_url` field

---

## Need Help?

1. **Supabase Docs**: https://supabase.com/docs
2. **PayFast Docs**: https://developers.payfast.co.za
3. **Next.js Docs**: https://nextjs.org/docs
4. **Tailwind CSS**: https://tailwindcss.com/docs

---

## Summary

With this guide, you should be able to:
- ✅ Day 1: Get environment set up
- ✅ Day 2: Connect real product data
- ✅ Day 3: Get checkout working
- ✅ Day 4: Polish and deploy

**Good luck with your launch! 🚀**
