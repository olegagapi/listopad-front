import { describe, it, expect } from 'vitest';
import {
  validateAccountStep,
  validateBrandBasicsStep,
  validateLinksLogoStep,
} from './brand-registration';

describe('validateAccountStep', () => {
  const validData = {
    email: 'test@example.com',
    password: 'Password123',
    confirmPassword: 'Password123',
    fullName: 'John Doe',
  };

  it('accepts valid email, password, fullName', () => {
    const result = validateAccountStep(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe('test@example.com');
      expect(result.data.fullName).toBe('John Doe');
    }
  });

  it('rejects invalid email format', () => {
    const result = validateAccountStep({
      ...validData,
      email: 'not-an-email',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.errors.issues.find((e) => e.path[0] === 'email');
      expect(emailError).toBeDefined();
    }
  });

  describe('rejects weak password', () => {
    it('rejects password shorter than 8 characters', () => {
      const result = validateAccountStep({
        ...validData,
        password: 'Pass1',
        confirmPassword: 'Pass1',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.errors.issues.find((e) => e.path[0] === 'password');
        expect(passwordError).toBeDefined();
        expect(passwordError?.message).toContain('at least 8 characters');
      }
    });

    it('rejects password without uppercase letter', () => {
      const result = validateAccountStep({
        ...validData,
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.errors.issues.find((e) => e.path[0] === 'password');
        expect(passwordError).toBeDefined();
        expect(passwordError?.message).toContain('uppercase');
      }
    });

    it('rejects password without lowercase letter', () => {
      const result = validateAccountStep({
        ...validData,
        password: 'PASSWORD123',
        confirmPassword: 'PASSWORD123',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.errors.issues.find((e) => e.path[0] === 'password');
        expect(passwordError).toBeDefined();
        expect(passwordError?.message).toContain('lowercase');
      }
    });

    it('rejects password without number', () => {
      const result = validateAccountStep({
        ...validData,
        password: 'Passwordabc',
        confirmPassword: 'Passwordabc',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        const passwordError = result.errors.issues.find((e) => e.path[0] === 'password');
        expect(passwordError).toBeDefined();
        expect(passwordError?.message).toContain('number');
      }
    });
  });

  it('rejects mismatched passwords', () => {
    const result = validateAccountStep({
      ...validData,
      password: 'Password123',
      confirmPassword: 'Different123',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const confirmError = result.errors.issues.find(
        (e) => e.path[0] === 'confirmPassword'
      );
      expect(confirmError).toBeDefined();
      expect(confirmError?.message).toContain('match');
    }
  });

  it('rejects short fullName (< 2 chars)', () => {
    const result = validateAccountStep({
      ...validData,
      fullName: 'A',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.errors.issues.find((e) => e.path[0] === 'fullName');
      expect(nameError).toBeDefined();
      expect(nameError?.message).toContain('at least 2 characters');
    }
  });

  it('rejects long fullName (> 100 chars)', () => {
    const result = validateAccountStep({
      ...validData,
      fullName: 'A'.repeat(101),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.errors.issues.find((e) => e.path[0] === 'fullName');
      expect(nameError).toBeDefined();
      expect(nameError?.message).toContain('at most 100 characters');
    }
  });
});

describe('validateBrandBasicsStep', () => {
  const validData = {
    nameUk: 'Тестовий Бренд',
    nameEn: 'Test Brand',
  };

  it('accepts valid brand names', () => {
    const result = validateBrandBasicsStep(validData);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.nameUk).toBe('Тестовий Бренд');
      expect(result.data.nameEn).toBe('Test Brand');
    }
  });

  it('rejects short names (< 2 chars) for Ukrainian name', () => {
    const result = validateBrandBasicsStep({
      ...validData,
      nameUk: 'A',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.errors.issues.find((e) => e.path[0] === 'nameUk');
      expect(nameError).toBeDefined();
      expect(nameError?.message).toContain('at least 2 characters');
    }
  });

  it('rejects short names (< 2 chars) for English name', () => {
    const result = validateBrandBasicsStep({
      ...validData,
      nameEn: 'B',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.errors.issues.find((e) => e.path[0] === 'nameEn');
      expect(nameError).toBeDefined();
      expect(nameError?.message).toContain('at least 2 characters');
    }
  });

  it('rejects long names (> 100 chars) for Ukrainian name', () => {
    const result = validateBrandBasicsStep({
      ...validData,
      nameUk: 'А'.repeat(101),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.errors.issues.find((e) => e.path[0] === 'nameUk');
      expect(nameError).toBeDefined();
      expect(nameError?.message).toContain('at most 100 characters');
    }
  });

  it('rejects long names (> 100 chars) for English name', () => {
    const result = validateBrandBasicsStep({
      ...validData,
      nameEn: 'A'.repeat(101),
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const nameError = result.errors.issues.find((e) => e.path[0] === 'nameEn');
      expect(nameError).toBeDefined();
      expect(nameError?.message).toContain('at most 100 characters');
    }
  });
});

describe('validateLinksLogoStep', () => {
  it('accepts valid URLs', () => {
    const result = validateLinksLogoStep({
      externalUrl: 'https://example.com',
      instagramUrl: 'https://instagram.com/mybrand',
      logoFile: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.externalUrl).toBe('https://example.com');
      expect(result.data.instagramUrl).toBe('https://instagram.com/mybrand');
    }
  });

  it('accepts empty URLs (optional fields)', () => {
    const result = validateLinksLogoStep({
      externalUrl: '',
      instagramUrl: '',
      logoFile: null,
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.externalUrl).toBe('');
      expect(result.data.instagramUrl).toBe('');
    }
  });

  it('rejects invalid URL format for externalUrl', () => {
    const result = validateLinksLogoStep({
      externalUrl: 'not-a-url',
      instagramUrl: '',
      logoFile: null,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const urlError = result.errors.issues.find((e) => e.path[0] === 'externalUrl');
      expect(urlError).toBeDefined();
      expect(urlError?.message).toContain('valid URL');
    }
  });

  it('rejects invalid URL format for instagramUrl', () => {
    const result = validateLinksLogoStep({
      externalUrl: '',
      instagramUrl: 'instagram.com/mybrand',
      logoFile: null,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      const urlError = result.errors.issues.find((e) => e.path[0] === 'instagramUrl');
      expect(urlError).toBeDefined();
      expect(urlError?.message).toContain('valid URL');
    }
  });
});
