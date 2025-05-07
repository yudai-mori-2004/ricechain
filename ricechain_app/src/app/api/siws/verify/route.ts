// app/api/siws/verify/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { upsertUser } from '@/lib/user'
import nacl from 'tweetnacl'
import bs58 from 'bs58'
import { buildSiwsMessage } from '@/lib/solana/siws'

export async function POST(req: NextRequest) {
  // テンポラリ Response ―― Set‑Cookie を拾うため
  const tempRes = NextResponse.next()

  try {
    /* ------------------------------------------------------------------ */
    /* 1) セッション＆リクエスト読み込み                                   */
    /* ------------------------------------------------------------------ */
    const session = await getSession(req, tempRes)
    const { address, message, signature } = await req.json()

    console.log('[verify] address :', address)
    console.log('[verify] nonce   :', session.nonce)
    console.log('[verify] sig.len :', signature.length)

    /* ------------------------------------------------------------------ */
    /* 2) Nonce チェック                                                   */
    /* ------------------------------------------------------------------ */
    if (!session.nonce || !message.includes(session.nonce)) {
      console.error('[verify] nonce mismatch')
      return NextResponse.json(
        { ok: false, error: 'Invalid nonce' },
        { status: 400 }
      )
    }

    /* ------------------------------------------------------------------ */
    /* 3) メッセージ整合性チェック（改行ズレ検出用ログ）                  */
    /* ------------------------------------------------------------------ */
    const expectedMsg = buildSiwsMessage({
      domain: req.headers.get('host') ?? '',
      address,
      statement: 'Sign-in with Solana to RiceChain',
      nonce: session.nonce,
    })
    if (message !== expectedMsg) {
      console.warn('[verify] message mismatch\n-- expected --\n' + expectedMsg + '\n-- received --\n' + message)
    }

    /* ------------------------------------------------------------------ */
    /* 4) 署名検証                                                         */
    /* ------------------------------------------------------------------ */
    let sigBytes = bs58.decode(signature)
    if (sigBytes.length === 65) {
      // Phantom 旧仕様: 先頭 1byte (0x01) を除去
      console.warn('[verify] 65‑byte signature → dropping first byte')
      sigBytes = sigBytes.slice(1)
    }

    const verified = nacl.sign.detached.verify(
      new TextEncoder().encode(message),
      sigBytes,
      bs58.decode(address)
    )
    console.log('[verify] verified:', verified)

    if (!verified) {
      return NextResponse.json(
        { ok: false, error: 'Signature invalid' },
        { status: 403 }
      )
    }

    /* ------------------------------------------------------------------ */
    /* 5) User upsert & Session 保存                                       */
    /* ------------------------------------------------------------------ */
    session.userId = await upsertUser(address)
    session.nonce = undefined
    await session.save()

    /* ------------------------------------------------------------------ */
    /* 6) 正常応答                                                         */
    /* ------------------------------------------------------------------ */
    const cookie = tempRes.headers.get('Set-Cookie')
    const jsonRes = NextResponse.json({ ok: true, userId: session.userId })
    if (cookie) jsonRes.headers.set('Set-Cookie', cookie)
    return jsonRes
  } catch (error) {
    console.error('[/api/siws/verify] unhandled error:', error)
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500 }
    )
  }
}
