import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getBaseUrl } from './getBaseUrl';

describe('getBaseUrl', () => {
  const originalWindow = global.window;
  const originalEnv = process.env;

  beforeEach(() => {
    process.env = { ...originalEnv };
    // @ts-ignore - mocking window
    delete global.window;
  });

  afterEach(() => {
    process.env = originalEnv;
    global.window = originalWindow;
  });

  it('returns empty string on client side (when window exists)', () => {
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

  it('falls back to localhost with default port 3000', () => {
    expect(getBaseUrl()).toBe('http://localhost:3000');
  });

  it('uses custom PORT env variable', () => {
    process.env.PORT = '4000';
    expect(getBaseUrl()).toBe('http://localhost:4000');
  });

  it('prioritizes NEXT_PUBLIC_SITE_URL over VERCEL_URL', () => {
    process.env.NEXT_PUBLIC_SITE_URL = 'https://example.com';
    process.env.VERCEL_URL = 'my-app.vercel.app';
    expect(getBaseUrl()).toBe('https://example.com');
  });

  it('prioritizes VERCEL_URL over localhost fallback', () => {
    process.env.VERCEL_URL = 'my-app.vercel.app';
    process.env.PORT = '4000';
    expect(getBaseUrl()).toBe('https://my-app.vercel.app');
  });
});
