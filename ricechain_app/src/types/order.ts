export type OrderStatus = 
  | 'pending_payment' // 支払い待ち
  | 'processing' // 処理中
  | 'shipped' // 発送済み
  | 'delivered' // 配達済み
  | 'completed' // 完了
  | 'cancelled' // キャンセル
  | 'refunded' // 返金済み
  | 'dispute' // 紛争中
  | 'dispute_resolved'; // 紛争解決済み

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImageUrl: string;
  quantity: number;
  price: number;
  komePonApplied: boolean;
  komePonDiscount?: number;
  farmerId: string;
  farmerName: string;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  tax: number;
  komePonDiscount: number;
  total: number;
  paymentMethod: 'solana' | 'credit_card' | 'bank_transfer';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  transactionHash?: string;
  shippingAddress: {
    name: string;
    postalCode: string;
    prefecture: string;
    city: string;
    address1: string;
    address2?: string;
    phoneNumber: string;
  };
  trackingNumber?: string;
  shippedAt?: string;
  deliveredAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  refundedAt?: string;
  disputeStartedAt?: string;
  disputeResolvedAt?: string;
  reviewSubmitted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface OrderListItem {
  id: string;
  status: OrderStatus;
  total: number;
  itemCount: number;
  mainImageUrl: string;
  createdAt: string;
  reviewSubmitted: boolean;
  canReview: boolean;
}
