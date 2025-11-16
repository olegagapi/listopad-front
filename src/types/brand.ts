export type Brand = {
  id: string;
  name: string;
  description?: string | null;
  internalUrl?: string | null;
  externalUrl?: string | null;
  instagramUrl?: string | null;
  productCount?: number;
  averageProductPrice?: number | null;
};
