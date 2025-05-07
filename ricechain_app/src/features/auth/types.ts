// features/auth/types.ts

import { PublicKey } from '@solana/web3.js'

/** Face SDK の Solana Provider が本来持っているメソッド */
export interface SolanaProvider {
  /** Phantom 互換: 現在利用可能な公開鍵の配列 */
  getPublicKeys(): Promise<PublicKey[]>
  /** メッセージ署名用 */
  signMessage(message: Uint8Array): Promise<Uint8Array>
}

/** SIWS ログイン時のリクエストペイロード */
export interface SiwsRequest {
  address: string        // base58 エンコードされた Solana アドレス
  message: string        // サーバーが発行した nonce を含むメッセージ
  signature: string      // base58 エンコードされた署名
}

/** SIWS で POST 後に返ってくる JSON  */
export interface SiwsResponse {
  ok: boolean            // 認証成否
  userId?: string        // 成功時に返却する内部ユーザーID
  error?: string         // 失敗時のエラーメッセージ
}

/** GET /api/auth/nonce で返る JSON */
export interface NonceResponse {
  nonce: string          // サーバーが毎回発行するランダムな文字列
}

/** iron-session で保持するセッションの中身 */
export interface SessionData {
  userId?: number        // ログイン後にセットされる内部ユーザーID
  nonce?: string         // SIWS の照合に使う nonce
}

/** クライアント側の認証コンテキストに置く情報と操作 */
export interface AuthContextValue {
  userId: string | null                // 現在ログイン中のユーザーID
  isAuthenticated: boolean             // ログイン済みかどうか
  login: (address: string) => Promise<SiwsResponse>  
  logout: () => Promise<void>
  loading: boolean                      // 非同期中ローディング状態
}
