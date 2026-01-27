import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getColors, getGenders } from './supabase-data';

// Mock Supabase client for the functions that require it
vi.mock('./supabase', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
          or: vi.fn(() => ({
            or: vi.fn(() => ({
              order: vi.fn(),
            })),
          })),
        })),
        ilike: vi.fn(() => ({
          limit: vi.fn(),
          eq: vi.fn(() => ({
            limit: vi.fn(),
          })),
        })),
        limit: vi.fn(),
      })),
    })),
  },
}));

describe('getColors', () => {
  it('returns 14 predefined colors', async () => {
    const colors = await getColors();
    expect(colors).toHaveLength(14);
  });

  it('includes expected color values', async () => {
    const colors = await getColors();
    expect(colors).toContain('white');
    expect(colors).toContain('black');
    expect(colors).toContain('grey');
    expect(colors).toContain('red');
    expect(colors).toContain('green');
    expect(colors).toContain('blue');
    expect(colors).toContain('yellow');
    expect(colors).toContain('brown');
    expect(colors).toContain('orange');
    expect(colors).toContain('cyan');
    expect(colors).toContain('magenta');
    expect(colors).toContain('indigo');
    expect(colors).toContain('silver');
    expect(colors).toContain('gold');
  });

  it('returns colors in expected order', async () => {
    const colors = await getColors();
    expect(colors).toEqual([
      'white', 'black', 'grey', 'red', 'green', 'blue',
      'yellow', 'brown', 'orange', 'cyan', 'magenta',
      'indigo', 'silver', 'gold'
    ]);
  });
});

describe('getGenders', () => {
  it('returns 3 gender options', async () => {
    const genders = await getGenders();
    expect(genders).toHaveLength(3);
  });

  it('returns male, female, and unisex', async () => {
    const genders = await getGenders();
    expect(genders).toContain('male');
    expect(genders).toContain('female');
    expect(genders).toContain('unisex');
  });

  it('returns genders in expected order', async () => {
    const genders = await getGenders();
    expect(genders).toEqual(['male', 'female', 'unisex']);
  });
});

// Note: Tests for Supabase-dependent functions (listBrands, listCategories, listProducts,
// getProductBySlug, countProducts) require more complex mocking of the Supabase client.
// These are integration tests that should run against a test database or use comprehensive mocks.
// For basic unit testing, the pure functions above are the primary focus.
