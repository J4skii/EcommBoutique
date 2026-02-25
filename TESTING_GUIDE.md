# 🧪 Testing Guide - Paitons Boutique

## ⚡ QUICK START (5 Minutes)

### Step 1: Setup Environment
```bash
# 1. Copy environment template
copy .env.example .env.local

# 2. Edit .env.local and add your Supabase credentials
```

### Step 2: Setup Database
1. Go to your Supabase project: https://app.supabase.com
2. Open SQL Editor
3. Copy contents of `scripts/setup-database.sql`
4. Paste and run

### Step 3: Start Server
```bash
npm run dev
```

### Step 4: Test URLs
- Main site: http://localhost:3000
- Products: http://localhost:3000/products
- Login: http://localhost:3000/auth/login
- Signup: http://localhost:3000/auth/signup
- Admin: http://localhost:3000/admin

---

## 🧪 TEST CHECKLIST

### 1. Customer Authentication ✅

#### Test Signup with Phone
```
URL: http://localhost:3000/auth/signup

Test Data:
- First Name: John
- Last Name: Doe
- Phone: 082 123 4567 (SA format)
- Email: john@example.com (optional)
- Password: test123
- Confirm Password: test123

Expected: Account created, redirected to login
```

#### Test Login with Phone
```
URL: http://localhost:3000/auth/login
- Tab: Phone Number
- Phone: 082 123 4567
- Password: test123

Expected: Logged in, redirected to homepage, header shows "Hi, John"
```

#### Test Login with Email
```
URL: http://localhost:3000/auth/login
- Tab: Email
- Email: john@example.com
- Password: test123

Expected: Same as phone login
```

#### Test Logout
```
Click logout button in header

Expected: Header shows login icon, cart count resets
```

---

### 2. Product Browsing ✅

#### Test Products Page
```
URL: http://localhost:3000/products

Check:
- [ ] Products load from database
- [ ] Images show (placeholders for now)
- [ ] Prices display correctly
- [ ] Stock status shows
```

#### Test Search
```
Type "rose" in search box

Expected: Only "Classic Rose Bow" shows
```

#### Test Sort
```
Select "Price: Low to High"

Expected: Products reorder by price
```

---

### 3. Shopping Cart ✅

#### Test Add to Cart (Not Logged In)
```
1. Logout if logged in
2. Go to /products
3. Click "Add to Cart" on any product

Expected: 
- Button shows "Added!" with checkmark
- Cart count updates in header
- Item saved to cart
```

#### Test Add to Cart (Logged In)
```
1. Login as John Doe
2. Add product to cart
3. Check header shows cart count

Expected: Same as above
```

#### Test View Cart
```
URL: http://localhost:3000/cart

Check:
- [ ] Shows items in cart
- [ ] Correct quantities
- [ ] Correct totals
- [ ] Can increase/decrease quantity
- [ ] Can remove items
```

#### Test Cart Persistence
```
1. Add items to cart
2. Refresh page
3. Check cart still has items

Expected: Cart persists (stored in database)
```

---

### 4. Checkout Flow ✅

#### Test Checkout (Logged In)
```
Prerequisites: Logged in + items in cart

1. Go to /cart
2. Click "Proceed to Checkout"
3. Fill form:
   - First Name: John
   - Last Name: Doe
   - Email: john@example.com
   - Phone: 082 123 4567
   - Address: 123 Main Street
   - City: Durban
   - Province: KwaZulu-Natal
   - Postal Code: 4000
4. Click "Complete Order"

Expected:
- Order created in database
- Redirected to PayFast sandbox
- (In sandbox, can complete test payment)
```

#### Test Payment Success
```
After PayFast payment:
- Should redirect to /payment/success
- Shows order confirmation
- Order number displayed
```

#### Test Payment Cancel
```
If cancel on PayFast:
- Should redirect to /payment/cancel
- Shows cancellation message
- Option to return to cart
```

---

### 5. Admin Panel ✅

#### Test Admin Login
```
URL: http://localhost:3000/admin

Credentials:
- Email: admin@paitonsboutique.co.za
- Password: admin123

Expected: Redirected to admin dashboard
```

#### Test Admin Dashboard Stats
```
Check:
- [ ] Total Products shows correct count
- [ ] Total Orders shows correct count
- [ ] Revenue calculates from paid orders
- [ ] Low Stock shows items with < 5 stock
```

#### Test Add Product
```
1. Go to "Add Product" tab
2. Fill form:
   - Name: Test Bow
   - Price: 55
   - Stock: 10
   - Description: A test product
3. Click "Add Product"

Expected: 
- Product added to database
- Appears in Products tab
- Shows on frontend
```

#### Test View Orders
```
1. Go to "Orders" tab
2. Check orders from checkout tests

Expected: Orders show with status, payment status
```

#### Test Admin Logout
```
Click "Logout" button

Expected: Redirected to login page
```

---

## 🔧 TROUBLESHOOTING

### Issue: "Failed to fetch products"
**Solution**: 
- Check `.env.local` has correct Supabase URL and key
- Verify Supabase project is active
- Check browser console for errors

### Issue: "Invalid credentials" on login
**Solution**:
- Phone format: Use 082 123 4567 (not +27)
- Password must be at least 6 characters
- Check if user exists in database

### Issue: "Add to cart" not working
**Solution**:
- Check customer_id is generated in localStorage
- Check /api/cart endpoint is working
- Check browser console for errors

### Issue: Checkout fails
**Solution**:
- Check all required fields filled
- Verify PayFast credentials in .env.local
- Check browser console for error details

### Issue: Admin login fails
**Solution**:
- Run setup-database.sql to create admin user
- Use exact credentials from setup script
- Check cookie is being set

---

## 📱 MOBILE TESTING

Test these on your phone:
- [ ] Site loads correctly
- [ ] Can navigate menu
- [ ] Can add to cart
- [ ] Can checkout
- [ ] Payment flow works

---

## ✅ PRE-LAUNCH CHECKLIST

Before going live:

- [ ] All tests above pass
- [ ] PayFast switched to production
- [ ] Real products added
- [ ] Real images uploaded
- [ ] SSL certificate active
- [ ] Domain configured
- [ ] Email notifications working
- [ ] Mobile responsive

---

## 🎯 TEST DATA

### Test Customer Account
```
Phone: 082 123 4567
Email: test@example.com
Password: test123
Name: Test User
```

### Test Admin Account
```
Email: admin@paitonsboutique.co.za
Password: admin123
```

### Sample Product SKUs
```
BOW-ROSE-001
BOW-BLACK-001
BOW-YELLOW-001
BOW-GREEN-001
```

---

## 🚨 KNOWN ISSUES

1. **Images are placeholders** - Upload real images to Supabase Storage
2. **Wishlist not connected** - UI only, not saving to database
3. **Email notifications not tested** - Code exists but needs Resend setup
4. **Order tracking shows mock** - Need to connect to real orders

---

## 💡 TESTING TIPS

1. **Use Incognito Mode** - Test signup flow fresh
2. **Clear localStorage** - To test as new user
3. **Check Supabase** - Verify data is being saved
4. **Test on Mobile** - Use Chrome DevTools device mode
5. **Monitor Console** - Watch for errors

---

## 📞 NEED HELP?

Common issues and solutions are in `PROJECT_AUDIT.md`

For testing support:
1. Check browser console (F12)
2. Check Supabase logs
3. Verify environment variables
4. Test API endpoints directly

---

**Happy Testing! 🎉**
