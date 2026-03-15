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
  inst_url TEXT,
  logo_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
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
  inst_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true
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

-- Analytics events table (for tracking brand/product engagement)
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  event_type TEXT NOT NULL,
  brand_id INTEGER NOT NULL REFERENCES brands(id),
  product_id INTEGER REFERENCES products(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_analytics_brand_date ON analytics_events (brand_id, created_at);
CREATE INDEX idx_analytics_type ON analytics_events (event_type);

-- Site settings table (for contact info, social links, etc.)
CREATE TABLE site_settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## Seed Sample Data

```sql
-- ===========================================
-- CATEGORIES
-- ===========================================

-- Parent categories (id 1-3)
INSERT INTO categories (name_uk, name_en, marketing_desc_uk, marketing_desc_en) VALUES
  ('Одяг', 'Clothing', 'Жіночий та чоловічий одяг від українських брендів', 'Women''s and men''s clothing from Ukrainian brands'),
  ('Взуття', 'Footwear', 'Стильне взуття на кожен день', 'Stylish footwear for every day'),
  ('Аксесуари', 'Accessories', 'Модні аксесуари для завершення образу', 'Fashion accessories to complete your look');

-- Clothing subcategories (id 4-10)
INSERT INTO categories (name_uk, name_en, marketing_desc_uk, marketing_desc_en, parent_category) VALUES
  ('Сукні', 'Dresses', 'Елегантні сукні', 'Elegant dresses', 1),
  ('Топи та блузи', 'Tops & Blouses', 'Стильні топи та блузи', 'Stylish tops and blouses', 1),
  ('Штани та джинси', 'Pants & Jeans', 'Зручні штани та джинси', 'Comfortable pants and jeans', 1),
  ('Верхній одяг', 'Outerwear', 'Куртки, пальта та тренчі', 'Jackets, coats and trench coats', 1),
  ('Спідниці', 'Skirts', 'Модні спідниці', 'Fashionable skirts', 1),
  ('Светри та кардигани', 'Sweaters & Cardigans', 'Теплі светри та кардигани', 'Warm sweaters and cardigans', 1),
  ('Костюми', 'Suits', 'Діловий та повсякденний стиль', 'Business and casual style', 1);

-- Footwear subcategories (id 11-14)
INSERT INTO categories (name_uk, name_en, marketing_desc_uk, marketing_desc_en, parent_category) VALUES
  ('Кросівки', 'Sneakers', 'Комфортні кросівки', 'Comfortable sneakers', 2),
  ('Черевики', 'Boots', 'Стильні черевики', 'Stylish boots', 2),
  ('Туфлі', 'Heels', 'Елегантні туфлі', 'Elegant heels', 2),
  ('Сандалі', 'Sandals', 'Легкі сандалі', 'Light sandals', 2);

-- Accessories subcategories (id 15-18)
INSERT INTO categories (name_uk, name_en, marketing_desc_uk, marketing_desc_en, parent_category) VALUES
  ('Сумки', 'Bags', 'Стильні сумки', 'Stylish bags', 3),
  ('Прикраси', 'Jewelry', 'Вишукані прикраси', 'Exquisite jewelry', 3),
  ('Шарфи та хустки', 'Scarves', 'Модні шарфи та хустки', 'Fashionable scarves and shawls', 3),
  ('Головні убори', 'Hats', 'Капелюхи та кепки', 'Hats and caps', 3);

-- ===========================================
-- BRANDS
-- ===========================================

INSERT INTO brands (name_uk, name_en, marketing_desc_uk, marketing_desc_en, external_url, inst_url, logo_url) VALUES
  ('Лелека', 'Leleka', 'Сучасний український бренд жіночого одягу', 'Modern Ukrainian women''s clothing brand', 'https://leleka.ua', 'https://instagram.com/leleka_ua', 'https://picsum.photos/seed/leleka-logo/200/200'),
  ('Вишиванка Модерн', 'Vyshyvanka Modern', 'Традиції в сучасному стилі', 'Traditions in modern style', 'https://vyshyvanka-modern.ua', 'https://instagram.com/vyshyvanka_modern', 'https://picsum.photos/seed/vyshyvanka-logo/200/200'),
  ('Степова', 'Stepova', 'Мінімалізм та якість', 'Minimalism and quality', 'https://stepova.com', 'https://instagram.com/stepova_brand', 'https://picsum.photos/seed/stepova-logo/200/200'),
  ('Карпати Стайл', 'Karpaty Style', 'Натхненні горами', 'Inspired by mountains', 'https://karpaty-style.ua', 'https://instagram.com/karpaty_style', 'https://picsum.photos/seed/karpaty-logo/200/200'),
  ('Київ Колекшн', 'Kyiv Collection', 'Міська мода', 'Urban fashion', 'https://kyiv-collection.com', 'https://instagram.com/kyiv_collection', 'https://picsum.photos/seed/kyiv-logo/200/200'),
  ('Борисфен', 'Borysfen', 'Чоловічий одяг преміум класу', 'Premium men''s clothing', 'https://borysfen.ua', 'https://instagram.com/borysfen_ua', 'https://picsum.photos/seed/borysfen-logo/200/200'),
  ('Сонячна', 'Soniachna', 'Яскраві літні колекції', 'Bright summer collections', 'https://soniachna.com', 'https://instagram.com/soniachna', 'https://picsum.photos/seed/soniachna-logo/200/200'),
  ('Оберіг', 'Oberih', 'Аксесуари ручної роботи', 'Handmade accessories', 'https://oberih.ua', 'https://instagram.com/oberih_ua', 'https://picsum.photos/seed/oberih-logo/200/200');

-- ===========================================
-- PRODUCTS
-- ===========================================

-- Dresses (category_id: 4)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Сукня Весняна', 'Spring Dress', 2800, 1, 4, 'Легка сукня з квітковим принтом, ідеальна для весняних прогулянок', 'Light dress with floral print, perfect for spring walks', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab159739f1c69ab159739f1d.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab15973d9c669ab15973d9c8.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab15974037069ab159740371.jpg'], ARRAY['white', 'green'], ARRAY['весна', 'квіти', 'легка'], 'female', 'https://leleka.ua/dress-spring', 'https://instagram.com/p/dress1'),
  ('Сукня Вечірня Зоря', 'Evening Star Dress', 5500, 1, 4, 'Елегантна вечірня сукня з шовку', 'Elegant silk evening dress', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da0686ce968a2da0686cea.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da068476d68a2da068476e.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da068223c68a2da068223d.jpg'], ARRAY['black', 'gold'], ARRAY['вечірня', 'елегантна', 'шовк'], 'female', 'https://leleka.ua/evening-star', NULL),
  ('Сукня Міді Класика', 'Classic Midi Dress', 3200, 3, 4, 'Класична сукня міді довжини, підходить для офісу та виходу', 'Classic midi length dress, suitable for office and outings', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b9a0e2968d6a3b9a0e2a.jpeg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b99cae368d6a3b99cae4.jpeg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b99ec5868d6a3b99ec59.jpeg'], ARRAY['grey', 'black', 'blue'], ARRAY['класика', 'офіс', 'міді'], 'female', 'https://stepova.com/classic-midi', NULL),
  ('Сукня Літня Бриз', 'Summer Breeze Dress', 2200, 7, 4, 'Легка літня сукня з натуральної тканини', 'Light summer dress made of natural fabric', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/25/764201/gallery/33683.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/25/764201/gallery/33685.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/25/663020/gallery/663020_69b04a99a870569b04a99a8706.jpg'], ARRAY['white', 'yellow', 'cyan'], ARRAY['літо', 'пляж', 'натуральна'], 'female', 'https://soniachna.com/summer-breeze', 'https://instagram.com/p/dress4'),
  ('Сукня Вишиванка', 'Vyshyvanka Dress', 4800, 2, 4, 'Сукня з традиційною українською вишивкою', 'Dress with traditional Ukrainian embroidery', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/15/654150/gallery/654150_68a2d986156bf68a2d986156c0.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/15/654150/gallery/654150_68a2d98611c4168a2d98611c42.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/15/654150/gallery/654150_68a2d98608cfb68a2d98608cfc.jpg'], ARRAY['white', 'red'], ARRAY['вишивка', 'традиційна', 'етно'], 'female', 'https://vyshyvanka-modern.ua/dress', 'https://instagram.com/p/dress5');

-- Tops & Blouses (category_id: 5)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Блуза Шовкова Ніч', 'Silk Night Blouse', 2400, 1, 5, 'Елегантна шовкова блуза', 'Elegant silk blouse', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/19/623943/gallery/623943_68380791a7fa868380791a7fa9.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/19/623943/gallery/623943_68380791a926068380791a9261.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/19/623943/gallery/623943_68380791a596868380791a5969.jpg'], ARRAY['black', 'indigo'], ARRAY['шовк', 'елегантна'], 'female', 'https://leleka.ua/silk-night', NULL),
  ('Топ Спортивний', 'Sport Top', 890, 5, 5, 'Зручний топ для спорту та активного відпочинку', 'Comfortable top for sports and active leisure', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581296/gallery/581296_66bb4998cf76066bb4998cf761.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581296/gallery/581296_66bb4998ccf6366bb4998ccf64.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581296/gallery/581296_66bb4998c524e66bb4998c524f.jpg'], ARRAY['black', 'white', 'grey'], ARRAY['спорт', 'активний'], 'female', 'https://kyiv-collection.com/sport-top', NULL),
  ('Блуза Офісна', 'Office Blouse', 1800, 3, 5, 'Класична блуза для ділового стилю', 'Classic blouse for business style', 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/06/01/506995/gallery/506995_6836fa0f788ca6836fa0f788cb.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2023/06/01/506995/gallery/506995_6836fa0f752d46836fa0f752d5.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/06/01/506995/gallery/506995_6836fa0f70ab46836fa0f70ab5.jpg'], ARRAY['white', 'blue', 'grey'], ARRAY['офіс', 'діловий'], 'female', 'https://stepova.com/office-blouse', NULL),
  ('Сорочка Вишита', 'Embroidered Shirt', 3200, 2, 5, 'Чоловіча сорочка з вишивкою', 'Men''s shirt with embroidery', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/13/588686/gallery/588686_68930488615a768930488615a8.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/13/588686/gallery/588686_6893048863bbf6893048863bc0.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/13/588686/gallery/588686_68930488665886893048866589.jpg'], ARRAY['white', 'blue'], ARRAY['вишивка', 'традиційна'], 'male', 'https://vyshyvanka-modern.ua/shirt', 'https://instagram.com/p/shirt1'),
  ('Поло Класичне', 'Classic Polo', 1500, 6, 5, 'Класична чоловіча сорочка поло', 'Classic men''s polo shirt', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581297/gallery/581297_66bb4ac2adcc666bb4ac2adcc8.png', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581297/gallery/581297_6835ccf8a078c6835ccf8a078d.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581297/gallery/581297_6835ccf8a705c6835ccf8a705d.jpg'], ARRAY['white', 'black', 'blue', 'green'], ARRAY['поло', 'класика'], 'male', 'https://borysfen.ua/polo', NULL);

-- Pants & Jeans (category_id: 6)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Джинси Класичні', 'Classic Jeans', 2100, 5, 6, 'Класичні джинси прямого крою', 'Classic straight-cut jeans', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/03/618979/gallery/618979_67c82351d63cb67c82351d63cc.jpeg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/03/618979/gallery/618979_67c82351ce95c67c82351ce95d.jpeg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/03/618979/gallery/618979_67c82351d2d3167c82351d2d32.jpeg'], ARRAY['blue', 'black'], ARRAY['джинси', 'класика'], 'unisex', 'https://kyiv-collection.com/classic-jeans', NULL),
  ('Штани Чінос', 'Chino Pants', 1900, 6, 6, 'Елегантні штани чінос', 'Elegant chino pants', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/27/625952/gallery/625952_68ac59a871f9d68ac59a871f9e.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/27/625952/gallery/625952_68ac59a87486868ac59a874869.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/27/625952/gallery/625952_68ac59a86ed6768ac59a86ed68.jpg'], ARRAY['brown', 'grey', 'black'], ARRAY['чінос', 'елегантні'], 'male', 'https://borysfen.ua/chinos', NULL),
  ('Штани Широкі', 'Wide Leg Pants', 2300, 3, 6, 'Модні широкі штани', 'Fashionable wide-leg pants', 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f0732cd696fc0f0732cf.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f0773ff696fc0f077400.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f07a5d1696fc0f07a5d2.jpg'], ARRAY['black', 'white', 'grey'], ARRAY['широкі', 'модні'], 'female', 'https://stepova.com/wide-pants', NULL),
  ('Джогери Спортивні', 'Sport Joggers', 1400, 5, 6, 'Зручні спортивні джогери', 'Comfortable sport joggers', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97e1ace66bb4b97e1acf.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97e48f166bb4b97e48f2.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97dcbd166bb4b97dcbd2.jpg'], ARRAY['grey', 'black'], ARRAY['спорт', 'джогери'], 'unisex', 'https://kyiv-collection.com/joggers', NULL);

-- Outerwear (category_id: 7)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Пальто Класичне', 'Classic Coat', 6500, 3, 7, 'Класичне вовняне пальто', 'Classic wool coat', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/02/17/616544/gallery/616544_68bec01b5127768bec01b51278.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/02/17/616544/gallery/616544_68bec01b57a0368bec01b57a04.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/02/17/616544/gallery/616544_68bec01b5abb368bec01b5abb4.jpg'], ARRAY['black', 'grey', 'brown'], ARRAY['пальто', 'вовна', 'класика'], 'female', 'https://stepova.com/classic-coat', NULL),
  ('Куртка Шкіряна', 'Leather Jacket', 8900, 6, 7, 'Стильна шкіряна куртка', 'Stylish leather jacket', 'https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/12/685589/gallery/685589_69aa8d1a3dbae69aa8d1a3dbaf.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/12/685589/gallery/685589_69aa8d1a4064269aa8d1a40643.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/12/685589/gallery/685589_69aa8d1a4174569aa8d1a41746.jpg'], ARRAY['black', 'brown'], ARRAY['шкіра', 'байкер'], 'male', 'https://borysfen.ua/leather-jacket', 'https://instagram.com/p/jacket1'),
  ('Тренч Весняний', 'Spring Trench', 4200, 1, 7, 'Легкий весняний тренч', 'Light spring trench coat', 'https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/26/689259/gallery/689259_69aa8d992018569aa8d9920186.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/26/689259/gallery/689259_69aa8d9922e4a69aa8d9922e4b.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/26/689259/gallery/689259_69aa8d992484869aa8d9924849.jpg'], ARRAY['grey', 'brown'], ARRAY['тренч', 'весна'], 'female', 'https://leleka.ua/spring-trench', NULL),
  ('Пуховик Зимовий', 'Winter Puffer', 7200, 4, 7, 'Теплий зимовий пуховик', 'Warm winter puffer jacket', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/24/670568/gallery/670568_6953b2467dfc76953b2467dfc8.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/24/670568/gallery/670568_6953b246820f86953b246820f9.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/24/670568/gallery/670568_6953b246852926953b24685293.jpg'], ARRAY['black', 'white', 'red'], ARRAY['зима', 'теплий'], 'unisex', 'https://karpaty-style.ua/winter-puffer', NULL);

-- Skirts (category_id: 8)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Спідниця Плісе', 'Pleated Skirt', 1800, 1, 8, 'Елегантна плісирована спідниця', 'Elegant pleated skirt', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/04/04/627612/gallery/627612_69b040a3c612869b040a3c6129.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/04/04/627612/gallery/627612_69b040a3ca5e969b040a3ca5ea.jpg'], ARRAY['black', 'grey', 'blue'], ARRAY['плісе', 'елегантна'], 'female', 'https://leleka.ua/pleated-skirt', NULL),
  ('Спідниця Міні', 'Mini Skirt', 1200, 7, 8, 'Молодіжна міні спідниця', 'Youth mini skirt', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b99cae368d6a3b99cae4.jpeg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b99ec5868d6a3b99ec59.jpeg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b9a0e2968d6a3b9a0e2a.jpeg'], ARRAY['black', 'red', 'white'], ARRAY['міні', 'молодіжна'], 'female', 'https://soniachna.com/mini-skirt', NULL),
  ('Спідниця Максі', 'Maxi Skirt', 2400, 3, 8, 'Довга елегантна спідниця', 'Long elegant skirt', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/02/25/617873/gallery/617873_67bee1de4c9f967bee1de4c9fa.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/02/25/617873/gallery/617873_67bee1de4a83c67bee1de4a83d.jpg'], ARRAY['black', 'brown', 'green'], ARRAY['максі', 'елегантна'], 'female', 'https://stepova.com/maxi-skirt', NULL);

-- Sweaters & Cardigans (category_id: 9)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Светр Оверсайз', 'Oversized Sweater', 2600, 4, 9, 'Затишний светр оверсайз', 'Cozy oversized sweater', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac34726a3268cac34726a33.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac3473085268cac34730853.jpg'], ARRAY['grey', 'brown', 'white'], ARRAY['оверсайз', 'затишний'], 'unisex', 'https://karpaty-style.ua/oversized-sweater', NULL),
  ('Кардиган В''язаний', 'Knit Cardigan', 3100, 4, 9, 'Теплий в''язаний кардиган', 'Warm knitted cardigan', 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f0773ff696fc0f077400.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f07a5d1696fc0f07a5d2.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f0732cd696fc0f0732cf.jpg'], ARRAY['brown', 'grey', 'green'], ARRAY['кардиган', 'в''язаний'], 'female', 'https://karpaty-style.ua/knit-cardigan', 'https://instagram.com/p/cardigan1'),
  ('Гольф Базовий', 'Basic Turtleneck', 1400, 3, 9, 'Базовий гольф для капсульного гардеробу', 'Basic turtleneck for capsule wardrobe', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97dcbd166bb4b97dcbd2.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97e1ace66bb4b97e1acf.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97e48f166bb4b97e48f2.jpg'], ARRAY['black', 'white', 'grey', 'brown'], ARRAY['базовий', 'гольф'], 'unisex', 'https://stepova.com/turtleneck', NULL);

-- Suits (category_id: 10)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Костюм Діловий', 'Business Suit', 9800, 6, 10, 'Класичний діловий костюм', 'Classic business suit', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da068476d68a2da068476e.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da068223c68a2da068223d.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da0686ce968a2da0686cea.jpg'], ARRAY['black', 'grey', 'blue'], ARRAY['діловий', 'класика'], 'male', 'https://borysfen.ua/business-suit', NULL),
  ('Костюм Жіночий', 'Women''s Suit', 7500, 3, 10, 'Елегантний жіночий костюм', 'Elegant women''s suit', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab15974037069ab159740371.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab15974316d69ab15974316e.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab159739f1c69ab159739f1d.jpg'], ARRAY['black', 'white', 'grey'], ARRAY['діловий', 'елегантний'], 'female', 'https://stepova.com/womens-suit', NULL);

-- Sneakers (category_id: 11)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Кросівки Міські', 'Urban Sneakers', 3200, 5, 11, 'Стильні міські кросівки', 'Stylish urban sneakers', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a9624b56941a1a9624b6.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a9670266941a1a967027.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a96a8cd6941a1a96a8ce.jpg'], ARRAY['white', 'black', 'grey'], ARRAY['міські', 'комфорт'], 'unisex', 'https://kyiv-collection.com/urban-sneakers', NULL),
  ('Кросівки Спортивні', 'Sport Sneakers', 2800, 5, 11, 'Кросівки для активного способу життя', 'Sneakers for active lifestyle', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a1145cb826941a1145cb83.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a11461eba6941a11461ebb.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a11464ff16941a11464ff2.jpg'], ARRAY['black', 'red', 'blue'], ARRAY['спорт', 'біг'], 'unisex', 'https://kyiv-collection.com/sport-sneakers', NULL);

-- Boots (category_id: 12)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Черевики Челсі', 'Chelsea Boots', 4500, 6, 12, 'Класичні черевики челсі', 'Classic Chelsea boots', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07150.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07148.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07152.jpg'], ARRAY['black', 'brown'], ARRAY['челсі', 'класика'], 'male', 'https://borysfen.ua/chelsea-boots', NULL),
  ('Черевики Зимові', 'Winter Boots', 5200, 4, 12, 'Теплі зимові черевики', 'Warm winter boots', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07148.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07150.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07152.jpg'], ARRAY['black', 'brown', 'grey'], ARRAY['зима', 'теплі'], 'unisex', 'https://karpaty-style.ua/winter-boots', NULL);

-- Heels (category_id: 13)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Туфлі Класичні', 'Classic Heels', 3800, 1, 13, 'Елегантні класичні туфлі', 'Elegant classic heels', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/25/764201/gallery/33685.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/25/764201/gallery/33683.jpg'], ARRAY['black', 'red', 'white'], ARRAY['класика', 'елегантні'], 'female', 'https://leleka.ua/classic-heels', NULL),
  ('Туфлі Вечірні', 'Evening Heels', 4200, 1, 13, 'Вишукані вечірні туфлі', 'Exquisite evening heels', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/04/04/627612/gallery/627612_69b040a3ca5e969b040a3ca5ea.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/04/04/627612/gallery/627612_69b040a3c612869b040a3c6129.jpg'], ARRAY['gold', 'silver', 'black'], ARRAY['вечірні', 'свято'], 'female', 'https://leleka.ua/evening-heels', NULL);

-- Sandals (category_id: 14)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Сандалі Літні', 'Summer Sandals', 1800, 7, 14, 'Легкі літні сандалі', 'Light summer sandals', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a11464ff16941a11464ff2.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a1145cb826941a1145cb83.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a11461eba6941a11461ebb.jpg'], ARRAY['brown', 'white', 'black'], ARRAY['літо', 'комфорт'], 'female', 'https://soniachna.com/summer-sandals', NULL),
  ('Сандалі Шкіряні', 'Leather Sandals', 2400, 6, 14, 'Якісні шкіряні сандалі', 'Quality leather sandals', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a96a8cd6941a1a96a8ce.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a96d96e6941a1a96d96f.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a9624b56941a1a9624b6.jpg'], ARRAY['brown', 'black'], ARRAY['шкіра', 'якість'], 'male', 'https://borysfen.ua/leather-sandals', NULL);

-- Bags (category_id: 15)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Сумка Шоппер', 'Shopper Bag', 2800, 8, 15, 'Містка сумка-шоппер', 'Spacious shopper bag', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/20/583951/gallery/583951_684a7ef19b0e6684a7ef19b0e7.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/20/583951/gallery/583951_684a7ef19c6fb684a7ef19c6fc.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/20/583951/gallery/583951_684a7ef19deeb684a7ef19deec.jpg'], ARRAY['brown', 'black', 'grey'], ARRAY['шоппер', 'містка'], 'female', 'https://oberih.ua/shopper', NULL),
  ('Сумка Крос-боді', 'Crossbody Bag', 2200, 8, 15, 'Зручна сумка крос-боді', 'Convenient crossbody bag', 'https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/8f20f12e8a75e2a5933ae7c4af4e591c.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/b13ee2f96e43c80235b4c6a89bbd03e9.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/904a356418d7add0387740e8adad60ad.jpg'], ARRAY['black', 'brown', 'red'], ARRAY['крос-боді', 'зручна'], 'female', 'https://oberih.ua/crossbody', 'https://instagram.com/p/bag2'),
  ('Рюкзак Міський', 'Urban Backpack', 3100, 5, 15, 'Стильний міський рюкзак', 'Stylish urban backpack', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/11/621349/gallery/621349_68a47865c39d568a47865c39d6.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/11/621349/gallery/621349_68a47865c4d8f68a47865c4d90.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/11/621349/gallery/621349_68a47865c17da68a47865c17db.jpg'], ARRAY['black', 'grey', 'brown'], ARRAY['рюкзак', 'міський'], 'unisex', 'https://kyiv-collection.com/backpack', NULL);

-- Jewelry (category_id: 16)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Сережки Мінімалізм', 'Minimalist Earrings', 890, 8, 16, 'Елегантні мінімалістичні сережки', 'Elegant minimalist earrings', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/17/589448/gallery/589448_686baf4bdd37c686baf4bdd37e.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/17/589448/gallery/589448_686baf4bdf90f686baf4bdf910.jpg'], ARRAY['gold', 'silver'], ARRAY['мінімалізм', 'сережки'], 'female', 'https://oberih.ua/minimalist-earrings', NULL),
  ('Намисто Перлини', 'Pearl Necklace', 1800, 8, 16, 'Класичне намисто з перлин', 'Classic pearl necklace', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/17/589448/gallery/589448_686baf4bdf90f686baf4bdf910.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/17/589448/gallery/589448_686baf4bdd37c686baf4bdd37e.jpg'], ARRAY['white', 'gold'], ARRAY['перлини', 'класика'], 'female', 'https://oberih.ua/pearl-necklace', 'https://instagram.com/p/necklace1'),
  ('Браслет Шкіряний', 'Leather Bracelet', 650, 8, 16, 'Стильний шкіряний браслет', 'Stylish leather bracelet', 'https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/904a356418d7add0387740e8adad60ad.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/8f20f12e8a75e2a5933ae7c4af4e591c.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/b13ee2f96e43c80235b4c6a89bbd03e9.jpg'], ARRAY['brown', 'black'], ARRAY['шкіра', 'браслет'], 'unisex', 'https://oberih.ua/leather-bracelet', NULL);

-- Scarves (category_id: 17)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Шарф Кашеміровий', 'Cashmere Scarf', 2400, 4, 17, 'Теплий кашеміровий шарф', 'Warm cashmere scarf', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/22/662003/gallery/662003_69579bb0a26e869579bb0a26e9.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/22/662003/gallery/662003_69579bb0a5dc069579bb0a5dc1.jpg'], ARRAY['grey', 'brown', 'black'], ARRAY['кашемір', 'теплий'], 'unisex', 'https://karpaty-style.ua/cashmere-scarf', NULL),
  ('Хустка Шовкова', 'Silk Scarf', 1600, 7, 17, 'Елегантна шовкова хустка', 'Elegant silk scarf', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/13/667815/gallery/667815_6917765a8e68f6917765a8e690.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/13/667815/gallery/667815_6917765a920586917765a92059.jpg'], ARRAY['red', 'blue', 'green', 'yellow'], ARRAY['шовк', 'яскрава'], 'female', 'https://soniachna.com/silk-scarf', NULL);

-- Hats (category_id: 18)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Капелюх Фетровий', 'Felt Hat', 1900, 8, 18, 'Елегантний фетровий капелюх', 'Elegant felt hat', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/07/665789/gallery/665789_6961206dab3026961206dab303.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/07/665789/gallery/665789_6961206dae8716961206dae872.jpg'], ARRAY['black', 'brown', 'grey'], ARRAY['фетр', 'елегантний'], 'female', 'https://oberih.ua/felt-hat', NULL),
  ('Кепка Бейсболка', 'Baseball Cap', 750, 5, 18, 'Стильна бейсболка', 'Stylish baseball cap', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac34726a3268cac34726a33.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac3473085268cac34730853.jpg'], ARRAY['black', 'white', 'blue'], ARRAY['кепка', 'спорт'], 'unisex', 'https://kyiv-collection.com/cap', NULL),
  ('Шапка Зимова', 'Winter Beanie', 890, 4, 18, 'Тепла зимова шапка', 'Warm winter beanie', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac3473085268cac34730853.jpg', ARRAY['https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac34726a3268cac34726a33.jpg'], ARRAY['grey', 'black', 'white', 'red'], ARRAY['зима', 'тепла'], 'unisex', 'https://karpaty-style.ua/winter-beanie', NULL);

-- ===========================================
-- SITE SETTINGS
-- ===========================================

INSERT INTO site_settings (key, value) VALUES
  ('contact', '{"phone": "+380 44 123 4567", "email": "hello@listopad.ua", "address": "Київ, Україна"}'),
  ('social_links', '{"instagram": "https://instagram.com/listopad_ua", "facebook": "https://facebook.com/listopad", "twitter": "", "youtube": "", "tiktok": "https://tiktok.com/@listopad_ua"}');

-- ===========================================
-- PROMOTIONS (optional)
-- ===========================================

INSERT INTO promotions (title_uk, title_en, subtitle_uk, subtitle_en, discount_text, image_url, link_url, display_order, is_active) VALUES
  ('Весняна колекція', 'Spring Collection', 'Нові надходження вже в продажу', 'New arrivals now available', NULL, 'https://picsum.photos/seed/promo1/1200/600', '/shop?tags=весна', 1, true),
  ('Знижки на верхній одяг', 'Outerwear Sale', 'До 30% на пальта та куртки', 'Up to 30% off coats and jackets', '-30%', 'https://picsum.photos/seed/promo2/1200/600', '/shop?category=7', 2, true),
  ('Українські бренди', 'Ukrainian Brands', 'Підтримуй своїх', 'Support local', NULL, 'https://picsum.photos/seed/promo3/1200/600', '/brands', 3, true);
```
