# Testing Setup

This is a read-only discovery/redirect site with no complex transactions. Testing priorities:

1. **E2E tests (Playwright)** - Most value. Test pages load, filters work, links redirect correctly
2. **Unit tests (Vitest)** - For `src/lib/` utilities and data functions
3. **Component tests** - Lower priority. For interactive bits like wishlist toggle, filter panel

---

## Installation

```bash
# E2E testing
pnpm add -D @playwright/test

# Unit/component testing
pnpm add -D vitest @testing-library/react @testing-library/dom jsdom @vitejs/plugin-react
```

After installing Playwright, run:
```bash
pnpm exec playwright install
```

---

## Configuration Files

### `playwright.config.ts`

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
  ],
  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

### `vitest.config.ts`

```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/lib/**/*.ts', 'src/components/**/*.tsx'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

### `vitest.setup.ts`

```typescript
import '@testing-library/jest-dom/vitest';
```

---

## Package.json Scripts

Add to `package.json`:

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

---

## Directory Structure

```
project_root/
├── e2e/                          # Playwright E2E tests
│   ├── home.spec.ts
│   ├── shop.spec.ts
│   ├── product.spec.ts
│   ├── filters.spec.ts
│   └── i18n.spec.ts
├── src/
│   ├── lib/
│   │   ├── formatPrice.ts
│   │   ├── formatPrice.test.ts   # Unit test co-located
│   │   ├── supabase-data.ts
│   │   └── supabase-data.test.ts
│   └── components/
│       └── Wishlist/
│           ├── index.tsx
│           └── index.test.tsx    # Component test co-located
├── playwright.config.ts
├── vitest.config.ts
└── vitest.setup.ts
```

---

## E2E Tests (Playwright)

### Priority Test Cases

For a discovery/redirect site, focus on:

1. **Page loads** - Home, shop, product detail pages render without errors
2. **Navigation** - Header links, breadcrumbs work
3. **Filters** - Category, brand, price, color filters update product list
4. **Search** - Search returns relevant results
5. **External links** - Product links redirect to brand website/Instagram
6. **i18n** - Language switching works (`/uk/...`, `/en/...`)
7. **Wishlist** - Add/remove items persists across page navigation

### Example: `e2e/home.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Home Page', () => {
  test('loads successfully', async ({ page }) => {
    await page.goto('/uk');
    await expect(page).toHaveTitle(/Listopad/i);
  });

  test('displays hero section', async ({ page }) => {
    await page.goto('/uk');
    await expect(page.locator('[data-testid="hero"]')).toBeVisible();
  });

  test('displays product grid', async ({ page }) => {
    await page.goto('/uk');
    await expect(page.locator('[data-testid="product-item"]').first()).toBeVisible();
  });

  test('navigates to shop page', async ({ page }) => {
    await page.goto('/uk');
    await page.click('a[href*="/shop"]');
    await expect(page).toHaveURL(/\/shop/);
  });
});
```

### Example: `e2e/shop.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Shop Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/uk/shop');
  });

  test('displays products', async ({ page }) => {
    const products = page.locator('[data-testid="product-item"]');
    await expect(products.first()).toBeVisible();
    expect(await products.count()).toBeGreaterThan(0);
  });

  test('filters by category', async ({ page }) => {
    // Click category filter
    await page.click('[data-testid="category-filter"]');
    await page.click('[data-testid="category-option"]:first-child');

    // URL should update with category param
    await expect(page).toHaveURL(/category=/);

    // Products should still display
    await expect(page.locator('[data-testid="product-item"]').first()).toBeVisible();
  });

  test('search filters products', async ({ page }) => {
    const searchInput = page.locator('[data-testid="search-input"]');
    await searchInput.fill('dress');
    await searchInput.press('Enter');

    await expect(page).toHaveURL(/search=dress/);
  });
});
```

### Example: `e2e/product.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Product Detail Page', () => {
  test('displays product information', async ({ page }) => {
    // Navigate to shop and click first product
    await page.goto('/uk/shop');
    await page.click('[data-testid="product-item"]:first-child a');

    // Product details should be visible
    await expect(page.locator('[data-testid="product-title"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-price"]')).toBeVisible();
    await expect(page.locator('[data-testid="product-description"]')).toBeVisible();
  });

  test('external link opens in new tab', async ({ page, context }) => {
    await page.goto('/uk/shop');
    await page.click('[data-testid="product-item"]:first-child a');

    const externalLink = page.locator('[data-testid="external-link"]');

    if (await externalLink.isVisible()) {
      const href = await externalLink.getAttribute('href');
      expect(href).toMatch(/^https?:\/\//);
      expect(await externalLink.getAttribute('target')).toBe('_blank');
    }
  });
});
```

### Example: `e2e/i18n.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Internationalization', () => {
  test('defaults to Ukrainian', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/uk/);
  });

  test('switches to English', async ({ page }) => {
    await page.goto('/uk');
    await page.click('[data-testid="language-switcher"]');
    await page.click('[data-testid="lang-en"]');
    await expect(page).toHaveURL(/\/en/);
  });

  test('preserves path when switching language', async ({ page }) => {
    await page.goto('/uk/shop');
    await page.click('[data-testid="language-switcher"]');
    await page.click('[data-testid="lang-en"]');
    await expect(page).toHaveURL(/\/en\/shop/);
  });
});
```

### Example: `e2e/wishlist.spec.ts`

```typescript
import { test, expect } from '@playwright/test';

test.describe('Wishlist', () => {
  test('adds item to wishlist', async ({ page }) => {
    await page.goto('/uk/shop');

    // Click wishlist button on first product
    await page.click('[data-testid="wishlist-toggle"]:first-child');

    // Navigate to wishlist page
    await page.click('[data-testid="wishlist-link"]');

    // Item should be in wishlist
    await expect(page.locator('[data-testid="wishlist-item"]')).toHaveCount(1);
  });

  test('persists wishlist across navigation', async ({ page }) => {
    await page.goto('/uk/shop');
    await page.click('[data-testid="wishlist-toggle"]:first-child');

    // Navigate away and back
    await page.goto('/uk');
    await page.click('[data-testid="wishlist-link"]');

    // Item should still be there (localStorage persistence)
    await expect(page.locator('[data-testid="wishlist-item"]')).toHaveCount(1);
  });
});
```

---

## Unit Tests (Vitest)

### What to Unit Test

Focus on pure functions in `src/lib/`:

| File | What to test |
|------|--------------|
| `formatPrice.ts` | Currency formatting, edge cases (0, negative, large numbers) |
| `supabase-data.ts` | `generateSlug`, `getIdFromSlug` helpers (mock Supabase for data functions) |
| `getBaseUrl.ts` | Different environment scenarios |
| `apiValidation.ts` | Parameter parsing, validation (locales, sort options, genders, colors) |
| `categoryHierarchy.ts` | Category tree building, descendant expansion |
| `filterCounts.ts` | Category and gender count calculations |

### Example: `src/lib/formatPrice.test.ts`

```typescript
import { describe, it, expect } from 'vitest';
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats USD by default', () => {
    expect(formatPrice(100)).toBe('$100.00');
  });

  it('formats UAH currency', () => {
    expect(formatPrice(100, 'UAH')).toBe('UAH\u00a0100.00');
  });

  it('handles zero', () => {
    expect(formatPrice(0)).toBe('$0.00');
  });

  it('handles decimals', () => {
    expect(formatPrice(99.99)).toBe('$99.99');
  });

  it('handles large numbers with thousands separator', () => {
    expect(formatPrice(1000000)).toBe('$1,000,000.00');
  });
});
```

### Example: `src/lib/slug.test.ts`

Extract and test slug utilities:

```typescript
import { describe, it, expect } from 'vitest';

// These functions should be exported from supabase-data.ts
function generateSlug(name: string, id: number | string): string {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${id}`;
}

function getIdFromSlug(slug: string): string | null {
  const parts = slug.split('-');
  return parts[parts.length - 1] || null;
}

describe('generateSlug', () => {
  it('creates slug from name and id', () => {
    expect(generateSlug('Summer Dress', 123)).toBe('summer-dress-123');
  });

  it('handles special characters', () => {
    expect(generateSlug("Women's Top!", 456)).toBe('women-s-top--456');
  });

  it('handles Ukrainian characters', () => {
    expect(generateSlug('Літня сукня', 789)).toBe('----789');
  });
});

describe('getIdFromSlug', () => {
  it('extracts id from slug', () => {
    expect(getIdFromSlug('summer-dress-123')).toBe('123');
  });

  it('handles single segment', () => {
    expect(getIdFromSlug('123')).toBe('123');
  });

  it('returns null for empty string', () => {
    expect(getIdFromSlug('')).toBeNull();
  });
});
```

### Example: `src/lib/getBaseUrl.test.ts`

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBaseUrl } from './getBaseUrl';

describe('getBaseUrl', () => {
  const originalWindow = global.window;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    // @ts-expect-error - mocking window
    delete global.window;
  });

  afterEach(() => {
    process.env = originalEnv;
    global.window = originalWindow;
  });

  it('returns empty string on client side', () => {
    // @ts-expect-error - mocking window
    global.window = {};
    expect(getBaseUrl()).toBe('');
  });

  it('uses NEXT_PUBLIC_SITE_URL when set', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    expect(getBaseUrl()).toBe('https://example.com');
  });

  it('uses VERCEL_URL with https prefix', () => {
    process.env.VERCEL_URL = 'my-app.vercel.app';
    expect(getBaseUrl()).toBe('https://my-app.vercel.app');
  });

  it('falls back to localhost with default port', () => {
    expect(getBaseUrl()).toBe('http://localhost:3000');
  });

  it('uses custom PORT', () => {
    process.env.PORT = '4000';
    expect(getBaseUrl()).toBe('http://localhost:4000');
  });
});
```

### Mocking Supabase for Data Function Tests

```typescript
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { listProducts, getProductBySlug } from './supabase-data';

// Mock Supabase client
vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
        ilike: vi.fn(() => ({
          limit: vi.fn(),
        })),
        limit: vi.fn(),
      })),
    })),
  },
}));

describe('listProducts', () => {
  it('returns empty array on error', async () => {
    // Test implementation with mocked error response
  });

  it('maps database fields to Product type', async () => {
    // Test field mapping
  });
});
```

---

## Component Tests

### When to Write Component Tests

Lower priority - only for interactive components:

- `Wishlist/index.tsx` - Add/remove toggle behavior
- `ShopWithSidebar/` filters - Filter interaction and state
- `QuickViewModal` - Modal open/close behavior
- `LanguageSwitcher` - Language selection

### Example: `src/components/Wishlist/index.test.tsx`

```typescript
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import wishlistReducer from '@/redux/features/wishlist-slice';
import WishlistItem from './SingleItem';

const mockProduct = {
  id: '1',
  title: 'Test Product',
  price: 100,
  currency: 'UAH',
  slug: 'test-product-1',
  imgs: { previews: ['/test.jpg'], thumbnails: ['/test.jpg'] },
};

function renderWithRedux(component: React.ReactNode) {
  const store = configureStore({
    reducer: { wishlist: wishlistReducer },
  });
  return render(<Provider store={store}>{component}</Provider>);
}

describe('WishlistItem', () => {
  it('renders product information', () => {
    renderWithRedux(<WishlistItem item={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
  });

  it('removes item when delete clicked', () => {
    renderWithRedux(<WishlistItem item={mockProduct} />);
    fireEvent.click(screen.getByTestId('remove-wishlist-item'));
    // Assert item removed from store
  });
});
```

---

## Test Data Setup

### Using Mock Data for Tests

The project has `src/lib/mock-data.ts` for development. Use it in tests:

```typescript
import { mockProducts, mockBrands, mockCategories } from '@/lib/mock-data';

describe('ProductGrid', () => {
  it('renders mock products', () => {
    render(<ProductGrid products={mockProducts} />);
    expect(screen.getAllByTestId('product-item')).toHaveLength(mockProducts.length);
  });
});
```

### E2E Test Data

For E2E tests, use the actual development database or a test seed:

1. Create a separate Supabase project for testing, OR
2. Seed test data before running E2E tests

---

## Adding Test IDs

Components need `data-testid` attributes for reliable E2E tests. Add them to:

```tsx
// src/components/Shop/SingleGridItem.tsx
<article data-testid="product-item">
  <a data-testid="product-link" href={...}>
    <h3 data-testid="product-title">{title}</h3>
    <p data-testid="product-price">{formatPrice(price, currency)}</p>
  </a>
  <button data-testid="wishlist-toggle">...</button>
</article>

// src/components/Header/index.tsx
<button data-testid="language-switcher">...</button>

// src/components/ShopWithSidebar/CategoryDropdown.tsx
<div data-testid="category-filter">...</div>
<button data-testid="category-option">...</button>
```

---

## CI Integration

### GitHub Actions: `.github/workflows/test.yml`

```yaml
name: Tests

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  unit-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm test:coverage

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install
      - run: pnpm exec playwright install --with-deps
      - run: pnpm test:e2e
        env:
          NEXT_PUBLIC_LISTOPAD__SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
          NEXT_PUBLIC_LISTOPAD__SUPABASE_ANON_KEY: ${{ secrets.SUPABASE_ANON_KEY }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 7
```

---

## Running Tests

```bash
# Unit tests
pnpm test              # Watch mode
pnpm test:coverage     # With coverage report

# E2E tests
pnpm test:e2e          # Headless
pnpm test:e2e:ui       # Interactive UI mode

# Run specific test file
pnpm test src/lib/formatPrice.test.ts
pnpm exec playwright test e2e/home.spec.ts
```

---

## Checklist for AI Agents

When implementing tests:

- [ ] Install dependencies: `pnpm add -D @playwright/test vitest @testing-library/react @testing-library/dom jsdom @vitejs/plugin-react`
- [ ] Create `playwright.config.ts` and `vitest.config.ts`
- [ ] Add test scripts to `package.json`
- [ ] Export `generateSlug` and `getIdFromSlug` from `src/lib/supabase-data.ts` for unit testing
- [ ] Add `data-testid` attributes to components for E2E tests
- [ ] Write E2E tests for critical user paths first
- [ ] Write unit tests for `src/lib/` utilities
- [ ] Set up GitHub Actions for CI
