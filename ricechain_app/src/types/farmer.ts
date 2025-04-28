export interface Farmer {
  id: string;
  name: string;
  description: string;
  location: string;
  prefecture: string;
  imageUrl: string;
  bannerImageUrl?: string;
  contactEmail: string;
  phoneNumber?: string;
  establishedYear?: number;
  rating: number;
  reviewCount: number;
  products: {
    id: string;
    name: string;
    imageUrl: string;
  }[];
  specialties: string[];
  cultivationMethods: ('organic' | 'conventional' | 'reduced_pesticide')[];
  certifications?: string[];
  story?: string;
  komePonRank?: number;
  komePonBudget?: number;
  komePonSettings?: {
    discountAmount: number;
    maxRedemptions: number;
    remainingRedemptions: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FarmerListItem {
  id: string;
  name: string;
  location: string;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  productCount: number;
  isNew: boolean;
}
