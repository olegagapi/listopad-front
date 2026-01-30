# Listopad - Fashion Marketplace

A curated fashion marketplace that unites local sellers and fashion brands, providing them an online presence and web storefront. This is a **click-through experience**: customers browse and explore items, then click through to the brand's website or Instagram to make purchases.

**No cart or checkout** - this is a discovery/redirect platform, not a transactional e-commerce site.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit
- **i18n**: next-intl (Ukrainian `uk` default, English `en`)
- **Hosting**: Vercel
- **Package Manager**: pnpm

## Project Structure

```
project_root
├── src/
│   ├── app/
│   │   ├── [locale]/     # i18n routes (uk, en)
│   │   │   ├── (site)/   # Site layout group
│   │   │   └── layout.tsx
│   │   ├── api/          # API routes (GET only)
│   │   │   ├── products/
│   │   │   ├── brands/
│   │   │   └── categories/
│   │   ├── context/      # React context providers
│   │   └── css/          # Global styles
│   ├── components/       # React components
│   │   ├── Home/         # Landing page sections
│   │   ├── Shop/         # Shop & product components
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── Common/       # Reusable UI components
│   ├── types/            # TypeScript types
│   ├── lib/              # Utilities & data fetching
│   │   ├── supabase.ts   # Supabase client
│   │   └── supabase-data.ts  # Data fetching functions
│   ├── redux/            # Redux state (wishlist, modals)
│   └── i18n/             # Internationalization config
├── messages/             # i18n translation files (en.json, uk.json)
├── next.config.js
├── tailwind.config.ts
└── package.json
```

## Key Features

| Feature | Description |
|---------|-------------|
| Items listing | Browse products with grid/list views |
| Product details | Full product page with image gallery |
| Search | Case-insensitive search on product names |
| Filters | Category, brand, gender, color, price range |
| Wishlist | Client-side wishlist (Redux, persistence in local storage) |
| Quick view | Modal preview of products |
| External links | Click-through to brand website/Instagram |
| i18n | Ukrainian (default) and English |

## Database Schema

See [docs/DATABASE-SCHEMA.md](docs/DATABASE-SCHEMA.md) for full schema documentation.

## Environment Variables

Create `.env.local` or pull from Vercel (`vercel env pull`):

```env
# Required (client-side)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional (server-side, for admin operations)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

## Development

```bash
pnpm install
pnpm dev        # Start dev server at localhost:3000
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
```

## Database Seeding

See [docs/DATABASE-SEEDING.md](docs/DATABASE-SEEDING.md) for table creation and sample data SQL.

## PLANNER AGENT INSTRUCTIONS
For planning, follow the instructions in [docs/PLANNER.md](docs/PLANNER.md).

## Testing

See [docs/TESTING.md](docs/TESTING.md) for testing setup and conventions.

## API Routes

See [docs/API.md](docs/API.md) for full API documentation. All routes are **read-only** (GET only).

## Important Patterns

### Icon Components

Reusable SVG icons at `src/components/Icons/`.

#### Usage

```tsx
import { EyeIcon, HeartIcon } from '@/components/Icons';

<EyeIcon />                           // Default size (16px)
<HeartIcon size={24} />               // Custom size
<SearchIcon className="text-malachite" />  // Custom color
<EyeIcon label="Quick view" />        // Accessible
```

#### Adding New Icons

1. Create `src/components/Icons/NewIcon.tsx`
2. Use `IconProps` interface from `types.ts`
3. Use `currentColor` for fill (unless semantic/brand)
4. Export from `index.ts`

#### Color Rules

- Most icons use `currentColor` - apply color via `className`
- Status icons (CheckCircleIcon, WarningCircleIcon) have semantic defaults
- Brand icons (GoogleIcon, GithubIcon) keep brand colors

### Slug Format
Products use slugs in format: `{name-lowercase}-{id}`
- Example: `summer-dress-123` for product "Summer Dress" with id 123
- Extract ID: split by `-`, take last segment

### Data Fetching
- Use functions from `src/lib/supabase-data.ts`
- `listProducts(options)` - fetch products with filters
- `getProductBySlug(slug)` - fetch single product
- `listBrands()` / `listCategories()` - fetch all brands/categories

### Shop Page Dual-Mode Architecture
The shop page uses two different backends:
- **Search mode** (`useSearch` hook): Uses Meilisearch via `/api/search` when user enters a search query
- **Browse mode** (`useFilteredProducts` hook): Uses Supabase via `/api/products` when filtering without search

Both return the same structure: products, pagination, and facet counts. The `ShopWithSidebar` component switches automatically.

### Caching
- Pages use ISR with `revalidate = 60` (60 seconds)
- API routes use `next: { revalidate: 120 }`

### Colors
14 predefined colors: white, black, grey, red, green, blue, yellow, brown, orange, cyan, magenta, indigo, silver, gold

### Currency
Default currency is **UAH** (Ukrainian Hryvnia)

## Code Style & Conventions

- Use clear, descriptive variable and function names that convey intent
- Follow the [Google TypeScript Style Guide](https://ts.dev/style)
- Components use PascalCase, utilities use camelCase
- Files match their default export name

## TypeScript Strictness

**Strict mode is enforced.** The project uses the strictest TypeScript settings:
- `strict: true`
- `noUncheckedIndexedAccess: true`
- No `any` types unless absolutely unavoidable (and must be justified)
- All function parameters and return types must be explicitly typed
- Prefer `unknown` over `any` when type is truly unknown

## Error Handling Patterns

This project uses **Result types** for explicit error handling - no silent failures.

### Result Type

```typescript
type Result<T> = { data: T; error: null } | { data: null; error: string };
```

### By Layer

| Layer | Pattern | Example |
|-------|---------|---------|
| Supabase calls | Use built-in `{ data, error }` | Check `error` before using `data` |
| API routes | Return Result type as JSON | `{ data: products }` or `{ data: null, error: "message" }` |
| Pages | `error.tsx` boundaries | Catch render errors, show fallback UI |
| Components | Null checks + fallback UI | Show "no data" state, never crash |

### Supabase Calls

Supabase already returns Result-style responses. Always check error:

```typescript
const { data, error } = await supabase.from('products').select();
if (error) {
  return { data: null, error: error.message };
}
return { data, error: null };
```

### API Routes

Return consistent Result-type JSON responses:

```typescript
export async function GET(): Promise<Response> {
  const { data, error } = await listProducts();

  if (error) {
    return Response.json({ data: null, error }, { status: 500 });
  }

  return Response.json({ data, error: null });
}
```

### Pages (error.tsx)

Each route segment can have an `error.tsx` for graceful degradation:

```
src/app/[locale]/(site)/shop/
├── page.tsx
├── error.tsx      ← catches errors in this route
└── loading.tsx
```

### Components

Never crash on missing data. Show fallback UI:

```typescript
// Good - graceful fallback
{products?.length > 0 ? (
  <ProductGrid products={products} />
) : (
  <EmptyState message={t('noProducts')} />
)}

// Bad - crashes if products is undefined
{products.map(p => <Product key={p.id} {...p} />)}
```

### What NOT to Do

- Don't use bare `try/catch` without returning structured errors
- Don't ignore the `error` field from Supabase responses
- Don't let components crash - always handle null/undefined states
- Don't expose internal error details to users (log them server-side)

## Image Storage

Product images are stored in **Supabase Storage**. Image URLs in the database (`preview_image`, `images[]`) point to Supabase Storage buckets.

## What's NOT in This Project

Removed from original nextmerce template:
- Shopping cart
- Checkout flow
- Orders/payments
- User authentication (pages exist but non-functional)
- Product reviews system
- Inventory management

## Deployment

Deployed on Vercel. Push to main branch triggers automatic deployment.

## Localization

**All UI text must be localized.** Never hardcode strings in components.

- Default locale: `uk` (Ukrainian)
- Supported: `uk`, `en`
- Translation files: `messages/uk.json`, `messages/en.json`
- URL structure: `/uk/...` or `/en/...`

### Adding New Text

1. Add key to both `messages/uk.json` and `messages/en.json`
2. Use `useTranslations` hook in components:
   ```tsx
   import { useTranslations } from 'next-intl';

   function MyComponent() {
     const t = useTranslations('Namespace');
     return <p>{t('keyName')}</p>;
   }
   ```
3. For server components, use `getTranslations`:
   ```tsx
   import { getTranslations } from 'next-intl/server';

   async function MyServerComponent() {
     const t = await getTranslations('Namespace');
     return <p>{t('keyName')}</p>;
   }
   ```
