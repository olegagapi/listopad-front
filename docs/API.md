# API Routes

All routes are **read-only** (GET only).

## Dual-Mode Architecture

The shop uses two APIs for product retrieval:

| Mode | API | When Used |
|------|-----|-----------|
| **Search** | `/api/search` (Meilisearch) | When user enters a search query |
| **Browse** | `/api/products` (Supabase) | When browsing/filtering without search |

Both return the same response structure with products, pagination, and facet counts.

---

## Products (Browse Mode)

Server-side Supabase filtering with pagination and facet counts.

```
GET /api/products                           # List all products (paginated)
GET /api/products?category=1,2              # Filter by category IDs (with hierarchy)
GET /api/products?gender=male,female        # Filter by genders
GET /api/products?color=black,white         # Filter by colors
GET /api/products?minPrice=500&maxPrice=5000 # Price range
GET /api/products?sort=price:asc&page=2     # Sorted, paginated
GET /api/products/[slug]                    # Get single product by slug
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| locale | `uk` \| `en` | `uk` | Locale for product names/descriptions |
| category | string | - | Comma-separated category IDs (includes child categories) |
| gender | string | - | Comma-separated genders (`male`, `female`, `unisex`) |
| color | string | - | Comma-separated colors |
| minPrice | number | - | Minimum price filter |
| maxPrice | number | - | Maximum price filter |
| sort | string | `relevance` | Sort option (see below) |
| page | number | 1 | Page number |
| limit | number | 12 | Results per page (max 100) |

### Sort Options

- `relevance` - Default (newest first)
- `price:asc` - Price low to high
- `price:desc` - Price high to low
- `discountedPrice:asc` - Discounted price low to high
- `discountedPrice:desc` - Discounted price high to low

### Response

```typescript
type ProductsResponse = {
  data: {
    products: Product[];
    totalHits: number;
    totalPages: number;
    page: number;
    counts: {
      categories: Record<string, number>;  // Product count per category
      genders: Record<Gender, number>;     // Product count per gender
      colors: Record<PrimeColor, number>;  // Product count per color
    };
  };
  error: null;
} | {
  data: null;
  error: string;
};
```

### Category Hierarchy

When filtering by category, child categories are automatically included. For example, selecting "Clothing" also returns products from "Dresses", "Tops", etc.

### Slug Format

Products use slugs in format: `{name-lowercase}-{id}`
- Example: `summer-dress-123` for product "Summer Dress" with id 123
- Extract ID: split by `-`, take last segment

## Brands

```
GET /api/brands                # List all brands
```

## Categories

```
GET /api/categories            # List all categories
```

## Caching

- API routes use `next: { revalidate: 120 }` (2 minutes)
