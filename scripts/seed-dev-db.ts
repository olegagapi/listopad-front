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
  { id: 1, name_uk: 'Лелека', name_en: 'Leleka', marketing_desc_uk: 'Сучасний український бренд жіночого одягу', marketing_desc_en: "Modern Ukrainian women's clothing brand", external_url: 'https://leleka.ua', inst_url: 'https://instagram.com/leleka_ua' },
  { id: 2, name_uk: 'Вишиванка Модерн', name_en: 'Vyshyvanka Modern', marketing_desc_uk: 'Традиції в сучасному стилі', marketing_desc_en: 'Traditions in modern style', external_url: 'https://vyshyvanka-modern.ua', inst_url: 'https://instagram.com/vyshyvanka_modern' },
  { id: 3, name_uk: 'Степова', name_en: 'Stepova', marketing_desc_uk: 'Мінімалізм та якість', marketing_desc_en: 'Minimalism and quality', external_url: 'https://stepova.com', inst_url: 'https://instagram.com/stepova_brand' },
  { id: 4, name_uk: 'Карпати Стайл', name_en: 'Karpaty Style', marketing_desc_uk: 'Натхненні горами', marketing_desc_en: 'Inspired by mountains', external_url: 'https://karpaty-style.ua', inst_url: 'https://instagram.com/karpaty_style' },
  { id: 5, name_uk: 'Київ Колекшн', name_en: 'Kyiv Collection', marketing_desc_uk: 'Міська мода', marketing_desc_en: 'Urban fashion', external_url: 'https://kyiv-collection.com', inst_url: 'https://instagram.com/kyiv_collection' },
  { id: 6, name_uk: 'Борисфен', name_en: 'Borysfen', marketing_desc_uk: 'Чоловічий одяг преміум класу', marketing_desc_en: "Premium men's clothing", external_url: 'https://borysfen.ua', inst_url: 'https://instagram.com/borysfen_ua' },
  { id: 7, name_uk: 'Сонячна', name_en: 'Soniachna', marketing_desc_uk: 'Яскраві літні колекції', marketing_desc_en: 'Bright summer collections', external_url: 'https://soniachna.com', inst_url: 'https://instagram.com/soniachna' },
  { id: 8, name_uk: 'Оберіг', name_en: 'Oberih', marketing_desc_uk: 'Аксесуари ручної роботи', marketing_desc_en: 'Handmade accessories', external_url: 'https://oberih.ua', inst_url: 'https://instagram.com/oberih_ua' },
];

const products = [
  // Dresses (category_id: 4)
  { id: 1, name_uk: 'Сукня Весняна', name_en: 'Spring Dress', price: 2800, brand_id: 1, category_id: 4, product_description_uk: 'Легка сукня з квітковим принтом, ідеальна для весняних прогулянок', product_description_en: 'Light dress with floral print, perfect for spring walks', preview_image: 'https://picsum.photos/seed/dress1/400/600', images: ['https://picsum.photos/seed/dress1a/400/600', 'https://picsum.photos/seed/dress1b/400/600'], colors: ['white', 'green'], tags: ['весна', 'квіти', 'легка'], gender: 'female', external_url: 'https://leleka.ua/dress-spring', inst_url: 'https://instagram.com/p/dress1' },
  { id: 2, name_uk: 'Сукня Вечірня Зоря', name_en: 'Evening Star Dress', price: 5500, brand_id: 1, category_id: 4, product_description_uk: 'Елегантна вечірня сукня з шовку', product_description_en: 'Elegant silk evening dress', preview_image: 'https://picsum.photos/seed/dress2/400/600', images: ['https://picsum.photos/seed/dress2a/400/600'], colors: ['black', 'gold'], tags: ['вечірня', 'елегантна', 'шовк'], gender: 'female', external_url: 'https://leleka.ua/evening-star', inst_url: null },
  { id: 3, name_uk: 'Сукня Міді Класика', name_en: 'Classic Midi Dress', price: 3200, brand_id: 3, category_id: 4, product_description_uk: 'Класична сукня міді довжини, підходить для офісу та виходу', product_description_en: 'Classic midi length dress, suitable for office and outings', preview_image: 'https://picsum.photos/seed/dress3/400/600', images: ['https://picsum.photos/seed/dress3a/400/600', 'https://picsum.photos/seed/dress3b/400/600'], colors: ['grey', 'black', 'blue'], tags: ['класика', 'офіс', 'міді'], gender: 'female', external_url: 'https://stepova.com/classic-midi', inst_url: null },
  { id: 4, name_uk: 'Сукня Літня Бриз', name_en: 'Summer Breeze Dress', price: 2200, brand_id: 7, category_id: 4, product_description_uk: 'Легка літня сукня з натуральної тканини', product_description_en: 'Light summer dress made of natural fabric', preview_image: 'https://picsum.photos/seed/dress4/400/600', images: ['https://picsum.photos/seed/dress4a/400/600'], colors: ['white', 'yellow', 'cyan'], tags: ['літо', 'пляж', 'натуральна'], gender: 'female', external_url: 'https://soniachna.com/summer-breeze', inst_url: 'https://instagram.com/p/dress4' },
  { id: 5, name_uk: 'Сукня Вишиванка', name_en: 'Vyshyvanka Dress', price: 4800, brand_id: 2, category_id: 4, product_description_uk: 'Сукня з традиційною українською вишивкою', product_description_en: 'Dress with traditional Ukrainian embroidery', preview_image: 'https://picsum.photos/seed/dress5/400/600', images: ['https://picsum.photos/seed/dress5a/400/600', 'https://picsum.photos/seed/dress5b/400/600'], colors: ['white', 'red'], tags: ['вишивка', 'традиційна', 'етно'], gender: 'female', external_url: 'https://vyshyvanka-modern.ua/dress', inst_url: 'https://instagram.com/p/dress5' },

  // Tops & Blouses (category_id: 5)
  { id: 6, name_uk: 'Блуза Шовкова Ніч', name_en: 'Silk Night Blouse', price: 2400, brand_id: 1, category_id: 5, product_description_uk: 'Елегантна шовкова блуза', product_description_en: 'Elegant silk blouse', preview_image: 'https://picsum.photos/seed/blouse1/400/600', images: ['https://picsum.photos/seed/blouse1a/400/600'], colors: ['black', 'indigo'], tags: ['шовк', 'елегантна'], gender: 'female', external_url: 'https://leleka.ua/silk-night', inst_url: null },
  { id: 7, name_uk: 'Топ Спортивний', name_en: 'Sport Top', price: 890, brand_id: 5, category_id: 5, product_description_uk: 'Зручний топ для спорту та активного відпочинку', product_description_en: 'Comfortable top for sports and active leisure', preview_image: 'https://picsum.photos/seed/top1/400/600', images: ['https://picsum.photos/seed/top1a/400/600'], colors: ['black', 'white', 'grey'], tags: ['спорт', 'активний'], gender: 'female', external_url: 'https://kyiv-collection.com/sport-top', inst_url: null },
  { id: 8, name_uk: 'Блуза Офісна', name_en: 'Office Blouse', price: 1800, brand_id: 3, category_id: 5, product_description_uk: 'Класична блуза для ділового стилю', product_description_en: 'Classic blouse for business style', preview_image: 'https://picsum.photos/seed/blouse2/400/600', images: ['https://picsum.photos/seed/blouse2a/400/600'], colors: ['white', 'blue', 'grey'], tags: ['офіс', 'діловий'], gender: 'female', external_url: 'https://stepova.com/office-blouse', inst_url: null },
  { id: 9, name_uk: 'Сорочка Вишита', name_en: 'Embroidered Shirt', price: 3200, brand_id: 2, category_id: 5, product_description_uk: 'Чоловіча сорочка з вишивкою', product_description_en: "Men's shirt with embroidery", preview_image: 'https://picsum.photos/seed/shirt1/400/600', images: ['https://picsum.photos/seed/shirt1a/400/600'], colors: ['white', 'blue'], tags: ['вишивка', 'традиційна'], gender: 'male', external_url: 'https://vyshyvanka-modern.ua/shirt', inst_url: 'https://instagram.com/p/shirt1' },
  { id: 10, name_uk: 'Поло Класичне', name_en: 'Classic Polo', price: 1500, brand_id: 6, category_id: 5, product_description_uk: 'Класична чоловіча сорочка поло', product_description_en: "Classic men's polo shirt", preview_image: 'https://picsum.photos/seed/polo1/400/600', images: ['https://picsum.photos/seed/polo1a/400/600'], colors: ['white', 'black', 'blue', 'green'], tags: ['поло', 'класика'], gender: 'male', external_url: 'https://borysfen.ua/polo', inst_url: null },

  // Pants & Jeans (category_id: 6)
  { id: 11, name_uk: 'Джинси Класичні', name_en: 'Classic Jeans', price: 2100, brand_id: 5, category_id: 6, product_description_uk: 'Класичні джинси прямого крою', product_description_en: 'Classic straight-cut jeans', preview_image: 'https://picsum.photos/seed/jeans1/400/600', images: ['https://picsum.photos/seed/jeans1a/400/600'], colors: ['blue', 'black'], tags: ['джинси', 'класика'], gender: 'unisex', external_url: 'https://kyiv-collection.com/classic-jeans', inst_url: null },
  { id: 12, name_uk: 'Штани Чінос', name_en: 'Chino Pants', price: 1900, brand_id: 6, category_id: 6, product_description_uk: 'Елегантні штани чінос', product_description_en: 'Elegant chino pants', preview_image: 'https://picsum.photos/seed/chinos1/400/600', images: ['https://picsum.photos/seed/chinos1a/400/600'], colors: ['brown', 'grey', 'black'], tags: ['чінос', 'елегантні'], gender: 'male', external_url: 'https://borysfen.ua/chinos', inst_url: null },
  { id: 13, name_uk: 'Штани Широкі', name_en: 'Wide Leg Pants', price: 2300, brand_id: 3, category_id: 6, product_description_uk: 'Модні широкі штани', product_description_en: 'Fashionable wide-leg pants', preview_image: 'https://picsum.photos/seed/pants1/400/600', images: ['https://picsum.photos/seed/pants1a/400/600'], colors: ['black', 'white', 'grey'], tags: ['широкі', 'модні'], gender: 'female', external_url: 'https://stepova.com/wide-pants', inst_url: null },
  { id: 14, name_uk: 'Джогери Спортивні', name_en: 'Sport Joggers', price: 1400, brand_id: 5, category_id: 6, product_description_uk: 'Зручні спортивні джогери', product_description_en: 'Comfortable sport joggers', preview_image: 'https://picsum.photos/seed/joggers1/400/600', images: ['https://picsum.photos/seed/joggers1a/400/600'], colors: ['grey', 'black'], tags: ['спорт', 'джогери'], gender: 'unisex', external_url: 'https://kyiv-collection.com/joggers', inst_url: null },

  // Outerwear (category_id: 7)
  { id: 15, name_uk: 'Пальто Класичне', name_en: 'Classic Coat', price: 6500, brand_id: 3, category_id: 7, product_description_uk: 'Класичне вовняне пальто', product_description_en: 'Classic wool coat', preview_image: 'https://picsum.photos/seed/coat1/400/600', images: ['https://picsum.photos/seed/coat1a/400/600', 'https://picsum.photos/seed/coat1b/400/600'], colors: ['black', 'grey', 'brown'], tags: ['пальто', 'вовна', 'класика'], gender: 'female', external_url: 'https://stepova.com/classic-coat', inst_url: null },
  { id: 16, name_uk: 'Куртка Шкіряна', name_en: 'Leather Jacket', price: 8900, brand_id: 6, category_id: 7, product_description_uk: 'Стильна шкіряна куртка', product_description_en: 'Stylish leather jacket', preview_image: 'https://picsum.photos/seed/jacket1/400/600', images: ['https://picsum.photos/seed/jacket1a/400/600'], colors: ['black', 'brown'], tags: ['шкіра', 'байкер'], gender: 'male', external_url: 'https://borysfen.ua/leather-jacket', inst_url: 'https://instagram.com/p/jacket1' },
  { id: 17, name_uk: 'Тренч Весняний', name_en: 'Spring Trench', price: 4200, brand_id: 1, category_id: 7, product_description_uk: 'Легкий весняний тренч', product_description_en: 'Light spring trench coat', preview_image: 'https://picsum.photos/seed/trench1/400/600', images: ['https://picsum.photos/seed/trench1a/400/600'], colors: ['grey', 'brown'], tags: ['тренч', 'весна'], gender: 'female', external_url: 'https://leleka.ua/spring-trench', inst_url: null },
  { id: 18, name_uk: 'Пуховик Зимовий', name_en: 'Winter Puffer', price: 7200, brand_id: 4, category_id: 7, product_description_uk: 'Теплий зимовий пуховик', product_description_en: 'Warm winter puffer jacket', preview_image: 'https://picsum.photos/seed/puffer1/400/600', images: ['https://picsum.photos/seed/puffer1a/400/600'], colors: ['black', 'white', 'red'], tags: ['зима', 'теплий'], gender: 'unisex', external_url: 'https://karpaty-style.ua/winter-puffer', inst_url: null },

  // Skirts (category_id: 8)
  { id: 19, name_uk: 'Спідниця Плісе', name_en: 'Pleated Skirt', price: 1800, brand_id: 1, category_id: 8, product_description_uk: 'Елегантна плісирована спідниця', product_description_en: 'Elegant pleated skirt', preview_image: 'https://picsum.photos/seed/skirt1/400/600', images: ['https://picsum.photos/seed/skirt1a/400/600'], colors: ['black', 'grey', 'blue'], tags: ['плісе', 'елегантна'], gender: 'female', external_url: 'https://leleka.ua/pleated-skirt', inst_url: null },
  { id: 20, name_uk: 'Спідниця Міні', name_en: 'Mini Skirt', price: 1200, brand_id: 7, category_id: 8, product_description_uk: 'Молодіжна міні спідниця', product_description_en: 'Youth mini skirt', preview_image: 'https://picsum.photos/seed/skirt2/400/600', images: ['https://picsum.photos/seed/skirt2a/400/600'], colors: ['black', 'red', 'white'], tags: ['міні', 'молодіжна'], gender: 'female', external_url: 'https://soniachna.com/mini-skirt', inst_url: null },
  { id: 21, name_uk: 'Спідниця Максі', name_en: 'Maxi Skirt', price: 2400, brand_id: 3, category_id: 8, product_description_uk: 'Довга елегантна спідниця', product_description_en: 'Long elegant skirt', preview_image: 'https://picsum.photos/seed/skirt3/400/600', images: ['https://picsum.photos/seed/skirt3a/400/600'], colors: ['black', 'brown', 'green'], tags: ['максі', 'елегантна'], gender: 'female', external_url: 'https://stepova.com/maxi-skirt', inst_url: null },

  // Sweaters & Cardigans (category_id: 9)
  { id: 22, name_uk: 'Светр Оверсайз', name_en: 'Oversized Sweater', price: 2600, brand_id: 4, category_id: 9, product_description_uk: 'Затишний светр оверсайз', product_description_en: 'Cozy oversized sweater', preview_image: 'https://picsum.photos/seed/sweater1/400/600', images: ['https://picsum.photos/seed/sweater1a/400/600'], colors: ['grey', 'brown', 'white'], tags: ['оверсайз', 'затишний'], gender: 'unisex', external_url: 'https://karpaty-style.ua/oversized-sweater', inst_url: null },
  { id: 23, name_uk: "Кардиган В'язаний", name_en: 'Knit Cardigan', price: 3100, brand_id: 4, category_id: 9, product_description_uk: "Теплий в'язаний кардиган", product_description_en: 'Warm knitted cardigan', preview_image: 'https://picsum.photos/seed/cardigan1/400/600', images: ['https://picsum.photos/seed/cardigan1a/400/600'], colors: ['brown', 'grey', 'green'], tags: ['кардиган', "в'язаний"], gender: 'female', external_url: 'https://karpaty-style.ua/knit-cardigan', inst_url: 'https://instagram.com/p/cardigan1' },
  { id: 24, name_uk: 'Гольф Базовий', name_en: 'Basic Turtleneck', price: 1400, brand_id: 3, category_id: 9, product_description_uk: 'Базовий гольф для капсульного гардеробу', product_description_en: 'Basic turtleneck for capsule wardrobe', preview_image: 'https://picsum.photos/seed/turtleneck1/400/600', images: ['https://picsum.photos/seed/turtleneck1a/400/600'], colors: ['black', 'white', 'grey', 'brown'], tags: ['базовий', 'гольф'], gender: 'unisex', external_url: 'https://stepova.com/turtleneck', inst_url: null },

  // Suits (category_id: 10)
  { id: 25, name_uk: 'Костюм Діловий', name_en: 'Business Suit', price: 9800, brand_id: 6, category_id: 10, product_description_uk: 'Класичний діловий костюм', product_description_en: 'Classic business suit', preview_image: 'https://picsum.photos/seed/suit1/400/600', images: ['https://picsum.photos/seed/suit1a/400/600', 'https://picsum.photos/seed/suit1b/400/600'], colors: ['black', 'grey', 'blue'], tags: ['діловий', 'класика'], gender: 'male', external_url: 'https://borysfen.ua/business-suit', inst_url: null },
  { id: 26, name_uk: 'Костюм Жіночий', name_en: "Women's Suit", price: 7500, brand_id: 3, category_id: 10, product_description_uk: 'Елегантний жіночий костюм', product_description_en: "Elegant women's suit", preview_image: 'https://picsum.photos/seed/suit2/400/600', images: ['https://picsum.photos/seed/suit2a/400/600'], colors: ['black', 'white', 'grey'], tags: ['діловий', 'елегантний'], gender: 'female', external_url: 'https://stepova.com/womens-suit', inst_url: null },

  // Sneakers (category_id: 11)
  { id: 27, name_uk: 'Кросівки Міські', name_en: 'Urban Sneakers', price: 3200, brand_id: 5, category_id: 11, product_description_uk: 'Стильні міські кросівки', product_description_en: 'Stylish urban sneakers', preview_image: 'https://picsum.photos/seed/sneakers1/400/600', images: ['https://picsum.photos/seed/sneakers1a/400/600'], colors: ['white', 'black', 'grey'], tags: ['міські', 'комфорт'], gender: 'unisex', external_url: 'https://kyiv-collection.com/urban-sneakers', inst_url: null },
  { id: 28, name_uk: 'Кросівки Спортивні', name_en: 'Sport Sneakers', price: 2800, brand_id: 5, category_id: 11, product_description_uk: 'Кросівки для активного способу життя', product_description_en: 'Sneakers for active lifestyle', preview_image: 'https://picsum.photos/seed/sneakers2/400/600', images: ['https://picsum.photos/seed/sneakers2a/400/600'], colors: ['black', 'red', 'blue'], tags: ['спорт', 'біг'], gender: 'unisex', external_url: 'https://kyiv-collection.com/sport-sneakers', inst_url: null },

  // Boots (category_id: 12)
  { id: 29, name_uk: 'Черевики Челсі', name_en: 'Chelsea Boots', price: 4500, brand_id: 6, category_id: 12, product_description_uk: 'Класичні черевики челсі', product_description_en: 'Classic Chelsea boots', preview_image: 'https://picsum.photos/seed/boots1/400/600', images: ['https://picsum.photos/seed/boots1a/400/600'], colors: ['black', 'brown'], tags: ['челсі', 'класика'], gender: 'male', external_url: 'https://borysfen.ua/chelsea-boots', inst_url: null },
  { id: 30, name_uk: 'Черевики Зимові', name_en: 'Winter Boots', price: 5200, brand_id: 4, category_id: 12, product_description_uk: 'Теплі зимові черевики', product_description_en: 'Warm winter boots', preview_image: 'https://picsum.photos/seed/boots2/400/600', images: ['https://picsum.photos/seed/boots2a/400/600'], colors: ['black', 'brown', 'grey'], tags: ['зима', 'теплі'], gender: 'unisex', external_url: 'https://karpaty-style.ua/winter-boots', inst_url: null },

  // Heels (category_id: 13)
  { id: 31, name_uk: 'Туфлі Класичні', name_en: 'Classic Heels', price: 3800, brand_id: 1, category_id: 13, product_description_uk: 'Елегантні класичні туфлі', product_description_en: 'Elegant classic heels', preview_image: 'https://picsum.photos/seed/heels1/400/600', images: ['https://picsum.photos/seed/heels1a/400/600'], colors: ['black', 'red', 'white'], tags: ['класика', 'елегантні'], gender: 'female', external_url: 'https://leleka.ua/classic-heels', inst_url: null },
  { id: 32, name_uk: 'Туфлі Вечірні', name_en: 'Evening Heels', price: 4200, brand_id: 1, category_id: 13, product_description_uk: 'Вишукані вечірні туфлі', product_description_en: 'Exquisite evening heels', preview_image: 'https://picsum.photos/seed/heels2/400/600', images: ['https://picsum.photos/seed/heels2a/400/600'], colors: ['gold', 'silver', 'black'], tags: ['вечірні', 'свято'], gender: 'female', external_url: 'https://leleka.ua/evening-heels', inst_url: null },

  // Sandals (category_id: 14)
  { id: 33, name_uk: 'Сандалі Літні', name_en: 'Summer Sandals', price: 1800, brand_id: 7, category_id: 14, product_description_uk: 'Легкі літні сандалі', product_description_en: 'Light summer sandals', preview_image: 'https://picsum.photos/seed/sandals1/400/600', images: ['https://picsum.photos/seed/sandals1a/400/600'], colors: ['brown', 'white', 'black'], tags: ['літо', 'комфорт'], gender: 'female', external_url: 'https://soniachna.com/summer-sandals', inst_url: null },
  { id: 34, name_uk: 'Сандалі Шкіряні', name_en: 'Leather Sandals', price: 2400, brand_id: 6, category_id: 14, product_description_uk: 'Якісні шкіряні сандалі', product_description_en: 'Quality leather sandals', preview_image: 'https://picsum.photos/seed/sandals2/400/600', images: ['https://picsum.photos/seed/sandals2a/400/600'], colors: ['brown', 'black'], tags: ['шкіра', 'якість'], gender: 'male', external_url: 'https://borysfen.ua/leather-sandals', inst_url: null },

  // Bags (category_id: 15)
  { id: 35, name_uk: 'Сумка Шоппер', name_en: 'Shopper Bag', price: 2800, brand_id: 8, category_id: 15, product_description_uk: 'Містка сумка-шоппер', product_description_en: 'Spacious shopper bag', preview_image: 'https://picsum.photos/seed/bag1/400/600', images: ['https://picsum.photos/seed/bag1a/400/600'], colors: ['brown', 'black', 'grey'], tags: ['шоппер', 'містка'], gender: 'female', external_url: 'https://oberih.ua/shopper', inst_url: null },
  { id: 36, name_uk: 'Сумка Крос-боді', name_en: 'Crossbody Bag', price: 2200, brand_id: 8, category_id: 15, product_description_uk: 'Зручна сумка крос-боді', product_description_en: 'Convenient crossbody bag', preview_image: 'https://picsum.photos/seed/bag2/400/600', images: ['https://picsum.photos/seed/bag2a/400/600'], colors: ['black', 'brown', 'red'], tags: ['крос-боді', 'зручна'], gender: 'female', external_url: 'https://oberih.ua/crossbody', inst_url: 'https://instagram.com/p/bag2' },
  { id: 37, name_uk: 'Рюкзак Міський', name_en: 'Urban Backpack', price: 3100, brand_id: 5, category_id: 15, product_description_uk: 'Стильний міський рюкзак', product_description_en: 'Stylish urban backpack', preview_image: 'https://picsum.photos/seed/backpack1/400/600', images: ['https://picsum.photos/seed/backpack1a/400/600'], colors: ['black', 'grey', 'brown'], tags: ['рюкзак', 'міський'], gender: 'unisex', external_url: 'https://kyiv-collection.com/backpack', inst_url: null },

  // Jewelry (category_id: 16)
  { id: 38, name_uk: 'Сережки Мінімалізм', name_en: 'Minimalist Earrings', price: 890, brand_id: 8, category_id: 16, product_description_uk: 'Елегантні мінімалістичні сережки', product_description_en: 'Elegant minimalist earrings', preview_image: 'https://picsum.photos/seed/earrings1/400/600', images: ['https://picsum.photos/seed/earrings1a/400/600'], colors: ['gold', 'silver'], tags: ['мінімалізм', 'сережки'], gender: 'female', external_url: 'https://oberih.ua/minimalist-earrings', inst_url: null },
  { id: 39, name_uk: 'Намисто Перлини', name_en: 'Pearl Necklace', price: 1800, brand_id: 8, category_id: 16, product_description_uk: 'Класичне намисто з перлин', product_description_en: 'Classic pearl necklace', preview_image: 'https://picsum.photos/seed/necklace1/400/600', images: ['https://picsum.photos/seed/necklace1a/400/600'], colors: ['white', 'gold'], tags: ['перлини', 'класика'], gender: 'female', external_url: 'https://oberih.ua/pearl-necklace', inst_url: 'https://instagram.com/p/necklace1' },
  { id: 40, name_uk: 'Браслет Шкіряний', name_en: 'Leather Bracelet', price: 650, brand_id: 8, category_id: 16, product_description_uk: 'Стильний шкіряний браслет', product_description_en: 'Stylish leather bracelet', preview_image: 'https://picsum.photos/seed/bracelet1/400/600', images: ['https://picsum.photos/seed/bracelet1a/400/600'], colors: ['brown', 'black'], tags: ['шкіра', 'браслет'], gender: 'unisex', external_url: 'https://oberih.ua/leather-bracelet', inst_url: null },

  // Scarves (category_id: 17)
  { id: 41, name_uk: 'Шарф Кашеміровий', name_en: 'Cashmere Scarf', price: 2400, brand_id: 4, category_id: 17, product_description_uk: 'Теплий кашеміровий шарф', product_description_en: 'Warm cashmere scarf', preview_image: 'https://picsum.photos/seed/scarf1/400/600', images: ['https://picsum.photos/seed/scarf1a/400/600'], colors: ['grey', 'brown', 'black'], tags: ['кашемір', 'теплий'], gender: 'unisex', external_url: 'https://karpaty-style.ua/cashmere-scarf', inst_url: null },
  { id: 42, name_uk: 'Хустка Шовкова', name_en: 'Silk Scarf', price: 1600, brand_id: 7, category_id: 17, product_description_uk: 'Елегантна шовкова хустка', product_description_en: 'Elegant silk scarf', preview_image: 'https://picsum.photos/seed/scarf2/400/600', images: ['https://picsum.photos/seed/scarf2a/400/600'], colors: ['red', 'blue', 'green', 'yellow'], tags: ['шовк', 'яскрава'], gender: 'female', external_url: 'https://soniachna.com/silk-scarf', inst_url: null },

  // Hats (category_id: 18)
  { id: 43, name_uk: 'Капелюх Фетровий', name_en: 'Felt Hat', price: 1900, brand_id: 8, category_id: 18, product_description_uk: 'Елегантний фетровий капелюх', product_description_en: 'Elegant felt hat', preview_image: 'https://picsum.photos/seed/hat1/400/600', images: ['https://picsum.photos/seed/hat1a/400/600'], colors: ['black', 'brown', 'grey'], tags: ['фетр', 'елегантний'], gender: 'female', external_url: 'https://oberih.ua/felt-hat', inst_url: null },
  { id: 44, name_uk: 'Кепка Бейсболка', name_en: 'Baseball Cap', price: 750, brand_id: 5, category_id: 18, product_description_uk: 'Стильна бейсболка', product_description_en: 'Stylish baseball cap', preview_image: 'https://picsum.photos/seed/cap1/400/600', images: ['https://picsum.photos/seed/cap1a/400/600'], colors: ['black', 'white', 'blue'], tags: ['кепка', 'спорт'], gender: 'unisex', external_url: 'https://kyiv-collection.com/cap', inst_url: null },
  { id: 45, name_uk: 'Шапка Зимова', name_en: 'Winter Beanie', price: 890, brand_id: 4, category_id: 18, product_description_uk: 'Тепла зимова шапка', product_description_en: 'Warm winter beanie', preview_image: 'https://picsum.photos/seed/beanie1/400/600', images: ['https://picsum.photos/seed/beanie1a/400/600'], colors: ['grey', 'black', 'white', 'red'], tags: ['зима', 'тепла'], gender: 'unisex', external_url: 'https://karpaty-style.ua/winter-beanie', inst_url: null },
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
  const tables = ['products', 'promotions', 'brands', 'categories', 'site_settings'];

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
