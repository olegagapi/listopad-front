# Meilisearch Integration

Listopad uses [Meilisearch](https://www.meilisearch.com/) for fast, typo-tolerant product search with support for filters, facets, and optional hybrid (semantic) search.

---

## Architecture Overview

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Supabase      │     │   Meilisearch    │     │   Next.js App   │
│   (PostgreSQL)  │────▶│   (Search Index) │◀────│   (Frontend)    │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                        ▲                        │
        │                        │                        │
        ▼                        │                        ▼
   Webhook ─────────────────────►│◀──────────────── /api/search
   (realtime sync)          Admin API              Search API
```

### Key Components

| Component | Location | Purpose |
|-----------|----------|---------|
| Search Client | `src/lib/meilisearch.ts` | Search operations, filter building |
| Sync Functions | `src/lib/meilisearch-sync.ts` | Product indexing, document transformation |
| Search API | `src/app/api/search/route.ts` | Public search endpoint (Meilisearch) |
| Products API | `src/app/api/products/route.ts` | Browse endpoint (Supabase) |
| Sync Webhook | `src/app/api/webhooks/supabase-sync/route.ts` | Realtime product sync |
| Setup Script | `scripts/meilisearch-setup.ts` | Index configuration |
| Sync Script | `scripts/meilisearch-sync.ts` | Bulk product import |
| Search Hook | `src/hooks/useSearch.ts` | React hook for search mode |
| Browse Hook | `src/hooks/useFilteredProducts.ts` | React hook for browse mode |
| API Validation | `src/lib/apiValidation.ts` | Shared validation for both APIs |
| Types | `src/types/search.ts` | TypeScript definitions |

### Dual-Mode Architecture

The shop page uses two different backends depending on user action:

| User Action | Hook | API | Backend |
|-------------|------|-----|---------|
| Enters search query | `useSearch` | `/api/search` | Meilisearch |
| Browses/filters only | `useFilteredProducts` | `/api/products` | Supabase |

Both return the same structure: products, pagination info, and facet counts. The `ShopWithSidebar` component switches between modes automatically based on whether a search query exists.

---

## Environment Variables

Add these to your `.env.local`:

```env
# Meilisearch host URL
# Local: http://localhost:7700
# Cloud: https://your-project.meilisearch.io
MEILISEARCH_HOST=http://localhost:7700

# Admin API key for indexing (server-side only)
MEILISEARCH_ADMIN_API_KEY=your-admin-key

# Search API key for search operations (read-only)
MEILISEARCH_SEARCH_API_KEY=your-search-key

# Optional: OpenAI API key for hybrid search
OPENAI_API_KEY=your-openai-key

# Optional: Webhook secret for Supabase sync
SUPABASE_WEBHOOK_SECRET=your-webhook-secret
```

---

## Local Development Setup

### Option 1: Docker (Recommended)

```bash
# Start Meilisearch with Docker
docker run -d --name meilisearch \
  -p 7700:7700 \
  -e MEILI_ENV=development \
  -e MEILI_MASTER_KEY=your-master-key \
  -v meilisearch-data:/meili_data \
  getmeili/meilisearch:latest

# Generate API keys
curl -X POST "http://localhost:7700/keys" \
  -H "Authorization: Bearer your-master-key" \
  -H "Content-Type: application/json" \
  --data-binary '{
    "name": "Search API Key",
    "description": "Read-only search key",
    "actions": ["search"],
    "indexes": ["products_*"],
    "expiresAt": null
  }'
```

### Option 2: Meilisearch Cloud

1. Create account at [cloud.meilisearch.com](https://cloud.meilisearch.com)
2. Create a new project
3. Copy the host URL and API keys to `.env.local`

### Option 3: Local Binary

```bash
# macOS
brew install meilisearch
meilisearch --master-key=your-master-key

# Or download from https://github.com/meilisearch/meilisearch/releases
```

---

## Initial Setup

After starting Meilisearch:

```bash
# 1. Configure indexes with searchable/filterable attributes
pnpm meilisearch:setup

# 2. Import all products from Supabase
pnpm meilisearch:sync
```

The setup script will:
- Create `products_uk` and `products_en` indexes
- Configure searchable attributes: `title`, `brandName`, `categoryNames`, `tags`, `description`
- Configure filterable attributes: `brandId`, `categoryIds`, `colors`, `gender`, `price`, `discountedPrice`
- Configure sortable attributes: `price`, `discountedPrice`
- Optionally configure embedders for hybrid search (if `OPENAI_API_KEY` is set)

---

## Index Structure

Each product is indexed in both locale-specific indexes:

### Document Schema

```typescript
type MeilisearchProductDocument = {
  id: string;              // Product ID (primary key)
  slug: string;            // URL slug
  title: string;           // Localized product name
  brandId: string | null;
  brandName: string | null;
  categoryIds: string[];
  categoryNames: string[];
  tags: string[];
  colors: PrimeColor[];
  gender: Gender | null;
  description: string | null;
  price: number;
  discountedPrice: number;
  previewImage: string;
};
```

### Indexes

| Index | Locale | Content |
|-------|--------|---------|
| `products_uk` | Ukrainian | Ukrainian product names, descriptions, brands, categories |
| `products_en` | English | English product names, descriptions, brands, categories |

---

## Search API

### Endpoint

```
GET /api/search
```

### Query Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | - | Search query |
| `locale` | `uk` \| `en` | `uk` | Search locale |
| `category` | string | - | Comma-separated category IDs |
| `brand` | string | - | Comma-separated brand IDs |
| `gender` | string | - | Comma-separated genders (`male`, `female`, `unisex`) |
| `color` | string | - | Comma-separated colors |
| `minPrice` | number | - | Minimum price filter |
| `maxPrice` | number | - | Maximum price filter |
| `sort` | string | `relevance` | Sort option (see below) |
| `page` | number | 1 | Page number |
| `limit` | number | 12 | Results per page (max 100) |
| `hybrid` | boolean | false | Enable hybrid (semantic) search |

### Sort Options

- `relevance` - Default relevance ranking
- `price:asc` - Price low to high
- `price:desc` - Price high to low
- `discountedPrice:asc` - Discounted price low to high
- `discountedPrice:desc` - Discounted price high to low

### Example Requests

```bash
# Basic search
curl "/api/search?q=dress&locale=uk"

# With filters
curl "/api/search?q=dress&category=1,2&color=black,white&minPrice=500&maxPrice=5000"

# Sorted by price
curl "/api/search?q=shirt&sort=price:asc&page=2&limit=24"

# Hybrid search (semantic)
curl "/api/search?q=summer outfit&hybrid=true"
```

### Response

```typescript
type SearchResponse = {
  data: {
    hits: Product[];
    totalHits: number;
    page: number;
    totalPages: number;
    processingTimeMs: number;
    facetDistribution: {
      brandId?: Record<string, number>;
      categoryIds?: Record<string, number>;
      colors?: Record<string, number>;
      gender?: Record<string, number>;
    };
    query: string;
  } | null;
  error: string | null;
};
```

---

## React Hooks

### useSearch

Full-featured search hook with debouncing, filters, and facets.

```tsx
import { useSearch } from "@/hooks/useSearch";

function ShopPage() {
  const {
    results,
    totalHits,
    totalPages,
    page,
    facets,
    isLoading,
    error,
    search,
    refetch,
  } = useSearch({
    categoryIds: ["1"],
    colors: ["black"],
    minPrice: 500,
    sort: "price:asc",
    page: 1,
    limit: 24,
  });

  return (
    <div>
      <input
        type="search"
        onChange={(e) => search(e.target.value)}
        placeholder="Search products..."
      />
      {isLoading && <Spinner />}
      {results.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### useInstantSearch

Lightweight hook for instant search (e.g., header search dropdown).

```tsx
import { useInstantSearch } from "@/hooks/useSearch";

function SearchDropdown() {
  const { results, isLoading, error, search, clear, query } = useInstantSearch(300);

  return (
    <div>
      <input
        value={query}
        onChange={(e) => search(e.target.value)}
        onBlur={clear}
      />
      {results.map((product) => (
        <SearchResult key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### useFilteredProducts

Hook for browse mode (when no search query). Uses Supabase via `/api/products`.

```tsx
import { useFilteredProducts } from "@/hooks/useFilteredProducts";

function BrowsePage() {
  const {
    results,
    totalHits,
    totalPages,
    page,
    counts,      // { categories, genders, colors }
    isLoading,
    error,
    refetch,
  } = useFilteredProducts({
    categoryIds: ["1"],
    genders: ["female"],
    colors: ["black"],
    minPrice: 500,
    sort: "price:asc",
    page: 1,
    limit: 24,
    enabled: true,  // Set to false to disable fetching
  });

  return (
    <div>
      <p>Found {totalHits} products</p>
      {results.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### Switching Between Modes

The `ShopWithSidebar` component automatically switches:

```tsx
const hasSearchQuery = Boolean(filters.query?.trim());

// Search mode: Meilisearch
const searchResult = useSearch({ ...options });

// Browse mode: Supabase
const browseResult = useFilteredProducts({ ...options, enabled: !hasSearchQuery });

// Use whichever is active
const { products, counts } = hasSearchQuery ? searchResult : browseResult;
```

---

## Realtime Sync (Supabase Webhook)

To keep Meilisearch in sync with Supabase:

### 1. Create Webhook in Supabase

Go to **Database > Webhooks** and create a new webhook:

| Setting | Value |
|---------|-------|
| Name | `meilisearch-sync` |
| Table | `products` |
| Events | INSERT, UPDATE, DELETE |
| URL | `https://your-domain.com/api/webhooks/supabase-sync` |
| HTTP Headers | `Authorization: Bearer your-webhook-secret` |

### 2. Configure Webhook Secret

Set `SUPABASE_WEBHOOK_SECRET` in your environment variables (must match the Bearer token in the webhook header).

### 3. Payload Format

The webhook expects this payload from Supabase:

```json
{
  "type": "INSERT" | "UPDATE" | "DELETE",
  "table": "products",
  "schema": "public",
  "record": { ... },
  "old_record": { ... }
}
```

---

## Hybrid Search (Semantic Search)

Meilisearch supports hybrid search combining keyword and semantic (vector) search.

### Enable Hybrid Search

1. Set `OPENAI_API_KEY` in environment variables
2. Run `pnpm meilisearch:setup` to configure embedders
3. Use `hybrid=true` parameter in search requests

### How It Works

- Uses OpenAI's `text-embedding-3-small` model
- Embeds document fields: `title`, `brandName`, `description`
- Combines keyword relevance with semantic similarity
- `semanticRatio: 0.5` balances both approaches

---

## Scripts Reference

### pnpm meilisearch:setup

Configures Meilisearch indexes with proper settings.

```bash
pnpm meilisearch:setup
```

Output:
```
Starting Meilisearch setup...

Meilisearch status: available
Configuring index: products_uk
  Created index: products_uk
  Updated settings (task 1)
  Settings applied successfully
Configuring index: products_en
  Created index: products_en
  Updated settings (task 2)
  Settings applied successfully

Setup complete!
```

### pnpm meilisearch:sync

Imports all products from Supabase to Meilisearch.

```bash
pnpm meilisearch:sync
```

Output:
```
Starting Meilisearch sync...

Fetching products from Supabase...
Found 150 products

Indexing to products_uk...
  Task 3 created
  Indexed 150 documents

Indexing to products_en...
  Task 4 created
  Indexed 150 documents

Sync complete!

Summary:
  - products_uk: 150 documents
  - products_en: 150 documents
```

---

## Testing

### Unit Tests

```bash
# Run Meilisearch-related tests
pnpm test src/lib/meilisearch.test.ts src/lib/meilisearch-sync.test.ts
```

Tests cover:
- `buildFilterString` - Filter query construction
- `buildSortArray` - Sort array construction
- `documentToProduct` - Document to Product transformation
- `transformProductToDocument` - Supabase to Meilisearch transformation

### Manual Testing

```bash
# Check Meilisearch health
curl http://localhost:7700/health

# Get index info
curl -H "Authorization: Bearer your-key" \
  http://localhost:7700/indexes/products_uk

# Test search directly
curl -H "Authorization: Bearer your-search-key" \
  "http://localhost:7700/indexes/products_uk/search" \
  -d '{"q": "dress", "limit": 5}'
```

---

## Troubleshooting

### "MEILISEARCH_HOST environment variable is not set"

Ensure `.env.local` has the correct Meilisearch URL:
```env
MEILISEARCH_HOST=http://localhost:7700
```

### "Index products_uk not found"

Run the setup script:
```bash
pnpm meilisearch:setup
```

### Search returns no results

1. Check if products are indexed:
   ```bash
   curl -H "Authorization: Bearer your-key" \
     http://localhost:7700/indexes/products_uk/stats
   ```

2. Re-sync products:
   ```bash
   pnpm meilisearch:sync
   ```

### Webhook not syncing

1. Verify `SUPABASE_WEBHOOK_SECRET` matches the webhook configuration
2. Check webhook logs in Supabase Dashboard
3. Test webhook manually:
   ```bash
   curl -X POST http://localhost:3000/api/webhooks/supabase-sync \
     -H "Authorization: Bearer your-secret" \
     -H "Content-Type: application/json" \
     -d '{"type": "UPDATE", "table": "products", "record": {"id": 1}}'
   ```

### Hybrid search not working

1. Ensure `OPENAI_API_KEY` is set
2. Re-run setup to configure embedders:
   ```bash
   pnpm meilisearch:setup
   ```
3. Verify embedders are configured:
   ```bash
   curl -H "Authorization: Bearer your-key" \
     http://localhost:7700/indexes/products_uk/settings/embedders
   ```

---

## Production Checklist

- [ ] Use [Meilisearch Cloud](https://cloud.meilisearch.com) for production
- [ ] Set separate Search API Key (read-only) for client-side use
- [ ] Configure Supabase webhook for realtime sync
- [ ] Set `SUPABASE_WEBHOOK_SECRET` for webhook authentication
- [ ] Run initial `meilisearch:sync` after deployment
- [ ] Monitor index size and search performance in Meilisearch Cloud dashboard
