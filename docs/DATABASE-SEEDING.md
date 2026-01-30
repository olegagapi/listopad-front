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

INSERT INTO brands (name_uk, name_en, marketing_desc_uk, marketing_desc_en, external_url, inst_url) VALUES
  ('Лелека', 'Leleka', 'Сучасний український бренд жіночого одягу', 'Modern Ukrainian women''s clothing brand', 'https://leleka.ua', 'https://instagram.com/leleka_ua'),
  ('Вишиванка Модерн', 'Vyshyvanka Modern', 'Традиції в сучасному стилі', 'Traditions in modern style', 'https://vyshyvanka-modern.ua', 'https://instagram.com/vyshyvanka_modern'),
  ('Степова', 'Stepova', 'Мінімалізм та якість', 'Minimalism and quality', 'https://stepova.com', 'https://instagram.com/stepova_brand'),
  ('Карпати Стайл', 'Karpaty Style', 'Натхненні горами', 'Inspired by mountains', 'https://karpaty-style.ua', 'https://instagram.com/karpaty_style'),
  ('Київ Колекшн', 'Kyiv Collection', 'Міська мода', 'Urban fashion', 'https://kyiv-collection.com', 'https://instagram.com/kyiv_collection'),
  ('Борисфен', 'Borysfen', 'Чоловічий одяг преміум класу', 'Premium men''s clothing', 'https://borysfen.ua', 'https://instagram.com/borysfen_ua'),
  ('Сонячна', 'Soniachna', 'Яскраві літні колекції', 'Bright summer collections', 'https://soniachna.com', 'https://instagram.com/soniachna'),
  ('Оберіг', 'Oberih', 'Аксесуари ручної роботи', 'Handmade accessories', 'https://oberih.ua', 'https://instagram.com/oberih_ua');

-- ===========================================
-- PRODUCTS
-- ===========================================

-- Dresses (category_id: 4)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Сукня Весняна', 'Spring Dress', 2800, 1, 4, 'Легка сукня з квітковим принтом, ідеальна для весняних прогулянок', 'Light dress with floral print, perfect for spring walks', 'https://picsum.photos/seed/dress1/400/600', ARRAY['https://picsum.photos/seed/dress1a/400/600', 'https://picsum.photos/seed/dress1b/400/600'], ARRAY['white', 'green'], ARRAY['весна', 'квіти', 'легка'], 'female', 'https://leleka.ua/dress-spring', 'https://instagram.com/p/dress1'),
  ('Сукня Вечірня Зоря', 'Evening Star Dress', 5500, 1, 4, 'Елегантна вечірня сукня з шовку', 'Elegant silk evening dress', 'https://picsum.photos/seed/dress2/400/600', ARRAY['https://picsum.photos/seed/dress2a/400/600'], ARRAY['black', 'gold'], ARRAY['вечірня', 'елегантна', 'шовк'], 'female', 'https://leleka.ua/evening-star', NULL),
  ('Сукня Міді Класика', 'Classic Midi Dress', 3200, 3, 4, 'Класична сукня міді довжини, підходить для офісу та виходу', 'Classic midi length dress, suitable for office and outings', 'https://picsum.photos/seed/dress3/400/600', ARRAY['https://picsum.photos/seed/dress3a/400/600', 'https://picsum.photos/seed/dress3b/400/600'], ARRAY['grey', 'black', 'blue'], ARRAY['класика', 'офіс', 'міді'], 'female', 'https://stepova.com/classic-midi', NULL),
  ('Сукня Літня Бриз', 'Summer Breeze Dress', 2200, 7, 4, 'Легка літня сукня з натуральної тканини', 'Light summer dress made of natural fabric', 'https://picsum.photos/seed/dress4/400/600', ARRAY['https://picsum.photos/seed/dress4a/400/600'], ARRAY['white', 'yellow', 'cyan'], ARRAY['літо', 'пляж', 'натуральна'], 'female', 'https://soniachna.com/summer-breeze', 'https://instagram.com/p/dress4'),
  ('Сукня Вишиванка', 'Vyshyvanka Dress', 4800, 2, 4, 'Сукня з традиційною українською вишивкою', 'Dress with traditional Ukrainian embroidery', 'https://picsum.photos/seed/dress5/400/600', ARRAY['https://picsum.photos/seed/dress5a/400/600', 'https://picsum.photos/seed/dress5b/400/600'], ARRAY['white', 'red'], ARRAY['вишивка', 'традиційна', 'етно'], 'female', 'https://vyshyvanka-modern.ua/dress', 'https://instagram.com/p/dress5');

-- Tops & Blouses (category_id: 5)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Блуза Шовкова Ніч', 'Silk Night Blouse', 2400, 1, 5, 'Елегантна шовкова блуза', 'Elegant silk blouse', 'https://picsum.photos/seed/blouse1/400/600', ARRAY['https://picsum.photos/seed/blouse1a/400/600'], ARRAY['black', 'indigo'], ARRAY['шовк', 'елегантна'], 'female', 'https://leleka.ua/silk-night', NULL),
  ('Топ Спортивний', 'Sport Top', 890, 5, 5, 'Зручний топ для спорту та активного відпочинку', 'Comfortable top for sports and active leisure', 'https://picsum.photos/seed/top1/400/600', ARRAY['https://picsum.photos/seed/top1a/400/600'], ARRAY['black', 'white', 'grey'], ARRAY['спорт', 'активний'], 'female', 'https://kyiv-collection.com/sport-top', NULL),
  ('Блуза Офісна', 'Office Blouse', 1800, 3, 5, 'Класична блуза для ділового стилю', 'Classic blouse for business style', 'https://picsum.photos/seed/blouse2/400/600', ARRAY['https://picsum.photos/seed/blouse2a/400/600'], ARRAY['white', 'blue', 'grey'], ARRAY['офіс', 'діловий'], 'female', 'https://stepova.com/office-blouse', NULL),
  ('Сорочка Вишита', 'Embroidered Shirt', 3200, 2, 5, 'Чоловіча сорочка з вишивкою', 'Men''s shirt with embroidery', 'https://picsum.photos/seed/shirt1/400/600', ARRAY['https://picsum.photos/seed/shirt1a/400/600'], ARRAY['white', 'blue'], ARRAY['вишивка', 'традиційна'], 'male', 'https://vyshyvanka-modern.ua/shirt', 'https://instagram.com/p/shirt1'),
  ('Поло Класичне', 'Classic Polo', 1500, 6, 5, 'Класична чоловіча сорочка поло', 'Classic men''s polo shirt', 'https://picsum.photos/seed/polo1/400/600', ARRAY['https://picsum.photos/seed/polo1a/400/600'], ARRAY['white', 'black', 'blue', 'green'], ARRAY['поло', 'класика'], 'male', 'https://borysfen.ua/polo', NULL);

-- Pants & Jeans (category_id: 6)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Джинси Класичні', 'Classic Jeans', 2100, 5, 6, 'Класичні джинси прямого крою', 'Classic straight-cut jeans', 'https://picsum.photos/seed/jeans1/400/600', ARRAY['https://picsum.photos/seed/jeans1a/400/600'], ARRAY['blue', 'black'], ARRAY['джинси', 'класика'], 'unisex', 'https://kyiv-collection.com/classic-jeans', NULL),
  ('Штани Чінос', 'Chino Pants', 1900, 6, 6, 'Елегантні штани чінос', 'Elegant chino pants', 'https://picsum.photos/seed/chinos1/400/600', ARRAY['https://picsum.photos/seed/chinos1a/400/600'], ARRAY['brown', 'grey', 'black'], ARRAY['чінос', 'елегантні'], 'male', 'https://borysfen.ua/chinos', NULL),
  ('Штани Широкі', 'Wide Leg Pants', 2300, 3, 6, 'Модні широкі штани', 'Fashionable wide-leg pants', 'https://picsum.photos/seed/pants1/400/600', ARRAY['https://picsum.photos/seed/pants1a/400/600'], ARRAY['black', 'white', 'grey'], ARRAY['широкі', 'модні'], 'female', 'https://stepova.com/wide-pants', NULL),
  ('Джогери Спортивні', 'Sport Joggers', 1400, 5, 6, 'Зручні спортивні джогери', 'Comfortable sport joggers', 'https://picsum.photos/seed/joggers1/400/600', ARRAY['https://picsum.photos/seed/joggers1a/400/600'], ARRAY['grey', 'black'], ARRAY['спорт', 'джогери'], 'unisex', 'https://kyiv-collection.com/joggers', NULL);

-- Outerwear (category_id: 7)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Пальто Класичне', 'Classic Coat', 6500, 3, 7, 'Класичне вовняне пальто', 'Classic wool coat', 'https://picsum.photos/seed/coat1/400/600', ARRAY['https://picsum.photos/seed/coat1a/400/600', 'https://picsum.photos/seed/coat1b/400/600'], ARRAY['black', 'grey', 'brown'], ARRAY['пальто', 'вовна', 'класика'], 'female', 'https://stepova.com/classic-coat', NULL),
  ('Куртка Шкіряна', 'Leather Jacket', 8900, 6, 7, 'Стильна шкіряна куртка', 'Stylish leather jacket', 'https://picsum.photos/seed/jacket1/400/600', ARRAY['https://picsum.photos/seed/jacket1a/400/600'], ARRAY['black', 'brown'], ARRAY['шкіра', 'байкер'], 'male', 'https://borysfen.ua/leather-jacket', 'https://instagram.com/p/jacket1'),
  ('Тренч Весняний', 'Spring Trench', 4200, 1, 7, 'Легкий весняний тренч', 'Light spring trench coat', 'https://picsum.photos/seed/trench1/400/600', ARRAY['https://picsum.photos/seed/trench1a/400/600'], ARRAY['grey', 'brown'], ARRAY['тренч', 'весна'], 'female', 'https://leleka.ua/spring-trench', NULL),
  ('Пуховик Зимовий', 'Winter Puffer', 7200, 4, 7, 'Теплий зимовий пуховик', 'Warm winter puffer jacket', 'https://picsum.photos/seed/puffer1/400/600', ARRAY['https://picsum.photos/seed/puffer1a/400/600'], ARRAY['black', 'white', 'red'], ARRAY['зима', 'теплий'], 'unisex', 'https://karpaty-style.ua/winter-puffer', NULL);

-- Skirts (category_id: 8)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Спідниця Плісе', 'Pleated Skirt', 1800, 1, 8, 'Елегантна плісирована спідниця', 'Elegant pleated skirt', 'https://picsum.photos/seed/skirt1/400/600', ARRAY['https://picsum.photos/seed/skirt1a/400/600'], ARRAY['black', 'grey', 'blue'], ARRAY['плісе', 'елегантна'], 'female', 'https://leleka.ua/pleated-skirt', NULL),
  ('Спідниця Міні', 'Mini Skirt', 1200, 7, 8, 'Молодіжна міні спідниця', 'Youth mini skirt', 'https://picsum.photos/seed/skirt2/400/600', ARRAY['https://picsum.photos/seed/skirt2a/400/600'], ARRAY['black', 'red', 'white'], ARRAY['міні', 'молодіжна'], 'female', 'https://soniachna.com/mini-skirt', NULL),
  ('Спідниця Максі', 'Maxi Skirt', 2400, 3, 8, 'Довга елегантна спідниця', 'Long elegant skirt', 'https://picsum.photos/seed/skirt3/400/600', ARRAY['https://picsum.photos/seed/skirt3a/400/600'], ARRAY['black', 'brown', 'green'], ARRAY['максі', 'елегантна'], 'female', 'https://stepova.com/maxi-skirt', NULL);

-- Sweaters & Cardigans (category_id: 9)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Светр Оверсайз', 'Oversized Sweater', 2600, 4, 9, 'Затишний светр оверсайз', 'Cozy oversized sweater', 'https://picsum.photos/seed/sweater1/400/600', ARRAY['https://picsum.photos/seed/sweater1a/400/600'], ARRAY['grey', 'brown', 'white'], ARRAY['оверсайз', 'затишний'], 'unisex', 'https://karpaty-style.ua/oversized-sweater', NULL),
  ('Кардиган В''язаний', 'Knit Cardigan', 3100, 4, 9, 'Теплий в''язаний кардиган', 'Warm knitted cardigan', 'https://picsum.photos/seed/cardigan1/400/600', ARRAY['https://picsum.photos/seed/cardigan1a/400/600'], ARRAY['brown', 'grey', 'green'], ARRAY['кардиган', 'в''язаний'], 'female', 'https://karpaty-style.ua/knit-cardigan', 'https://instagram.com/p/cardigan1'),
  ('Гольф Базовий', 'Basic Turtleneck', 1400, 3, 9, 'Базовий гольф для капсульного гардеробу', 'Basic turtleneck for capsule wardrobe', 'https://picsum.photos/seed/turtleneck1/400/600', ARRAY['https://picsum.photos/seed/turtleneck1a/400/600'], ARRAY['black', 'white', 'grey', 'brown'], ARRAY['базовий', 'гольф'], 'unisex', 'https://stepova.com/turtleneck', NULL);

-- Suits (category_id: 10)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Костюм Діловий', 'Business Suit', 9800, 6, 10, 'Класичний діловий костюм', 'Classic business suit', 'https://picsum.photos/seed/suit1/400/600', ARRAY['https://picsum.photos/seed/suit1a/400/600', 'https://picsum.photos/seed/suit1b/400/600'], ARRAY['black', 'grey', 'blue'], ARRAY['діловий', 'класика'], 'male', 'https://borysfen.ua/business-suit', NULL),
  ('Костюм Жіночий', 'Women''s Suit', 7500, 3, 10, 'Елегантний жіночий костюм', 'Elegant women''s suit', 'https://picsum.photos/seed/suit2/400/600', ARRAY['https://picsum.photos/seed/suit2a/400/600'], ARRAY['black', 'white', 'grey'], ARRAY['діловий', 'елегантний'], 'female', 'https://stepova.com/womens-suit', NULL);

-- Sneakers (category_id: 11)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Кросівки Міські', 'Urban Sneakers', 3200, 5, 11, 'Стильні міські кросівки', 'Stylish urban sneakers', 'https://picsum.photos/seed/sneakers1/400/600', ARRAY['https://picsum.photos/seed/sneakers1a/400/600'], ARRAY['white', 'black', 'grey'], ARRAY['міські', 'комфорт'], 'unisex', 'https://kyiv-collection.com/urban-sneakers', NULL),
  ('Кросівки Спортивні', 'Sport Sneakers', 2800, 5, 11, 'Кросівки для активного способу життя', 'Sneakers for active lifestyle', 'https://picsum.photos/seed/sneakers2/400/600', ARRAY['https://picsum.photos/seed/sneakers2a/400/600'], ARRAY['black', 'red', 'blue'], ARRAY['спорт', 'біг'], 'unisex', 'https://kyiv-collection.com/sport-sneakers', NULL);

-- Boots (category_id: 12)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Черевики Челсі', 'Chelsea Boots', 4500, 6, 12, 'Класичні черевики челсі', 'Classic Chelsea boots', 'https://picsum.photos/seed/boots1/400/600', ARRAY['https://picsum.photos/seed/boots1a/400/600'], ARRAY['black', 'brown'], ARRAY['челсі', 'класика'], 'male', 'https://borysfen.ua/chelsea-boots', NULL),
  ('Черевики Зимові', 'Winter Boots', 5200, 4, 12, 'Теплі зимові черевики', 'Warm winter boots', 'https://picsum.photos/seed/boots2/400/600', ARRAY['https://picsum.photos/seed/boots2a/400/600'], ARRAY['black', 'brown', 'grey'], ARRAY['зима', 'теплі'], 'unisex', 'https://karpaty-style.ua/winter-boots', NULL);

-- Heels (category_id: 13)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Туфлі Класичні', 'Classic Heels', 3800, 1, 13, 'Елегантні класичні туфлі', 'Elegant classic heels', 'https://picsum.photos/seed/heels1/400/600', ARRAY['https://picsum.photos/seed/heels1a/400/600'], ARRAY['black', 'red', 'white'], ARRAY['класика', 'елегантні'], 'female', 'https://leleka.ua/classic-heels', NULL),
  ('Туфлі Вечірні', 'Evening Heels', 4200, 1, 13, 'Вишукані вечірні туфлі', 'Exquisite evening heels', 'https://picsum.photos/seed/heels2/400/600', ARRAY['https://picsum.photos/seed/heels2a/400/600'], ARRAY['gold', 'silver', 'black'], ARRAY['вечірні', 'свято'], 'female', 'https://leleka.ua/evening-heels', NULL);

-- Sandals (category_id: 14)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Сандалі Літні', 'Summer Sandals', 1800, 7, 14, 'Легкі літні сандалі', 'Light summer sandals', 'https://picsum.photos/seed/sandals1/400/600', ARRAY['https://picsum.photos/seed/sandals1a/400/600'], ARRAY['brown', 'white', 'black'], ARRAY['літо', 'комфорт'], 'female', 'https://soniachna.com/summer-sandals', NULL),
  ('Сандалі Шкіряні', 'Leather Sandals', 2400, 6, 14, 'Якісні шкіряні сандалі', 'Quality leather sandals', 'https://picsum.photos/seed/sandals2/400/600', ARRAY['https://picsum.photos/seed/sandals2a/400/600'], ARRAY['brown', 'black'], ARRAY['шкіра', 'якість'], 'male', 'https://borysfen.ua/leather-sandals', NULL);

-- Bags (category_id: 15)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Сумка Шоппер', 'Shopper Bag', 2800, 8, 15, 'Містка сумка-шоппер', 'Spacious shopper bag', 'https://picsum.photos/seed/bag1/400/600', ARRAY['https://picsum.photos/seed/bag1a/400/600'], ARRAY['brown', 'black', 'grey'], ARRAY['шоппер', 'містка'], 'female', 'https://oberih.ua/shopper', NULL),
  ('Сумка Крос-боді', 'Crossbody Bag', 2200, 8, 15, 'Зручна сумка крос-боді', 'Convenient crossbody bag', 'https://picsum.photos/seed/bag2/400/600', ARRAY['https://picsum.photos/seed/bag2a/400/600'], ARRAY['black', 'brown', 'red'], ARRAY['крос-боді', 'зручна'], 'female', 'https://oberih.ua/crossbody', 'https://instagram.com/p/bag2'),
  ('Рюкзак Міський', 'Urban Backpack', 3100, 5, 15, 'Стильний міський рюкзак', 'Stylish urban backpack', 'https://picsum.photos/seed/backpack1/400/600', ARRAY['https://picsum.photos/seed/backpack1a/400/600'], ARRAY['black', 'grey', 'brown'], ARRAY['рюкзак', 'міський'], 'unisex', 'https://kyiv-collection.com/backpack', NULL);

-- Jewelry (category_id: 16)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Сережки Мінімалізм', 'Minimalist Earrings', 890, 8, 16, 'Елегантні мінімалістичні сережки', 'Elegant minimalist earrings', 'https://picsum.photos/seed/earrings1/400/600', ARRAY['https://picsum.photos/seed/earrings1a/400/600'], ARRAY['gold', 'silver'], ARRAY['мінімалізм', 'сережки'], 'female', 'https://oberih.ua/minimalist-earrings', NULL),
  ('Намисто Перлини', 'Pearl Necklace', 1800, 8, 16, 'Класичне намисто з перлин', 'Classic pearl necklace', 'https://picsum.photos/seed/necklace1/400/600', ARRAY['https://picsum.photos/seed/necklace1a/400/600'], ARRAY['white', 'gold'], ARRAY['перлини', 'класика'], 'female', 'https://oberih.ua/pearl-necklace', 'https://instagram.com/p/necklace1'),
  ('Браслет Шкіряний', 'Leather Bracelet', 650, 8, 16, 'Стильний шкіряний браслет', 'Stylish leather bracelet', 'https://picsum.photos/seed/bracelet1/400/600', ARRAY['https://picsum.photos/seed/bracelet1a/400/600'], ARRAY['brown', 'black'], ARRAY['шкіра', 'браслет'], 'unisex', 'https://oberih.ua/leather-bracelet', NULL);

-- Scarves (category_id: 17)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Шарф Кашеміровий', 'Cashmere Scarf', 2400, 4, 17, 'Теплий кашеміровий шарф', 'Warm cashmere scarf', 'https://picsum.photos/seed/scarf1/400/600', ARRAY['https://picsum.photos/seed/scarf1a/400/600'], ARRAY['grey', 'brown', 'black'], ARRAY['кашемір', 'теплий'], 'unisex', 'https://karpaty-style.ua/cashmere-scarf', NULL),
  ('Хустка Шовкова', 'Silk Scarf', 1600, 7, 17, 'Елегантна шовкова хустка', 'Elegant silk scarf', 'https://picsum.photos/seed/scarf2/400/600', ARRAY['https://picsum.photos/seed/scarf2a/400/600'], ARRAY['red', 'blue', 'green', 'yellow'], ARRAY['шовк', 'яскрава'], 'female', 'https://soniachna.com/silk-scarf', NULL);

-- Hats (category_id: 18)
INSERT INTO products (name_uk, name_en, price, brand_id, category_id, product_description_uk, product_description_en, preview_image, images, colors, tags, gender, external_url, inst_url) VALUES
  ('Капелюх Фетровий', 'Felt Hat', 1900, 8, 18, 'Елегантний фетровий капелюх', 'Elegant felt hat', 'https://picsum.photos/seed/hat1/400/600', ARRAY['https://picsum.photos/seed/hat1a/400/600'], ARRAY['black', 'brown', 'grey'], ARRAY['фетр', 'елегантний'], 'female', 'https://oberih.ua/felt-hat', NULL),
  ('Кепка Бейсболка', 'Baseball Cap', 750, 5, 18, 'Стильна бейсболка', 'Stylish baseball cap', 'https://picsum.photos/seed/cap1/400/600', ARRAY['https://picsum.photos/seed/cap1a/400/600'], ARRAY['black', 'white', 'blue'], ARRAY['кепка', 'спорт'], 'unisex', 'https://kyiv-collection.com/cap', NULL),
  ('Шапка Зимова', 'Winter Beanie', 890, 4, 18, 'Тепла зимова шапка', 'Warm winter beanie', 'https://picsum.photos/seed/beanie1/400/600', ARRAY['https://picsum.photos/seed/beanie1a/400/600'], ARRAY['grey', 'black', 'white', 'red'], ARRAY['зима', 'тепла'], 'unisex', 'https://karpaty-style.ua/winter-beanie', NULL);

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
