/**
 * Database seeding script for development
 *
 * Seeds the development database with sample data from docs/DATABASE-SEEDING.md.
 * Safety: Refuses to run on production URLs.
 *
 * Usage:
 *   pnpm db:seed         - Seeds with upsert (safe for existing data)
 *   pnpm db:seed --clear - Clears all tables first, then seeds
 *   pnpm db:reset        - Alias for --clear
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Load .env.local
config({ path: resolve(process.cwd(), '.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Use service role key if available, otherwise fall back to anon key
const supabaseKey = serviceRoleKey || anonKey;


// ===========================================
// SEED DATA
// ===========================================

// Parent categories (id 1-3)
const parentCategories = [
  {
    id: 1,
    name_uk: 'Одяг',
    name_en: 'Clothing',
    marketing_desc_uk: 'Жіночий та чоловічий одяг від українських брендів',
    marketing_desc_en: "Women's and men's clothing from Ukrainian brands",
    parent_category: null,
  },
  {
    id: 2,
    name_uk: 'Взуття',
    name_en: 'Footwear',
    marketing_desc_uk: 'Стильне взуття на кожен день',
    marketing_desc_en: 'Stylish footwear for every day',
    parent_category: null,
  },
  {
    id: 3,
    name_uk: 'Аксесуари',
    name_en: 'Accessories',
    marketing_desc_uk: 'Модні аксесуари для завершення образу',
    marketing_desc_en: 'Fashion accessories to complete your look',
    parent_category: null,
  },
];

// Subcategories
const subcategories = [
  // Clothing subcategories (id 4-10)
  { id: 4, name_uk: 'Сукні', name_en: 'Dresses', marketing_desc_uk: 'Елегантні сукні', marketing_desc_en: 'Elegant dresses', parent_category: 1 },
  { id: 5, name_uk: 'Топи та блузи', name_en: 'Tops & Blouses', marketing_desc_uk: 'Стильні топи та блузи', marketing_desc_en: 'Stylish tops and blouses', parent_category: 1 },
  { id: 6, name_uk: 'Штани та джинси', name_en: 'Pants & Jeans', marketing_desc_uk: 'Зручні штани та джинси', marketing_desc_en: 'Comfortable pants and jeans', parent_category: 1 },
  { id: 7, name_uk: 'Верхній одяг', name_en: 'Outerwear', marketing_desc_uk: 'Куртки, пальта та тренчі', marketing_desc_en: 'Jackets, coats and trench coats', parent_category: 1 },
  { id: 8, name_uk: 'Спідниці', name_en: 'Skirts', marketing_desc_uk: 'Модні спідниці', marketing_desc_en: 'Fashionable skirts', parent_category: 1 },
  { id: 9, name_uk: 'Светри та кардигани', name_en: 'Sweaters & Cardigans', marketing_desc_uk: 'Теплі светри та кардигани', marketing_desc_en: 'Warm sweaters and cardigans', parent_category: 1 },
  { id: 10, name_uk: 'Костюми', name_en: 'Suits', marketing_desc_uk: 'Діловий та повсякденний стиль', marketing_desc_en: 'Business and casual style', parent_category: 1 },
  // Footwear subcategories (id 11-14)
  { id: 11, name_uk: 'Кросівки', name_en: 'Sneakers', marketing_desc_uk: 'Комфортні кросівки', marketing_desc_en: 'Comfortable sneakers', parent_category: 2 },
  { id: 12, name_uk: 'Черевики', name_en: 'Boots', marketing_desc_uk: 'Стильні черевики', marketing_desc_en: 'Stylish boots', parent_category: 2 },
  { id: 13, name_uk: 'Туфлі', name_en: 'Heels', marketing_desc_uk: 'Елегантні туфлі', marketing_desc_en: 'Elegant heels', parent_category: 2 },
  { id: 14, name_uk: 'Сандалі', name_en: 'Sandals', marketing_desc_uk: 'Легкі сандалі', marketing_desc_en: 'Light sandals', parent_category: 2 },
  // Accessories subcategories (id 15-18)
  { id: 15, name_uk: 'Сумки', name_en: 'Bags', marketing_desc_uk: 'Стильні сумки', marketing_desc_en: 'Stylish bags', parent_category: 3 },
  { id: 16, name_uk: 'Прикраси', name_en: 'Jewelry', marketing_desc_uk: 'Вишукані прикраси', marketing_desc_en: 'Exquisite jewelry', parent_category: 3 },
  { id: 17, name_uk: 'Шарфи та хустки', name_en: 'Scarves', marketing_desc_uk: 'Модні шарфи та хустки', marketing_desc_en: 'Fashionable scarves and shawls', parent_category: 3 },
  { id: 18, name_uk: 'Головні убори', name_en: 'Hats', marketing_desc_uk: 'Капелюхи та кепки', marketing_desc_en: 'Hats and caps', parent_category: 3 },
];

const brands = [
  { id: 1, name_uk: 'Лелека', name_en: 'Leleka', marketing_desc_uk: 'Сучасний український бренд жіночого одягу', marketing_desc_en: "Modern Ukrainian women's clothing brand", external_url: 'https://leleka.ua', inst_url: 'https://instagram.com/leleka_ua', logo_url: 'https://picsum.photos/seed/leleka-logo/200/200' },
  { id: 2, name_uk: 'Вишиванка Модерн', name_en: 'Vyshyvanka Modern', marketing_desc_uk: 'Традиції в сучасному стилі', marketing_desc_en: 'Traditions in modern style', external_url: 'https://vyshyvanka-modern.ua', inst_url: 'https://instagram.com/vyshyvanka_modern', logo_url: 'https://picsum.photos/seed/vyshyvanka-logo/200/200' },
  { id: 3, name_uk: 'Степова', name_en: 'Stepova', marketing_desc_uk: 'Мінімалізм та якість', marketing_desc_en: 'Minimalism and quality', external_url: 'https://stepova.com', inst_url: 'https://instagram.com/stepova_brand', logo_url: 'https://picsum.photos/seed/stepova-logo/200/200' },
  { id: 4, name_uk: 'Карпати Стайл', name_en: 'Karpaty Style', marketing_desc_uk: 'Натхненні горами', marketing_desc_en: 'Inspired by mountains', external_url: 'https://karpaty-style.ua', inst_url: 'https://instagram.com/karpaty_style', logo_url: 'https://picsum.photos/seed/karpaty-logo/200/200' },
  { id: 5, name_uk: 'Київ Колекшн', name_en: 'Kyiv Collection', marketing_desc_uk: 'Міська мода', marketing_desc_en: 'Urban fashion', external_url: 'https://kyiv-collection.com', inst_url: 'https://instagram.com/kyiv_collection', logo_url: 'https://picsum.photos/seed/kyiv-logo/200/200' },
  { id: 6, name_uk: 'Борисфен', name_en: 'Borysfen', marketing_desc_uk: 'Чоловічий одяг преміум класу', marketing_desc_en: "Premium men's clothing", external_url: 'https://borysfen.ua', inst_url: 'https://instagram.com/borysfen_ua', logo_url: 'https://picsum.photos/seed/borysfen-logo/200/200' },
  { id: 7, name_uk: 'Сонячна', name_en: 'Soniachna', marketing_desc_uk: 'Яскраві літні колекції', marketing_desc_en: 'Bright summer collections', external_url: 'https://soniachna.com', inst_url: 'https://instagram.com/soniachna', logo_url: 'https://picsum.photos/seed/soniachna-logo/200/200' },
  { id: 8, name_uk: 'Оберіг', name_en: 'Oberih', marketing_desc_uk: 'Аксесуари ручної роботи', marketing_desc_en: 'Handmade accessories', external_url: 'https://oberih.ua', inst_url: 'https://instagram.com/oberih_ua', logo_url: 'https://picsum.photos/seed/oberih-logo/200/200' },
];

const products = [
  // Dresses (category_id: 4)
  { id: 1, name_uk: 'Сукня Весняна', name_en: 'Spring Dress', price: 2800, brand_id: 1, category_id: 4, product_description_uk: 'Легка сукня з квітковим принтом, ідеальна для весняних прогулянок', product_description_en: 'Light dress with floral print, perfect for spring walks', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab159739f1c69ab159739f1d.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab15973d9c669ab15973d9c8.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab15974037069ab159740371.jpg'], colors: ['white', 'green'], tags: ['весна', 'квіти', 'легка'], gender: 'female', external_url: 'https://leleka.ua/dress-spring', inst_url: 'https://instagram.com/p/dress1', is_active: true },
  { id: 2, name_uk: 'Сукня Вечірня Зоря', name_en: 'Evening Star Dress', price: 5500, brand_id: 1, category_id: 4, product_description_uk: 'Елегантна вечірня сукня з шовку', product_description_en: 'Elegant silk evening dress', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da0686ce968a2da0686cea.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da068476d68a2da068476e.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da068223c68a2da068223d.jpg'], colors: ['black', 'gold'], tags: ['вечірня', 'елегантна', 'шовк'], gender: 'female', external_url: 'https://leleka.ua/evening-star', inst_url: null, is_active: true },
  { id: 3, name_uk: 'Сукня Міді Класика', name_en: 'Classic Midi Dress', price: 3200, brand_id: 3, category_id: 4, product_description_uk: 'Класична сукня міді довжини, підходить для офісу та виходу', product_description_en: 'Classic midi length dress, suitable for office and outings', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b9a0e2968d6a3b9a0e2a.jpeg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b99cae368d6a3b99cae4.jpeg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b99ec5868d6a3b99ec59.jpeg'], colors: ['grey', 'black', 'blue'], tags: ['класика', 'офіс', 'міді'], gender: 'female', external_url: 'https://stepova.com/classic-midi', inst_url: null, is_active: true },
  { id: 4, name_uk: 'Сукня Літня Бриз', name_en: 'Summer Breeze Dress', price: 2200, brand_id: 7, category_id: 4, product_description_uk: 'Легка літня сукня з натуральної тканини', product_description_en: 'Light summer dress made of natural fabric', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/25/764201/gallery/33683.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/25/764201/gallery/33685.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/25/663020/gallery/663020_69b04a99a870569b04a99a8706.jpg'], colors: ['white', 'yellow', 'cyan'], tags: ['літо', 'пляж', 'натуральна'], gender: 'female', external_url: 'https://soniachna.com/summer-breeze', inst_url: 'https://instagram.com/p/dress4', is_active: true },
  { id: 5, name_uk: 'Сукня Вишиванка', name_en: 'Vyshyvanka Dress', price: 4800, brand_id: 2, category_id: 4, product_description_uk: 'Сукня з традиційною українською вишивкою', product_description_en: 'Dress with traditional Ukrainian embroidery', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/15/654150/gallery/654150_68a2d986156bf68a2d986156c0.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/15/654150/gallery/654150_68a2d98611c4168a2d98611c42.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/15/654150/gallery/654150_68a2d98608cfb68a2d98608cfc.jpg'], colors: ['white', 'red'], tags: ['вишивка', 'традиційна', 'етно'], gender: 'female', external_url: 'https://vyshyvanka-modern.ua/dress', inst_url: 'https://instagram.com/p/dress5', is_active: true },

  // Tops & Blouses (category_id: 5)
  { id: 6, name_uk: 'Блуза Шовкова Ніч', name_en: 'Silk Night Blouse', price: 2400, brand_id: 1, category_id: 5, product_description_uk: 'Елегантна шовкова блуза', product_description_en: 'Elegant silk blouse', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/19/623943/gallery/623943_68380791a7fa868380791a7fa9.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/19/623943/gallery/623943_68380791a926068380791a9261.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/19/623943/gallery/623943_68380791a596868380791a5969.jpg'], colors: ['black', 'indigo'], tags: ['шовк', 'елегантна'], gender: 'female', external_url: 'https://leleka.ua/silk-night', inst_url: null, is_active: true },
  { id: 7, name_uk: 'Топ Спортивний', name_en: 'Sport Top', price: 890, brand_id: 5, category_id: 5, product_description_uk: 'Зручний топ для спорту та активного відпочинку', product_description_en: 'Comfortable top for sports and active leisure', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581296/gallery/581296_66bb4998cf76066bb4998cf761.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581296/gallery/581296_66bb4998ccf6366bb4998ccf64.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581296/gallery/581296_66bb4998c524e66bb4998c524f.jpg'], colors: ['black', 'white', 'grey'], tags: ['спорт', 'активний'], gender: 'female', external_url: 'https://kyiv-collection.com/sport-top', inst_url: null, is_active: true },
  { id: 8, name_uk: 'Блуза Офісна', name_en: 'Office Blouse', price: 1800, brand_id: 3, category_id: 5, product_description_uk: 'Класична блуза для ділового стилю', product_description_en: 'Classic blouse for business style', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/06/01/506995/gallery/506995_6836fa0f788ca6836fa0f788cb.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2023/06/01/506995/gallery/506995_6836fa0f752d46836fa0f752d5.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/06/01/506995/gallery/506995_6836fa0f70ab46836fa0f70ab5.jpg'], colors: ['white', 'blue', 'grey'], tags: ['офіс', 'діловий'], gender: 'female', external_url: 'https://stepova.com/office-blouse', inst_url: null, is_active: true },
  { id: 9, name_uk: 'Сорочка Вишита', name_en: 'Embroidered Shirt', price: 3200, brand_id: 2, category_id: 5, product_description_uk: 'Чоловіча сорочка з вишивкою', product_description_en: "Men's shirt with embroidery", preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/13/588686/gallery/588686_68930488615a768930488615a8.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/13/588686/gallery/588686_6893048863bbf6893048863bc0.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/13/588686/gallery/588686_68930488665886893048866589.jpg'], colors: ['white', 'blue'], tags: ['вишивка', 'традиційна'], gender: 'male', external_url: 'https://vyshyvanka-modern.ua/shirt', inst_url: 'https://instagram.com/p/shirt1', is_active: true },
  { id: 10, name_uk: 'Поло Класичне', name_en: 'Classic Polo', price: 1500, brand_id: 6, category_id: 5, product_description_uk: 'Класична чоловіча сорочка поло', product_description_en: "Classic men's polo shirt", preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581297/gallery/581297_66bb4ac2adcc666bb4ac2adcc8.png', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581297/gallery/581297_6835ccf8a078c6835ccf8a078d.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581297/gallery/581297_6835ccf8a705c6835ccf8a705d.jpg'], colors: ['white', 'black', 'blue', 'green'], tags: ['поло', 'класика'], gender: 'male', external_url: 'https://borysfen.ua/polo', inst_url: null, is_active: true },

  // Pants & Jeans (category_id: 6)
  { id: 11, name_uk: 'Джинси Класичні', name_en: 'Classic Jeans', price: 2100, brand_id: 5, category_id: 6, product_description_uk: 'Класичні джинси прямого крою', product_description_en: 'Classic straight-cut jeans', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/03/618979/gallery/618979_67c82351d63cb67c82351d63cc.jpeg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/03/618979/gallery/618979_67c82351ce95c67c82351ce95d.jpeg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/03/618979/gallery/618979_67c82351d2d3167c82351d2d32.jpeg'], colors: ['blue', 'black'], tags: ['джинси', 'класика'], gender: 'unisex', external_url: 'https://kyiv-collection.com/classic-jeans', inst_url: null, is_active: true },
  { id: 12, name_uk: 'Штани Чінос', name_en: 'Chino Pants', price: 1900, brand_id: 6, category_id: 6, product_description_uk: 'Елегантні штани чінос', product_description_en: 'Elegant chino pants', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/27/625952/gallery/625952_68ac59a871f9d68ac59a871f9e.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/27/625952/gallery/625952_68ac59a87486868ac59a874869.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/27/625952/gallery/625952_68ac59a86ed6768ac59a86ed68.jpg'], colors: ['brown', 'grey', 'black'], tags: ['чінос', 'елегантні'], gender: 'male', external_url: 'https://borysfen.ua/chinos', inst_url: null, is_active: true },
  { id: 13, name_uk: 'Штани Широкі', name_en: 'Wide Leg Pants', price: 2300, brand_id: 3, category_id: 6, product_description_uk: 'Модні широкі штани', product_description_en: 'Fashionable wide-leg pants', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f0732cd696fc0f0732cf.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f0773ff696fc0f077400.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f07a5d1696fc0f07a5d2.jpg'], colors: ['black', 'white', 'grey'], tags: ['широкі', 'модні'], gender: 'female', external_url: 'https://stepova.com/wide-pants', inst_url: null, is_active: true },
  { id: 14, name_uk: 'Джогери Спортивні', name_en: 'Sport Joggers', price: 1400, brand_id: 5, category_id: 6, product_description_uk: 'Зручні спортивні джогери', product_description_en: 'Comfortable sport joggers', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97e1ace66bb4b97e1acf.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97e48f166bb4b97e48f2.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97dcbd166bb4b97dcbd2.jpg'], colors: ['grey', 'black'], tags: ['спорт', 'джогери'], gender: 'unisex', external_url: 'https://kyiv-collection.com/joggers', inst_url: null, is_active: true },

  // Outerwear (category_id: 7)
  { id: 15, name_uk: 'Пальто Класичне', name_en: 'Classic Coat', price: 6500, brand_id: 3, category_id: 7, product_description_uk: 'Класичне вовняне пальто', product_description_en: 'Classic wool coat', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/02/17/616544/gallery/616544_68bec01b5127768bec01b51278.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/02/17/616544/gallery/616544_68bec01b57a0368bec01b57a04.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/02/17/616544/gallery/616544_68bec01b5abb368bec01b5abb4.jpg'], colors: ['black', 'grey', 'brown'], tags: ['пальто', 'вовна', 'класика'], gender: 'female', external_url: 'https://stepova.com/classic-coat', inst_url: null, is_active: true },
  { id: 16, name_uk: 'Куртка Шкіряна', name_en: 'Leather Jacket', price: 8900, brand_id: 6, category_id: 7, product_description_uk: 'Стильна шкіряна куртка', product_description_en: 'Stylish leather jacket', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/12/685589/gallery/685589_69aa8d1a3dbae69aa8d1a3dbaf.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/12/685589/gallery/685589_69aa8d1a4064269aa8d1a40643.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/12/685589/gallery/685589_69aa8d1a4174569aa8d1a41746.jpg'], colors: ['black', 'brown'], tags: ['шкіра', 'байкер'], gender: 'male', external_url: 'https://borysfen.ua/leather-jacket', inst_url: 'https://instagram.com/p/jacket1', is_active: true },
  { id: 17, name_uk: 'Тренч Весняний', name_en: 'Spring Trench', price: 4200, brand_id: 1, category_id: 7, product_description_uk: 'Легкий весняний тренч', product_description_en: 'Light spring trench coat', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/26/689259/gallery/689259_69aa8d992018569aa8d9920186.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/26/689259/gallery/689259_69aa8d9922e4a69aa8d9922e4b.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2026/02/26/689259/gallery/689259_69aa8d992484869aa8d9924849.jpg'], colors: ['grey', 'brown'], tags: ['тренч', 'весна'], gender: 'female', external_url: 'https://leleka.ua/spring-trench', inst_url: null, is_active: true },
  { id: 18, name_uk: 'Пуховик Зимовий', name_en: 'Winter Puffer', price: 7200, brand_id: 4, category_id: 7, product_description_uk: 'Теплий зимовий пуховик', product_description_en: 'Warm winter puffer jacket', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/24/670568/gallery/670568_6953b2467dfc76953b2467dfc8.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/24/670568/gallery/670568_6953b246820f86953b246820f9.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/24/670568/gallery/670568_6953b246852926953b24685293.jpg'], colors: ['black', 'white', 'red'], tags: ['зима', 'теплий'], gender: 'unisex', external_url: 'https://karpaty-style.ua/winter-puffer', inst_url: null, is_active: true },

  // Skirts (category_id: 8)
  { id: 19, name_uk: 'Спідниця Плісе', name_en: 'Pleated Skirt', price: 1800, brand_id: 1, category_id: 8, product_description_uk: 'Елегантна плісирована спідниця', product_description_en: 'Elegant pleated skirt', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/04/04/627612/gallery/627612_69b040a3c612869b040a3c6129.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/04/04/627612/gallery/627612_69b040a3ca5e969b040a3ca5ea.jpg'], colors: ['black', 'grey', 'blue'], tags: ['плісе', 'елегантна'], gender: 'female', external_url: 'https://leleka.ua/pleated-skirt', inst_url: null, is_active: true },
  { id: 20, name_uk: 'Спідниця Міні', name_en: 'Mini Skirt', price: 1200, brand_id: 7, category_id: 8, product_description_uk: 'Молодіжна міні спідниця', product_description_en: 'Youth mini skirt', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b99cae368d6a3b99cae4.jpeg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b99ec5868d6a3b99ec59.jpeg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/23/662548/gallery/662548_68d6a3b9a0e2968d6a3b9a0e2a.jpeg'], colors: ['black', 'red', 'white'], tags: ['міні', 'молодіжна'], gender: 'female', external_url: 'https://soniachna.com/mini-skirt', inst_url: null, is_active: true },
  { id: 21, name_uk: 'Спідниця Максі', name_en: 'Maxi Skirt', price: 2400, brand_id: 3, category_id: 8, product_description_uk: 'Довга елегантна спідниця', product_description_en: 'Long elegant skirt', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/02/25/617873/gallery/617873_67bee1de4c9f967bee1de4c9fa.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/02/25/617873/gallery/617873_67bee1de4a83c67bee1de4a83d.jpg'], colors: ['black', 'brown', 'green'], tags: ['максі', 'елегантна'], gender: 'female', external_url: 'https://stepova.com/maxi-skirt', inst_url: null, is_active: true },

  // Sweaters & Cardigans (category_id: 9)
  { id: 22, name_uk: 'Светр Оверсайз', name_en: 'Oversized Sweater', price: 2600, brand_id: 4, category_id: 9, product_description_uk: 'Затишний светр оверсайз', product_description_en: 'Cozy oversized sweater', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac34726a3268cac34726a33.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac3473085268cac34730853.jpg'], colors: ['grey', 'brown', 'white'], tags: ['оверсайз', 'затишний'], gender: 'unisex', external_url: 'https://karpaty-style.ua/oversized-sweater', inst_url: null, is_active: true },
  { id: 23, name_uk: "Кардиган В'язаний", name_en: 'Knit Cardigan', price: 3100, brand_id: 4, category_id: 9, product_description_uk: "Теплий в'язаний кардиган", product_description_en: 'Warm knitted cardigan', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f0773ff696fc0f077400.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f07a5d1696fc0f07a5d2.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2023/10/19/532646/gallery/532646_696fc0f0732cd696fc0f0732cf.jpg'], colors: ['brown', 'grey', 'green'], tags: ['кардиган', "в'язаний"], gender: 'female', external_url: 'https://karpaty-style.ua/knit-cardigan', inst_url: 'https://instagram.com/p/cardigan1', is_active: true },
  { id: 24, name_uk: 'Гольф Базовий', name_en: 'Basic Turtleneck', price: 1400, brand_id: 3, category_id: 9, product_description_uk: 'Базовий гольф для капсульного гардеробу', product_description_en: 'Basic turtleneck for capsule wardrobe', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97dcbd166bb4b97dcbd2.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97e1ace66bb4b97e1acf.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/07/31/581299/gallery/581299_66bb4b97e48f166bb4b97e48f2.jpg'], colors: ['black', 'white', 'grey', 'brown'], tags: ['базовий', 'гольф'], gender: 'unisex', external_url: 'https://stepova.com/turtleneck', inst_url: null, is_active: true },

  // Suits (category_id: 10)
  { id: 25, name_uk: 'Костюм Діловий', name_en: 'Business Suit', price: 9800, brand_id: 6, category_id: 10, product_description_uk: 'Класичний діловий костюм', product_description_en: 'Classic business suit', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da068476d68a2da068476e.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da068223c68a2da068223d.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/27/584997/gallery/584997_68a2da0686ce968a2da0686cea.jpg'], colors: ['black', 'grey', 'blue'], tags: ['діловий', 'класика'], gender: 'male', external_url: 'https://borysfen.ua/business-suit', inst_url: null, is_active: true },
  { id: 26, name_uk: 'Костюм Жіночий', name_en: "Women's Suit", price: 7500, brand_id: 3, category_id: 10, product_description_uk: 'Елегантний жіночий костюм', product_description_en: "Elegant women's suit", preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab15974037069ab159740371.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab15974316d69ab15974316e.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/04/657489/gallery/657489_69ab159739f1c69ab159739f1d.jpg'], colors: ['black', 'white', 'grey'], tags: ['діловий', 'елегантний'], gender: 'female', external_url: 'https://stepova.com/womens-suit', inst_url: null, is_active: true },

  // Sneakers (category_id: 11)
  { id: 27, name_uk: 'Кросівки Міські', name_en: 'Urban Sneakers', price: 3200, brand_id: 5, category_id: 11, product_description_uk: 'Стильні міські кросівки', product_description_en: 'Stylish urban sneakers', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a9624b56941a1a9624b6.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a9670266941a1a967027.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a96a8cd6941a1a96a8ce.jpg'], colors: ['white', 'black', 'grey'], tags: ['міські', 'комфорт'], gender: 'unisex', external_url: 'https://kyiv-collection.com/urban-sneakers', inst_url: null, is_active: true },
  { id: 28, name_uk: 'Кросівки Спортивні', name_en: 'Sport Sneakers', price: 2800, brand_id: 5, category_id: 11, product_description_uk: 'Кросівки для активного способу життя', product_description_en: 'Sneakers for active lifestyle', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a1145cb826941a1145cb83.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a11461eba6941a11461ebb.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a11464ff16941a11464ff2.jpg'], colors: ['black', 'red', 'blue'], tags: ['спорт', 'біг'], gender: 'unisex', external_url: 'https://kyiv-collection.com/sport-sneakers', inst_url: null, is_active: true },

  // Boots (category_id: 12)
  { id: 29, name_uk: 'Черевики Челсі', name_en: 'Chelsea Boots', price: 4500, brand_id: 6, category_id: 12, product_description_uk: 'Класичні черевики челсі', product_description_en: 'Classic Chelsea boots', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07150.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07148.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07152.jpg'], colors: ['black', 'brown'], tags: ['челсі', 'класика'], gender: 'male', external_url: 'https://borysfen.ua/chelsea-boots', inst_url: null, is_active: true },
  { id: 30, name_uk: 'Черевики Зимові', name_en: 'Winter Boots', price: 5200, brand_id: 4, category_id: 12, product_description_uk: 'Теплі зимові черевики', product_description_en: 'Warm winter boots', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07148.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07150.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/03/766256/gallery/DSC07152.jpg'], colors: ['black', 'brown', 'grey'], tags: ['зима', 'теплі'], gender: 'unisex', external_url: 'https://karpaty-style.ua/winter-boots', inst_url: null, is_active: true },

  // Heels (category_id: 13)
  { id: 31, name_uk: 'Туфлі Класичні', name_en: 'Classic Heels', price: 3800, brand_id: 1, category_id: 13, product_description_uk: 'Елегантні класичні туфлі', product_description_en: 'Elegant classic heels', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/25/764201/gallery/33685.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/25/764201/gallery/33683.jpg'], colors: ['black', 'red', 'white'], tags: ['класика', 'елегантні'], gender: 'female', external_url: 'https://leleka.ua/classic-heels', inst_url: null, is_active: true },
  { id: 32, name_uk: 'Туфлі Вечірні', name_en: 'Evening Heels', price: 4200, brand_id: 1, category_id: 13, product_description_uk: 'Вишукані вечірні туфлі', product_description_en: 'Exquisite evening heels', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/04/04/627612/gallery/627612_69b040a3ca5e969b040a3ca5ea.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/04/04/627612/gallery/627612_69b040a3c612869b040a3c6129.jpg'], colors: ['gold', 'silver', 'black'], tags: ['вечірні', 'свято'], gender: 'female', external_url: 'https://leleka.ua/evening-heels', inst_url: null, is_active: true },

  // Sandals (category_id: 14)
  { id: 33, name_uk: 'Сандалі Літні', name_en: 'Summer Sandals', price: 1800, brand_id: 7, category_id: 14, product_description_uk: 'Легкі літні сандалі', product_description_en: 'Light summer sandals', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a11464ff16941a11464ff2.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a1145cb826941a1145cb83.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658611/gallery/658611_6941a11461eba6941a11461ebb.jpg'], colors: ['brown', 'white', 'black'], tags: ['літо', 'комфорт'], gender: 'female', external_url: 'https://soniachna.com/summer-sandals', inst_url: null, is_active: true },
  { id: 34, name_uk: 'Сандалі Шкіряні', name_en: 'Leather Sandals', price: 2400, brand_id: 6, category_id: 14, product_description_uk: 'Якісні шкіряні сандалі', product_description_en: 'Quality leather sandals', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a96a8cd6941a1a96a8ce.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a96d96e6941a1a96d96f.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/09/658597/gallery/658597_6941a1a9624b56941a1a9624b6.jpg'], colors: ['brown', 'black'], tags: ['шкіра', 'якість'], gender: 'male', external_url: 'https://borysfen.ua/leather-sandals', inst_url: null, is_active: true },

  // Bags (category_id: 15)
  { id: 35, name_uk: 'Сумка Шоппер', name_en: 'Shopper Bag', price: 2800, brand_id: 8, category_id: 15, product_description_uk: 'Містка сумка-шоппер', product_description_en: 'Spacious shopper bag', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/20/583951/gallery/583951_684a7ef19b0e6684a7ef19b0e7.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/20/583951/gallery/583951_684a7ef19c6fb684a7ef19c6fc.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/08/20/583951/gallery/583951_684a7ef19deeb684a7ef19deec.jpg'], colors: ['brown', 'black', 'grey'], tags: ['шоппер', 'містка'], gender: 'female', external_url: 'https://oberih.ua/shopper', inst_url: null, is_active: true },
  { id: 36, name_uk: 'Сумка Крос-боді', name_en: 'Crossbody Bag', price: 2200, brand_id: 8, category_id: 15, product_description_uk: 'Зручна сумка крос-боді', product_description_en: 'Convenient crossbody bag', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/8f20f12e8a75e2a5933ae7c4af4e591c.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/b13ee2f96e43c80235b4c6a89bbd03e9.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/904a356418d7add0387740e8adad60ad.jpg'], colors: ['black', 'brown', 'red'], tags: ['крос-боді', 'зручна'], gender: 'female', external_url: 'https://oberih.ua/crossbody', inst_url: 'https://instagram.com/p/bag2', is_active: true },
  { id: 37, name_uk: 'Рюкзак Міський', name_en: 'Urban Backpack', price: 3100, brand_id: 5, category_id: 15, product_description_uk: 'Стильний міський рюкзак', product_description_en: 'Stylish urban backpack', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/11/621349/gallery/621349_68a47865c39d568a47865c39d6.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/11/621349/gallery/621349_68a47865c4d8f68a47865c4d90.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/03/11/621349/gallery/621349_68a47865c17da68a47865c17db.jpg'], colors: ['black', 'grey', 'brown'], tags: ['рюкзак', 'міський'], gender: 'unisex', external_url: 'https://kyiv-collection.com/backpack', inst_url: null, is_active: true },

  // Jewelry (category_id: 16)
  { id: 38, name_uk: 'Сережки Мінімалізм', name_en: 'Minimalist Earrings', price: 890, brand_id: 8, category_id: 16, product_description_uk: 'Елегантні мінімалістичні сережки', product_description_en: 'Elegant minimalist earrings', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/17/589448/gallery/589448_686baf4bdd37c686baf4bdd37e.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/17/589448/gallery/589448_686baf4bdf90f686baf4bdf910.jpg'], colors: ['gold', 'silver'], tags: ['мінімалізм', 'сережки'], gender: 'female', external_url: 'https://oberih.ua/minimalist-earrings', inst_url: null, is_active: true },
  { id: 39, name_uk: 'Намисто Перлини', name_en: 'Pearl Necklace', price: 1800, brand_id: 8, category_id: 16, product_description_uk: 'Класичне намисто з перлин', product_description_en: 'Classic pearl necklace', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/17/589448/gallery/589448_686baf4bdf90f686baf4bdf910.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2024/09/17/589448/gallery/589448_686baf4bdd37c686baf4bdd37e.jpg'], colors: ['white', 'gold'], tags: ['перлини', 'класика'], gender: 'female', external_url: 'https://oberih.ua/pearl-necklace', inst_url: 'https://instagram.com/p/necklace1', is_active: true },
  { id: 40, name_uk: 'Браслет Шкіряний', name_en: 'Leather Bracelet', price: 650, brand_id: 8, category_id: 16, product_description_uk: 'Стильний шкіряний браслет', product_description_en: 'Stylish leather bracelet', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/904a356418d7add0387740e8adad60ad.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/8f20f12e8a75e2a5933ae7c4af4e591c.jpg', 'https://media2.vsisvoi.ua/uploads/catalog/products/2022/04/01/376199/gallery/b13ee2f96e43c80235b4c6a89bbd03e9.jpg'], colors: ['brown', 'black'], tags: ['шкіра', 'браслет'], gender: 'unisex', external_url: 'https://oberih.ua/leather-bracelet', inst_url: null, is_active: true },

  // Scarves (category_id: 17)
  { id: 41, name_uk: 'Шарф Кашеміровий', name_en: 'Cashmere Scarf', price: 2400, brand_id: 4, category_id: 17, product_description_uk: 'Теплий кашеміровий шарф', product_description_en: 'Warm cashmere scarf', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/22/662003/gallery/662003_69579bb0a26e869579bb0a26e9.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/09/22/662003/gallery/662003_69579bb0a5dc069579bb0a5dc1.jpg'], colors: ['grey', 'brown', 'black'], tags: ['кашемір', 'теплий'], gender: 'unisex', external_url: 'https://karpaty-style.ua/cashmere-scarf', inst_url: null, is_active: true },
  { id: 42, name_uk: 'Хустка Шовкова', name_en: 'Silk Scarf', price: 1600, brand_id: 7, category_id: 17, product_description_uk: 'Елегантна шовкова хустка', product_description_en: 'Elegant silk scarf', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/13/667815/gallery/667815_6917765a8e68f6917765a8e690.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/13/667815/gallery/667815_6917765a920586917765a92059.jpg'], colors: ['red', 'blue', 'green', 'yellow'], tags: ['шовк', 'яскрава'], gender: 'female', external_url: 'https://soniachna.com/silk-scarf', inst_url: null, is_active: true },

  // Hats (category_id: 18)
  { id: 43, name_uk: 'Капелюх Фетровий', name_en: 'Felt Hat', price: 1900, brand_id: 8, category_id: 18, product_description_uk: 'Елегантний фетровий капелюх', product_description_en: 'Elegant felt hat', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/07/665789/gallery/665789_6961206dab3026961206dab303.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/10/07/665789/gallery/665789_6961206dae8716961206dae872.jpg'], colors: ['black', 'brown', 'grey'], tags: ['фетр', 'елегантний'], gender: 'female', external_url: 'https://oberih.ua/felt-hat', inst_url: null, is_active: true },
  { id: 44, name_uk: 'Кепка Бейсболка', name_en: 'Baseball Cap', price: 750, brand_id: 5, category_id: 18, product_description_uk: 'Стильна бейсболка', product_description_en: 'Stylish baseball cap', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac34726a3268cac34726a33.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac3473085268cac34730853.jpg'], colors: ['black', 'white', 'blue'], tags: ['кепка', 'спорт'], gender: 'unisex', external_url: 'https://kyiv-collection.com/cap', inst_url: null, is_active: true },
  { id: 45, name_uk: 'Шапка Зимова', name_en: 'Winter Beanie', price: 890, brand_id: 4, category_id: 18, product_description_uk: 'Тепла зимова шапка', product_description_en: 'Warm winter beanie', preview_image: 'https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac3473085268cac34730853.jpg', images: ['https://media2.vsisvoi.ua/uploads/catalog/products/2025/08/27/655881/gallery/655881_68cac34726a3268cac34726a33.jpg'], colors: ['grey', 'black', 'white', 'red'], tags: ['зима', 'тепла'], gender: 'unisex', external_url: 'https://karpaty-style.ua/winter-beanie', inst_url: null, is_active: true },
];

const promotions = [
  { id: 1, title_uk: 'Весняна колекція', title_en: 'Spring Collection', subtitle_uk: 'Нові надходження вже в продажу', subtitle_en: 'New arrivals now available', discount_text: null, image_url: 'https://picsum.photos/seed/promo1/1200/600', link_url: '/shop?tags=весна', display_order: 1, is_active: true },
  { id: 2, title_uk: 'Знижки на верхній одяг', title_en: 'Outerwear Sale', subtitle_uk: 'До 30% на пальта та куртки', subtitle_en: 'Up to 30% off coats and jackets', discount_text: '-30%', image_url: 'https://picsum.photos/seed/promo2/1200/600', link_url: '/shop?category=7', display_order: 2, is_active: true },
  { id: 3, title_uk: 'Українські бренди', title_en: 'Ukrainian Brands', subtitle_uk: 'Підтримуй своїх', subtitle_en: 'Support local', discount_text: null, image_url: 'https://picsum.photos/seed/promo3/1200/600', link_url: '/brands', display_order: 3, is_active: true },
];

const siteSettings = [
  { key: 'contact', value: { phone: '+380 44 123 4567', email: 'hello@listopad.ua', address: 'Київ, Україна' } },
  { key: 'social_links', value: { instagram: 'https://instagram.com/listopad_ua', facebook: 'https://facebook.com/listopad', twitter: '', youtube: '', tiktok: 'https://tiktok.com/@listopad_ua' } },
];

// ===========================================
// DATABASE OPERATIONS
// ===========================================

async function clearDatabase(supabase: SupabaseClient): Promise<void> {
  console.log('\nClearing database...');

  // Delete in order respecting foreign keys
  const tables = ['analytics_events', 'products', 'promotions', 'brands', 'categories', 'site_settings'];

  for (const table of tables) {
    // For categories, we need to delete subcategories first (those with parent_category)
    if (table === 'categories') {
      const { error: subError } = await supabase.from(table).delete().not('parent_category', 'is', null);
      if (subError) throw new Error(`Failed to clear ${table} subcategories: ${subError.message}`);

      const { error: parentError } = await supabase.from(table).delete().is('parent_category', null);
      if (parentError) throw new Error(`Failed to clear ${table} parents: ${parentError.message}`);
    } else {
      const { error } = await supabase.from(table).delete().gte('id', 0);
      if (error) {
        // Try alternative delete for tables without numeric id
        const { error: altError } = await supabase.from(table).delete().neq('key', '');
        if (altError) throw new Error(`Failed to clear ${table}: ${error.message}`);
      }
    }
    console.log(`  Cleared ${table}`);
  }

  console.log('Database cleared successfully!\n');
}

async function seedDatabase(): Promise<void> {
  const shouldClear = process.argv.includes('--clear');

  console.log('Listopad Database Seeder\n');

  // Validate environment
  if (!supabaseUrl || !supabaseKey) {
    console.error('Error: Missing Supabase credentials.');
    console.error('Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and either');
    console.error('SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY');
    process.exit(1);
  }

  console.log(`Target: ${supabaseUrl}`);
  console.log(`Using: ${serviceRoleKey && serviceRoleKey.length > 0 ? 'service role key' : 'anon key'}`);
  console.log(`Mode: ${shouldClear ? 'CLEAR + SEED' : 'UPSERT (safe)'}`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Clear database if --clear flag is passed
    if (shouldClear) {
      if (!serviceRoleKey || serviceRoleKey.length === 0) {
        console.error('\nError: --clear requires SUPABASE_SERVICE_ROLE_KEY');
        console.error('The anon key may not have DELETE permissions.');
        process.exit(1);
      }
      await clearDatabase(supabase);
    }

    // Seed parent categories first
    console.log('Seeding categories...');
    const { error: parentCatError } = await supabase.from('categories').upsert(parentCategories, { onConflict: 'id' });
    if (parentCatError) throw new Error(`Failed to seed parent categories: ${parentCatError.message}`);

    // Then seed subcategories
    const { error: subCatError } = await supabase.from('categories').upsert(subcategories, { onConflict: 'id' });
    if (subCatError) throw new Error(`Failed to seed subcategories: ${subCatError.message}`);
    console.log('  18 categories seeded');

    // Seed brands
    console.log('Seeding brands...');
    const { error: brandError } = await supabase.from('brands').upsert(brands, { onConflict: 'id' });
    if (brandError) throw new Error(`Failed to seed brands: ${brandError.message}`);
    console.log('  8 brands seeded');

    // Seed products
    console.log('Seeding products...');
    const { error: prodError } = await supabase.from('products').upsert(products, { onConflict: 'id' });
    if (prodError) throw new Error(`Failed to seed products: ${prodError.message}`);
    console.log('  45 products seeded');

    // Seed promotions
    console.log('Seeding promotions...');
    const { error: promoError } = await supabase.from('promotions').upsert(promotions, { onConflict: 'id' });
    if (promoError) throw new Error(`Failed to seed promotions: ${promoError.message}`);
    console.log('  3 promotions seeded');

    // Seed site settings
    console.log('Seeding site settings...');
    const { error: settingsError } = await supabase.from('site_settings').upsert(siteSettings, { onConflict: 'key' });
    if (settingsError) throw new Error(`Failed to seed site settings: ${settingsError.message}`);
    console.log('  2 site settings seeded');

    console.log('\nDatabase seeded successfully!');
  } catch (error) {
    console.error('\nSeeding failed:', error instanceof Error ? error.message : error);
    process.exit(1);
  }
}

seedDatabase();
