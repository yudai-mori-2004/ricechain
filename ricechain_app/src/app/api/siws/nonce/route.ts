// app/api/siws/nonce/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/solana/session'
import { createNonce } from '@/lib/solana/siws'

export async function GET(req: NextRequest) {
  try {
    // empty NextResponse to hold Set-Cookie
    const tempRes = NextResponse.next()
    // load session
    const session = await getSession(req, tempRes)
    // generate and store nonce
    const nonce = createNonce()
    session.nonce = nonce
    await session.save()
    // extract Set-Cookie header
    const cookie = tempRes.headers.get('Set-Cookie')
    // return nonce JSON with cookie
    const jsonRes = NextResponse.json({ nonce })
    if (cookie) jsonRes.headers.set('Set-Cookie', cookie)
    return jsonRes
  } catch (error) {
    console.error('Nonce route error:', error)
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}