// // features/product/types.ts

// /** 商品の詳細仕様 */
// export interface ProductDetails {
//   variety: string    // 品種名
//   weightKg: number   // 内容量 (kg)
// }

// /** 商品の完全情報モデル */
// export interface Product {
//   id: string                 // 商品ID
//   farmerId: string           // 農家ID
//   name: string               // 商品名
//   description: string        // 商品説明文
//   imageUrl: string           // メイン画像のURL
//   price: number              // 通常価格
//   komePonDiscountRate?: number  // KomePon適用時の割引率（任意）
//   stock: number              // 在庫数
//   available: boolean         // 販売状態フラグ
//   rating: number             // 平均評価点（0-5）
//   reviewCount: number        // 評価件数
//   createdAt: string          // 作成日時（ISO形式）
//   updatedAt: string          // 更新日時（ISO形式）
//   details: ProductDetails    // 商品詳細情報
// }