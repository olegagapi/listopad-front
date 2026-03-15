# Color Scheme Documentation

This document describes the Listopad color palette, design rationale, and practical guidelines for working with colors in the codebase.

## Design Philosophy

The palette uses **PANTONE-sourced** deep greens and blues for a **sophisticated, moody** aesthetic. Key principles:

- **Cool neutrals** — subtle cool-toned backgrounds, not warm
- **Dark primary accent** — Posy Green is deep; white text on primary accent backgrounds
- **Soft secondary accents** — Silver uses neutral light grays for understated secondary elements
- **Forest-inspired sophistication** — Pine Grove, Posy Green, and Stormy Weather evoke depth
- **High contrast** — Carbon text on cool white backgrounds for excellent readability

## PANTONE Sources

| PANTONE Name | Hex | Role |
|---|---|---|
| Posy Green | `#325B51` | Primary accent (malachite) |
| Pine Grove | `#223631` | Secondary accent (darkslate) |
| Carbon | `#272F38` | Primary text (onyx) |
| *(removed)* | — | Silver is now neutral light gray, not Colonial Blue |
| Stormy Weather | `#58646D` | Body text (slate) |

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Malachite** | `#325B51` | Primary CTAs, active states, highlights |
| **Onyx** | `#272F38` | Primary text, headings |
| **Dark Slate** | `#223631` | Hover states, secondary accents |

### Background Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Champagne** | `#F9FAFA` | Main page background |
| **Champagne-50** | `#FEFEFE` | Cards, panels, modals |
| **Champagne-200** | `#F5F6F7` | Section backgrounds, hero areas |
| **Champagne-300** | `#EEEEF0` | Dividers, subtle separations |
| **Champagne-400** | `#E3E4E6` | Borders, input outlines |

### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Onyx** | `#272F38` | Primary text, headings |
| **Onyx-soft** | `#343D47` | Slightly softer variant |
| **Slate** | `#58646D` | Body text, secondary content |
| **Slate-light** | `#7A848C` | Muted text, captions, placeholders |
| **Slate-dark** | `#434D54` | Emphasized secondary text |

### Accent Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Malachite** | `#325B51` | Primary buttons, active indicators |
| **Malachite-dark** | `#284A42` | Hover state for malachite buttons |
| **Malachite-muted** | `#E8EFED` | Very light green tint backgrounds |
| **Silver** | `#EEEEF0` | Neutral light gray — secondary buttons, icon button backgrounds |
| **Silver-dark** | `#E3E4E6` | Hover state for silver elements |
| **Silver-light** | `#F5F6F7` | Light variant for subtle accents |
| **Silver-muted** | `#F9FAFA` | Subtle accent backgrounds (e.g. category icons) |

### Semantic Colors

| Name | Hex | Usage |
|------|-----|-------|
| **Success** | `#325B51` | Same as Malachite |
| **Error** | `#E53935` | Error states, validation |
| **Warning** | `#FFA726` | Warning messages |

## Text on Accent Backgrounds

Malachite (#325B51) is **dark** — use `text-white`. Silver (#EEEEF0) is **light** — use `text-onyx`.

```tsx
// Primary button — white text on dark green
<button className="bg-malachite text-white hover:bg-malachite-dark">
  View on Seller
</button>

// Secondary button — dark text on light neutral
<Link className="bg-silver text-onyx border border-silver-dark hover:bg-silver-dark">
  View All
</Link>

// Icon buttons — dark icons on light neutral
<button className="bg-silver text-onyx hover:bg-silver-dark">
  <EyeIcon />
</button>
```

## Tailwind Configuration

Colors are defined in `tailwind.config.ts`. The configuration includes:

1. **Semantic colors** (champagne, malachite, silver, onyx, slate, darkslate)
2. **Legacy mappings** for backward compatibility

### Using Colors in Components

```tsx
// Primary button
<button className="bg-malachite text-white hover:bg-malachite-dark">
  View on Seller
</button>

// Card with subtle background
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

### Box Shadows

Custom shadows use champagne-400 (#E3E4E6):

```typescript
boxShadow: {
  breadcrumb: "0px 1px 0px 0px #E3E4E6, 0px -1px 0px 0px #E3E4E6",
  filter: "0px 1px 0px 0px #E3E4E6",
  list: "1px 0px 0px 0px #E3E4E6",
  input: "inset 0 0 0 2px #325B51",  // Malachite (Posy Green)
}
```

## Caveats & Lessons Learned

### 1. Malachite is Dark, Silver is Light

Malachite (`bg-malachite`) requires `text-white`. Silver (`bg-silver`) is a neutral light gray and requires `text-onyx`.

### 2. Legacy Color Mappings

The config maintains legacy color names (`blue`, `gray`, `dark`, etc.) that map to PANTONE values. When writing new code, prefer semantic names (`malachite`, `champagne`, etc.).

### 3. SVG Icon Colors

SVG icons use hardcoded fills. The current values:
- Text/path fills: `#272F38` (Carbon)
- Accent fills: `#325B51` (Posy Green)

Prefer `fill="currentColor"` with a text color class for flexibility:

```tsx
<svg className="fill-current text-malachite">
```

### 4. Contrast Ratios

| Combination | Ratio | WCAG |
|---|---|---|
| Carbon (#272F38) on Champagne (#F9FAFA) | ~14:1 | AAA |
| White on Posy Green (#325B51) | ~5.5:1 | AA |
| White on Pine Grove (#223631) | ~10:1 | AAA |
| Onyx (#272F38) on Silver (#EEEEF0) | ~10:1 | AAA |
| Stormy Weather (#58646D) on Champagne | ~5:1 | AA |
| Posy Green on Champagne (text/link) | ~6.5:1 | AA |

### 5. Button Patterns

| Type | Classes |
|---|---|
| Primary CTA | `bg-malachite text-white hover:bg-malachite-dark` |
| Secondary | `bg-silver text-onyx border border-silver-dark hover:bg-silver-dark` |
| Ghost/Hover | `text-onyx hover:bg-malachite hover:text-white` |
| Icon button | `bg-silver text-onyx hover:bg-silver-dark` |

**Design rationale:**
- **Green (malachite)**: External actions (View on seller website)
- **Neutral (silver)**: Internal actions (View All, Quick View, Wishlist icons)

## File Reference

| File | Purpose |
|------|---------|
| `tailwind.config.ts` | Color palette definition |
| `src/app/css/style.css` | Global styles, component styles |
| `src/components/Icons/CheckCircleIcon.tsx` | Hardcoded accent fill |
| `public/images/logo/logo.svg` | Logo fill colors |
| `public/images/icons/*.svg` | Static SVG icon fills |

## Adding New Colors

1. Add to `tailwind.config.ts` under `colors`
2. Consider adding legacy mapping if replacing an existing color
3. Update this documentation
4. Run `pnpm build` to verify no CSS errors
