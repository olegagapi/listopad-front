import { describe, it, expect } from 'vitest';
import { formatPrice } from './formatPrice';

describe('formatPrice', () => {
  it('formats USD by default', () => {
    expect(formatPrice(100)).toBe('$100.00');
  });

  it('formats UAH currency', () => {
    expect(formatPrice(100, 'UAH')).toContain('100');
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
