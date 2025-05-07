import { Header, Payload, SIWS } from '@web3auth/sign-in-with-solana';
import crypto from 'crypto';
import bs58 from 'bs58'
import type { SiwsResponse } from '@/features/auth/types'
import { PublicKey } from '@solana/web3.js';


/** 17 文字の英数字ノンス */
export const createNonce = (len = 17) =>
  crypto.randomBytes(len * 2).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, len);

export function buildSiwsMessage({ domain, address, statement, nonce }: {
  domain: string; address: string; statement: string; nonce: string
}) {
  return `${domain} wants you to sign in with your Solana account:\n` +
         `${address}\n\n` +
         `${statement}\n\n` +
         `Nonce: ${nonce}\n` +           // ← 最後に \n
         `Issued At: ${new Date().toISOString()}\n`
}

export async function siwsLoginWithPhantom(
  publicKey: PublicKey,
  signMessage: (msg: Uint8Array) => Promise<Uint8Array>
): Promise<SiwsResponse> {
  /* 1. nonce */
  const nonceRes = await fetch('/api/siws/nonce', { credentials: 'include' })
  if (!nonceRes.ok) throw new Error('Failed to fetch nonce')
  const { nonce } = await nonceRes.json()

  /* 2. sign */
  const msg = buildSiwsMessage({
    domain: window.location.host,
    address: publicKey.toBase58(),
    statement: 'Sign‑in with Solana to RiceChain',
    nonce,
  })
  const sig = await signMessage(new TextEncoder().encode(msg))
  const signature = bs58.encode(sig)

  /* 3. verify */
  const verifyRes = await fetch('/api/siws/verify', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address: publicKey.toBase58(),
      message: msg,
      signature,
    }),
  })
  if (!verifyRes.ok) throw new Error('SIWS verify failed')
  return verifyRes.json()
}