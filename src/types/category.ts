export type Category = {
  id: string | number;
  name?: string;
  title?: string;
  description?: string | null;
  parentId?: string | null;
  image?: string | null;
  img?: string;
  productCount?: number;
};
