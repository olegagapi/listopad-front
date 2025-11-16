export type Category = {
  id: string;
  name: string;
  description?: string | null;
  parentId?: string | null;
  image?: string | null;
  productCount?: number;
};
