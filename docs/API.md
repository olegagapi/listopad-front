# API Routes

All routes are **read-only** (GET only).

## Products

```
GET /api/products              # List all products
GET /api/products?limit=8      # Limit results
GET /api/products?search=query # Search by name (case-insensitive)
GET /api/products?brand=1      # Filter by brand ID
GET /api/products?category=1   # Filter by category ID
GET /api/products/[slug]       # Get single product by slug
```

### Query Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| limit | number | Max number of products to return |
| search | string | Case-insensitive search on product name |
| brand | number | Filter by brand ID |
| category | number | Filter by category ID |
| gender | string | Filter by gender (male/female/unisex) |
| color | string | Filter by color |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |

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
