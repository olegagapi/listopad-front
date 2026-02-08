# Brand Cabinet Database Migrations

Run these migrations in your Supabase SQL Editor in order.

## 1. Add Columns to Brands Table

```sql
ALTER TABLE brands
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
```

## 2. Create Brand Managers Table

```sql
CREATE TABLE brand_managers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id),
  UNIQUE(brand_id)
);

-- Create index for faster lookups
CREATE INDEX idx_brand_managers_user_id ON brand_managers(user_id);
CREATE INDEX idx_brand_managers_brand_id ON brand_managers(brand_id);
CREATE INDEX idx_brand_managers_status ON brand_managers(status);
```

## 3. Enable Row Level Security

```sql
-- Enable RLS on brand_managers
ALTER TABLE brand_managers ENABLE ROW LEVEL SECURITY;

-- Enable RLS on products (if not already enabled)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Enable RLS on brands (if not already enabled)
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
```

## 4. Create RLS Policies

### Brand Managers Table Policies

```sql
-- Brand managers can read their own record
CREATE POLICY "Brand managers can read own record"
  ON brand_managers
  FOR SELECT
  USING (auth.uid() = user_id);

-- Brand managers can update their own record (limited fields via API)
CREATE POLICY "Brand managers can update own record"
  ON brand_managers
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Service role can insert (registration handled server-side)
CREATE POLICY "Service role can manage brand_managers"
  ON brand_managers
  FOR ALL
  USING (auth.role() = 'service_role');
```

### Products Table Policies

```sql
-- Public read access for all products
CREATE POLICY "Products are publicly readable"
  ON products
  FOR SELECT
  TO public
  USING (true);

-- Brand managers can insert products for their brand
CREATE POLICY "Brand managers can insert own products"
  ON products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM brand_managers
      WHERE brand_managers.user_id = auth.uid()
      AND brand_managers.brand_id = products.brand_id
      AND brand_managers.status = 'active'
    )
  );

-- Brand managers can update their brand's products
CREATE POLICY "Brand managers can update own products"
  ON products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM brand_managers
      WHERE brand_managers.user_id = auth.uid()
      AND brand_managers.brand_id = products.brand_id
      AND brand_managers.status = 'active'
    )
  );

-- Brand managers can delete their brand's products
CREATE POLICY "Brand managers can delete own products"
  ON products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM brand_managers
      WHERE brand_managers.user_id = auth.uid()
      AND brand_managers.brand_id = products.brand_id
      AND brand_managers.status = 'active'
    )
  );
```

### Brands Table Policies

```sql
-- Public read access for all brands
CREATE POLICY "Brands are publicly readable"
  ON brands
  FOR SELECT
  TO public
  USING (true);

-- Brand managers can update their own brand
CREATE POLICY "Brand managers can update own brand"
  ON brands
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM brand_managers
      WHERE brand_managers.user_id = auth.uid()
      AND brand_managers.brand_id = brands.id
      AND brand_managers.status = 'active'
    )
  );

-- Service role can insert brands (registration handled server-side)
CREATE POLICY "Service role can insert brands"
  ON brands
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
```

## 5. Create Updated At Trigger

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for brand_managers
CREATE TRIGGER update_brand_managers_updated_at
  BEFORE UPDATE ON brand_managers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger for brands
CREATE TRIGGER update_brands_updated_at
  BEFORE UPDATE ON brands
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

## 6. Create Storage Bucket for Brand Assets

```sql
-- Create storage bucket for brand logos and product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'brand-assets',
  'brand-assets',
  true,
  5242880, -- 5MB
  ARRAY['image/jpeg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;
```

### Storage Policies

```sql
-- Public read access for brand assets
CREATE POLICY "Brand assets are publicly accessible"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'brand-assets');

-- Brand managers can upload to their brand folder
CREATE POLICY "Brand managers can upload brand assets"
  ON storage.objects
  FOR INSERT
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

-- Brand managers can update their brand assets
CREATE POLICY "Brand managers can update brand assets"
  ON storage.objects
  FOR UPDATE
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

-- Brand managers can delete their brand assets
CREATE POLICY "Brand managers can delete brand assets"
  ON storage.objects
  FOR DELETE
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

## Verification

After running all migrations, verify:

```sql
-- Check brand_managers table exists
SELECT * FROM brand_managers LIMIT 1;

-- Check brands has new columns
SELECT logo_url, created_at, updated_at FROM brands LIMIT 1;

-- Check RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('brand_managers', 'products', 'brands');

-- Check policies exist
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public';
```
