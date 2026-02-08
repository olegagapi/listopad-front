export type AccountStepData = {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
};

export type BrandBasicsStepData = {
  nameUk: string;
  nameEn: string;
};

export type BrandDetailsStepData = {
  marketingDescUk: string;
  marketingDescEn: string;
};

export type LinksLogoStepData = {
  externalUrl: string;
  instagramUrl: string;
  logoFile: File | null;
};

export type RegistrationFormData = AccountStepData &
  BrandBasicsStepData &
  BrandDetailsStepData &
  LinksLogoStepData;

export type RegistrationStep = 1 | 2 | 3 | 4;

export type RegistrationState = {
  currentStep: RegistrationStep;
  formData: Partial<RegistrationFormData>;
  isSubmitting: boolean;
  error: string | null;
};
