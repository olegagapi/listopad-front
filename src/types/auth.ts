export type BrandManagerStatus = 'pending' | 'active' | 'suspended';

export type BrandManager = {
  id: string;
  userId: string;
  brandId: number | null;
  fullName: string;
  phone: string | null;
  status: BrandManagerStatus;
  createdAt: string;
  updatedAt: string;
  brandLogoUrl: string | null;
};

export type AuthState = {
  user: {
    id: string;
    email: string;
  } | null;
  brandManager: BrandManager | null;
  isLoading: boolean;
  isAuthenticated: boolean;
};

export type SessionResponse = {
  user: {
    id: string;
    email: string;
  } | null;
  brandManager: BrandManager | null;
};
