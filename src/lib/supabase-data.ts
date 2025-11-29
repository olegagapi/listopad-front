import { supabase } from "@/lib/supabase";
import { Brand } from "@/types/brand";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

export type ListProductsOptions = {
    limit?: number;
    brandId?: string;
    categoryId?: string;
    search?: string;
};

// Helper to generate slug
function generateSlug(name: string, id: number | string): string {
    return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`;
}

// Helper to parse id from slug
function getIdFromSlug(slug: string): string | null {
    const parts = slug.split('-');
    return parts[parts.length - 1] || null;
}

export async function listBrands(): Promise<Brand[]> {
    const { data, error } = await supabase
        .from('brands')
        .select('*');

    if (error) {
        console.error('Error fetching brands:', error);
        return [];
    }

    return data.map((brand: any) => ({
        id: brand.id.toString(),
        name: brand.name,
        description: brand.marketing_desc,
        internalUrl: brand.internal_url,
        externalUrl: brand.external_url,
        instagramUrl: brand.inst_url,
        productCount: 0, // TODO: Implement count
        averageProductPrice: 0, // TODO: Implement average price
    }));
}

export async function listCategories(): Promise<Category[]> {
    const { data, error } = await supabase
        .from('categories')
        .select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }

    return data.map((cat: any) => ({
        id: cat.id.toString(),
        name: cat.name,
        title: cat.name, // Using name as title
        description: cat.marketing_desc,
        parentId: cat.parent_category ? cat.parent_category.toString() : null,
        image: null, // No image in DB
        productCount: 0, // TODO: Implement count
    }));
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
    let query = supabase.from('products').select(`
    *,
    brands (name),
    categories (name)
  `);

    if (options.brandId) {
        query = query.eq('brand_id', options.brandId);
    }

    if (options.categoryId) {
        query = query.eq('category_id', options.categoryId);
    }

    if (options.search) {
        query = query.ilike('name', `%${options.search}%`);
    }

    if (options.limit) {
        query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching products:', error);
        return [];
    }

    return data.map((prod: any) => {
        const images = prod.images || [];
        const preview = prod.preview_image ? [prod.preview_image] : [];

        return {
            id: prod.id.toString(),
            slug: generateSlug(prod.name, prod.id),
            title: prod.name,
            reviews: 0,
            price: prod.price,
            discountedPrice: prod.price, // Assuming no discount column
            currency: "UAH",
            brandId: prod.brand_id?.toString(),
            brandName: prod.brands?.name,
            categoryIds: prod.category_id ? [prod.category_id.toString()] : [],
            categoryNames: prod.categories?.name ? [prod.categories.name] : [],
            tags: prod.tags || [],
            colors: prod.colors || [],
            gender: prod.gender,
            description: prod.product_description,
            shortDescription: prod.product_description?.slice(0, 100) + '...',
            externalUrl: prod.external_url,
            instagramUrl: prod.inst_url,
            imgs: {
                previews: preview.length > 0 ? preview : images,
                thumbnails: preview.length > 0 ? preview : images,
            },
        };
    });
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
    const id = getIdFromSlug(slug);
    if (!id) return null;

    const { data: prod, error } = await supabase
        .from('products')
        .select(`
      *,
      brands (name),
      categories (name)
    `)
        .eq('id', id)
        .single();

    if (error || !prod) {
        console.error('Error fetching product by slug:', error);
        return null;
    }

    const images = prod.images || [];
    const preview = prod.preview_image ? [prod.preview_image] : [];

    return {
        id: prod.id.toString(),
        slug: generateSlug(prod.name, prod.id),
        title: prod.name,
        reviews: 0,
        price: prod.price,
        discountedPrice: prod.price,
        currency: "UAH",
        brandId: prod.brand_id?.toString(),
        brandName: prod.brands?.name,
        categoryIds: prod.category_id ? [prod.category_id.toString()] : [],
        categoryNames: prod.categories?.name ? [prod.categories.name] : [],
        tags: prod.tags || [],
        colors: prod.colors || [],
        gender: prod.gender,
        description: prod.product_description,
        shortDescription: prod.product_description?.slice(0, 100) + '...',
        externalUrl: prod.external_url,
        instagramUrl: prod.inst_url,
        imgs: {
            previews: preview.length > 0 ? preview : images,
            thumbnails: preview.length > 0 ? preview : images,
        },
    };
}
