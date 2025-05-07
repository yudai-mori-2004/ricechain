import { getIronSession, IronSessionData, type SessionOptions } from 'iron-session';
import type { NextRequest, NextResponse } from 'next/server';

/* ────────────────────────────────────
   1) ここでセッションに載せるフィールドを宣言
──────────────────────────────────── */
declare module 'iron-session' {
  interface IronSessionData {
    userId?: string;
    nonce?: string;
  }
}

/* ────────────────────────────────────
   2) 共通オプション
──────────────────────────────────── */
export const sessionOptions: SessionOptions = {
  cookieName: 'rc_auth',
  password  : process.env.SESSION_PASSWORD!,        // 32 文字以上
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',  // 本番のみ Secure
  },
};

/* ────────────────────────────────────
   3) ルートハンドラ用ヘルパ
──────────────────────────────────── */
/** Session を取り出す：Next.js Route Handlers 用 */
export function getSession(req: NextRequest, res: NextResponse) {
  return getIronSession<IronSessionData>(req, res, sessionOptions);
}
