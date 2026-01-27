import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchProductsFromApi } from './serverApi';

// Mock getBaseUrl
vi.mock('./getBaseUrl', () => ({
  getBaseUrl: vi.fn(() => 'http://localhost:3000'),
}));

describe('fetchProductsFromApi', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.resetAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('constructs correct URL with no params', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    global.fetch = mockFetch;

    await fetchProductsFromApi();

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/products',
      expect.objectContaining({ next: { revalidate: 120 } })
    );
  });

  it('constructs correct URL with limit param', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    global.fetch = mockFetch;

    await fetchProductsFromApi({ limit: 10 });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/products?limit=10',
      expect.objectContaining({ next: { revalidate: 120 } })
    );
  });

  it('constructs correct URL with search param', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    global.fetch = mockFetch;

    await fetchProductsFromApi({ search: 'dress' });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/products?search=dress',
      expect.objectContaining({ next: { revalidate: 120 } })
    );
  });

  it('constructs correct URL with both limit and search params', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    global.fetch = mockFetch;

    await fetchProductsFromApi({ limit: 5, search: 'shirt' });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/products?limit=5&search=shirt',
      expect.objectContaining({ next: { revalidate: 120 } })
    );
  });

  it('uses custom revalidate value', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: [] }),
    });
    global.fetch = mockFetch;

    await fetchProductsFromApi({ revalidate: 60 });

    expect(mockFetch).toHaveBeenCalledWith(
      'http://localhost:3000/api/products',
      expect.objectContaining({ next: { revalidate: 60 } })
    );
  });

  it('returns products from response', async () => {
    const mockProducts = [
      { id: '1', title: 'Product 1' },
      { id: '2', title: 'Product 2' },
    ];
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ products: mockProducts }),
    });
    global.fetch = mockFetch;

    const result = await fetchProductsFromApi();

    expect(result).toEqual(mockProducts);
  });

  it('returns empty array on fetch error', async () => {
    const mockFetch = vi.fn().mockRejectedValue(new Error('Network error'));
    global.fetch = mockFetch;

    const result = await fetchProductsFromApi();

    expect(result).toEqual([]);
  });

  it('returns empty array on non-ok response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: () => Promise.resolve('Internal Server Error'),
    });
    global.fetch = mockFetch;

    const result = await fetchProductsFromApi();

    expect(result).toEqual([]);
  });

  it('returns empty array when products is undefined in response', async () => {
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    global.fetch = mockFetch;

    const result = await fetchProductsFromApi();

    expect(result).toEqual([]);
  });
});
