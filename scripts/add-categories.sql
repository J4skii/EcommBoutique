-- ========================================
-- Add Categories Support to Database
-- ========================================

-- 1. Create categories table
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

-- Allow public read
CREATE POLICY "Allow public read categories" 
  ON categories FOR SELECT 
  USING (is_active = true);

-- Allow admin all operations
CREATE POLICY "Allow admin all categories" 
  ON categories FOR ALL 
  USING (true);

-- 2. Add category_id to products table
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id),
  ADD COLUMN IF NOT EXISTS category TEXT; -- Fallback for existing data

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 3. Insert default categories
INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Hair Bows', 'hair-bows', 'Beautiful handcrafted bows for your hair', 1),
  ('Accessories', 'accessories', 'Elegant accessories to complete your look', 2),
  ('Gift Sets', 'gift-sets', 'Perfect gift bundles for loved ones', 3),
  ('Custom Orders', 'custom-orders', 'Personalized bows made just for you', 4)
ON CONFLICT (slug) DO NOTHING;

-- 4. Update existing products to have a category
-- First, get the hair-bows category id
DO $$
DECLARE
  hair_bows_id UUID;
BEGIN
  SELECT id INTO hair_bows_id FROM categories WHERE slug = 'hair-bows' LIMIT 1;
  
  IF hair_bows_id IS NOT NULL THEN
    UPDATE products 
    SET category_id = hair_bows_id,
        category = 'Hair Bows'
    WHERE category_id IS NULL;
  END IF;
END $$;

-- 5. Create function to update product count per category
CREATE OR REPLACE FUNCTION get_category_product_count(category_uuid UUID)
RETURNS INTEGER AS $$
BEGIN
  RETURN (
    SELECT COUNT(*) 
    FROM products 
    WHERE category_id = category_uuid 
    AND is_active = true
  );
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- DONE! Categories system is ready
-- ========================================
