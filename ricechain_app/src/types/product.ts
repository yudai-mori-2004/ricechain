export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  komePonPrice?: number;
  imageUrl: string;
  farmer: {
    id: string;
    name: string;
    location: string;
    rating: number;
  };
  details: {
    variety: string;
    harvestDate: string;
    weight: number; // in kg
    polishingRatio?: number; // 精米歩合
    cultivationMethod: 'organic' | 'conventional' | 'reduced_pesticide';
  };
  stock: number;
  available: boolean;
  rating: number;
  reviewCount: number;
  hasKomePon: boolean;
  komePonAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListItem {
  id: string;
  name: string;
  description: string;
  price: number;
  komePonPrice?: number;
  imageUrl: string;
  farmer: {
    id: string;
    name: string;
  };
  rating: number;
  reviewCount: number;
  available: boolean;
  hasKomePon: boolean;
}
