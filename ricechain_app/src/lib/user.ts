// lib/user.ts
import { prisma } from '@/lib/prisma/client'
import { cookies } from 'next/headers'
import type { User as PrismaUser } from '@prisma/client'

/**
 * ウォレットを既存ユーザーに紐づけ、なければ新規作成して id を返す
 */
export async function upsertUser(address: string): Promise<string> {
  const existing = await prisma.user.findUnique({
    where:   { walletAddress: address },
    select:  { id: true },
  })
  if (existing) return existing.id

  const user = await prisma.user.create({
    data: { walletAddress: address },
  })
  return user.id
}

/**
 * サーバーコンポーネントで初期ユーザー情報を取得する
 * - セッション Cookie を /api/me に転送し、PrismaUser を返す
 * - 未ログイン時は null を返す
 */
export async function fetchInitialUser(): Promise<PrismaUser | null> {
  const cookieHeader = cookies().toString()
  if (!cookieHeader) return null

  const baseUrl = process.env.NEXT_PUBLIC_APP_ORIGIN ?? ''
  const res = await fetch(`${baseUrl}/api/me`, {
    headers: { cookie: cookieHeader },
    cache:   'no-store',
  })
  if (!res.ok) return null

  // ここで受け取る user は PrismaUser|null
  const { user } = (await res.json()) as {
    user: PrismaUser | null
  }
  return user
}
