import { supabase } from "@/lib/supabase";
import { Brand } from "@/types/brand";
import { Category } from "@/types/category";
import { Product, PrimeColor, Gender } from "@/types/product";
import { Promotion } from "@/types/promotion";
import { generateSlug, getIdFromSlug } from "@/lib/slug";

type Result<T> = { data: T; error: null } | { data: null; error: string };

export type Locale = 'uk' | 'en';

export type ListProductsOptions = {
    limit?: number;
    brandId?: string;
    categoryId?: string;
    search?: string;
    locale?: Locale;
};

// Re-export slug utilities for convenience
export { generateSlug, getIdFromSlug };

export async function listBrands(locale: Locale = 'uk'): Promise<Brand[]> {
    const { data, error } = await supabase
        .from('brands')
        .select('*');

    if (error) {
        console.error('Error fetching brands:', error);
        return [];
    }

    return data.map((brand: Record<string, unknown>) => ({
        id: String(brand.id),
        name: locale === 'uk' ? String(brand.name_uk ?? '') : String(brand.name_en ?? ''),
        description: locale === 'uk' ? (brand.marketing_desc_uk as string | null) : (brand.marketing_desc_en as string | null),
        internalUrl: brand.internal_url as string | null,
        externalUrl: brand.external_url as string | null,
        instagramUrl: brand.inst_url as string | null,
        productCount: 0,
        averageProductPrice: 0,
    }));
}

export async function listCategories(locale: Locale = 'uk'): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data.map((cat: Record<string, unknown>) => {
        const name = locale === 'uk' ? String(cat.name_uk ?? '') : String(cat.name_en ?? '');
        return {
            id: String(cat.id),
            name,
            title: name,
            description: locale === 'uk' ? (cat.marketing_desc_uk as string | null) : (cat.marketing_desc_en as string | null),
            parentId: cat.parent_category ? String(cat.parent_category) : null,
            image: null,
            productCount: 0,
        };
    });
}

export async function getColors(): Promise<string[]> {
    return [
        "white", "black", "grey", "red", "green", "blue",
        "yellow", "brown", "orange", "cyan", "magenta",
        "indigo", "silver", "gold"
    ];
}

export async function getGenders(): Promise<string[]> {
    return ["male", "female", "unisex"];
}

export async function listProducts(options: ListProductsOptions = {}): Promise<Product[]> {
    const locale = options.locale ?? 'uk';
    const nameField = locale === 'uk' ? 'name_uk' : 'name_en';

    let query = supabase.from('products').select(`
    *,
    brands (name_uk, name_en),
    categories (name_uk, name_en)
  `);

    if (options.brandId) {
        query = query.eq('brand_id', options.brandId);
    }

    if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
    }

    if (options.search) {
        query = query.ilike(nameField, `%${options.search}%`);
    }

    if (options.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data.map((prod: Record<string, unknown>) => {
        const images = (prod.images as string[] | null) ?? [];
        const preview = prod.preview_image ? [prod.preview_image as string] : [];
        const productName = locale === 'uk' ? String(prod.name_uk ?? '') : String(prod.name_en ?? '');
        const description = locale === 'uk' ? (prod.product_description_uk as string | null) : (prod.product_description_en as string | null);
        const brands = prod.brands as Record<string, unknown> | null;
        const categories = prod.categories as Record<string, unknown> | null;
        const brandName = brands ? (locale === 'uk' ? String(brands.name_uk ?? '') : String(brands.name_en ?? '')) : undefined;
        const categoryName = categories ? (locale === 'uk' ? String(categories.name_uk ?? '') : String(categories.name_en ?? '')) : undefined;

        return {
            id: String(prod.id),
            slug: generateSlug(productName, prod.id as number),
            title: productName,
            reviews: 0,
            price: prod.price as number,
            discountedPrice: prod.price as number,
            currency: "UAH",
            brandId: prod.brand_id ? String(prod.brand_id) : undefined,
            brandName,
            categoryIds: prod.category_id ? [String(prod.category_id)] : [],
            categoryNames: categoryName ? [categoryName] : [],
            tags: (prod.tags as string[] | null) ?? [],
            colors: (prod.colors as PrimeColor[] | null) ?? [],
            gender: prod.gender as Gender | undefined,
            description,
            shortDescription: description ? description.slice(0, 100) + '...' : null,
            externalUrl: prod.external_url as string | null,
            instagramUrl: prod.inst_url as string | null,
            imgs: {
                previews: preview.length > 0 ? preview : images,
                thumbnails: preview.length > 0 ? preview : images,
            },
        };
    });
}

export async function getProductBySlug(slug: string, locale: Locale = 'uk'): Promise<Product | null> {
    const id = getIdFromSlug(slug);
    if (!id) return null;

    const { data: prod, error } = await supabase
        .from('products')
        .select(`
      *,
      brands (name_uk, name_en),
      categories (name_uk, name_en)
    `)
        .eq('id', id)
        .single();

    if (error || !prod) {
        console.error('Error fetching product by slug:', error);
        return null;
    }

    const prodRecord = prod as Record<string, unknown>;
    const images = (prodRecord.images as string[] | null) ?? [];
    const preview = prodRecord.preview_image ? [prodRecord.preview_image as string] : [];
    const productName = locale === 'uk' ? String(prodRecord.name_uk ?? '') : String(prodRecord.name_en ?? '');
    const description = locale === 'uk' ? (prodRecord.product_description_uk as string | null) : (prodRecord.product_description_en as string | null);
    const brands = prodRecord.brands as Record<string, unknown> | null;
    const categories = prodRecord.categories as Record<string, unknown> | null;
    const brandName = brands ? (locale === 'uk' ? String(brands.name_uk ?? '') : String(brands.name_en ?? '')) : undefined;
    const categoryName = categories ? (locale === 'uk' ? String(categories.name_uk ?? '') : String(categories.name_en ?? '')) : undefined;

    return {
        id: String(prodRecord.id),
        slug: generateSlug(productName, prodRecord.id as number),
        title: productName,
        reviews: 0,
        price: prodRecord.price as number,
        discountedPrice: prodRecord.price as number,
        currency: "UAH",
        brandId: prodRecord.brand_id ? String(prodRecord.brand_id) : undefined,
        brandName,
        categoryIds: prodRecord.category_id ? [String(prodRecord.category_id)] : [],
        categoryNames: categoryName ? [categoryName] : [],
        tags: (prodRecord.tags as string[] | null) ?? [],
        colors: (prodRecord.colors as PrimeColor[] | null) ?? [],
        gender: prodRecord.gender as Gender | undefined,
        description,
        shortDescription: description ? description.slice(0, 100) + '...' : null,
        externalUrl: prodRecord.external_url as string | null,
        instagramUrl: prodRecord.inst_url as string | null,
        imgs: {
            previews: preview.length > 0 ? preview : images,
            thumbnails: preview.length > 0 ? preview : images,
        },
    };
}

export async function countProducts(options: ListProductsOptions = {}): Promise<number> {
    const locale = options.locale ?? 'uk';
    const nameField = locale === 'uk' ? 'name_uk' : 'name_en';

    let query = supabase.from('products').select('*', { count: 'exact', head: true });

    if (options.brandId) {
        query = query.eq('brand_id', options.brandId);
    }

    if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
    }

    if (options.search) {
        query = query.ilike(nameField, `%${options.search}%`);
    }

    const { count, error } = await query;

    if (error) {
        console.error('Error counting products:', error);
        return 0;
    }

    return count ?? 0;
}

export async function listPromotions(): Promise<Result<Promotion[]>> {
    const now = new Date().toISOString();

    const { data, error } = await supabase
        .from('promotions')
        .select('*')
        .eq('is_active', true)
        .or(`start_date.is.null,start_date.lte.${now}`)
        .or(`end_date.is.null,end_date.gte.${now}`)
        .order('display_order');

    if (error) {
        console.error('Error fetching promotions:', error);
        return { data: null, error: error.message };
    }

    return { data: data as Promotion[], error: null };
}

export async function getSiteSetting<T>(key: string): Promise<Result<T>> {
    const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single();

    if (error) {
        console.error(`Error fetching site setting '${key}':`, error);
        return { data: null, error: error.message };
    }

    return { data: data?.value as T, error: null };
}
