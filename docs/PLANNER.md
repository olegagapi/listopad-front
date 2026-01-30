# AI Agent Guidelines

Guidelines for AI agents working on this codebase. These practices ensure consistency, quality, and alignment with business requirements.

---

## 1. TDD Approach

### When to Use TDD

TDD (Test-Driven Development) works best for:

| Use Case | Why TDD Helps |
|----------|---------------|
| **New utilities** in `src/lib/` | Pure functions are easy to test first |
| **API routes** | Define expected inputs/outputs before implementation |
| **Bug fixes** | Write a failing test that reproduces the bug, then fix |
| **Data transformation** | Clear input→output contracts |
| **Edge cases** | Explicitly handle null, undefined, empty arrays |

### When TDD is Less Applicable

- UI layout and styling changes
- Content-only changes (text, images)
- Configuration file updates
- Simple refactoring within existing test coverage

### TDD Process

1. **Understand** - Read related code and existing tests
2. **Write test** - Create a failing test for the expected behavior
3. **See it fail** - Run the test to confirm it fails for the right reason
4. **Implement** - Write minimal code to pass the test
5. **Refactor** - Improve code while keeping tests green
6. **Repeat** - Add more test cases as needed

### Example

```typescript
// 1. Write test first (src/lib/formatPrice.test.ts)
it('formats UAH with symbol', () => {
  expect(formatPrice(100, 'UAH')).toBe('₴100.00');
});

// 2. Run test - it fails
// 3. Implement function
export function formatPrice(amount: number, currency: string): string {
  const symbols: Record<string, string> = { UAH: '₴', USD: '$' };
  return `${symbols[currency] || currency}${amount.toFixed(2)}`;
}

// 4. Run test - it passes
```

---

## 2. Ask Product Questions Instead of Assuming

When requirements are ambiguous, **ask before implementing**. Format questions clearly:

### Question Format

```markdown
**Context:** [What you're working on]
**Ambiguity:** [What's unclear]
**Options:**
1. [Option A] - [implications]
2. [Option B] - [implications]
**Default assumption:** [What I'll do if no answer]
```

### When to Ask

| Scenario | Ask About |
|----------|-----------|
| **Filter behavior** | Should empty filter show all items or no items? |
| **Missing data** | Show placeholder, hide element, or show error? |
| **External links** | Open in same tab, new tab, or modal? |
| **Error states** | User-friendly message or technical details? |
| **Localization** | Is this text user-facing and needs translation? |
| **Performance** | Lazy load or eager load? Pagination or infinite scroll? |

### Example Question

```markdown
**Context:** Implementing category filter on shop page
**Ambiguity:** When user selects a category with no products, what should happen?
**Options:**
1. Show empty state with "No products in this category" message
2. Show all products with a banner "No exact matches, showing related"
3. Redirect to parent category if available
**Default assumption:** Option 1 (show empty state)
```

### Don't Assume

- Business logic based on other e-commerce sites
- User preferences for UI behavior
- What "looks better" without checking design specs
- Feature parity with competitors

---

## 3. Flag Code-Business Logic Mismatches

When you discover code that contradicts business requirements, flag it immediately.

### Flag Format

```markdown
**MISMATCH FOUND**
**Location:** [file:line]
**Code behavior:** [what the code does]
**Expected:** [what CLAUDE.md or business logic says]
**Recommendation:** [fix suggestion]
```

### Areas to Check

| Principle | Check For |
|-----------|-----------|
| **No cart/checkout** | Any cart-related code, checkout flows, payment logic |
| **Click-through only** | Any internal purchase/order processing |
| **External links** | Links should use `target="_blank"` and point to brand sites |
| **Localization** | All UI text uses `t()` or `getTranslations()` |
| **Result types** | Error handling uses `{ data, error }` pattern |
| **Data fetching** | Uses functions from `supabase-data.ts` |
| **Currency** | Default is UAH, not USD |

### Example Flag

```markdown
**MISMATCH FOUND**
**Location:** src/components/Shop/SingleGridItem.tsx:129
**Code behavior:** Price displayed as `$${item.discountedPrice}` (USD symbol)
**Expected:** Currency should be UAH per CLAUDE.md
**Recommendation:** Change to `${item.discountedPrice} ${item.currency || 'UAH'}`
```

### Known Issues to Watch

1. **SingleGridItem links to hardcoded `/shop-details`** - Should use product slug
2. **LanguageSwitcher uses `<select>`** - E2E tests need `selectOption()` not `click()`
3. **Some components have hardcoded English text** - Should use `useTranslations()`

---

## 4. Testing Conventions

### File Naming

| Type | Pattern | Location |
|------|---------|----------|
| Unit tests | `*.test.ts` | Co-located with source (e.g., `src/lib/formatPrice.test.ts`) |
| Component tests | `*.test.tsx` | Co-located with component |
| E2E tests | `*.spec.ts` | `e2e/` directory |

### data-testid Conventions

- Use kebab-case: `product-item`, `wishlist-toggle`
- Be descriptive: `remove-wishlist-item` not `btn-1`
- Scope to component: `modal-close` not just `close`
- Don't over-attribute: Only add testids where E2E tests need them

### Standard Attributes

```tsx
// Product items
data-testid="product-item"
data-testid="product-link"
data-testid="product-title"
data-testid="product-price"
data-testid="wishlist-toggle"
data-testid="quick-view-btn"

// Filters
data-testid="category-filter"
data-testid="color-filter"
data-testid="gender-filter"
data-testid="price-filter"
data-testid="category-option"
data-testid="color-option"
data-testid="gender-option"

// Header/Navigation
data-testid="search-input"
data-testid="wishlist-link"
data-testid="language-switcher"
data-testid="language-select"

// Modals
data-testid="quick-view-modal"
data-testid="modal-close"

// Wishlist page
data-testid="wishlist-item"
data-testid="remove-wishlist-item"
data-testid="wishlist-count"
data-testid="clear-wishlist"

// Product details
data-testid="product-description"
data-testid="external-link"
```

### Running Tests

```bash
# Unit tests
pnpm test              # Watch mode
pnpm test:coverage     # With coverage report

# E2E tests
pnpm test:e2e          # Headless
pnpm test:e2e:ui       # Interactive UI mode

# Specific file
pnpm test src/lib/formatPrice.test.ts
pnpm exec playwright test e2e/home.spec.ts
```

---

## 5. When to Pause and Verify

### Stop and Ask When

- Changes affect **5+ files**
- Modifying **database schema** or migrations
- Changing **API response structure**
- Requirement contradicts CLAUDE.md
- Unsure about **user-facing text** (needs localization review)
- Adding **new dependencies**
- Touching **authentication** or **security** code

### Verification Checklist

Before completing a task:

- [ ] Code follows existing patterns in codebase
- [ ] No hardcoded English text (use `t()`)
- [ ] Error handling uses Result type pattern
- [ ] New functions have tests
- [ ] Components have data-testid if needed for E2E
- [ ] No cart/checkout/payment code introduced
- [ ] External links use `target="_blank"` with `rel="noopener noreferrer"`

---

## 6. Codebase-Specific Reminders

### This is NOT a transactional e-commerce site

- No shopping cart
- No checkout flow
- No order processing
- No payment integration
- No user accounts (auth pages exist but are non-functional)

### This IS a discovery/redirect platform

- Users browse products
- Users click through to brand websites or Instagram to purchase
- Wishlist is local storage only (no server-side persistence)
- All "buy" buttons should link externally

### Key Files

| Purpose | File |
|---------|------|
| Data fetching | `src/lib/supabase-data.ts` |
| API validation | `src/lib/apiValidation.ts` |
| Category hierarchy | `src/lib/categoryHierarchy.ts` |
| Search hook | `src/hooks/useSearch.ts` |
| Browse hook | `src/hooks/useFilteredProducts.ts` |
| Type definitions | `src/types/*.ts` |
| Redux state | `src/redux/features/*.ts` |
| Translations | `messages/uk.json`, `messages/en.json` |
| Testing docs | `docs/TESTING.md` |
| Database schema | `docs/DATABASE-SCHEMA.md` |
| Meilisearch docs | `docs/MEILISEARCH.md` |

---

## Quick Reference Card

```
✅ DO:
- Use TDD for new utilities
- Ask about ambiguous requirements
- Flag code-business mismatches
- Use useTranslations() for UI text
- Return Result types { data, error }
- Add data-testid for E2E tests
- Link externally for purchases

❌ DON'T:
- Assume business logic
- Add cart/checkout code
- Hardcode English strings
- Use console.log in production
- Skip error handling
- Introduce new patterns without discussion
```
