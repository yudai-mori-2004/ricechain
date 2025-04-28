export interface Review {
  id: string;
  productId: string;
  userId: string;
  orderId: string;
  rating: number;
  title: string;
  content: string;
  imageUrls?: string[];
  likes: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
    reviewCount: number;
  };
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
  farmer: {
    id: string;
    name: string;
  };
  komePonEarned: boolean;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  images?: File[];
}

export interface ReviewListItem {
  id: string;
  productId: string;
  rating: number;
  title: string;
  content: string;
  imageUrls?: string[];
  likes: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatarUrl?: string;
  };
  product: {
    id: string;
    name: string;
    imageUrl: string;
  };
}
