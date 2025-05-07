// // features/order/types.ts

// /** 注文ステータス */
// export type OrderStatus =
//   | 'pending_payment'  // 支払い待ち
//   | 'processing'       // 処理中
//   | 'shipped'          // 発送済み
//   | 'delivered'        // 配達済み
//   | 'completed'        // 完了
//   | 'cancelled'        // キャンセル
//   | 'refunded'         // 返金済み
//   | 'dispute'          // 紛争中
//   | 'dispute_resolved' // 紛争解決済み

// /** 注文内アイテム */
// export interface OrderItem {
//   id: string           // アイテムID（行ID）
//   orderId: string      // 注文ID（外部キー）
//   productId: string    // 商品ID
//   quantity: number     // 数量
//   price: number        // 単価
//   createdAt: string    // 作成日時
// }

// /** 注文本体 */
// export interface Order {
//   id: string                // 注文ID
//   buyerId: string           // 購入者ユーザーID
//   sellerId: string          // 生産者ID
//   shippingAddressId: string // 配送先住所ID（外部キー）
//   status: OrderStatus       // ステータス
//   subtotal: number          // 小計
//   shippingFee: number       // 送料
//   komePonDiscount: number   // KomePon値引き合計
//   total: number             // 支払総額
//   paymentStatus: string     // 支払ステータス
//   reviewSubmitted: boolean  // レビュー済みか
//   transactionHash?: string  // Solana取引ハッシュ
//   shippedAt?: string        // 発送日時
//   cancelledAt?: string      // キャンセル日時
//   refundedAt?: string       // 返金日時
//   createdAt: string         // 作成日時
//   updatedAt: string         // 更新日時
// }