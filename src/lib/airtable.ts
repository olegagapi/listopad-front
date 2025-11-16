import { Product } from "@/types/product";
import { Category } from "@/types/category";
import { Brand } from "@/types/brand";

const API = "https://api.airtable.com/v0";
const BASE = process.env.AIRTABLE_BASE_ID;
const TOKEN = process.env.AIRTABLE_TOKEN;

if (!BASE) {
  throw new Error("Missing AIRTABLE_BASE_ID environment variable");
}

if (!TOKEN) {
  throw new Error("Missing AIRTABLE_TOKEN environment variable");
}

const PRODUCTS = process.env.AIRTABLE_PRODUCTS_TABLE || "Products";
const BRANDS = process.env.AIRTABLE_BRANDS_TABLE || "Brands";
const CATEGORIES = process.env.AIRTABLE_CATEGORIES_TABLE || "Categories";

type AirtableRecord<T = Record<string, unknown>> = {
  id: string;
  fields: T & Record<string, any>;
};

type AirtableResponse<T> = {
  records: AirtableRecord<T>[];
};

type AirtableAttachment = {
  url?: string;
  thumbnails?: {
    small?: { url?: string };
    large?: { url?: string };
    full?: { url?: string };
  };
};

export type ListProductsOptions = {
  limit?: number;
  brandId?: string;
  categoryId?: string;
  search?: string;
};

async function at<T = Record<string, unknown>>(
  path: string,
  params: Record<string, string | number | undefined> = {},
) {
  const url = new URL(`${API}/${BASE}/${encodeURIComponent(path)}`);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  });

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${TOKEN}` },
  });

  if (!res.ok) {
    throw new Error(`Airtable request failed with status ${res.status}`);
  }

  return (await res.json()) as AirtableResponse<T>;
}

function toAttachmentArray(value: unknown): AirtableAttachment[] {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item) => item && typeof item.url === "string");
}

function uniqueStrings(values: Array<string | undefined | null>): string[] {
  return Array.from(new Set(values.filter((val): val is string => Boolean(val))));
}

function escapeFormulaValue(value: string) {
  return value.replace(/'/g, "\\'");
}

function buildImageSet(fields: Record<string, any>): Product["imgs"] {
  const previewAttachments = toAttachmentArray(fields["Preview Image"]);
  const galleryAttachments = toAttachmentArray(fields.Images);
  const attachments = [...previewAttachments, ...galleryAttachments];

  return {
    previews: uniqueStrings(attachments.map((attachment) => attachment.url)),
    thumbnails: uniqueStrings(
      attachments.map(
        (attachment) =>
          attachment.thumbnails?.small?.url ||
          attachment.thumbnails?.large?.url ||
          attachment.url,
      ),
    ),
  };
}

function mapProduct(record: AirtableRecord): Product {
  const fields = record.fields || {};
  const price = typeof fields.Price === "number" ? fields.Price : 0;
  const discountedPrice =
    typeof fields["Discounted Price"] === "number" ? fields["Discounted Price"] : price;
  const brandIds = Array.isArray(fields.Brand) ? fields.Brand : [];
  const categoryIds = Array.isArray(fields.Category) ? fields.Category : [];
  const categoryNames = Array.isArray(fields["Category Name"])
    ? fields["Category Name"]
    : Array.isArray(fields["Category Names"])
      ? fields["Category Names"]
      : [];

  return {
    id: String(fields.ID || record.id),
    slug: String(fields.slug || fields.Slug || fields.ID || record.id),
    title: fields.Name || fields.name || fields.title || "Untitled Product",
    reviews: typeof fields.Reviews === "number" ? fields.Reviews : 0,
    price,
    discountedPrice,
    currency: fields.Currency || "USD",
    brandId: brandIds[0],
    brandName: fields["Brand Name"] || fields.BrandName,
    categoryIds,
    categoryNames,
    tags: Array.isArray(fields.Tags) ? fields.Tags : [],
    colors: Array.isArray(fields.Colors) ? fields.Colors : [],
    description: typeof fields.Description === "string" ? fields.Description : null,
    shortDescription:
      typeof fields["Short Description"] === "string" ? fields["Short Description"] : null,
    externalUrl:
      typeof fields["External Shop URL"] === "string" ? fields["External Shop URL"] : null,
    instagramUrl:
      typeof fields["Instagram URL"] === "string" ? fields["Instagram URL"] : null,
    imgs: buildImageSet(fields),
  };
}

function buildProductFormula({ brandId, categoryId, search }: ListProductsOptions) {
  const filters: string[] = [];

  if (brandId) {
    filters.push(`FIND('${escapeFormulaValue(brandId)}', ARRAYJOIN({Brand}, ','))`);
  }

  if (categoryId) {
    filters.push(`FIND('${escapeFormulaValue(categoryId)}', ARRAYJOIN({Category}, ','))`);
  }

  if (search) {
    filters.push(`SEARCH(LOWER('${escapeFormulaValue(search)}'), LOWER({Name}))`);
  }

  if (filters.length === 0) {
    return undefined;
  }

  return filters.length === 1 ? filters[0] : `AND(${filters.join(",")})`;
}

function mapBrand(record: AirtableRecord): Brand {
  const fields = record.fields || {};

  return {
    id: String(fields.ID || record.id),
    name: fields.Name || "Unnamed Brand",
    description: typeof fields.Description === "string" ? fields.Description : null,
    internalUrl:
      typeof fields["Internal URL"] === "string" ? fields["Internal URL"] : null,
    externalUrl:
      typeof fields["External Shop URL"] === "string" ? fields["External Shop URL"] : null,
    instagramUrl:
      typeof fields["Instagram URL"] === "string" ? fields["Instagram URL"] : null,
    productCount: typeof fields["Product Count"] === "number" ? fields["Product Count"] : undefined,
    averageProductPrice:
      typeof fields["Average Product Price"] === "number"
        ? fields["Average Product Price"]
        : null,
  };
}

function mapCategory(record: AirtableRecord): Category {
  const fields = record.fields || {};
  const attachments = toAttachmentArray(fields.Image || fields["Preview Image"]);
  const parentLink = Array.isArray(fields.Parent) ? fields.Parent[0] : undefined;

  return {
    id: String(fields.ID || record.id),
    name: fields.Name || "Unnamed Category",
    description: typeof fields.Description === "string" ? fields.Description : null,
    parentId:
      typeof fields["Parent Category"] === "string"
        ? fields["Parent Category"]
        : parentLink || null,
    productCount: typeof fields["Product Count"] === "number" ? fields["Product Count"] : undefined,
    image: attachments[0]?.url || null,
  };
}

export async function listProducts(options: ListProductsOptions = {}): Promise<Product[]> {
  const params: Record<string, string | number | undefined> = {};

  if (options.limit) {
    params.pageSize = Math.max(1, Math.min(options.limit, 100));
  }

  const formula = buildProductFormula(options);
  if (formula) {
    params.filterByFormula = formula;
  }

  const data = await at(PRODUCTS, params);
  return (data.records || []).map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  if (!slug) {
    return null;
  }

  const data = await at(PRODUCTS, {
    maxRecords: 1,
    filterByFormula: `{slug}='${escapeFormulaValue(slug)}'`,
  });
  const record = data.records?.[0];
  return record ? mapProduct(record) : null;
}

export async function listBrands(): Promise<Brand[]> {
  const data = await at(BRANDS);
  return (data.records || []).map(mapBrand);
}

export async function listCategories(): Promise<Category[]> {
  const data = await at(CATEGORIES);
  return (data.records || []).map(mapCategory);
}
