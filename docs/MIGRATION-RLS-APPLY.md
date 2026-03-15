# RLS Policies — Idempotent Migration

Paste this entire script into the **Supabase SQL Editor** and run it. Safe to re-run — it drops policies by name before recreating them.

## Full Migration Script

```sql
-- =============================================================
-- 1. Enable RLS (safe if already enabled)
-- =============================================================
ALTER TABLE brand_managers ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;

-- =============================================================
-- 2. brand_managers policies
-- =============================================================
DROP POLICY IF EXISTS "Brand managers can read own record" ON brand_managers;
DROP POLICY IF EXISTS "Brand managers can update own record" ON brand_managers;
DROP POLICY IF EXISTS "Service role can manage brand_managers" ON brand_managers;

CREATE POLICY "Brand managers can read own record"
  ON brand_managers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Brand managers can update own record"
  ON brand_managers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Service role can manage brand_managers"
  ON brand_managers FOR ALL
  USING (auth.role() = 'service_role');

-- =============================================================
-- 3. products policies
-- =============================================================
DROP POLICY IF EXISTS "Products are publicly readable" ON products;
DROP POLICY IF EXISTS "Brand managers can insert own products" ON products;
DROP POLICY IF EXISTS "Brand managers can update own products" ON products;
DROP POLICY IF EXISTS "Brand managers can delete own products" ON products;

CREATE POLICY "Products are publicly readable"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Brand managers can insert own products"
  ON products FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brand_managers
      WHERE brand_managers.user_id = auth.uid()
        AND brand_managers.brand_id = products.brand_id
        AND brand_managers.status = 'active'
    )
  );

CREATE POLICY "Brand managers can update own products"
  ON products FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM brand_managers
      WHERE brand_managers.user_id = auth.uid()
        AND brand_managers.brand_id = products.brand_id
        AND brand_managers.status = 'active'
    )
  );

CREATE POLICY "Brand managers can delete own products"
  ON products FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM brand_managers
      WHERE brand_managers.user_id = auth.uid()
        AND brand_managers.brand_id = products.brand_id
        AND brand_managers.status = 'active'
    )
  );

-- =============================================================
-- 4. brands policies
-- =============================================================
DROP POLICY IF EXISTS "Brands are publicly readable" ON brands;
DROP POLICY IF EXISTS "Brand managers can update own brand" ON brands;
DROP POLICY IF EXISTS "Service role can insert brands" ON brands;

CREATE POLICY "Brands are publicly readable"
  ON brands FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Brand managers can update own brand"
  ON brands FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM brand_managers
      WHERE brand_managers.user_id = auth.uid()
        AND brand_managers.brand_id = brands.id
        AND brand_managers.status = 'active'
    )
  );

CREATE POLICY "Service role can insert brands"
  ON brands FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

-- =============================================================
-- 5. Storage bucket (idempotent)
-- =============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-assets',
  'brand-assets',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- =============================================================
-- 6. Storage policies
-- =============================================================
DROP POLICY IF EXISTS "Brand assets are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Brand managers can upload brand assets" ON storage.objects;
DROP POLICY IF EXISTS "Brand managers can update brand assets" ON storage.objects;
DROP POLICY IF EXISTS "Brand managers can delete brand assets" ON storage.objects;

CREATE POLICY "Brand assets are publicly accessible"
  ON storage.objects FOR SELECT
  TO public
  USING (bucket_id = 'brand-assets');

CREATE POLICY "Brand managers can upload brand assets"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'brand-assets'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM brand_managers
      WHERE brand_managers.user_id = auth.uid()
        AND brand_managers.status = 'active'
        AND (storage.foldername(name))[1] = brand_managers.brand_id::text
    )
  );

CREATE POLICY "Brand managers can update brand assets"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'brand-assets'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM brand_managers
      WHERE brand_managers.user_id = auth.uid()
        AND brand_managers.status = 'active'
        AND (storage.foldername(name))[1] = brand_managers.brand_id::text
    )
  );

CREATE POLICY "Brand managers can delete brand assets"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'brand-assets'
    AND auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1 FROM brand_managers
      WHERE brand_managers.user_id = auth.uid()
        AND brand_managers.status = 'active'
        AND (storage.foldername(name))[1] = brand_managers.brand_id::text
    )
  );
```

## Verification Queries

Run after the migration to confirm everything is in place:

```sql
-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('brand_managers', 'products', 'brands');

-- Check all policies
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE (schemaname = 'public' AND tablename IN ('brand_managers', 'products', 'brands'))
   OR (schemaname = 'storage' AND tablename = 'objects')
ORDER BY schemaname, tablename, policyname;

-- Check storage bucket
SELECT id, name, public, file_size_limit
FROM storage.buckets
WHERE id = 'brand-assets';
```

Expected results:
- All 3 tables show `rowsecurity = true`
- 10 policies on public tables (3 brand_managers + 4 products + 3 brands)
- 4 policies on storage.objects
- 1 brand-assets bucket with `public = true`
