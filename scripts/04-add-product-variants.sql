-- Migration 04: Add Product Variants & Image Tables
-- Run this in Supabase SQL Editor after migration 03

-- 1. Add custom text support columns to products
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS has_custom_text BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS custom_text_label TEXT,
  ADD COLUMN IF NOT EXISTS custom_text_max_length INTEGER DEFAULT 50;

-- 2. Create product_images table (multiple images per product)
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  storage_path TEXT,
  alt_text TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_display_order ON product_images(product_id, display_order);

-- Ensure only one primary image per product
CREATE UNIQUE INDEX IF NOT EXISTS idx_product_images_primary
  ON product_images(product_id)
  WHERE is_primary = true;

-- 3. Create product_variants table
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_type TEXT NOT NULL CHECK (variant_type IN ('color', 'size', 'custom_text')),
  variant_name TEXT NOT NULL,
  variant_value TEXT NOT NULL,
  color_hex TEXT,
  price_modifier DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  display_order INTEGER NOT NULL DEFAULT 0,
  sku_suffix TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX IF NOT EXISTS idx_product_variants_type ON product_variants(product_id, variant_type);

-- 4. Create variant_combinations table (color + size pairs)
CREATE TABLE IF NOT EXISTS variant_combinations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  color_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  size_variant_id UUID REFERENCES product_variants(id) ON DELETE CASCADE,
  sku TEXT,
  price_modifier DECIMAL(10, 2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  is_available BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (product_id, color_variant_id, size_variant_id)
);

CREATE INDEX IF NOT EXISTS idx_variant_combinations_product_id ON variant_combinations(product_id);

-- 5. Updated_at triggers for new tables
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_product_images_updated_at
  BEFORE UPDATE ON product_images
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_product_variants_updated_at
  BEFORE UPDATE ON product_variants
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_variant_combinations_updated_at
  BEFORE UPDATE ON variant_combinations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 6. Migrate existing product image_url values into product_images table
INSERT INTO product_images (product_id, image_url, is_primary, display_order)
SELECT id, image_url, true, 0
FROM products
WHERE image_url IS NOT NULL AND image_url != ''
ON CONFLICT DO NOTHING;

-- 7. RLS Policies — public can read images and variants, only service role can write
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE variant_combinations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_product_images" ON product_images FOR SELECT USING (true);
CREATE POLICY "public_read_product_variants" ON product_variants FOR SELECT USING (true);
CREATE POLICY "public_read_variant_combinations" ON variant_combinations FOR SELECT USING (true);

GRANT ALL ON product_images TO service_role;
GRANT ALL ON product_variants TO service_role;
GRANT ALL ON variant_combinations TO service_role;
