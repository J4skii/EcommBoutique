-- Run this in Supabase SQL Editor to set up the database

-- Customers table (with password_hash for authentication)
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

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  image_urls TEXT[],
  stock_quantity INTEGER DEFAULT 0,
  category TEXT DEFAULT 'bow',
  colors TEXT[],
  sizes TEXT[],
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sku TEXT UNIQUE,
  weight_grams INTEGER,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_number TEXT UNIQUE NOT NULL,
  customer_id UUID REFERENCES customers(id),
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  status TEXT DEFAULT 'pending',
  payment_status TEXT DEFAULT 'pending',
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

-- Order items
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

-- Cart items
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

-- Wishlist
CREATE TABLE IF NOT EXISTS wishlist_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(customer_id, product_id)
);

-- Admin users
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  role TEXT DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Discount codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  minimum_order_amount DECIMAL(10,2),
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  valid_from TIMESTAMP DEFAULT NOW(),
  valid_until TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert default admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, first_name, last_name, role)
VALUES ('admin@monicasbowboutique.co.za', '240be518fabd2724ddb6f04eeb1da5967448d7e831c08c8fa822809f74c720a9', 'Monica', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, image_url, category, colors, sizes, is_featured, stock_quantity) VALUES
('Classic Satin Bow', 'Beautiful classic satin bow in various colors', 45.00, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400', 'bow', ARRAY['Pink', 'Red', 'Blue', 'Black'], ARRAY['Small', 'Medium', 'Large'], true, 50),
('Grosgrain Ribbon Bow', 'Elegant grosgrain ribbon bow for everyday wear', 35.00, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400', 'bow', ARRAY['Navy', 'Burgundy', 'Forest Green'], ARRAY['Small', 'Medium'], true, 30),
('Floral Embellished Bow', 'Handmade bow with floral embellishments', 65.00, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400', 'bow', ARRAY['Pink', 'White', 'Coral'], ARRAY['Medium', 'Large'], true, 20),
('Organza Ribbon Bow', 'Delicate organza bow perfect for special occasions', 55.00, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400', 'bow', ARRAY['White', 'Ivory', 'Blush'], ARRAY['Small', 'Medium', 'Large'], false, 25),
('Velvet Bow Set', 'Luxurious velvet bow set with clips', 75.00, 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400', 'bow', ARRAY['Burgundy', 'Navy', 'Black'], ARRAY['Medium', 'Large'], true, 15)
ON CONFLICT (sku) DO NOTHING;

-- Insert discount codes
INSERT INTO discount_codes (code, description, type, value, minimum_order_amount, is_active) VALUES
('WELCOME10', 'Welcome discount for new customers', 'percentage', 10, NULL, true),
('PAITON20', 'Special discount for loyal customers', 'percentage', 20, 200, true),
('FREESHIP300', 'Free shipping on orders over R300', 'free_shipping', 0, 300, true)
ON CONFLICT (code) DO NOTHING;
