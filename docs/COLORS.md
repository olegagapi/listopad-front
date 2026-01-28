# Color Scheme Documentation

This document describes the Listopad color palette, design rationale, and practical guidelines for working with colors in the codebase.

## Design Philosophy

The palette was designed to feel **warm, fashion-forward, and sophisticated** rather than corporate/tech-leaning. Key principles:

- **Warm neutrals** instead of cool grays (fashion brands like Zara, COS use warm tones)
- **Unexpected green accent** - Malachite Green is fresh and bold while remaining elegant
- **Subtle warmth** - backgrounds have barely-perceptible warmth, not obviously tinted
- **Cohesive harmony** - green undertones run through the palette (Malachite, Onyx, Dark Slate)

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Malachite** | `#0BDA51` | Primary CTAs, active states, highlights |
| **Onyx** | `#00120B` | Primary text, headings, button text |
| **Dark Slate** | `#35605A` | Hover states, secondary accents, links |

### Background Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Champagne** | `#FAFAF8` | Main page background |
| **Champagne-50** | `#FEFEFD` | Cards, panels, modals (subtle off-white) |
| **Champagne-200** | `#F7F6F3` | Section backgrounds, hero areas |
| **Champagne-300** | `#F0EFEB` | Dividers, subtle separations |
| **Champagne-400** | `#E8E6E2` | Borders, input outlines |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Onyx** | `#00120B` | Primary text, headings |
| **Onyx-soft** | `#1A2920` | Slightly softer variant |
| **Slate** | `#6B818C` | Body text, secondary content |
| **Slate-light** | `#8A9BA5` | Muted text, captions, placeholders |
| **Slate-dark** | `#4A5C64` | Emphasized secondary text |

### Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Malachite** | `#0BDA51` | Primary buttons, active indicators |
| **Malachite-dark** | `#09B844` | Hover state for malachite buttons |
| **Malachite-muted** | `#E6FCF0` | Very light green tint backgrounds |
| **Lavender** | `#D8E4FF` | Focus rings, selection backgrounds |
| **Lavender-muted** | `#F2F5FF` | Subtle accent backgrounds |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#0BDA51` | Same as Malachite |
| **Error** | `#E53935` | Error states, validation |
| **Warning** | `#FFA726` | Warning messages |

## Tailwind Configuration

Colors are defined in `tailwind.config.ts`. The configuration includes:

1. **New semantic colors** (champagne, malachite, lavender, onyx, slate, darkslate)
2. **Legacy mappings** for backward compatibility during transition

### Using Colors in Components

```tsx
// Primary button
<button className="bg-malachite text-onyx hover:bg-malachite-dark">
  View on Seller
</button>

// Card with subtle off-white background
<div className="bg-champagne-50 shadow-1 rounded-lg">
  ...
</div>

// Link with hover
<a className="text-onyx hover:text-malachite">
  Learn more
</a>

// Body text
<p className="text-slate">Description text here</p>

// Muted/caption text
<span className="text-slate-light">Last updated</span>
```

## CSS Considerations

### Global Styles (`src/app/css/style.css`)

The body background is set in the base layer:

```css
body {
  @apply bg-champagne;
}
```

Component-level styles (dropdowns, sliders, carousels) also use the color palette.

### Box Shadows

Custom shadows use champagne-400 for consistency:

```typescript
boxShadow: {
  breadcrumb: "0px 1px 0px 0px #E8E6E2, 0px -1px 0px 0px #E8E6E2",
  filter: "0px 1px 0px 0px #E8E6E2",
  list: "1px 0px 0px 0px #E8E6E2",
}
```

## Caveats & Lessons Learned

### 1. Hardcoded Hex Values

Some components had hardcoded hex values like `bg-[#f3f4f6]` instead of Tailwind classes. Always search for hardcoded colors when doing palette changes:

```bash
# Find hardcoded background colors
grep -r "bg-\[#" src/components/
```

### 2. Invalid Class Names

During search-and-replace operations, typos can create invalid classes:
- `text-onyx-4` (doesn't exist - should be `text-slate`)
- `hover:text-onyxslate` (typo - should be `hover:text-malachite`)

Always run `pnpm build` after color changes to catch CSS errors.

### 3. Pure White vs Off-White

Not everything should be off-white. Keep pure `bg-white` for:
- Slider/range thumbs (functional elements)
- Checkbox unchecked states

Use `bg-lavender` for small icon buttons (Quick View, Wishlist icons) - they stand out better against cards.

Use `bg-champagne-50` for:
- Cards and panels
- Filter containers
- Modal backgrounds
- Dropdowns

### 4. Legacy Color Mappings

The config maintains legacy color names (`blue`, `gray`, `dark`, etc.) that map to new values. This prevents breaking existing code during transition:

```typescript
blue: {
  DEFAULT: "#0BDA51", // maps to malachite
  dark: "#09B844",
  // ...
}
```

When writing new code, prefer the semantic names (`malachite`, `champagne`, etc.).

### Secondary Button Pattern

For internal actions (View All, Add to Wishlist), use lavender buttons to distinguish from primary green CTAs:

| State | Classes |
|-------|---------|
| Default | `bg-lavender text-onyx border border-lavender-dark` |
| Hover | `hover:bg-lavender-dark hover:border-lavender-dark` |

**Design rationale:**
- **Green (malachite)**: External actions (View on seller website, Buy)
- **Lavender**: Internal actions (Add to Wishlist, View All, icon buttons)

### 5. SVG Icon Colors

Footer and header icons may have hardcoded `fill="#..."` attributes. These need manual updates:

```tsx
// Before
<svg fill="#3C50E0">

// After
<svg fill="#35605A">  // or use fill="currentColor" with text color class
```

Prefer `fill="currentColor"` with a text color class for flexibility:

```tsx
<svg className="fill-current text-malachite">
```

### 6. Contrast Ratios

| Combination | Ratio | WCAG |
|-------------|-------|------|
| Onyx on Champagne | ~19:1 | AAA |
| Malachite on Champagne | ~4:1 | AA (large text) |
| Malachite on Onyx | ~10:1 | AAA |
| Slate on Champagne | ~4.6:1 | AA |

Malachite Green on light backgrounds meets large text requirements. For small text on malachite backgrounds, use Onyx (dark text).

### 7. Subtlety is Key

The champagne palette should be barely perceptible. If backgrounds look obviously yellow/cream, the values are too saturated. Current values:
- `#FAFAF8` - main background (almost white with hint of warmth)
- `#FEFEFD` - cards (nearly indistinguishable from white)

## File Reference

Key files for color configuration:

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Color palette definition |
| `src/app/css/style.css` | Global styles, component styles |
| `src/components/Header/index.tsx` | Header colors, icons |
| `src/components/Footer/index.tsx` | Footer colors, social icons |
| `src/components/Shop/*.tsx` | Product cards, filters |
| `src/components/ShopWithSidebar/*.tsx` | Filter dropdowns |

## Adding New Colors

1. Add to `tailwind.config.ts` under `colors`
2. Consider adding legacy mapping if replacing an existing color
3. Update this documentation
4. Run `pnpm build` to verify no CSS errors
