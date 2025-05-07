// // features/user/types.ts

// /** KYC審査情報 */
// export interface KycStatus {
//   userId: string        // 関連するユーザーID
//   consumerId: string    // コンシューマー審査で割り当てられる一意ID
//   consumerLevel: number // コンシューマー審査の合格レベル
//   farmerId: string      // 農家審査で割り当てられる一意ID
//   farmerLevel: number   // 農家審査の合格レベル
//   createdAt: string     // 作成日時
//   updatedAt: string     // 更新日時
// }

// /** KomePon情報 */
// export interface KomePon {
//   id: string            // KomePonレコードの一意ID
//   userId: string        // 所有者のユーザーID
//   available: boolean    // 使用可能かどうか
//   givenAt: string       // 付与日時
//   relatedOrderId: string// 付与のトリガーとなった注文ID
//   createdAt: string     // 作成日時
// }

// /** 配送先住所 */
// export interface ShippingAddress {
//   id: string            // 住所レコードの一意ID
//   userId: string        // 関連するユーザーID
//   name: string          // 宛名
//   postalCode: string    // 郵便番号
//   prefecture: string    // 都道府県
//   city: string          // 市区町村
//   address1: string      // 町名・番地
//   address2?: string     // 建物名・部屋番号など（任意）
//   phoneNumber: string   // 電話番号
//   isDefault: boolean    // デフォルト住所かどうか
//   createdAt: string     // 作成日時
//   updatedAt: string     // 更新日時
// }

// /** ユーザー基本情報 */
// export interface User {
//   id: string            // 内部ユーザーID (主キー)
//   kycProfileId: string  // KYCプロバイダから割り当てられた一意のID
//   walletAddress: string // Solanaアドレス
//   handleName?: string   // ハンドル名
//   email?: string        // メールアドレス
//   iconImageUrl?: string // プロフィール画像URL
//   bannerImageUrl?: string // バナー画像URL
//   createdAt: string     // 作成日時
//   updatedAt: string     // 更新日時
// }