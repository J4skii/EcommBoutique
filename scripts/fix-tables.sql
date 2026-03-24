-- Add categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Add some default categories
INSERT INTO categories (name, slug, description, sort_order, is_active) VALUES
('Hair Bows', 'hair-bows', 'Beautiful handmade hair bows', 1, true),
('Accessories', 'accessories', 'Bow accessories and supplies', 2, true),
('Gift Sets', 'gift-sets', 'Perfect gift sets', 3, true),
('Custom Orders', 'custom-orders', 'Custom made to order', 4, true)
ON CONFLICT (slug) DO NOTHING;

-- Add category_id column to products table if it doesn't exist
ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES categories(id);

-- Add category_id to the products that were created without it (map existing category names to category IDs)
UPDATE products 
SET category_id = (
  SELECT id FROM categories WHERE LOWER(categories.slug) = LOWER(products.category)
)
WHERE category_id IS NULL AND category IS NOT NULL;

-- Enable RLS on categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for categories
DROP POLICY IF EXISTS "Allow public read categories" ON categories;
CREATE POLICY "Allow public read categories" ON categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow admin full access categories" ON categories;
CREATE POLICY "Allow admin full access categories" ON categories FOR ALL USING (true);
