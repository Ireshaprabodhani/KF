-- ============================================================
-- KF Hand Made Paper Pulp Products — Supabase Database Setup
-- Run this entire script in the Supabase SQL Editor
-- ============================================================

-- 1. Create the products table
CREATE TABLE IF NOT EXISTS products (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        TEXT NOT NULL,
  description TEXT,
  price       NUMERIC(10, 2) NOT NULL,
  discount    NUMERIC(5, 2) DEFAULT 0,
  images      TEXT[] DEFAULT '{}',
  available   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Auto-update the updated_at column on row changes
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- 3. Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- 4. Public customers can read available products
CREATE POLICY "public_read_available_products"
  ON products
  FOR SELECT
  TO anon, authenticated
  USING (available = TRUE);

-- 5. Authenticated admin can read ALL products (including hidden)
CREATE POLICY "admin_read_all_products"
  ON products
  FOR SELECT
  TO authenticated
  USING (TRUE);

-- 6. Authenticated admin can insert
CREATE POLICY "admin_insert_products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- 7. Authenticated admin can update
CREATE POLICY "admin_update_products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (TRUE);

-- 8. Authenticated admin can delete
CREATE POLICY "admin_delete_products"
  ON products
  FOR DELETE
  TO authenticated
  USING (TRUE);

-- ============================================================
-- Storage Setup
-- Run AFTER creating the storage bucket named 'product-images'
-- Go to: Storage → Create Bucket → Name: product-images → Public: ON
-- Then run these RLS policies:
-- ============================================================

-- Anyone can view images
CREATE POLICY "public_read_product_images"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'product-images');

-- Only authenticated admin can upload
CREATE POLICY "admin_upload_product_images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'product-images');

-- Only authenticated admin can delete
CREATE POLICY "admin_delete_product_images"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'product-images');

-- ============================================================
-- Migration: Color Variants
-- Run this AFTER the initial setup above (in Supabase SQL Editor)
-- ============================================================

-- 1. Create the product_colors table
CREATE TABLE IF NOT EXISTS product_colors (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  hex         TEXT NOT NULL DEFAULT '#000000',
  images      TEXT[] DEFAULT '{}',
  videos      TEXT[] DEFAULT '{}',
  sort_order  INTEGER DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Index for fast lookup by product
CREATE INDEX IF NOT EXISTS idx_product_colors_product_id
  ON product_colors(product_id);

-- 3. Enable Row Level Security
ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;

-- 4. Public can read all colors
CREATE POLICY "public_read_product_colors"
  ON product_colors FOR SELECT
  TO anon, authenticated
  USING (TRUE);

-- 5. Admin can insert
CREATE POLICY "admin_insert_product_colors"
  ON product_colors FOR INSERT
  TO authenticated
  WITH CHECK (TRUE);

-- 6. Admin can update
CREATE POLICY "admin_update_product_colors"
  ON product_colors FOR UPDATE
  TO authenticated
  USING (TRUE);

-- 7. Admin can delete
CREATE POLICY "admin_delete_product_colors"
  ON product_colors FOR DELETE
  TO authenticated
  USING (TRUE);
