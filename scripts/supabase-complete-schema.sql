-- ========================================
-- COMPLETE SUPABASE DATABASE SCHEMA
-- Fixed: No duplicate tables, all CHECK constraints, all missing tables
-- ========================================

-- ========================================
-- 1. CUSTOMERS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT,
  password_hash TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  date_of_birth DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 2. CUSTOMER ADDRESSES
-- ========================================
CREATE TABLE IF NOT EXISTS customer_addresses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('billing', 'shipping')) NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company TEXT,
  address_line_1 TEXT NOT NULL,
  address_line_2 TEXT,
  city TEXT NOT NULL,
  province TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  country TEXT DEFAULT 'South Africa',
  phone TEXT,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 3. PRODUCTS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  image_urls TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  category TEXT DEFAULT 'bow',
  category_id UUID REFERENCES categories(id),
  colors TEXT[],
  sizes TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sku TEXT UNIQUE,
  weight_grams INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 4. ORDERS TABLE (with CHECK constraints)
-- ========================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  payment_method TEXT,
  payment_reference TEXT,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping_cost DECIMAL(10,2) DEFAULT 0,
  tax_amount DECIMAL(10,2) DEFAULT 0,
  discount_amount DECIMAL(10,2) DEFAULT 0,
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_method TEXT,
  tracking_number TEXT,
  estimated_delivery DATE,
  billing_address JSONB,
  shipping_address JSONB,
  is_custom_order BOOLEAN DEFAULT false,
  custom_order_details JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 5. ORDER ITEMS
-- ========================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  product_sku TEXT,
  quantity INTEGER NOT NULL,
  unit_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  selected_color TEXT,
  selected_size TEXT,
  custom_specifications JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 6. CART ITEMS
-- ========================================
CREATE TABLE IF NOT EXISTS cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  selected_color TEXT,
  selected_size TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(customer_id, product_id, selected_color, selected_size)
);

-- ========================================
-- 7. WISHLIST
-- ========================================
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- ========================================
-- 8. PRODUCT REVIEWS
-- ========================================
CREATE TABLE IF NOT EXISTS product_reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  customer_id UUID REFERENCES customers(id),
  order_id UUID REFERENCES orders(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
  title TEXT,
  comment TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  helpful_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 9. CUSTOM ORDER REQUESTS
-- ========================================
CREATE TABLE IF NOT EXISTS custom_order_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  colors TEXT[] NOT NULL,
  size TEXT NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  special_requests TEXT,
  inspiration_images TEXT[],
  estimated_price DECIMAL(10,2),
  is_rush_order BOOLEAN DEFAULT false,
  estimated_completion_date DATE,
  status TEXT DEFAULT 'submitted' CHECK (status IN ('submitted', 'quoted', 'approved', 'in_progress', 'completed', 'cancelled')),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 10. EMAIL SUBSCRIBERS
-- ========================================
CREATE TABLE IF NOT EXISTS email_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed')),
  source TEXT,
  subscribed_at TIMESTAMP DEFAULT NOW(),
  unsubscribed_at TIMESTAMP
);

-- ========================================
-- 11. DISCOUNT CODES
-- ========================================
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT CHECK (type IN ('percentage', 'fixed_amount', 'free_shipping')) NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 12. ADMIN USERS
-- ========================================
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'manager')),
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 13. ADMIN SESSIONS (for session management)
-- ========================================
CREATE TABLE IF NOT EXISTS admin_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  ip_address TEXT,
  user_agent TEXT,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 14. INVENTORY MOVEMENTS
-- ========================================
CREATE TABLE IF NOT EXISTS inventory_movements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('restock', 'sale', 'adjustment', 'return')) NOT NULL,
  quantity_change INTEGER NOT NULL,
  reason TEXT,
  reference_id UUID,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 15. PAGE VIEWS (Analytics)
-- ========================================
CREATE TABLE IF NOT EXISTS page_views (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_path TEXT NOT NULL,
  user_agent TEXT,
  ip_address INET,
  referrer TEXT,
  session_id TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 16. CONTACT SUBMISSIONS
-- ========================================
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  subject TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'replied', 'closed')),
  admin_notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ========================================
-- 17. CATEGORIES
-- ========================================
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- 18. STORE SETTINGS (only once!)
-- ========================================
CREATE TABLE IF NOT EXISTS store_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================
-- INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_is_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_customer_id ON cart_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_items_customer_id ON wishlist_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_store_settings_key ON store_settings(setting_key);
CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes(code);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_token ON admin_sessions(token);
CREATE INDEX IF NOT EXISTS idx_page_views_created_at ON page_views(created_at);

-- ========================================
-- DEFAULT CATEGORIES
-- ========================================
INSERT INTO categories (name, slug, description, sort_order) VALUES
('Hair Bows', 'hair-bows', 'Beautiful handmade hair bows', 1),
('Accessories', 'accessories', 'Bow accessories and supplies', 2),
('Gift Sets', 'gift-sets', 'Perfect gift sets', 3),
('Custom Orders', 'custom-orders', 'Custom made to order', 4)
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- DEFAULT ADMIN USER
-- Password: admin123 (SHA-256: 240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9)
-- ========================================
INSERT INTO admin_users (email, password_hash, first_name, last_name, role)
VALUES ('admin@monicasbowboutique.co.za', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Monica', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- ========================================
-- DEFAULT PRODUCTS (from Supabase SQL)
-- ========================================
INSERT INTO products (name, description, price, image_url, category, colors, sizes, is_featured, stock_quantity) VALUES
('Classic Satin Bow', 'Beautiful classic satin bow in various colors', 45.00, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400', 'bow', ARRAY['Pink', 'Red', 'Blue', 'Black'], ARRAY['Small', 'Medium', 'Large'], true, 50),
('Grosgrain Ribbon Bow', 'Elegant grosgrain ribbon bow for everyday wear', 35.00, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400', 'bow', ARRAY['Navy', 'Burgundy', 'Forest Green'], ARRAY['Small', 'Medium'], true, 30),
('Floral Embellished Bow', 'Handmade bow with floral embellishments', 65.00, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400', 'bow', ARRAY['Pink', 'White', 'Coral'], ARRAY['Medium', 'Large'], true, 20),
('Organza Ribbon Bow', 'Delicate organza bow perfect for special occasions', 55.00, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400', 'bow', ARRAY['White', 'Ivory', 'Blush'], ARRAY['Small', 'Medium', 'Large'], false, 25),
('Velvet Bow Set', 'Luxurious velvet bow set with clips', 75.00, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400', 'bow', ARRAY['Burgundy', 'Navy', 'Black'], ARRAY['Medium', 'Large'], true, 15)
ON CONFLICT (sku) DO NOTHING;

-- ========================================
-- DEFAULT DISCOUNT CODES
-- ========================================
INSERT INTO discount_codes (code, description, type, value, minimum_order_amount, is_active) VALUES
('WELCOME10', 'Welcome discount for new customers', 'percentage', 10, NULL, true),
('PAITON20', 'Special discount for loyal customers', 'percentage', 20, 200, true),
('FREESHIP300', 'Free shipping on orders over R300', 'free_shipping', 0, 300, true)
ON CONFLICT (code) DO NOTHING;

-- ========================================
-- DEFAULT STORE SETTINGS (Bank Details)
-- ========================================
INSERT INTO store_settings (setting_key, setting_value, description) VALUES
    ('bank_name', 'First National Bank', 'Bank name for EFT payments'),
    ('account_number', '1234567890', 'Account number for EFT payments'),
    ('account_type', 'Cheque', 'Account type (Cheque/Savings/Current)'),
    ('branch_code', '123456', 'Branch code for EFT payments'),
    ('account_holder', 'Monica''s Bow Boutique', 'Account holder name'),
    ('payment_instructions', 'Please make payment within 48 hours. Email proof of payment to info@monicasbowboutique.co.za', 'Instructions shown to customers on checkout')
ON CONFLICT (setting_key) DO NOTHING;

-- ========================================
-- DONE!
