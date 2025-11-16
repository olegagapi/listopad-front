import { Product } from "@/types/product";

export const defaultProduct: Product = {
  id: "",
  slug: "",
  title: "",
  reviews: 0,
  price: 0,
  discountedPrice: 0,
  currency: "USD",
  brandId: undefined,
  brandName: undefined,
  categoryIds: [],
  categoryNames: [],
  tags: [],
  colors: [],
  description: null,
  shortDescription: null,
  externalUrl: null,
  instagramUrl: null,
  imgs: { thumbnails: [], previews: [] },
};
