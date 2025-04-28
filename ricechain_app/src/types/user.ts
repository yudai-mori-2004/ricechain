export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  role: 'consumer' | 'farmer' | 'admin';
  isFarmer: boolean;
  farmerId?: string;
  walletAddress?: string;
  hasKomePonRights: boolean;
  kycStatus: 'none' | 'pending' | 'verified' | 'rejected';
  shippingAddresses: ShippingAddress[];
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ShippingAddress {
  id: string;
  name: string;
  postalCode: string;
  prefecture: string;
  city: string;
  address1: string;
  address2?: string;
  phoneNumber: string;
  isDefault: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  avatarUrl?: string;
  reviewCount: number;
  orderCount: number;
  memberSince: string;
  hasKomePonRights: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}
