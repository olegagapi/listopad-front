# Database Seeding

## Create Tables in Supabase SQL Editor

```sql
-- Categories table
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  name_uk TEXT NOT NULL,
  name_en TEXT NOT NULL,
  marketing_desc_uk TEXT,
  marketing_desc_en TEXT,
  parent_category INTEGER REFERENCES categories(id)
);

-- Brands table
CREATE TABLE brands (
  id SERIAL PRIMARY KEY,
  name_uk TEXT NOT NULL,
  name_en TEXT NOT NULL,
  marketing_desc_uk TEXT,
  marketing_desc_en TEXT,
  internal_url TEXT,
  external_url TEXT,
  inst_url TEXT
);

-- Products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name_uk TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price NUMERIC NOT NULL,
  brand_id INTEGER REFERENCES brands(id),
  category_id INTEGER REFERENCES categories(id),
  product_description_uk TEXT,
  product_description_en TEXT,
  preview_image TEXT,
  images TEXT[],
  colors TEXT[],
  tags TEXT[],
  gender TEXT CHECK (gender IN ('male', 'female', 'unisex')),
  external_url TEXT,
  inst_url TEXT
);

-- Promotions table (for hero carousel)
CREATE TABLE promotions (
  id SERIAL PRIMARY KEY,
  title_uk TEXT NOT NULL,
  title_en TEXT NOT NULL,
  subtitle_uk TEXT,
  subtitle_en TEXT,
  discount_text TEXT,
  image_url TEXT NOT NULL,
  link_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Site settings table (for contact info, social links, etc.)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Seed Sample Data

```sql
-- Sample categories
INSERT INTO categories (name_uk, name_en, marketing_desc_uk, marketing_desc_en) VALUES
  ('Одяг', 'Clothing', 'Жіночий та чоловічий одяг', 'Women''s and men''s clothing'),
  ('Взуття', 'Footwear', 'Стильне взуття', 'Stylish footwear'),
  ('Аксесуари', 'Accessories', 'Модні аксесуари', 'Fashion accessories');

-- Sample brand
INSERT INTO brands (name_uk, name_en, marketing_desc_uk, marketing_desc_en, external_url, inst_url) VALUES
  ('Зразковий бренд', 'Sample Brand', 'Український бренд', 'Ukrainian brand', 'https://example.com', 'https://instagram.com/example');

-- Sample product
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, colors, gender, external_url) VALUES
  ('Сукня літня', 'Summer Dress', 2500, 1, 1, 'Легка літня сукня', 'Light summer dress', 'https://example.com/image.jpg', ARRAY['white', 'blue'], 'female', 'https://example.com/product');

-- Default site settings
INSERT INTO site_settings (key, value) VALUES
  ('contact', '{"phone": "", "email": "", "address": ""}'),
  ('social_links', '{"instagram": "", "facebook": "", "twitter": "", "youtube": "", "tiktok": ""}');

-- Sample promotion (optional)
-- INSERT INTO promotions (title_uk, title_en, subtitle_uk, subtitle_en, discount_text, image_url, link_url, display_order) VALUES
--   ('Колекція весна 2024', 'Spring 2024 Collection', 'Нова колекція вже в продажу', 'New collection available now', '-20%', 'https://example.com/promo.jpg', '/shop', 1);
```
