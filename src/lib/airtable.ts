const API = "https://api.airtable.com/v0";
const BASE = process.env.AIRTABLE_BASE_ID!;
const TOKEN = process.env.AIRTABLE_TOKEN!;
const PRODUCTS = process.env.AIRTABLE_PRODUCTS_TABLE || "Products";

async function at(path: string, params: Record<string, string | number> = {}) {
  const url = new URL(`${API}/${BASE}/${encodeURIComponent(path)}`);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  if (!res.ok) throw new Error(`Airtable ${res.status}`);
  return res.json();
}

function mapProduct(rec: any) {
  const f = rec.fields || {};
  return {
    id: rec.id,
    name: f.name || f.title,
    price: f.price ?? null,
    currency: f.currency ?? "USD",
    slug: f.slug,
    externalUrl: f.external_url,
    image: Array.isArray(f.images) && f.images[0]?.url ? f.images[0].url : null,
  };
}

export async function listProducts(limit = 24) {
  const data = await at(PRODUCTS, {
    pageSize: limit,
    filterByFormula: "AND({is_published}=1)", // tweak for your schema
  });
  return (data.records || []).map(mapProduct);
}

export async function getProductBySlug(slug: string) {
  const data = await at(PRODUCTS, {
    maxRecords: 1,
    filterByFormula: `{slug}="${slug}"`,
  });
  const rec = data.records?.[0];
  return rec ? mapProduct(rec) : null;
}
