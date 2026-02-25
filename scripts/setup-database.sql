-- ========================================
-- Paitons Boutique - Database Setup
-- Run this in Supabase SQL Editor
-- ========================================

-- ========================================
-- 1. CUSTOMERS TABLE (With Phone Auth)
-- ========================================
CREATE TABLE IF NOT EXISTS customers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  phone TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

-- Allow customers to read/update their own data
CREATE POLICY "Customers can read own data" 
  ON customers FOR SELECT 
  USING (auth.uid()::text = id::text);

CREATE POLICY "Customers can update own data" 
  ON customers FOR UPDATE 
  USING (auth.uid()::text = id::text);

-- ========================================
-- 2. CUSTOMER SESSIONS TABLE
-- ========================================
CREATE TABLE IF NOT EXISTS customer_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE customer_sessions ENABLE ROW LEVEL SECURITY;

-- ========================================
-- 3. CATEGORIES TABLE
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

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read categories" 
  ON categories FOR SELECT 
  USING (is_active = true);

-- Add category_id to products
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id),
  ADD COLUMN IF NOT EXISTS category TEXT;

CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);

-- Insert default categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Hair Bows', 'hair-bows', 'Beautiful handcrafted bows for your hair', 1),
  ('Accessories', 'accessories', 'Elegant accessories to complete your look', 2),
  ('Gift Sets', 'gift-sets', 'Perfect gift bundles for loved ones', 3),
  ('Custom Orders', 'custom-orders', 'Personalized bows made just for you', 4)
ON CONFLICT (slug) DO NOTHING;

-- ========================================
-- 4. UPDATE EXISTING TABLES
-- ========================================

-- Update cart_items to reference customers
ALTER TABLE cart_items 
  DROP CONSTRAINT IF EXISTS cart_items_customer_id_fkey,
  ALTER COLUMN customer_id TYPE UUID USING customer_id::UUID,
  ADD CONSTRAINT cart_items_customer_id_fkey 
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE;

-- Update orders to reference customers (optional)
ALTER TABLE orders 
  ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES customers(id);

-- ========================================
-- 5. RLS POLICIES FOR CART
-- ========================================
CREATE POLICY "Allow cart operations" 
  ON cart_items FOR ALL 
  USING (true)
  WITH CHECK (true);

-- ========================================
-- 6. CREATE TEST DATA
-- ========================================

-- Create admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, first_name, last_name)
VALUES (
  'admin@paitonsboutique.co.za',
  'ef92b778bafe771e89245b89ecbc08a44a4e166c06659911881f383d4473e94f',
  'Paiton',
  'Admin'
)
ON CONFLICT (email) DO NOTHING;

-- Create test customer with phone (password: test123)
-- Phone: +27 82 123 4567
INSERT INTO customers (email, phone, password_hash, first_name, last_name)
VALUES (
  'test@example.com',
  '27821234567',
  '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
  'Test',
  'User'
)
ON CONFLICT (phone) DO NOTHING;

-- Get hair-bows category ID for products
DO $$
DECLARE
  hair_bows_id UUID;
BEGIN
  SELECT id INTO hair_bows_id FROM categories WHERE slug = 'hair-bows' LIMIT 1;
  
-- Create sample products
INSERT INTO products (
  name, description, price, stock_quantity, 
  colors, sizes, is_active, is_featured, sku, category_id, category
) VALUES 
  (
    'Classic Rose Bow',
    'Elegant rose-colored bow perfect for any occasion. Handcrafted with premium faux leather.',
    45.00,
    10,
    ARRAY['rose', 'pink'],
    ARRAY['small', 'medium', 'large'],
    true,
    true,
    'BOW-ROSE-001',
    hair_bows_id,
    'Hair Bows'
  ),
  (
    'Midnight Black Bow',
    'Sophisticated black bow for formal events. Timeless elegance in premium faux leather.',
    50.00,
    8,
    ARRAY['black'],
    ARRAY['medium', 'large'],
    true,
    true,
    'BOW-BLACK-001',
    hair_bows_id,
    'Hair Bows'
  ),
  (
    'Sunshine Yellow Bow',
    'Bright and cheerful yellow bow to brighten your day.',
    42.00,
    5,
    ARRAY['yellow', 'gold'],
    ARRAY['medium'],
    true,
    false,
    'BOW-YELLOW-001',
    hair_bows_id,
    'Hair Bows'
  ),
  (
    'Forest Green Bow',
    'Natural green bow inspired by forest walks. Earthy elegance for nature lovers.',
    48.00,
    12,
    ARRAY['green', 'forest'],
    ARRAY['medium', 'large'],
    true,
    true,
    'BOW-GREEN-001',
    hair_bows_id,
    'Hair Bows'
  )
ON CONFLICT (sku) DO NOTHING;

END $$;

-- Create discount codes
INSERT INTO discount_codes (code, description, type, value, minimum_order_amount, usage_limit, valid_until, is_active)
VALUES 
  ('PAITON20', 'Welcome discount - 20% off first order', 'percentage', 20.00, 100.00, 100, NOW() + INTERVAL '3 months', true),
  ('WELCOME10', '10% off welcome offer', 'percentage', 10.00, 0, NULL, NOW() + INTERVAL '1 year', true),
  ('FREESHIP300', 'Free shipping on orders over R300', 'free_shipping', 0.00, 300.00, NULL, NOW() + INTERVAL '1 year', true)
ON CONFLICT (code) DO NOTHING;

-- ========================================
-- 7. CREATE INDEXES
-- ========================================
CREATE INDEX IF NOT EXISTS idx_customers_phone ON customers(phone);
CREATE INDEX IF NOT EXISTS idx_customers_email ON customers(email);
CREATE INDEX IF NOT EXISTS idx_cart_items_customer ON cart_items(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_customer ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- ========================================
-- DONE! Your database is ready for testing
-- ========================================
