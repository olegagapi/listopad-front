import { describe, it, expect } from 'vitest';
import { generateSlug, getIdFromSlug } from './slug';

describe('generateSlug', () => {
  it('creates slug from name and id', () => {
    expect(generateSlug('Summer Dress', 123)).toBe('summer-dress-123');
  });

  it('handles special characters', () => {
    expect(generateSlug("Women's Top!", 456)).toBe('women-s-top--456');
  });

  it('handles spaces', () => {
    expect(generateSlug('Blue Cotton Shirt', 789)).toBe('blue-cotton-shirt-789');
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

  it('handles multiple dashes', () => {
    expect(getIdFromSlug('blue-cotton-long-sleeve-shirt-456')).toBe('456');
  });
});
