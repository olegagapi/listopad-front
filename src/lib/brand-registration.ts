import { z } from 'zod';

export const accountStepSchema = z
  .object({
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
      .regex(/[0-9]/, 'Password must contain at least one number'),
    confirmPassword: z.string(),
    fullName: z
      .string()
      .min(2, 'Full name must be at least 2 characters')
      .max(100, 'Full name must be at most 100 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const brandBasicsStepSchema = z.object({
  nameUk: z
    .string()
    .min(2, 'Brand name must be at least 2 characters')
    .max(100, 'Brand name must be at most 100 characters'),
  nameEn: z
    .string()
    .min(2, 'Brand name must be at least 2 characters')
    .max(100, 'Brand name must be at most 100 characters'),
});

export const brandDetailsStepSchema = z.object({
  marketingDescUk: z
    .string()
    .max(1000, 'Description must be at most 1000 characters'),
  marketingDescEn: z
    .string()
    .max(1000, 'Description must be at most 1000 characters'),
});

const urlOrEmpty = z
  .string()
  .refine(
    (val) => val === '' || z.string().url().safeParse(val).success,
    'Must be a valid URL'
  );

export const linksLogoStepSchema = z.object({
  externalUrl: urlOrEmpty,
  instagramUrl: urlOrEmpty,
  logoFile: z.instanceof(File).nullable(),
});

export const fullRegistrationSchema = accountStepSchema
  .merge(brandBasicsStepSchema)
  .merge(brandDetailsStepSchema)
  .merge(
    z.object({
      externalUrl: urlOrEmpty,
      instagramUrl: urlOrEmpty,
    })
  );

export type AccountStepInput = z.infer<typeof accountStepSchema>;
export type BrandBasicsStepInput = z.infer<typeof brandBasicsStepSchema>;
export type BrandDetailsStepInput = z.infer<typeof brandDetailsStepSchema>;
export type LinksLogoStepInput = z.infer<typeof linksLogoStepSchema>;
export type FullRegistrationInput = z.infer<typeof fullRegistrationSchema>;

export function validateAccountStep(
  data: unknown
): { success: true; data: AccountStepInput } | { success: false; errors: z.ZodError } {
  const result = accountStepSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export function validateBrandBasicsStep(
  data: unknown
): { success: true; data: BrandBasicsStepInput } | { success: false; errors: z.ZodError } {
  const result = brandBasicsStepSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export function validateBrandDetailsStep(
  data: unknown
): { success: true; data: BrandDetailsStepInput } | { success: false; errors: z.ZodError } {
  const result = brandDetailsStepSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export function validateLinksLogoStep(
  data: unknown
): { success: true; data: LinksLogoStepInput } | { success: false; errors: z.ZodError } {
  const result = linksLogoStepSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}

export function validateFullRegistration(
  data: unknown
): { success: true; data: FullRegistrationInput } | { success: false; errors: z.ZodError } {
  const result = fullRegistrationSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
}
