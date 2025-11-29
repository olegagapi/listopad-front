import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";

export type ListProductsOptions = {
  limit?: number;
  brandId?: string;
  categoryId?: string;
  search?: string;
};

const BRANDS: Brand[] = [
  {
    id: "brand-1",
    name: "Urban Style",
    description: "Modern urban fashion for the city dweller.",
    internalUrl: "/brands/urban-style",
    externalUrl: "https://example.com/urban-style",
    instagramUrl: "https://instagram.com/urbanstyle",
    productCount: 10,
    averageProductPrice: 150,
  },
  {
    id: "brand-2",
    name: "Cozy Wear",
    description: "Comfortable clothing for relaxing at home.",
    internalUrl: "/brands/cozy-wear",
    externalUrl: "https://example.com/cozy-wear",
    instagramUrl: "https://instagram.com/cozywear",
    productCount: 8,
    averageProductPrice: 80,
  },
];

const CATEGORIES: Category[] = [
  {
    id: "cat-1",
    name: "Men",
    title: "Men's Collection",
    description: "Fashion for men.",
    parentId: null,
    image: "https://placehold.co/600x400?text=Men",
    productCount: 12,
  },
  {
    id: "cat-2",
    name: "Women",
    title: "Women's Collection",
    description: "Fashion for women.",
    parentId: null,
    image: "https://placehold.co/600x400?text=Women",
    productCount: 15,
  },
];

const PRODUCTS: Product[] = [
  {
    id: "prod-1",
    slug: "urban-jacket",
    title: "Urban Jacket",
    reviews: 4,
    price: 120,
    discountedPrice: 100,
    currency: "USD",
    brandId: "brand-1",
    brandName: "Urban Style",
    categoryIds: ["cat-1"],
    categoryNames: ["Men"],
    tags: ["new", "sale"],
    colors: ["black", "blue"],
    description: "A stylish jacket for the modern man.",
    shortDescription: "Stylish urban jacket.",
    externalUrl: "https://example.com/urban-jacket",
    instagramUrl: "https://instagram.com/urbanstyle/p/123",
    imgs: {
      previews: ["https://placehold.co/400x600?text=Jacket+1", "https://placehold.co/400x600?text=Jacket+2"],
      thumbnails: ["https://placehold.co/200x300?text=Jacket+1", "https://placehold.co/200x300?text=Jacket+2"],
    },
  },
  {
    id: "prod-2",
    slug: "cozy-sweater",
    title: "Cozy Sweater",
    reviews: 5,
    price: 80,
    discountedPrice: 80,
    currency: "USD",
    brandId: "brand-2",
    brandName: "Cozy Wear",
    categoryIds: ["cat-2"],
    categoryNames: ["Women"],
    tags: ["bestseller"],
    colors: ["brown", "white"],
    description: "Keep warm with this cozy sweater.",
    shortDescription: "Warm and cozy sweater.",
    externalUrl: "https://example.com/cozy-sweater",
    instagramUrl: "https://instagram.com/cozywear/p/456",
    imgs: {
      previews: ["https://placehold.co/400x600?text=Sweater+1", "https://placehold.co/400x600?text=Sweater+2"],
      thumbnails: ["https://placehold.co/200x300?text=Sweater+1", "https://placehold.co/200x300?text=Sweater+2"],
    },
  },
  {
    id: "prod-3",
    slug: "street-sneakers",
    title: "Street Sneakers",
    reviews: 3,
    price: 150,
    discountedPrice: 130,
    currency: "USD",
    brandId: "brand-1",
    brandName: "Urban Style",
    categoryIds: ["cat-1"],
    categoryNames: ["Men"],
    tags: ["limited"],
    colors: ["red", "white"],
    description: "High-top sneakers for the street.",
    shortDescription: "Cool street sneakers.",
    externalUrl: "https://example.com/street-sneakers",
    instagramUrl: null,
    imgs: {
      previews: ["https://placehold.co/400x600?text=Sneakers+1"],
      thumbnails: ["https://placehold.co/200x300?text=Sneakers+1"],
    },
  },
  {
    id: "prod-4",
    slug: "lounge-pants",
    title: "Lounge Pants",
    reviews: 5,
    price: 60,
    discountedPrice: 50,
    currency: "USD",
    brandId: "brand-2",
    brandName: "Cozy Wear",
    categoryIds: ["cat-2"],
    categoryNames: ["Women"],
    tags: ["sale"],
    colors: ["grey"],
    description: "Perfect for lounging around the house.",
    shortDescription: "Comfortable lounge pants.",
    externalUrl: "https://example.com/lounge-pants",
    instagramUrl: null,
    imgs: {
      previews: ["https://placehold.co/400x600?text=Pants+1"],
      thumbnails: ["https://placehold.co/200x300?text=Pants+1"],
    },
  },
];

export async function listProducts(options: ListProductsOptions = {}): Promise<Product[]> {
  let filtered = [...PRODUCTS];

  if (options.brandId) {
    filtered = filtered.filter((p) => p.brandId === options.brandId);
  }

  if (options.categoryId) {
    filtered = filtered.filter((p) => p.categoryIds.includes(options.categoryId!));
  }

  if (options.search) {
    const searchLower = options.search.toLowerCase();
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(searchLower));
  }

  if (options.limit) {
    filtered = filtered.slice(0, options.limit);
  }

  return filtered;
}

export async function getProductBySlug(slug: string) {
  if (!slug) {
    return null;
  }
  return PRODUCTS.find((p) => p.slug === slug) || null;
}

export async function listBrands(): Promise<Brand[]> {
  return BRANDS;
}

export async function listCategories(): Promise<Category[]> {
  return CATEGORIES;
}
