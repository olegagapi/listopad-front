export type ProductImages = {
  thumbnails: string[];
  previews: string[];
};

export type Product = {
  id: string | number;
  slug: string;
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number;
  currency: string;
  brandId?: string;
  brandName?: string;
  categoryIds: string[];
  categoryNames: string[];
  tags: string[];
  colors: string[];
  description?: string | null;
  shortDescription?: string | null;
  externalUrl?: string | null;
  instagramUrl?: string | null;
  imgs: ProductImages;
};
